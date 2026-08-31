from typing import List
from app.services.document_semantic.semantic_models import SemanticBlock, SemanticType


class TableParser:
    """Conservative table parser. Converts high-confidence TABLE_CANDIDATE blocks into TABLE structures."""

    def parse_tables(self, blocks: List[SemanticBlock]) -> List[SemanticBlock]:
        result_blocks: List[SemanticBlock] = []

        for block in blocks:
            if block.semantic_type == SemanticType.TABLE_CELL:  # Candidate
                # Conservatively convert to TABLE block if structured lines exist
                lines = (block.content or "").split("\n")
                if len(lines) >= 2:
                    table_block = SemanticBlock(
                        id=f"tbl_{block.id}",
                        semantic_type=SemanticType.TABLE,
                        content=block.content,
                        order=block.order,
                        source_block_ids=block.source_block_ids,
                        page_number=block.page_number,
                        metadata={"raw_table_text": block.content}
                    )
                    result_blocks.append(table_block)
                else:
                    # Fail safe: fall back to PARAGRAPH if structure is uncertain
                    block.semantic_type = SemanticType.PARAGRAPH
                    result_blocks.append(block)
            else:
                result_blocks.append(block)

        return result_blocks
