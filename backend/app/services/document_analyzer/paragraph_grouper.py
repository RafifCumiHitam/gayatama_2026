from typing import List
from app.services.document_analyzer.models import AnalyzedBlock, BlockClassification


class ParagraphGrouper:
    """Groups compatible text blocks belonging to the same logical paragraph and flags cross-page/column continuation."""

    def group_blocks(self, blocks: List[AnalyzedBlock]) -> List[AnalyzedBlock]:
        if not blocks:
            return []

        grouped_blocks: List[AnalyzedBlock] = []
        current_block: AnalyzedBlock = None

        for b in blocks:
            if not current_block:
                current_block = b.model_copy(deep=True)
                grouped_blocks.append(current_block)
                continue

            # Only attempt merging adjacent PARAGRAPH blocks in the same column
            if (
                current_block.classification == BlockClassification.PARAGRAPH
                and b.classification == BlockClassification.PARAGRAPH
                and current_block.column_index == b.column_index
                and current_block.page_number == b.page_number
            ):
                # Calculate vertical gap
                v_gap = b.bbox[1] - current_block.bbox[3]
                # Merge if vertical gap is small (<= 15pt) and font properties match
                if 0 <= v_gap <= 15.0 and current_block.font_name == b.font_name:
                    current_block.text = f"{current_block.text}\n{b.text}"
                    current_block.bbox[2] = max(current_block.bbox[2], b.bbox[2])
                    current_block.bbox[3] = max(current_block.bbox[3], b.bbox[3])
                    current_block.width = current_block.bbox[2] - current_block.bbox[0]
                    current_block.height = current_block.bbox[3] - current_block.bbox[1]
                    current_block.evidence_signals.append(f"grouped_with_{b.block_id}")
                    continue

            # Check cross-column / cross-page continuation
            if (
                current_block.classification == BlockClassification.PARAGRAPH
                and b.classification == BlockClassification.PARAGRAPH
                and current_block.text
                and not current_block.text.strip().endswith((".", "!", "?", ":"))
            ):
                b.is_continuation = True
                b.evidence_signals.append(f"continuation_from_{current_block.block_id}")

            current_block = b.model_copy(deep=True)
            grouped_blocks.append(current_block)

        return grouped_blocks
