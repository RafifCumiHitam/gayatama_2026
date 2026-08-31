from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DocumentSectionResponse(BaseModel):
    id: UUID
    document_id: UUID
    parent_id: Optional[UUID] = None
    section_type: str
    title: Optional[str] = None
    content: Optional[str] = None
    order_index: int
    page_number: Optional[int] = None
    metadata_json: Optional[Any] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReadableContentResponse(BaseModel):
    document_id: UUID
    title: Optional[str] = None
    total_sections: int
    sections: List[DocumentSectionResponse]

    model_config = ConfigDict(from_attributes=True)
