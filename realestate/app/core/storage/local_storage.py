
import io
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union

from fastapi import HTTPException, UploadFile, status
from jose import ExpiredSignatureError, JWTError, jwt

from app.core.config import settings
from app.core.storage.base import StorageProvider

STREAM_TOKEN_TYPE = "doc_stream"
STREAM_PATH = "/api/v1/documents/stream"

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

    @classmethod
    def relative_key(cls, destination_path: str) -> str:
        # Accepts either the bare relative disk path or the full URL this
        # class itself returns from upload_file().
        if cls.URL_PREFIX in destination_path:
            return destination_path.split(cls.URL_PREFIX, 1)[1]
        return destination_path

    def _get_file_path(self, destination_path: str) -> Path:
        relative = self.relative_key(destination_path)
        full = (self.base_path / relative).resolve()
        # Refuse anything that resolves outside the storage root (e.g. "../").
        if self.base_path.resolve() not in full.parents and full != self.base_path.resolve():
            raise ValueError("path escapes the storage root")
        return full
    
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
    
    async def generate_signed_url(self, file_path: str, expiration: int = 3600, **claims: Any) -> str:
        """Return a short-lived URL to this app's authorised stream endpoint.

        The URL carries a signed token (HMAC via SECRET_KEY) that names the file
        and expires after `expiration` seconds. Serving is done by the stream
        route, never by a static mount. `claims` (e.g. actor id, asset id) are
        embedded for audit and are not secret.
        """
        now = datetime.now(timezone.utc)
        payload = {
            "typ": STREAM_TOKEN_TYPE,
            "key": self.relative_key(file_path),
            "iat": now,
            "exp": now + timedelta(seconds=expiration),
            "jti": uuid.uuid4().hex,
            **claims,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return f"{settings.BACKEND_BASE_URL.rstrip('/')}{STREAM_PATH}?token={token}"

    @staticmethod
    def read_stream_token(token: str) -> Tuple[str, Dict[str, Any]]:
        """Validate a stream token. Returns (storage key, claims) or raises 401."""
        try:
            claims = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="This link has expired")
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid link")
        if claims.get("typ") != STREAM_TOKEN_TYPE or not claims.get("key"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid link")
        return claims["key"], claims

    def path_for_key(self, key: str) -> Optional[Path]:
        """Resolved on-disk path for a storage key, or None if it is not a file."""
        try:
            full = self._get_file_path(key)
        except ValueError:
            return None
        return full if full.is_file() else None
    
    async def file_exists(self, file_path: str) -> bool:
        """Check if a file exists in local storage"""
        try:
            return self._get_file_path(file_path).exists()
        except Exception:
            return False