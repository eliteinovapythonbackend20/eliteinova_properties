import os
import asyncio
from datetime import timedelta
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, Union
from urllib.parse import urlparse, quote

import io
from fastapi import UploadFile
from google.cloud.storage import Client

from app.core.storage.base import StorageProvider
from app.core.config import settings


class GCSStorage(StorageProvider):
    """Google Cloud Storage implementation"""

    def __init__(self):
        self.bucket_name = settings.GCS_BUCKET_NAME
        self.max_workers = settings.GCS_UPLOAD_WORKERS
        self.executor = ThreadPoolExecutor(max_workers=self.max_workers)

        # Optional custom domain fronting a Cloud CDN / Load Balancer in
        # front of the bucket, e.g. "https://cdn.example.com". Falls back
        # to the standard public GCS URL if not configured.
        self.cdn_base_url = getattr(settings, "GCS_CDN_BASE_URL", None)

        try:
            if settings.GCS_CREDENTIALS_PATH and os.path.exists(settings.GCS_CREDENTIALS_PATH):
                self.client = Client.from_service_account_json(settings.GCS_CREDENTIALS_PATH)
            else:
                self.client = Client()
            self.bucket = self.client.bucket(self.bucket_name)
            self.bucket.exists()
            # print(f"☁️ GCSStorage initialized with bucket: {self.bucket_name}")
        except Exception as e:
            raise Exception(f"Failed to initialize GCS: {str(e)}")

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _build_url(self, destination_path: str) -> str:
        """
        Build the public-facing URL we return/store for this object.

        NOTE: this only resolves to something viewable if the object is
        actually publicly readable -- either via bucket-level IAM
        (allUsers -> Storage Object Viewer, with Uniform Bucket-Level
        Access) or because self.cdn_base_url points at a CDN backend
        that's authorized to read the bucket. This code does not and
        should not call per-object ACL methods like blob.make_public():
        those raise an error if Uniform Bucket-Level Access is enabled,
        which is the recommended (and often required) setting for a
        bucket sitting behind Cloud CDN. Configure public read access at
        the bucket/IAM level once, outside application code.
        """
        safe_path = quote(destination_path, safe="/")
        if self.cdn_base_url:
            return f"{self.cdn_base_url.rstrip('/')}/{safe_path}"
        return f"https://storage.googleapis.com/{self.bucket_name}/{safe_path}"

    def _extract_object_path(self, file_url_or_path: str) -> str:
        """
        Recover the GCS object path from either a bare destination_path
        (old rows, or callers that kept the pre-CDN convention) or a full
        URL produced by _build_url. Mirrors the same "reverse-engineer
        from what we stored" approach used for Cloudinary, so delete_file
        / generate_signed_url / file_exists all agree on the same object
        regardless of which form was persisted.
        """
        if file_url_or_path.startswith("http://") or file_url_or_path.startswith("https://"):
            parsed = urlparse(file_url_or_path)
            path = parsed.path.lstrip("/")
            # storage.googleapis.com/<bucket>/<object path>
            if not self.cdn_base_url and path.startswith(f"{self.bucket_name}/"):
                path = path[len(self.bucket_name) + 1:]
            return path
        return file_url_or_path

    @staticmethod
    async def _read_all_bytes(file: Union[UploadFile, io.BytesIO]) -> bytes:
        """Read file content on the event loop, where awaiting is legal,
        BEFORE handing raw bytes off to a worker thread. UploadFile.read()
        and .seek() are coroutines -- calling them from inside a
        ThreadPoolExecutor thread (no running loop) silently produces an
        unawaited coroutine instead of bytes, which is the bug this fixes.
        """
        if isinstance(file, UploadFile):
            content = await file.read()
            await file.seek(0)
            return content
        elif isinstance(file, io.BytesIO):
            file.seek(0)
            return file.getvalue()
        else:
            raise ValueError("File must be UploadFile or BytesIO")

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
        """Upload a file to GCS - returns a usable (CDN/public) URL"""
        try:
            content = await self._read_all_bytes(file)

            resolved_content_type = (
                content_type
                or getattr(file, "content_type", None)
                or "application/octet-stream"
            )

            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                self.executor,
                self._upload_sync,
                content,
                destination_path,
                cache_control,
                storage_class,
                resolved_content_type,
            )
            return self._build_url(destination_path)
        except Exception as e:
            raise Exception(f"Failed to upload file to GCS: {str(e)}")

    def _upload_sync(
        self,
        content: bytes,
        destination_path: str,
        cache_control: str,
        storage_class: str,
        content_type: str,
    ) -> None:
        blob = self.bucket.blob(destination_path)
        blob.cache_control = cache_control
        blob.storage_class = storage_class
        blob.upload_from_string(content, content_type=content_type)

    async def delete_file(self, file_path: str) -> None:
        """Delete a file from GCS using its path or previously-returned URL"""
        try:
            object_path = self._extract_object_path(file_path)
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(self.executor, self._delete_sync, object_path)
        except Exception as e:
            raise Exception(f"Failed to delete file from GCS: {str(e)}")

    def _delete_sync(self, object_path: str) -> None:
        blob = self.bucket.blob(object_path)
        blob.delete()

    async def generate_signed_url(self, file_path: str, expiration: int = 3600) -> str:
        """
        Generate a v4 signed URL.

        Requires either:
        - credentials loaded from a service-account JSON key (as in
          GCS_CREDENTIALS_PATH), which carry a private key usable for
          local signing, or
        - default/compute credentials PLUS the IAM
          "roles/iam.serviceAccountTokenCreator" permission, so the
          client can sign via the IAM signBlob API.
        Default Compute Engine/GKE credentials with neither of the above
        will raise on signing -- this is a deployment/IAM concern, not
        something fixable purely in this method.
        """
        try:
            object_path = self._extract_object_path(file_path)
            blob = self.bucket.blob(object_path)
            loop = asyncio.get_running_loop()
            signed_url = await loop.run_in_executor(
                self.executor,
                lambda: blob.generate_signed_url(
                    version="v4",
                    expiration=timedelta(seconds=expiration),
                    method="GET",
                ),
            )
            return signed_url
        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")

    async def file_exists(self, file_path: str) -> bool:
        try:
            object_path = self._extract_object_path(file_path)
            blob = self.bucket.blob(object_path)
            loop = asyncio.get_running_loop()
            # blob.exists() is a blocking network call -- offload it like
            # every other method here instead of calling it directly on
            # the event loop.
            return await loop.run_in_executor(self.executor, blob.exists)
        except Exception:
            return False

    def shutdown(self):
        self.executor.shutdown(wait=True)