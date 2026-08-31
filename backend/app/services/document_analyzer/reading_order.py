from typing import List
from app.services.document_analyzer.models import AnalyzedBlock, AnalyzedPage, BlockClassification


class ReadingOrderEngine:
    """Deterministically orders document blocks for human reading sequence across columns and pages."""

    def sort_page_blocks(self, page: AnalyzedPage) -> List[AnalyzedBlock]:
        """
        Sorts blocks on a page:
        1. Headers at top
        2. Full-width blocks (column_index == 0 or TITLE/full-width HEADING) by y0
        3. Column 1 blocks by y0
        4. Column 2 blocks by y0
        5. Column 3+ blocks by y0
        6. Footers at bottom
        """
        headers = [b for b in page.blocks if b.is_header]
        footers = [b for b in page.blocks if b.is_footer]
        content_blocks = [b for b in page.blocks if not b.is_header and not b.is_footer]

        headers.sort(key=lambda b: (b.bbox[1], b.bbox[0]))
        footers.sort(key=lambda b: (b.bbox[1], b.bbox[0]))

        # Group content blocks by column index
        full_width_blocks = [b for b in content_blocks if b.column_index == 0 or b.classification == BlockClassification.TITLE]
        col1_blocks = [b for b in content_blocks if b.column_index == 1 and b.classification != BlockClassification.TITLE]
        col2_blocks = [b for b in content_blocks if b.column_index == 2 and b.classification != BlockClassification.TITLE]
        col3_blocks = [b for b in content_blocks if b.column_index >= 3 and b.classification != BlockClassification.TITLE]

        full_width_blocks.sort(key=lambda b: (b.bbox[1], b.bbox[0]))
        col1_blocks.sort(key=lambda b: (b.bbox[1], b.bbox[0]))
        col2_blocks.sort(key=lambda b: (b.bbox[1], b.bbox[0]))
        col3_blocks.sort(key=lambda b: (b.bbox[1], b.bbox[0]))

        # Interleave full-width headers/titles with columns based on vertical position
        ordered_content: List[AnalyzedBlock] = []

        # Simple robust layout ordering: Top full-width -> Col 1 -> Col 2 -> Col 3 -> Bottom full-width
        top_full_width = [b for b in full_width_blocks if not col1_blocks or b.bbox[3] <= min(c.bbox[1] for c in col1_blocks)]
        bottom_full_width = [b for b in full_width_blocks if b not in top_full_width]

        ordered_content.extend(top_full_width)
        ordered_content.extend(col1_blocks)
        ordered_content.extend(col2_blocks)
        ordered_content.extend(col3_blocks)
        ordered_content.extend(bottom_full_width)

        final_page_order = headers + ordered_content + footers

        # Assign page reading order index
        for idx, block in enumerate(final_page_order, start=1):
            block.page_reading_order = idx

        return final_page_order
