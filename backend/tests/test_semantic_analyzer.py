import pytest
import pathlib
from app.services.document_processor.pdf_processor import PDFProcessor
from app.services.document_analyzer.layout_analyzer import LayoutAnalyzer
from app.services.document_semantic.semantic_analyzer import SemanticAnalyzer
from app.services.document_reflow.reflow_engine import ReflowEngine
from app.services.document_semantic.semantic_models import SemanticType
from tests.fixtures.create_fixtures import (
    create_simple_single_column_pdf,
    create_heading_pdf,
    create_lists_pdf,
    create_header_footer_pdf,
    create_mixed_layout_pdf,
)


@pytest.fixture(scope="module", autouse=True)
def generate_semantic_fixtures():
    create_simple_single_column_pdf()
    create_heading_pdf()
    create_lists_pdf()
    create_header_footer_pdf()
    create_mixed_layout_pdf()


def test_semantic_document_title_and_sections():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    semantic_analyzer = SemanticAnalyzer()

    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/heading_document.pdf").resolve())
    extraction = processor.extract("sem_1", pdf_path)
    ordered_doc = analyzer.analyze(extraction)
    semantic_doc = semantic_analyzer.analyze(ordered_doc)

    assert semantic_doc.document_id == "sem_1"
    assert semantic_doc.title is not None
    assert "MAIN TITLE HEADING" in semantic_doc.title
    assert len(semantic_doc.sections) >= 1

    # Check nested heading hierarchy
    intro_sec = next((s for s in semantic_doc.sections if "Introduction" in (s.title or "")), None)
    assert intro_sec is not None


def test_list_parsing():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    semantic_analyzer = SemanticAnalyzer()

    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/lists.pdf").resolve())
    extraction = processor.extract("sem_list", pdf_path)
    ordered_doc = analyzer.analyze(extraction)
    semantic_doc = semantic_analyzer.analyze(ordered_doc)

    # Flatten all blocks inside sections
    all_blocks = []
    def collect(sec):
        all_blocks.extend(sec.blocks)
        for c in sec.children:
            collect(c)

    for s in semantic_doc.sections:
        collect(s)

    list_blocks = [b for b in all_blocks if b.semantic_type == SemanticType.LIST]
    assert len(list_blocks) >= 1
    assert "•" in list_blocks[0].content


def test_header_footer_filtering():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    semantic_analyzer = SemanticAnalyzer()

    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/header_footer.pdf").resolve())
    extraction = processor.extract("sem_hf", pdf_path)
    ordered_doc = analyzer.analyze(extraction)
    semantic_doc = semantic_analyzer.analyze(ordered_doc)

    # Headers and Footers must be preserved in headers/footers list but excluded from reading sections
    assert len(semantic_doc.headers) >= 1
    assert len(semantic_doc.footers) >= 1


def test_content_integrity_and_reflow():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    semantic_analyzer = SemanticAnalyzer()
    reflow_engine = ReflowEngine()

    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/mixed_layout.pdf").resolve())
    extraction = processor.extract("sem_reflow", pdf_path)
    ordered_doc = analyzer.analyze(extraction)
    semantic_doc = semantic_analyzer.analyze(ordered_doc)
    readable_doc = reflow_engine.reflow(semantic_doc)

    assert readable_doc.document_id == "sem_reflow"
    assert readable_doc.total_word_count > 0
    assert readable_doc.total_character_count > 0
    assert len(readable_doc.sections) >= 1


def test_semantic_determinism():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    semantic_analyzer = SemanticAnalyzer()

    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/mixed_layout.pdf").resolve())

    ext1 = processor.extract("sem_det", pdf_path)
    s1 = semantic_analyzer.analyze(analyzer.analyze(ext1))

    ext2 = processor.extract("sem_det", pdf_path)
    s2 = semantic_analyzer.analyze(analyzer.analyze(ext2))

    assert s1.title == s2.title
    assert len(s1.sections) == len(s2.sections)
    assert s1.source_text_length == s2.source_text_length
