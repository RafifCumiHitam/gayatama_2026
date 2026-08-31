from typing import List
from app.services.document_semantic.semantic_models import SemanticBlock, SemanticType


class ListParser:
    """Groups adjacent LIST_ITEM semantic blocks into structured LIST semantic blocks."""

    def parse_lists(self, blocks: List[SemanticBlock]) -> List[SemanticBlock]:
        if not blocks:
            return []

        result_blocks: List[SemanticBlock] = []
        current_list_items: List[SemanticBlock] = []

        def flush_list():
            nonlocal current_list_items
            if current_list_items:
                list_id = f"list_{current_list_items[0].id}"
                combined_sources = []
                for item in current_list_items:
                    combined_sources.extend(item.source_block_ids)

                # Format list content as markdown bullet list
                formatted_list_text = "\n".join(f"• {item.content}" for item in current_list_items if item.content)

                list_block = SemanticBlock(
                    id=list_id,
                    semantic_type=SemanticType.LIST,
                    content=formatted_list_text,
                    order=current_list_items[0].order,
                    source_block_ids=combined_sources,
                    page_number=current_list_items[0].page_number,
                    metadata={"item_count": len(current_list_items)}
                )
                result_blocks.append(list_block)
                current_list_items = []

        for block in blocks:
            if block.semantic_type == SemanticType.LIST_ITEM:
                current_list_items.append(block)
            else:
                flush_list()
                result_blocks.append(block)

        flush_list()
        return result_blocks
