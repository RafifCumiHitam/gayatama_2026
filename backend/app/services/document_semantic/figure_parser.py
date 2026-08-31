import re
from typing import List
from app.services.document_semantic.semantic_models import SemanticBlock, SemanticType


class FigureParser:
    """Associates image blocks with immediately preceding or following caption blocks."""

    def parse_figures(self, blocks: List[SemanticBlock]) -> List[SemanticBlock]:
        if not blocks:
            return []

        result_blocks: List[SemanticBlock] = []
        skip_indices = set()

        for idx, block in enumerate(blocks):
            if idx in skip_indices:
                continue

            if block.semantic_type == SemanticType.IMAGE:
                caption_text = None
                source_ids = list(block.source_block_ids)

                # Check next block for caption pattern e.g. "Figure 1: ..." or "Fig. 1"
                if idx + 1 < len(blocks):
                    next_b = blocks[idx + 1]
                    next_text = (next_b.content or "").strip()
                    if re.match(r'^(figure|fig\.|image)\s+\d+', next_text, re.IGNORECASE) or len(next_text) < 80:
                        caption_text = next_text
                        source_ids.extend(next_b.source_block_ids)
                        skip_indices.add(idx + 1)

                figure_block = SemanticBlock(
                    id=f"fig_{block.id}",
                    semantic_type=SemanticType.FIGURE,
                    content=caption_text or "Figure",
                    order=block.order,
                    source_block_ids=source_ids,
                    page_number=block.page_number,
                    metadata={"caption": caption_text, "image_block_id": block.id}
                )
                result_blocks.append(figure_block)
            else:
                result_blocks.append(block)

        return result_blocks
