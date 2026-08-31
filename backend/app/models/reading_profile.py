import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class ReadingProfile(Base):
    __tablename__ = "reading_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    profile_type = Column(String(50), nullable=False, default="CUSTOM")
    font_family = Column(String(100), nullable=False, default="Inter")
    font_size = Column(Numeric(5, 2), nullable=False, default=16.0)
    line_height = Column(Numeric(4, 2), nullable=False, default=1.5)
    letter_spacing = Column(Numeric(4, 2), nullable=False, default=0.0)
    word_spacing = Column(Numeric(4, 2), nullable=False, default=0.0)
    background_color = Column(String(50), nullable=False, default="#FFFDF8")
    text_color = Column(String(50), nullable=False, default="#2D2825")
    column_width = Column(String(50), nullable=False, default="normal")
    reading_ruler = Column(Boolean, nullable=False, default=False)
    focus_mode = Column(Boolean, nullable=False, default=False)
    tts_enabled = Column(Boolean, nullable=False, default=False)
    tts_speed = Column(Numeric(3, 2), nullable=False, default=1.0)
    is_default = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="reading_profiles")
    reading_progress = relationship("ReadingProgress", back_populates="profile")
