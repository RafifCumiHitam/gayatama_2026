import os
import uuid
import pathlib
import shutil
from abc import ABC, abstractmethod
from typing import BinaryIO, Optional
from fastapi import HTTPException, status
from app.core.config import settings


class StorageService(ABC):
    """Abstract file storage service interface."""

    @abstractmethod
    def save(self, file_object: BinaryIO, original_filename: str, mime_type: str) -> str:
        """Saves file to storage and returns unique storage path key."""
        pass

    @abstractmethod
    def delete(self, file_path_key: str) -> bool:
        """Deletes file from storage."""
        pass

    @abstractmethod
    def exists(self, file_path_key: str) -> bool:
        """Checks if file exists in storage."""
        pass

    @abstractmethod
    def get(self, file_path_key: str) -> Optional[bytes]:
        """Reads file bytes from storage."""
        pass


class LocalStorageService(StorageService):
    """Local filesystem storage implementation."""

    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = pathlib.Path(base_dir or settings.STORAGE_PATH).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _get_full_path(self, file_path_key: str) -> pathlib.Path:
        """Resolves file path key and checks against path traversal attacks."""
        resolved_path = (self.base_dir / file_path_key).resolve()
        if not str(resolved_path).startswith(str(self.base_dir)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file path key (path traversal detected)."
            )
        return resolved_path

    def save(self, file_object: BinaryIO, original_filename: str, mime_type: str) -> str:
        # Generate safe storage filename using UUID
        ext = pathlib.Path(original_filename).suffix.lower()
        if ext != ".pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are supported."
            )
        
        safe_filename = f"{uuid.uuid4().hex}{ext}"
        target_path = self._get_full_path(safe_filename)

        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file_object, buffer)

        return safe_filename

    def delete(self, file_path_key: str) -> bool:
        try:
            target_path = self._get_full_path(file_path_key)
            if target_path.exists():
                target_path.unlink()
                return True
            return False
        except Exception:
            return False

    def exists(self, file_path_key: str) -> bool:
        try:
            target_path = self._get_full_path(file_path_key)
            return target_path.exists()
        except Exception:
            return False

    def get(self, file_path_key: str) -> Optional[bytes]:
        try:
            target_path = self._get_full_path(file_path_key)
            if target_path.exists():
                return target_path.read_bytes()
            return None
        except Exception:
            return None


def get_storage_service() -> StorageService:
    return LocalStorageService()
