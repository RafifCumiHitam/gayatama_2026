import logging
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.processing_job import ProcessingJob
from app.core.storage import StorageService, get_storage_service
from app.services.document_processor.pdf_processor import PDFProcessor
from app.services.document_processor.base import DocumentProcessorError

logger = logging.getLogger(__name__)


def process_document_job(document_id: UUID, db: Session, storage: StorageService) -> ProcessingJob:
    """Executes deterministic PDF extraction job, updating status from QUEUED -> PROCESSING -> COMPLETED/FAILED."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise ValueError(f"Document {document_id} not found.")

    job = db.query(ProcessingJob).filter(
        ProcessingJob.document_id == document_id
    ).order_by(ProcessingJob.created_at.desc()).first()

    if not job:
        job = ProcessingJob(
            document_id=doc.id,
            job_type="PARSE_PDF",
            status="QUEUED",
            progress=0
        )
        db.add(job)
        db.commit()
        db.refresh(job)

    # 1. Update status to PROCESSING
    job.status = "PROCESSING"
    job.started_at = datetime.utcnow()
    doc.processing_status = "PROCESSING"
    db.commit()

    try:
        # Check storage file existence
        if not storage.exists(doc.original_file_path):
            raise DocumentProcessorError("Document storage file is missing.")

        full_file_path = str(storage._get_full_path(doc.original_file_path))

        # 2. Stage 1 (0-20%): Execute PyMuPDF PDF extraction
        processor = PDFProcessor()
        extraction = processor.extract(document_id=str(doc.id), file_path=full_file_path)
        job.progress = 20
        db.commit()

        # 3. Stage 2 (20-40%): Execute Phase 1B Layout Analysis & Reading Order Engine
        from app.services.document_analyzer.layout_analyzer import LayoutAnalyzer
        analyzer = LayoutAnalyzer()
        ordered_doc = analyzer.analyze(extraction)
        job.progress = 40
        db.commit()

        # 4. Stage 3 (40-60%): Execute Phase 1C Part A Semantic Document Analysis
        from app.services.document_semantic.semantic_analyzer import SemanticAnalyzer
        semantic_analyzer = SemanticAnalyzer()
        semantic_doc = semantic_analyzer.analyze(ordered_doc)
        job.progress = 60
        db.commit()

        # 5. Stage 4 (60-85%): Execute Phase 1C Part B Accessible Reflow Engine
        from app.services.document_reflow.reflow_engine import ReflowEngine
        reflow_engine = ReflowEngine()
        readable_doc = reflow_engine.reflow(semantic_doc)
        job.progress = 85
        db.commit()

        # 6. Stage 5 (85-100%): Persist semantic sections to database document_sections table
        from app.services.document_semantic.persistence import persist_semantic_sections
        persist_semantic_sections(semantic_doc, db)

        job.status = "COMPLETED"
        job.progress = 100
        job.completed_at = datetime.utcnow()
        doc.processing_status = "COMPLETED"
        doc.processed_at = datetime.utcnow()

        db.commit()
        db.refresh(job)
        return job

    except Exception as e:
        logger.error(f"Processing failed for document {document_id}: {str(e)}", exc_info=True)
        job.status = "FAILED"
        job.progress = 0
        job.error_message = f"Processing failed: {str(e)}"
        job.completed_at = datetime.utcnow()
        doc.processing_status = "FAILED"
        db.commit()
        db.refresh(job)
        return job
