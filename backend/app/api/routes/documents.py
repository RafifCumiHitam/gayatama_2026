from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.processing_job import ProcessingJob
from app.schemas.document import DocumentResponse, DocumentDetailResponse, ProcessingJobResponse
from app.core.dependencies import get_current_user
from app.core.storage import get_storage_service, StorageService
from app.core.config import settings

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("", response_model=DocumentDetailResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    storage: StorageService = Depends(get_storage_service)
):
    """Upload PDF document, store safely, and create QUEUED processing job."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    # Read content to check size
    file_bytes = file.file.read()
    file_size = len(file_bytes)
    max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    if file_size > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Reset file cursor and save to storage
    file.file.seek(0)
    storage_path_key = storage.save(file.file, file.filename, file.content_type or "application/pdf")

    # Create document database record
    doc = Document(
        user_id=current_user.id,
        original_filename=file.filename,
        original_file_path=storage_path_key,
        mime_type=file.content_type or "application/pdf",
        file_size=file_size,
        source_format="PDF",
        processing_status="QUEUED",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Create initial processing job record
    job = ProcessingJob(
        document_id=doc.id,
        job_type="PARSE_PDF",
        status="QUEUED",
        progress=0
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Execute PDF extraction job (QUEUED -> PROCESSING -> COMPLETED/FAILED)
    from app.services.processing_service import process_document_job
    job = process_document_job(doc.id, db, storage)
    db.refresh(doc)

    return DocumentDetailResponse(
        id=doc.id,
        user_id=doc.user_id,
        original_filename=doc.original_filename,
        mime_type=doc.mime_type,
        file_size=doc.file_size,
        source_format=doc.source_format,
        processing_status=doc.processing_status,
        uploaded_at=doc.uploaded_at,
        latest_job=ProcessingJobResponse.model_validate(job)
    )


@router.get("", response_model=List[DocumentResponse])
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List documents belonging exclusively to the authenticated user."""
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.uploaded_at.desc()).all()
    return docs


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single document metadata and status (ownership verified)."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        # Return 404 to avoid leaking existence of another user's document
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    latest_job = db.query(ProcessingJob).filter(ProcessingJob.document_id == doc.id).order_by(ProcessingJob.created_at.desc()).first()

    return DocumentDetailResponse(
        id=doc.id,
        user_id=doc.user_id,
        original_filename=doc.original_filename,
        mime_type=doc.mime_type,
        file_size=doc.file_size,
        source_format=doc.source_format,
        processing_status=doc.processing_status,
        uploaded_at=doc.uploaded_at,
        latest_job=ProcessingJobResponse.model_validate(latest_job) if latest_job else None
    )


@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    storage: StorageService = Depends(get_storage_service)
):
    """Delete document, related database entities (cascaded), and file from storage."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Delete storage file
    storage.delete(doc.original_file_path)

    # Delete document record (SQLAlchemy cascade deletes sections, jobs, reports, etc.)
    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully."}


@router.get("/{document_id}/sections")
def get_document_sections(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get persisted semantic sections for document (ownership verified)."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    from app.models.document_section import DocumentSection
    from app.schemas.section import DocumentSectionResponse

    sections = db.query(DocumentSection).filter(
        DocumentSection.document_id == doc.id
    ).order_by(DocumentSection.order_index.asc()).all()

    return [DocumentSectionResponse.model_validate(s) for s in sections]


@router.get("/{document_id}/content")
def get_document_readable_content(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get structured readable content for document (ownership verified)."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    from app.models.document_section import DocumentSection
    from app.schemas.section import DocumentSectionResponse, ReadableContentResponse

    sections = db.query(DocumentSection).filter(
        DocumentSection.document_id == doc.id
    ).order_by(DocumentSection.order_index.asc()).all()

    sec_responses = [DocumentSectionResponse.model_validate(s) for s in sections]

    # Look for top title heading
    first_title = next((s.title for s in sections if s.title), doc.original_filename)

    return ReadableContentResponse(
        document_id=doc.id,
        title=first_title,
        total_sections=len(sec_responses),
        sections=sec_responses
    )
