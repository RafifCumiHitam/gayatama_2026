from app.services.document_semantic.semantic_models import SemanticDocument, SemanticSection, SemanticBlock
from app.services.document_reflow.reflow_models import ReadableDocument, ReadableSection, ReadableBlock


class ReflowEngine:
    """Transforms SemanticDocument into a single-column, linear ReadableDocument stream."""

    def reflow(self, semantic_doc: SemanticDocument) -> ReadableDocument:
        total_words = 0
        total_chars = 0

        def convert_block(block: SemanticBlock) -> ReadableBlock:
            nonlocal total_words, total_chars
            text = block.content or ""
            total_words += len(text.split())
            total_chars += len(text)

            return ReadableBlock(
                id=f"reflow_{block.id}",
                semantic_type=block.semantic_type.value,
                content=text,
                order=block.order,
                source_block_ids=block.source_block_ids,
                heading_level=block.heading_level,
                metadata=block.metadata,
            )

        def convert_section(section: SemanticSection) -> ReadableSection:
            reflow_blocks = [convert_block(b) for b in section.blocks]
            reflow_children = [convert_section(c) for c in section.children]

            return ReadableSection(
                id=f"reflow_{section.id}",
                title=section.title,
                level=section.level,
                order=section.order,
                blocks=reflow_blocks,
                children=reflow_children,
            )

        readable_sections = [convert_section(s) for s in semantic_doc.sections]

        return ReadableDocument(
            document_id=semantic_doc.document_id,
            title=semantic_doc.title,
            sections=readable_sections,
            reading_width="comfortable",
            total_word_count=total_words,
            total_character_count=total_chars,
        )
