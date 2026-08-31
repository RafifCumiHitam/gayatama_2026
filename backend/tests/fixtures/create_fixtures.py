import fitz  # PyMuPDF
import pathlib
from typing import List

FIXTURE_DIR = pathlib.Path(__file__).parent / "documents"
FIXTURE_DIR.mkdir(parents=True, exist_ok=True)


def create_simple_single_column_pdf() -> str:
    path = FIXTURE_DIR / "simple_single_column.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 100), "Heading 1: Introduction to ReadAble", fontsize=18)
    page.insert_text((50, 140), "ReadAble is a universal accessible document converter.", fontsize=12)
    page.insert_text((50, 160), "It uses rule-based text block extraction without machine learning.", fontsize=12)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_multi_page_pdf() -> str:
    path = FIXTURE_DIR / "multi_page.pdf"
    doc = fitz.open()
    # Page 1
    p1 = doc.new_page(width=595, height=842)
    p1.insert_text((50, 100), "First Page Header", fontsize=16)
    p1.insert_text((50, 130), "Content on page one of multi-page document.", fontsize=12)
    # Page 2
    p2 = doc.new_page(width=595, height=842)
    p2.insert_text((50, 100), "Second Page Header", fontsize=16)
    p2.insert_text((50, 130), "Content on page two of multi-page document.", fontsize=12)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_two_column_pdf() -> str:
    path = FIXTURE_DIR / "two_column.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    # Left column
    page.insert_text((50, 100), "Left Column Text Line 1", fontsize=11)
    page.insert_text((50, 120), "Left Column Text Line 2", fontsize=11)
    # Right column
    page.insert_text((320, 100), "Right Column Text Line 1", fontsize=11)
    page.insert_text((320, 120), "Right Column Text Line 2", fontsize=11)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_image_pdf() -> str:
    path = FIXTURE_DIR / "image_pdf.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 50), "Document containing a drawing image", fontsize=14)
    # Insert a simple red rectangle image
    pix = fitz.Pixmap(fitz.csRGB, fitz.Rect(0, 0, 100, 100), 0)
    pix.clear_with(255)
    page.insert_image(fitz.Rect(50, 100, 200, 250), pixmap=pix)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_empty_text_pdf() -> str:
    path = FIXTURE_DIR / "empty_text.pdf"
    doc = fitz.open()
    doc.new_page(width=595, height=842)  # Empty blank page
    doc.save(str(path))
    doc.close()
    return str(path)


def create_corrupted_pdf() -> str:
    path = FIXTURE_DIR / "corrupted.pdf"
    path.write_bytes(b"%PDF-1.4 Not a valid pdf file content junk 12345")
    return str(path)


def create_three_column_pdf() -> str:
    path = FIXTURE_DIR / "three_column.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((40, 100), "Col 1 line 1", fontsize=10)
    page.insert_text((220, 100), "Col 2 line 1", fontsize=10)
    page.insert_text((400, 100), "Col 3 line 1", fontsize=10)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_heading_pdf() -> str:
    path = FIXTURE_DIR / "heading_document.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "MAIN TITLE HEADING", fontsize=20)
    page.insert_text((50, 100), "1. Introduction", fontsize=14)
    page.insert_text((50, 130), "This is the body paragraph text of section 1.", fontsize=10)
    page.insert_text((50, 170), "1.1 Sub-section", fontsize=12)
    page.insert_text((50, 195), "This is sub-section details paragraph.", fontsize=10)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_header_footer_pdf() -> str:
    path = FIXTURE_DIR / "header_footer.pdf"
    doc = fitz.open()
    # Page 1
    p1 = doc.new_page(width=595, height=842)
    p1.insert_text((50, 30), "ReadAble University Press - Report", fontsize=9)
    p1.insert_text((50, 150), "Page 1 Content Body", fontsize=11)
    p1.insert_text((50, 800), "Page 1", fontsize=9)
    # Page 2
    p2 = doc.new_page(width=595, height=842)
    p2.insert_text((50, 30), "ReadAble University Press - Report", fontsize=9)
    p2.insert_text((50, 150), "Page 2 Content Body", fontsize=11)
    p2.insert_text((50, 800), "Page 2", fontsize=9)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_lists_pdf() -> str:
    path = FIXTURE_DIR / "lists.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "Feature List", fontsize=14)
    page.insert_text((50, 90), "• First bullet item", fontsize=11)
    page.insert_text((50, 110), "- Second bullet item", fontsize=11)
    page.insert_text((50, 130), "1. Numbered item one", fontsize=11)
    page.insert_text((50, 150), "2. Numbered item two", fontsize=11)
    doc.save(str(path))
    doc.close()
    return str(path)


def create_mixed_layout_pdf() -> str:
    path = FIXTURE_DIR / "mixed_layout.pdf"
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 50), "Full Width Title Heading", fontsize=18)
    # Col 1
    page.insert_text((50, 100), "Col 1 paragraph text line 1.", fontsize=11)
    page.insert_text((50, 120), "Col 1 paragraph text line 2.", fontsize=11)
    # Col 2
    page.insert_text((320, 100), "Col 2 paragraph text line 1.", fontsize=11)
    page.insert_text((320, 120), "Col 2 paragraph text line 2.", fontsize=11)
    # Full Width Footer
    page.insert_text((50, 800), "Confidential Page 1", fontsize=9)
    doc.save(str(path))
    doc.close()
    return str(path)


if __name__ == "__main__":
    create_simple_single_column_pdf()
    create_multi_page_pdf()
    create_two_column_pdf()
    create_image_pdf()
    create_empty_text_pdf()
    create_corrupted_pdf()
    create_three_column_pdf()
    create_heading_pdf()
    create_header_footer_pdf()
    create_lists_pdf()
    create_mixed_layout_pdf()
    print("Fixtures created successfully.")
