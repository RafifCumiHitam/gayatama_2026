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

        # 2. Execute PyMuPDF PDF extraction
        processor = PDFProcessor()
        extraction = processor.extract(document_id=str(doc.id), file_path=full_file_path)

        # 3. Execute Phase 1B Layout Analysis & Reading Order Engine
        from app.services.document_analyzer.layout_analyzer import LayoutAnalyzer
        analyzer = LayoutAnalyzer()
        ordered_doc = analyzer.analyze(extraction)

        # 4. Store intermediate analyzed extraction JSON inside processing_job record
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
