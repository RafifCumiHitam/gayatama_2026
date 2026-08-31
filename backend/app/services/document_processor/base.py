from abc import ABC, abstractmethod
from typing import BinaryIO
from app.services.document_processor.models import DocumentExtraction


class DocumentProcessorError(Exception):
    """Base exception for document processor errors."""
    pass


class CorruptedDocumentError(DocumentProcessorError):
    """Raised when the document file is corrupted or unreadable."""
    pass


class EncryptedDocumentError(DocumentProcessorError):
    """Raised when the document file is encrypted or password protected."""
    pass


class EmptyDocumentError(DocumentProcessorError):
    """Raised when the document contains no pages or content."""
    pass


class DocumentProcessor(ABC):
    """Abstract interface for deterministic document processors."""

    @abstractmethod
    def validate(self, file_path_or_stream: str) -> bool:
        """Validate if file is valid for processing."""
        pass

    @abstractmethod
    def extract(self, document_id: str, file_path: str) -> DocumentExtraction:
        """Extract structured blocks from file."""
        pass
