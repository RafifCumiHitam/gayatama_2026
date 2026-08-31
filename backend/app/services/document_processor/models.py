from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class BlockType(str, Enum):
    TEXT = "TEXT"
    IMAGE = "IMAGE"
    UNKNOWN = "UNKNOWN"


class ExtractedBlock(BaseModel):
    block_id: str
    page_number: int
    block_type: BlockType
    bbox: List[float]  # [x0, y0, x1, y1]
    text: Optional[str] = None
    font_name: Optional[str] = None
    font_size: Optional[float] = None
    font_flags: Optional[int] = None
    width: Optional[float] = None
    height: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class ExtractedPage(BaseModel):
    page_number: int
    width: float
    height: float
    blocks: List[ExtractedBlock]

    model_config = ConfigDict(from_attributes=True)


class DocumentExtraction(BaseModel):
    document_id: str
    total_pages: int
    pages: List[ExtractedPage]

    model_config = ConfigDict(from_attributes=True)
