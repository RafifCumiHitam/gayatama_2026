import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class AccessibilityIssue(Base):
    __tablename__ = "accessibility_issues"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("accessibility_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    issue_code = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # CRITICAL, WARNING, INFO
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    wcag_criterion = Column(String(50), nullable=True)
    location_json = Column("location", JSON, nullable=True)
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("AccessibilityReport", back_populates="issues")
