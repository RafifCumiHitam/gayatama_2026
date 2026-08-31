import uuid
from app.core.time import utc_now
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class ReadingProgress(Base):
    __tablename__ = "reading_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("reading_profiles.id", ondelete="SET NULL"), nullable=True)
    current_page = Column(Integer, nullable=False, default=1)
    current_section_id = Column(UUID(as_uuid=True), nullable=True)
    scroll_position = Column(Numeric(10, 2), nullable=False, default=0.0)
    completion_percentage = Column(Numeric(5, 2), nullable=False, default=0.0)
    last_read_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
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

    user = relationship("User", back_populates="reading_progress")
    document = relationship("Document", back_populates="reading_progress")
    profile = relationship("ReadingProfile", back_populates="reading_progress")
