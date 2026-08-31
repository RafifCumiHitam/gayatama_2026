from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.services.document_processor.models import ExtractedBlock, BlockType


class BlockClassification(str, Enum):
    TITLE = "TITLE"
    HEADING = "HEADING"
    PARAGRAPH = "PARAGRAPH"
    LIST_ITEM = "LIST_ITEM"
    TABLE_CANDIDATE = "TABLE_CANDIDATE"
    IMAGE = "IMAGE"
    CAPTION = "CAPTION"
    HEADER = "HEADER"
    FOOTER = "FOOTER"
    UNKNOWN = "UNKNOWN"


class AnalyzedBlock(BaseModel):
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
    
    # Phase 1B Deterministic Layout Attributes
    classification: BlockClassification = BlockClassification.UNKNOWN
    evidence_signals: List[str] = []
    column_index: int = 0  # 0 for full-width, 1..N for specific column
    global_reading_order: int = 0
    page_reading_order: int = 0
    is_header: bool = False
    is_footer: bool = False
    is_continuation: bool = False
    group_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class ColumnRegion(BaseModel):
    column_index: int
    bbox: List[float]  # [x0, y0, x1, y1]
    block_ids: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class AnalyzedPage(BaseModel):
    page_number: int
    width: float
    height: float
    detected_columns_count: int = 1
    columns: List[ColumnRegion] = []
    blocks: List[AnalyzedBlock] = []

    model_config = ConfigDict(from_attributes=True)


class OrderedDocument(BaseModel):
    document_id: str
    total_pages: int
    pages: List[AnalyzedPage] = []
    ordered_blocks: List[AnalyzedBlock] = []

    model_config = ConfigDict(from_attributes=True)
