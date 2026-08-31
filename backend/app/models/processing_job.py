import uuid
from app.core.time import utc_now
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    job_type = Column(String(50), nullable=False, default="PARSE_PDF")
    status = Column(String(50), nullable=False, default="QUEUED")  # UPLOADED, QUEUED, PROCESSING, COMPLETED, FAILED, CANCELLED
    progress = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(
    DateTime(timezone=True),
    nullable=True,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    document = relationship("Document", back_populates="processing_jobs")
