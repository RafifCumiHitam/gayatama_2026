import uuid
from app.core.time import utc_now
from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    original_file_path = Column(String(512), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    source_format = Column(String(20), nullable=False, default="PDF")
    processing_status = Column(String(50), nullable=False, default="QUEUED")
    current_version = Column(String(20), nullable=False, default="1.0")
    uploaded_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    processed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )

    user = relationship("User", back_populates="documents")
    sections = relationship("DocumentSection", back_populates="document", cascade="all, delete-orphan")
    processing_jobs = relationship("ProcessingJob", back_populates="document", cascade="all, delete-orphan")
    accessibility_reports = relationship("AccessibilityReport", back_populates="document", cascade="all, delete-orphan")
    export_jobs = relationship("ExportJob", back_populates="document", cascade="all, delete-orphan")
    reading_progress = relationship("ReadingProgress", back_populates="document", cascade="all, delete-orphan")
