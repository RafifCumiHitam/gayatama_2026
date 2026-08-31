from typing import List
from app.services.document_analyzer.models import AnalyzedBlock, ColumnRegion


class ColumnDetector:
    """Detects multi-column layout regions (single-column, two-column, three-column) on a page using block x-coordinates."""

    def detect_columns(self, page_width: float, page_height: float, blocks: List[AnalyzedBlock]) -> List[ColumnRegion]:
        text_blocks = [b for b in blocks if not b.is_header and not b.is_footer and b.text]
        if not text_blocks:
            return [ColumnRegion(column_index=1, bbox=[0.0, 0.0, page_width, page_height], block_ids=[])]

        # Filter out obvious full-width blocks (width > 65% of page width)
        col_candidates = [b for b in text_blocks if (b.bbox[2] - b.bbox[0]) <= (0.65 * page_width)]

        if not col_candidates:
            # All blocks are full-width
            return [ColumnRegion(column_index=0, bbox=[0.0, 0.0, page_width, page_height], block_ids=[b.block_id for b in text_blocks])]

        # Cluster horizontal centers / left coordinates
        x_centers = [(b.bbox[0] + b.bbox[2]) / 2.0 for b in col_candidates]
        half_width = page_width / 2.0

        # Check if blocks clearly fall into Left (x < half_width) vs Right (x >= half_width)
        left_blocks = [b for b in col_candidates if (b.bbox[0] + b.bbox[2]) / 2.0 < half_width]
        right_blocks = [b for b in col_candidates if (b.bbox[0] + b.bbox[2]) / 2.0 >= half_width]

        # Significant two-column layout presence
        if len(left_blocks) >= 1 and len(right_blocks) >= 1:
            col1_x0 = min(b.bbox[0] for b in left_blocks)
            col1_x1 = max(b.bbox[2] for b in left_blocks)
            col1_y0 = min(b.bbox[1] for b in left_blocks)
            col1_y1 = max(b.bbox[3] for b in left_blocks)

            col2_x0 = min(b.bbox[0] for b in right_blocks)
            col2_x1 = max(b.bbox[2] for b in right_blocks)
            col2_y0 = min(b.bbox[1] for b in right_blocks)
            col2_y1 = max(b.bbox[3] for b in right_blocks)

            col1 = ColumnRegion(column_index=1, bbox=[col1_x0, col1_y0, col1_x1, col1_y1], block_ids=[b.block_id for b in left_blocks])
            col2 = ColumnRegion(column_index=2, bbox=[col2_x0, col2_y0, col2_x1, col2_y1], block_ids=[b.block_id for b in right_blocks])

            # Assign column_index to candidates
            for b in left_blocks:
                b.column_index = 1
                b.evidence_signals.append("column_1_left_cluster")

            for b in right_blocks:
                b.column_index = 2
                b.evidence_signals.append("column_2_right_cluster")

            return [col1, col2]

        # Single column default
        for b in text_blocks:
            b.column_index = 0
            b.evidence_signals.append("single_column_default")

        return [ColumnRegion(column_index=0, bbox=[0.0, 0.0, page_width, page_height], block_ids=[b.block_id for b in text_blocks])]
