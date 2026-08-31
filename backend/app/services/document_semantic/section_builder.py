from typing import List
from app.services.document_semantic.semantic_models import SemanticBlock, SemanticSection, SemanticType


class SectionBuilder:
    """Builds hierarchical SemanticSection structures from flat ordered semantic blocks using stack algorithm."""

    def build_sections(self, blocks: List[SemanticBlock]) -> List[SemanticSection]:
        if not blocks:
            return []

        root_sections: List[SemanticSection] = []
        section_stack: List[SemanticSection] = []
        section_counter = 1

        # Fallback root section if document starts with body text before any heading
        current_section = SemanticSection(
            id=f"sec_{section_counter}",
            title="General",
            level=1,
            order=section_counter,
            blocks=[],
            children=[]
        )
        root_sections.append(current_section)
        section_stack.append(current_section)

        for block in blocks:
            if block.semantic_type == SemanticType.HEADING:
                section_counter += 1
                heading_level = block.heading_level or 1
                new_section = SemanticSection(
                    id=f"sec_{section_counter}",
                    title=block.content,
                    level=heading_level,
                    order=section_counter,
                    blocks=[block],
                    children=[],
                    page_number=block.page_number,
                )

                # Pop stack until parent level is smaller than new section level
                while section_stack and section_stack[-1].level >= heading_level:
                    section_stack.pop()

                if section_stack:
                    section_stack[-1].children.append(new_section)
                else:
                    root_sections.append(new_section)

                section_stack.append(new_section)
            else:
                if section_stack:
                    section_stack[-1].blocks.append(block)
                else:
                    current_section.blocks.append(block)

        # Remove empty fallback "General" section if not needed
        if len(root_sections) > 1 and not root_sections[0].blocks and not root_sections[0].children:
            root_sections.pop(0)

        return root_sections
