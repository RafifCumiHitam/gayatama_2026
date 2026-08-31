import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class AccessibilityReport(Base):
    __tablename__ = "accessibility_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score = Column(Numeric(5, 2), nullable=False, default=0.0)
    total_issues = Column(Integer, nullable=False, default=0)
    critical_issues = Column(Integer, nullable=False, default=0)
    warning_issues = Column(Integer, nullable=False, default=0)
    info_issues = Column(Integer, nullable=False, default=0)
    summary_json = Column("summary", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    document = relationship("Document", back_populates="accessibility_reports")
    issues = relationship("AccessibilityIssue", back_populates="report", cascade="all, delete-orphan")
