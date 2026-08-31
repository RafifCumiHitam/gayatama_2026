from uuid import UUID
from typing import List
from sqlalchemy.orm import Session
from app.models.document_section import DocumentSection
from app.services.document_semantic.semantic_models import SemanticDocument, SemanticSection, SemanticBlock


def persist_semantic_sections(semantic_doc: SemanticDocument, db: Session) -> List[DocumentSection]:
    """Atomically persists SemanticSections into PostgreSQL document_sections table."""
    document_uuid = UUID(semantic_doc.document_id)

    # Delete any existing sections for atomic processing
    db.query(DocumentSection).filter(DocumentSection.document_id == document_uuid).delete()

    created_sections: List[DocumentSection] = []

    def save_section(section: SemanticSection, parent_id: UUID = None):
        # 1. Save heading/section container record if section title exists
        sec_title = section.title or f"Section {section.order}"
        db_sec = DocumentSection(
            document_id=document_uuid,
            parent_id=parent_id,
            section_type="HEADING",
            title=sec_title,
            content=sec_title,
            order_index=section.order,
            page_number=section.page_number or 1,
            metadata_json={"level": section.level}
        )
        db.add(db_sec)
        db.flush()
        created_sections.append(db_sec)

        # 2. Save blocks contained in this section
        for block in section.blocks:
            b_sec = DocumentSection(
                document_id=document_uuid,
                parent_id=db_sec.id,
                section_type=block.semantic_type.value,
                title=None,
                content=block.content,
                order_index=block.order,
                page_number=block.page_number,
                metadata_json={
                    "source_block_ids": block.source_block_ids,
                    "heading_level": block.heading_level,
                }
            )
            db.add(b_sec)
            created_sections.append(b_sec)

        # 3. Recursively save child sections
        for child in section.children:
            save_section(child, parent_id=db_sec.id)

    for root_sec in semantic_doc.sections:
        save_section(root_sec)

    db.commit()
    return created_sections
