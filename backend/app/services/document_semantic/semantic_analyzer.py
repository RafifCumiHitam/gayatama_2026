from typing import List
from app.services.document_analyzer.models import OrderedDocument, BlockClassification
from app.services.document_semantic.semantic_models import (
    SemanticDocument,
    SemanticSection,
    SemanticBlock,
    SemanticType,
)
from app.services.document_semantic.heading_hierarchy import HeadingHierarchyEngine
from app.services.document_semantic.normalization import normalize_text_content
from app.services.document_semantic.list_parser import ListParser
from app.services.document_semantic.figure_parser import FigureParser
from app.services.document_semantic.table_parser import TableParser
from app.services.document_semantic.section_builder import SectionBuilder


class SemanticAnalyzer:
    """Master orchestrator for Phase 1C Part A: Semantic Document Analysis."""

    def __init__(self):
        self.heading_engine = HeadingHierarchyEngine()
        self.list_parser = ListParser()
        self.figure_parser = FigureParser()
        self.table_parser = TableParser()
        self.section_builder = SectionBuilder()

    def analyze(self, ordered_doc: OrderedDocument) -> SemanticDocument:
        all_ordered_blocks = ordered_doc.ordered_blocks
        
        # 1. Calculate Content Integrity Source Baseline
        source_text = "".join(b.text or "" for b in all_ordered_blocks)
        source_text_length = len(source_text)
        source_word_count = len(source_text.split())

        # Collect headings for hierarchy analysis
        heading_blocks = [
            b for b in all_ordered_blocks
            if b.classification in (BlockClassification.TITLE, BlockClassification.HEADING)
        ]

        document_title = None
        semantic_blocks: List[SemanticBlock] = []
        headers: List[SemanticBlock] = []
        footers: List[SemanticBlock] = []

        # 2. Map AnalyzedBlock -> SemanticBlock & normalize text
        for block in all_ordered_blocks:
            norm_content = normalize_text_content(block.text or "")

            # Map classification -> SemanticType
            if block.classification == BlockClassification.TITLE:
                sem_type = SemanticType.DOCUMENT_TITLE
                if document_title is None and norm_content:
                    document_title = norm_content
            elif block.classification == BlockClassification.HEADING:
                sem_type = SemanticType.HEADING
            elif block.classification == BlockClassification.LIST_ITEM:
                sem_type = SemanticType.LIST_ITEM
            elif block.classification == BlockClassification.IMAGE:
                sem_type = SemanticType.IMAGE
            elif block.classification == BlockClassification.TABLE_CANDIDATE:
                sem_type = SemanticType.TABLE_CELL
            elif block.classification == BlockClassification.HEADER:
                sem_type = SemanticType.HEADER
            elif block.classification == BlockClassification.FOOTER:
                sem_type = SemanticType.FOOTER
            else:
                sem_type = SemanticType.PARAGRAPH

            heading_level = None
            heading_evidence = []

            if sem_type == SemanticType.HEADING or sem_type == SemanticType.DOCUMENT_TITLE:
                heading_level, heading_evidence = self.heading_engine.determine_heading_level(
                    block, heading_blocks
                )

            s_block = SemanticBlock(
                id=f"sem_{block.block_id}",
                semantic_type=sem_type,
                content=norm_content,
                order=block.global_reading_order,
                source_block_ids=[block.block_id],
                page_number=block.page_number,
                heading_level=heading_level,
                heading_level_evidence=heading_evidence,
                metadata={"classification": block.classification.value, "bbox": block.bbox}
            )

            # Separate repeated headers/footers from main reading content
            if block.is_header:
                headers.append(s_block)
            elif block.is_footer:
                footers.append(s_block)
            else:
                semantic_blocks.append(s_block)

        # 3. Parse Lists
        parsed_lists = self.list_parser.parse_lists(semantic_blocks)

        # 4. Parse Figures & Captions
        parsed_figures = self.figure_parser.parse_figures(parsed_lists)

        # 5. Parse Tables
        parsed_tables = self.table_parser.parse_tables(parsed_figures)

        # 6. Build Hierarchical Sections
        sections = self.section_builder.build_sections(parsed_tables)

        return SemanticDocument(
            document_id=ordered_doc.document_id,
            title=document_title,
            language="en",
            sections=sections,
            headers=headers,
            footers=footers,
            source_text_length=source_text_length,
            source_word_count=source_word_count,
        )
