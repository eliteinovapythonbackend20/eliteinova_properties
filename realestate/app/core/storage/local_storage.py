
import os
from pathlib import Path
from typing import Optional, Union
from fastapi import UploadFile
import io
from app.core.storage.base import StorageProvider
from app.core.config import settings

class LocalStorage(StorageProvider):
    """Local filesystem storage implementation for development.

    Files are written under LOCAL_STORAGE_PATH and served back over HTTP via
    the "/uploads" StaticFiles mount in app/main.py. upload_file() returns a
    full absolute URL (not just the relative disk path) because the frontend
    runs on a different origin - a bare "/uploads/..." path would resolve
    against the frontend's own host, not the API's.
    """

    URL_PREFIX = "/uploads/"

    def __init__(self):
        self.base_path = Path(settings.LOCAL_STORAGE_PATH)
        self.base_path.mkdir(parents=True, exist_ok=True)
        print(f"LocalStorage initialized at: {self.base_path.absolute()}")

    def _get_file_path(self, destination_path: str) -> Path:
        # Accepts either the bare relative disk path or the full URL this
        # class itself returns from upload_file() - strip the URL part down
        # to the relative path either way before resolving it on disk.
        relative = destination_path
        if self.URL_PREFIX in relative:
            relative = relative.split(self.URL_PREFIX, 1)[1]
        return self.base_path / relative
    
    async def upload_file(
        self,
        file: Union[UploadFile, io.BytesIO],
        destination_path: str,
        cache_control: str = 'public, max-age=86400',
        storage_class: str = 'STANDARD',
        content_type: Optional[str] = None
    ) -> str:
        """Upload a file to local storage"""
        try:
            # Create directory
            file_path = self._get_file_path(destination_path)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # ✅ Read content based on file type
            if isinstance(file, UploadFile):
                # For UploadFile - async read
                content = await file.read()
            elif isinstance(file, io.BytesIO):
                # For BytesIO - sync methods
                file.seek(0)
                content = file.getvalue()
            else:
                content = bytes()
            
            # Write file
            with open(file_path, 'wb') as f:
                f.write(content)

            return f"{settings.BACKEND_BASE_URL.rstrip('/')}{self.URL_PREFIX}{destination_path}"

        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")
    
    async def delete_file(self, file_path: str) -> None:
        """Delete a file from local storage"""
        try:
            full_path = self._get_file_path(file_path)
            if full_path.exists():
                full_path.unlink()
                self._cleanup_empty_dirs(full_path.parent)
        except Exception as e:
            print(f"Failed to delete file {file_path}: {str(e)}")
    
    def _cleanup_empty_dirs(self, path: Path) -> None:
        """Remove empty directories up to the base path"""
        if path == self.base_path:
            return
        try:
            if path.exists() and not any(path.iterdir()):
                path.rmdir()
                self._cleanup_empty_dirs(path.parent)
        except Exception:
            pass
    
    async def generate_signed_url(self, file_path: str, expiration: int = 3600) -> str:
        """For local storage, just return the path"""
        return file_path
    
    async def file_exists(self, file_path: str) -> bool:
        """Check if a file exists in local storage"""
        try:
            full_path = self._get_file_path(file_path)
            return full_path.exists()
        except Exception:
            return False