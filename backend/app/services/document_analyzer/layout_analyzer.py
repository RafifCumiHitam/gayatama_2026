from typing import List, Dict
from app.services.document_processor.models import DocumentExtraction
from app.services.document_analyzer.models import (
    AnalyzedBlock,
    AnalyzedPage,
    OrderedDocument,
    ColumnRegion
)
from app.services.document_analyzer.header_footer_detector import HeaderFooterDetector
from app.services.document_analyzer.column_detector import ColumnDetector
from app.services.document_analyzer.block_classifier import BlockClassifier
from app.services.document_analyzer.paragraph_grouper import ParagraphGrouper
from app.services.document_analyzer.reading_order import ReadingOrderEngine


class LayoutAnalyzer:
    """Master orchestrator for Phase 1B layout analysis and reading order reconstruction."""

    def __init__(self):
        self.header_footer_detector = HeaderFooterDetector()
        self.column_detector = ColumnDetector()
        self.block_classifier = BlockClassifier()
        self.paragraph_grouper = ParagraphGrouper()
        self.reading_order_engine = ReadingOrderEngine()

    def analyze(self, extraction: DocumentExtraction) -> OrderedDocument:
        # Convert ExtractedBlock instances to AnalyzedBlock instances
        blocks_by_page: Dict[int, List[AnalyzedBlock]] = {}

        for page in extraction.pages:
            analyzed_page_blocks: List[AnalyzedBlock] = []
            for b in page.blocks:
                a_block = AnalyzedBlock(
                    block_id=b.block_id,
                    page_number=b.page_number,
                    block_type=b.block_type,
                    bbox=b.bbox,
                    text=b.text,
                    font_name=b.font_name,
                    font_size=b.font_size,
                    font_flags=b.font_flags,
                    width=b.width,
                    height=b.height,
                    metadata=b.metadata,
                )
                analyzed_page_blocks.append(a_block)
            blocks_by_page[page.page_number] = analyzed_page_blocks

        # 1. Header / Footer Detection
        self.header_footer_detector.detect(extraction, blocks_by_page)

        analyzed_pages: List[AnalyzedPage] = []
        all_ordered_blocks: List[AnalyzedBlock] = []
        global_order_counter = 1

        for page in extraction.pages:
            page_num = page.page_number
            page_blocks = blocks_by_page.get(page_num, [])

            # 2. Block Classification
            self.block_classifier.classify_page_blocks(page.width, page.height, page_blocks)

            # 3. Column Detection
            columns = self.column_detector.detect_columns(page.width, page.height, page_blocks)

            # 4. Paragraph Grouping
            grouped_blocks = self.paragraph_grouper.group_blocks(page_blocks)

            analyzed_page = AnalyzedPage(
                page_number=page_num,
                width=page.width,
                height=page.height,
                detected_columns_count=len(columns),
                columns=columns,
                blocks=grouped_blocks,
            )

            # 5. Reading Order Reconstruction
            sorted_page_blocks = self.reading_order_engine.sort_page_blocks(analyzed_page)
            analyzed_page.blocks = sorted_page_blocks

            # 6. Global Reading Order Assignment
            for block in sorted_page_blocks:
                block.global_reading_order = global_order_counter
                global_order_counter += 1
                all_ordered_blocks.append(block)

            analyzed_pages.append(analyzed_page)

        return OrderedDocument(
            document_id=extraction.document_id,
            total_pages=len(analyzed_pages),
            pages=analyzed_pages,
            ordered_blocks=all_ordered_blocks,
        )
