import uuid

from app.core.time import utc_now
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ExportJob(Base):
    __tablename__ = "export_jobs"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    document_id = Column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    target_format = Column(
        String(20),
        nullable=False,
    )  # HTML, EPUB, PDF_ACCESSIBLE

    status = Column(
        String(50),
        nullable=False,
        default="QUEUED",
    )  # QUEUED, PROCESSING, COMPLETED, FAILED

    exported_file_path = Column(
        String(512),
        nullable=True,
    )

    error_message = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    document = relationship(
        "Document",
        back_populates="export_jobs",
    )