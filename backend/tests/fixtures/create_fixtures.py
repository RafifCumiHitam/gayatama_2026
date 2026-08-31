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


if __name__ == "__main__":
    create_simple_single_column_pdf()
    create_multi_page_pdf()
    create_two_column_pdf()
    create_image_pdf()
    create_empty_text_pdf()
    create_corrupted_pdf()
    print("Fixtures created successfully.")
