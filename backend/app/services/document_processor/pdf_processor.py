import os
import pathlib
import fitz  # PyMuPDF
from typing import List, Optional
from app.services.document_processor.base import (
    DocumentProcessor,
    DocumentProcessorError,
    CorruptedDocumentError,
    EncryptedDocumentError,
    EmptyDocumentError,
)
from app.services.document_processor.models import (
    DocumentExtraction,
    ExtractedPage,
    ExtractedBlock,
    BlockType,
)


class PDFProcessor(DocumentProcessor):
    """PyMuPDF-based deterministic PDF text & block structure extractor."""

    def validate(self, file_path: str) -> bool:
        path = pathlib.Path(file_path)
        if not path.exists() or not path.is_file():
            raise DocumentProcessorError("PDF file does not exist.")
        
        try:
            doc = fitz.open(file_path)
            if doc.is_encrypted:
                doc.close()
                raise EncryptedDocumentError("PDF document is encrypted or password-protected.")
            if doc.page_count == 0:
                doc.close()
                raise EmptyDocumentError("PDF document contains no pages.")
            doc.close()
            return True
        except (EncryptedDocumentError, EmptyDocumentError, DocumentProcessorError):
            raise
        except Exception as e:
            raise CorruptedDocumentError(f"Failed to open or parse PDF: {str(e)}")

    def extract(self, document_id: str, file_path: str) -> DocumentExtraction:
        self.validate(file_path)

        try:
            doc = fitz.open(file_path)
        except Exception as e:
            raise CorruptedDocumentError(f"Cannot open PDF file: {str(e)}")

        extracted_pages: List[ExtractedPage] = []

        try:
            for page_idx in range(doc.page_count):
                page = doc.load_page(page_idx)
                page_num = page_idx + 1
                rect = page.rect
                page_width = float(rect.width)
                page_height = float(rect.height)

                page_blocks: List[ExtractedBlock] = []

                # Extract page layout dictionary using PyMuPDF
                text_page = page.get_text("dict")
                blocks = text_page.get("blocks", [])

                block_counter = 0
                for b in blocks:
                    block_counter += 1
                    block_id = f"p{page_num}_b{block_counter}"
                    bbox = [float(c) for c in b.get("bbox", [0, 0, 0, 0])]

                    b_type_num = b.get("type", 0)
                    if b_type_num == 0:
                        # Text block
                        lines = b.get("lines", [])
                        line_texts = []
                        primary_font_name = None
                        primary_font_size = None
                        primary_font_flags = None

                        for line in lines:
                            spans = line.get("spans", [])
                            for span in spans:
                                text_content = span.get("text", "")
                                line_texts.append(text_content)
                                if primary_font_name is None and text_content.strip():
                                    primary_font_name = span.get("font")
                                    primary_font_size = float(span.get("size", 0.0))
                                    primary_font_flags = span.get("flags")

                        raw_text = "\n".join(line_texts).strip()

                        # Normalize minor whitespace artifacts without aggressive merging
                        normalized_text = " ".join(raw_text.split()) if raw_text else ""

                        if not normalized_text:
                            continue

                        extracted_block = ExtractedBlock(
                            block_id=block_id,
                            page_number=page_num,
                            block_type=BlockType.TEXT,
                            bbox=bbox,
                            text=normalized_text,
                            font_name=primary_font_name,
                            font_size=primary_font_size,
                            font_flags=primary_font_flags,
                            width=bbox[2] - bbox[0],
                            height=bbox[3] - bbox[1],
                        )
                        page_blocks.append(extracted_block)

                    elif b_type_num == 1:
                        # Image block
                        img_width = float(b.get("width", bbox[2] - bbox[0]))
                        img_height = float(b.get("height", bbox[3] - bbox[1]))

                        extracted_block = ExtractedBlock(
                            block_id=block_id,
                            page_number=page_num,
                            block_type=BlockType.IMAGE,
                            bbox=bbox,
                            width=img_width,
                            height=img_height,
                            metadata={
                                "ext": b.get("ext", "png"),
                                "size": b.get("size", 0),
                            }
                        )
                        page_blocks.append(extracted_block)

                extracted_pages.append(
                    ExtractedPage(
                        page_number=page_num,
                        width=page_width,
                        height=page_height,
                        blocks=page_blocks,
                    )
                )
            doc.close()
        except Exception as e:
            doc.close()
            raise DocumentProcessorError(f"Error during block extraction: {str(e)}")

        return DocumentExtraction(
            document_id=document_id,
            total_pages=len(extracted_pages),
            pages=extracted_pages,
        )
