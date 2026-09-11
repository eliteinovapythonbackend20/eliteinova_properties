# app/core/storage/cloudinary_storage.py
import io
import time
import asyncio
import hashlib
from typing import Optional, Union, Tuple

import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import UploadFile

from .base import StorageProvider
from app.core.config import settings


class CloudinaryStorage(StorageProvider):

    def __init__(self):
        """Initialize Cloudinary with configuration"""
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )
        self.cloudinary = cloudinary

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _extract_public_id_and_type(self, file_url: str) -> Tuple[str, str]:
        try:
            url = file_url.split('?')[0]
            parts = url.split('/')

            resource_type = "image"
            for i, part in enumerate(parts):
                if part in ("image", "video", "raw") and i + 1 < len(parts) and parts[i + 1] == "upload":
                    resource_type = part
                    break

            version_index = -1
            for i, part in enumerate(parts):
                if part.startswith('v') and part[1:].isdigit():
                    version_index = i
                    break

            if version_index != -1 and version_index + 1 < len(parts):
                public_id_with_ext = '/'.join(parts[version_index + 1:])
            else:
                public_id_with_ext = parts[-1]

            # Strip only the LAST extension, not everything after the
            # first dot (filenames can legitimately contain dots).
            if '.' in public_id_with_ext.rsplit('/', 1)[-1]:
                public_id = public_id_with_ext.rsplit('.', 1)[0]
            else:
                public_id = public_id_with_ext

            return public_id, resource_type

        except Exception:
            return hashlib.md5(file_url.encode()).hexdigest(), "image"

    @staticmethod
    def _resource_type_from_content_type(content_type: Optional[str]) -> str:
        if not content_type:
            return "auto"
        if content_type.startswith("image/"):
            return "image"
        if content_type.startswith("video/"):
            return "video"
        return "raw"

    # ------------------------------------------------------------------
    # StorageProvider interface
    # ------------------------------------------------------------------

    async def upload_file(
        self,
        file: Union[UploadFile, io.BytesIO],
        destination_path: str,
        cache_control: str = 'public, max-age=86400',
        storage_class: str = 'STANDARD',
        content_type: Optional[str] = None
    ) -> str:
        try:
            # Read file content
            if isinstance(file, UploadFile):
                file_bytes = await file.read()
                await file.seek(0)
            elif isinstance(file, io.BytesIO):
                file.seek(0)
                file_bytes = file.getvalue()
            else:
                raise ValueError("File must be UploadFile or BytesIO")

            # destination_path format: "user_id/property_id/images/filename.webp"
            path_parts = destination_path.split('/')
            filename = path_parts[-1]
            folder = '/'.join(path_parts[:-1]) if len(path_parts) > 1 else ""

            # Strip only the last extension (not split('.')[0], which
            # mangles filenames with multiple dots, e.g. "my.trip.webp").
            public_id = filename.rsplit('.', 1)[0] if '.' in filename else filename

            upload_options = {
                "folder": folder,
                "public_id": public_id,
                "use_filename": True,
                "unique_filename": False,
                "overwrite": True,
                "resource_type": self._resource_type_from_content_type(content_type),
                "type": "upload",
            }

            result = await asyncio.to_thread(
                cloudinary.uploader.upload, file_bytes, **upload_options
            )

            return result.get("secure_url")

        except Exception as e:
            raise Exception(f"Cloudinary upload failed: {str(e)}")

    async def delete_file(self, file_url: str) -> None:
        try:
            public_id, resource_type = self._extract_public_id_and_type(file_url)

            result = await asyncio.to_thread(
                cloudinary.uploader.destroy,
                public_id,
                resource_type=resource_type,
            )

            if result.get("result") not in ("ok", "not found"):
                raise Exception(f"Failed to delete file: {result.get('result')}")

        except Exception as e:
            raise Exception(f"Cloudinary delete failed: {str(e)}")

    async def generate_signed_url(self, file_url: str, expiration: int = 3600) -> str:
       
        try:
            public_id, resource_type = self._extract_public_id_and_type(file_url)

            timestamp = int(time.time()) + expiration

            signed_url = cloudinary.utils.cloudinary_url(
                public_id,
                sign_url=True,
                expires_at=timestamp,
                secure=True,
                resource_type=resource_type,
            )

            return signed_url[0]

        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")

    async def file_exists(self, file_url: str) -> bool:
        try:
            public_id, resource_type = self._extract_public_id_and_type(file_url)
            result = await asyncio.to_thread(
                cloudinary.api.resource, public_id, resource_type=resource_type
            )
            return result is not None
        except cloudinary.exceptions.NotFound:
            return False
        except Exception:
            return False