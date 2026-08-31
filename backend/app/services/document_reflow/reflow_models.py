from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.services.document_semantic.semantic_models import SemanticSection, SemanticBlock


class ReadableBlock(BaseModel):
    id: str
    semantic_type: str
    content: Optional[str] = None
    order: int
    source_block_ids: List[str] = []
    heading_level: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class ReadableSection(BaseModel):
    id: str
    title: Optional[str] = None
    level: int = 1
    order: int
    blocks: List[ReadableBlock] = []
    children: List["ReadableSection"] = []

    model_config = ConfigDict(from_attributes=True)


class ReadableDocument(BaseModel):
    document_id: str
    title: Optional[str] = None
    sections: List[ReadableSection] = []
    reading_width: str = "comfortable"
    total_word_count: int = 0
    total_character_count: int = 0

    model_config = ConfigDict(from_attributes=True)


ReadableSection.model_rebuild()
