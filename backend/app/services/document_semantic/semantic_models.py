from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class SemanticType(str, Enum):
    DOCUMENT_TITLE = "DOCUMENT_TITLE"
    HEADING = "HEADING"
    PARAGRAPH = "PARAGRAPH"
    LIST = "LIST"
    LIST_ITEM = "LIST_ITEM"
    IMAGE = "IMAGE"
    FIGURE = "FIGURE"
    CAPTION = "CAPTION"
    TABLE = "TABLE"
    TABLE_ROW = "TABLE_ROW"
    TABLE_CELL = "TABLE_CELL"
    HEADER = "HEADER"
    FOOTER = "FOOTER"
    QUOTE = "QUOTE"
    UNKNOWN = "UNKNOWN"


class SemanticBlock(BaseModel):
    id: str
    semantic_type: SemanticType
    content: Optional[str] = None
    order: int
    source_block_ids: List[str] = []
    page_number: int
    heading_level: Optional[int] = None
    heading_level_evidence: List[str] = []
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class SemanticSection(BaseModel):
    id: str
    title: Optional[str] = None
    level: int = 1
    order: int
    blocks: List[SemanticBlock] = []
    children: List["SemanticSection"] = []
    page_number: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class SemanticDocument(BaseModel):
    document_id: str
    title: Optional[str] = None
    language: str = "en"
    sections: List[SemanticSection] = []
    headers: List[SemanticBlock] = []
    footers: List[SemanticBlock] = []
    source_text_length: int = 0
    source_word_count: int = 0

    model_config = ConfigDict(from_attributes=True)


SemanticSection.model_rebuild()
