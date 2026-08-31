import pytest
import pathlib
from app.services.document_processor.pdf_processor import PDFProcessor
from app.services.document_analyzer.layout_analyzer import LayoutAnalyzer
from app.services.document_analyzer.models import BlockClassification
from tests.fixtures.create_fixtures import (
    create_simple_single_column_pdf,
    create_multi_page_pdf,
    create_two_column_pdf,
    create_three_column_pdf,
    create_heading_pdf,
    create_header_footer_pdf,
    create_lists_pdf,
    create_mixed_layout_pdf,
)


@pytest.fixture(scope="module", autouse=True)
def generate_analyzer_fixtures():
    create_simple_single_column_pdf()
    create_multi_page_pdf()
    create_two_column_pdf()
    create_three_column_pdf()
    create_heading_pdf()
    create_header_footer_pdf()
    create_lists_pdf()
    create_mixed_layout_pdf()


def test_single_column_reading_order():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/simple_single_column.pdf").resolve())

    extraction = processor.extract("doc_sc", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    assert ordered_doc.total_pages == 1
    blocks = ordered_doc.ordered_blocks
    assert len(blocks) > 0

    # Verify global reading order index is strictly ascending
    orders = [b.global_reading_order for b in blocks]
    assert orders == sorted(orders)
    assert orders == list(range(1, len(blocks) + 1))


def test_two_column_reading_order():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/two_column.pdf").resolve())

    extraction = processor.extract("doc_2col", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    page = ordered_doc.pages[0]
    assert page.detected_columns_count == 2

    blocks = ordered_doc.ordered_blocks
    col1_blocks = [b for b in blocks if b.column_index == 1]
    col2_blocks = [b for b in blocks if b.column_index == 2]

    assert len(col1_blocks) >= 1
    assert len(col2_blocks) >= 1

    # Verify Column 1 blocks precede Column 2 blocks in global reading order
    max_col1_order = max(b.global_reading_order for b in col1_blocks)
    min_col2_order = min(b.global_reading_order for b in col2_blocks)
    assert max_col1_order < min_col2_order


def test_heading_detection_and_classification():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/heading_document.pdf").resolve())

    extraction = processor.extract("doc_head", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    blocks = ordered_doc.ordered_blocks
    classifications = [b.classification for b in blocks]

    assert BlockClassification.TITLE in classifications or BlockClassification.HEADING in classifications
    
    title_or_heading = [b for b in blocks if b.classification in (BlockClassification.TITLE, BlockClassification.HEADING)]
    assert len(title_or_heading) >= 2


def test_header_footer_detection():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/header_footer.pdf").resolve())

    extraction = processor.extract("doc_hf", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    blocks = ordered_doc.ordered_blocks
    headers = [b for b in blocks if b.is_header]
    footers = [b for b in blocks if b.is_footer]

    assert len(headers) >= 1
    assert len(footers) >= 1


def test_list_item_detection():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/lists.pdf").resolve())

    extraction = processor.extract("doc_list", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    blocks = ordered_doc.ordered_blocks
    list_items = [b for b in blocks if b.classification == BlockClassification.LIST_ITEM]
    assert len(list_items) >= 2


def test_mixed_layout_title_and_columns():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/mixed_layout.pdf").resolve())

    extraction = processor.extract("doc_mixed", pdf_path)
    ordered_doc = analyzer.analyze(extraction)

    blocks = ordered_doc.ordered_blocks
    first_block = blocks[0]
    
    # Title must come first before column blocks
    assert first_block.classification in (BlockClassification.TITLE, BlockClassification.HEADING)
    assert "Title" in first_block.text


def test_determinism():
    processor = PDFProcessor()
    analyzer = LayoutAnalyzer()
    pdf_path = str(pathlib.Path("backend/tests/fixtures/documents/mixed_layout.pdf").resolve())

    extraction1 = processor.extract("doc_det", pdf_path)
    res1 = analyzer.analyze(extraction1)

    extraction2 = processor.extract("doc_det", pdf_path)
    res2 = analyzer.analyze(extraction2)

    order1 = [b.text for b in res1.ordered_blocks]
    order2 = [b.text for b in res2.ordered_blocks]

    assert order1 == order2
