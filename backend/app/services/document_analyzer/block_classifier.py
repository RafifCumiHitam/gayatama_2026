import re
from typing import List
from app.services.document_analyzer.models import AnalyzedBlock, BlockClassification
from app.services.document_processor.models import BlockType


class BlockClassifier:
    """Classifies blocks into TITLE, HEADING, PARAGRAPH, LIST_ITEM, TABLE_CANDIDATE, IMAGE, etc."""

    def __init__(self, median_font_size: float = 12.0):
        self.median_font_size = median_font_size

    def classify_page_blocks(self, page_width: float, page_height: float, blocks: List[AnalyzedBlock]):
        # Calculate page font size median if available
        font_sizes = [b.font_size for b in blocks if b.font_size and b.font_size > 0]
        if font_sizes:
            font_sizes.sort()
            median_size = font_sizes[len(font_sizes) // 2]
        else:
            median_size = self.median_font_size

        for b in blocks:
            if b.is_header or b.is_footer:
                continue

            if b.block_type == BlockType.IMAGE:
                b.classification = BlockClassification.IMAGE
                b.evidence_signals.append("image_block_type")
                continue

            text = (b.text or "").strip()
            if not text:
                b.classification = BlockClassification.UNKNOWN
                continue

            # 1. Title Candidate: First page, large font (>1.4x median), centered or prominent y
            if b.page_number == 1 and b.font_size and b.font_size >= (1.4 * median_size) and len(text) < 120:
                b.classification = BlockClassification.TITLE
                b.evidence_signals.append("large_font_title_signal")
                continue

            # 2. Heading Candidate: Significantly larger font (>1.15x median), short length, or numbered pattern
            is_numbered_heading = bool(re.match(r'^(\d+(\.\d+)*)\s+[A-Z]', text))
            is_uppercase_heading = text.isupper() and len(text) < 60 and len(text) > 2
            is_larger_font = b.font_size and b.font_size >= (1.15 * median_size) and len(text) < 100

            if is_numbered_heading or (is_larger_font and len(text) < 100) or is_uppercase_heading:
                b.classification = BlockClassification.HEADING
                if is_numbered_heading:
                    b.evidence_signals.append("heading_numbering_pattern")
                if is_larger_font:
                    b.evidence_signals.append("heading_font_size_signal")
                if is_uppercase_heading:
                    b.evidence_signals.append("heading_uppercase_signal")
                continue

            # 3. List Item Candidate: Starts with bullet or list numbering e.g. "1.", "•", "-", "a."
            is_list_item = bool(re.match(r'^([•\-\*]|(\d+|[a-zA-Z])[\.\)])\s+', text))
            if is_list_item:
                b.classification = BlockClassification.LIST_ITEM
                b.evidence_signals.append("list_item_prefix_pattern")
                continue

            # 4. Table Candidate: Multiple short aligned text lines / grid structure
            if text.count("\t") >= 2 or len(re.findall(r'\s{3,}', text)) >= 3:
                b.classification = BlockClassification.TABLE_CANDIDATE
                b.evidence_signals.append("table_grid_whitespace_signal")
                continue

            # 5. Default Body Paragraph
            b.classification = BlockClassification.PARAGRAPH
            b.evidence_signals.append("default_body_paragraph")
