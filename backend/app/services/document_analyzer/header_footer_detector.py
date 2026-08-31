from typing import List, Dict
import re
from app.services.document_processor.models import DocumentExtraction, BlockType
from app.services.document_analyzer.models import AnalyzedBlock, BlockClassification


class HeaderFooterDetector:
    """Detects repeated header and footer blocks across document pages using position and text repetition."""

    def __init__(self, top_margin_threshold: float = 0.15, bottom_margin_threshold: float = 0.85):
        self.top_margin_threshold = top_margin_threshold
        self.bottom_margin_threshold = bottom_margin_threshold

    def detect(self, extraction: DocumentExtraction, blocks_by_page: Dict[int, List[AnalyzedBlock]]):
        if extraction.total_pages < 2:
            # Single-page documents: check edge position and page numbering patterns
            for page in extraction.pages:
                page_blocks = blocks_by_page.get(page.page_number, [])
                for b in page_blocks:
                    y0_ratio = b.bbox[1] / page.height
                    y1_ratio = b.bbox[3] / page.height
                    text = (b.text or "").strip()

                    # Check footer page number pattern e.g. "Page 1" or "1 of 5"
                    if y1_ratio >= self.bottom_margin_threshold and re.search(r'^(page\s+\d+|\d+(\s*/\s*\d+)?)$', text, re.IGNORECASE):
                        b.is_footer = True
                        b.classification = BlockClassification.FOOTER
                        b.evidence_signals.append("footer_page_number_pattern")
            return

        # Multi-page documents: detect repeated text near top/bottom margins
        header_text_count: Dict[str, int] = {}
        footer_text_count: Dict[str, int] = {}

        for page in extraction.pages:
            page_blocks = blocks_by_page.get(page.page_number, [])
            for b in page_blocks:
                text = (b.text or "").strip()
                if not text:
                    continue

                y0_ratio = b.bbox[1] / page.height
                y1_ratio = b.bbox[3] / page.height

                # Normalize text (ignore changing page numbers)
                normalized_text = re.sub(r'\b\d+\b', '#', text.lower())

                if y0_ratio <= self.top_margin_threshold:
                    header_text_count[normalized_text] = header_text_count.get(normalized_text, 0) + 1

                if y1_ratio >= self.bottom_margin_threshold:
                    footer_text_count[normalized_text] = footer_text_count.get(normalized_text, 0) + 1

        # Classify repeated occurrences across pages
        for page in extraction.pages:
            page_blocks = blocks_by_page.get(page.page_number, [])
            for b in page_blocks:
                text = (b.text or "").strip()
                if not text:
                    continue

                y0_ratio = b.bbox[1] / page.height
                y1_ratio = b.bbox[3] / page.height
                normalized_text = re.sub(r'\b\d+\b', '#', text.lower())

                if y0_ratio <= self.top_margin_threshold:
                    if header_text_count.get(normalized_text, 0) >= 2 or (
                        y0_ratio <= 0.08 and len(text) < 60
                    ):
                        b.is_header = True
                        b.classification = BlockClassification.HEADER
                        b.evidence_signals.append("top_margin_repetition")

                if y1_ratio >= self.bottom_margin_threshold:
                    if footer_text_count.get(normalized_text, 0) >= 2 or re.search(r'^(page\s+\d+|\d+(\s*/\s*\d+)?)$', text, re.IGNORECASE):
                        b.is_footer = True
                        b.classification = BlockClassification.FOOTER
                        b.evidence_signals.append("bottom_margin_repetition")
