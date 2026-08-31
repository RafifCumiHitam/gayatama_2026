import pytest
import os
import pathlib
from app.services.document_processor.pdf_processor import PDFProcessor
from app.services.document_processor.base import (
    CorruptedDocumentError,
    DocumentProcessorError
)
from app.services.document_processor.models import BlockType
from tests.fixtures.create_fixtures import (
    create_simple_single_column_pdf,
    create_multi_page_pdf,
    create_two_column_pdf,
    create_image_pdf,
    create_empty_text_pdf,
    create_corrupted_pdf,
)

@pytest.fixture(scope="module", autouse=True)
def generate_fixtures():
    create_simple_single_column_pdf()
    create_multi_page_pdf()
    create_two_column_pdf()
    create_image_pdf()
    create_empty_text_pdf()
    create_corrupted_pdf()


def test_pdf_opens_successfully():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/simple_single_column.pdf").resolve())
    assert processor.validate(pdf_path) is True


def test_single_page_extraction():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/simple_single_column.pdf").resolve())
    extraction = processor.extract("doc_1", pdf_path)

    assert extraction.document_id == "doc_1"
    assert extraction.total_pages == 1
    assert len(extraction.pages) == 1

    page = extraction.pages[0]
    assert page.page_number == 1
    assert page.width > 0
    assert page.height > 0
    assert len(page.blocks) > 0

    first_block = page.blocks[0]
    assert first_block.block_type == BlockType.TEXT
    assert "Introduction to ReadAble" in first_block.text
    assert len(first_block.bbox) == 4
    assert first_block.font_size > 0


def test_multi_page_extraction():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/multi_page.pdf").resolve())
    extraction = processor.extract("doc_multi", pdf_path)

    assert extraction.total_pages == 2
    assert len(extraction.pages) == 2
    assert extraction.pages[0].page_number == 1
    assert extraction.pages[1].page_number == 2
    assert "First Page Header" in extraction.pages[0].blocks[0].text
    assert "Second Page Header" in extraction.pages[1].blocks[0].text


def test_two_column_extraction():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/two_column.pdf").resolve())
    extraction = processor.extract("doc_col", pdf_path)

    assert extraction.total_pages == 1
    blocks = extraction.pages[0].blocks
    assert len(blocks) >= 2
    # Verify bounding boxes exist and differ between left and right column blocks
    bbox_x_coords = [b.bbox[0] for b in blocks]
    assert min(bbox_x_coords) < max(bbox_x_coords)


def test_image_pdf_extraction():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/image_pdf.pdf").resolve())
    extraction = processor.extract("doc_img", pdf_path)

    page = extraction.pages[0]
    image_blocks = [b for b in page.blocks if b.block_type == BlockType.IMAGE]
    assert len(image_blocks) >= 1
    assert image_blocks[0].width > 0
    assert image_blocks[0].height > 0


def test_empty_text_pdf_handling():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/empty_text.pdf").resolve())
    extraction = processor.extract("doc_empty", pdf_path)

    assert extraction.total_pages == 1
    assert len(extraction.pages[0].blocks) == 0


def test_corrupted_pdf_handling():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/corrupted.pdf").resolve())
    with pytest.raises(CorruptedDocumentError):
        processor.extract("doc_bad", pdf_path)


def test_missing_file_handling():
    processor = PDFProcessor()
    pdf_path = str(pathlib.Path("tests/fixtures/documents/non_existent.pdf").resolve())
    with pytest.raises(DocumentProcessorError):
        processor.extract("doc_missing", pdf_path)
