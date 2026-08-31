from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProcessingJobResponse(BaseModel):
    id: UUID
    document_id: UUID
    job_type: str
    status: str
    progress: int
    error_message: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentResponse(BaseModel):
    id: UUID
    user_id: UUID
    original_filename: str
    mime_type: str
    file_size: int
    source_format: str
    processing_status: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentDetailResponse(DocumentResponse):
    latest_job: Optional[ProcessingJobResponse] = None
