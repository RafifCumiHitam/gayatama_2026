import uuid
from app.core.time import utc_now
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class DocumentSection(Base):
    __tablename__ = "document_sections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("document_sections.id", ondelete="SET NULL"), nullable=True, index=True)
    section_type = Column(String(50), nullable=False)
    title = Column(String(512), nullable=True)
    content = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False, default=0)
    page_number = Column(Integer, nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)
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

    document = relationship("Document", back_populates="sections")
    parent = relationship("DocumentSection", remote_side=[id], backref="children")
