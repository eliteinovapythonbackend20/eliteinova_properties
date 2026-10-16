# app/core/storage/locator.py
#
# Turns a stored file URL (the value already in file_url / storedPath columns)
# into a storage locator: (storage_provider, bucket, storage_key).
#
# This only reads the string. It never contacts storage, so it is safe to run
# over existing rows during migration. Anything it cannot parse comes back as
# provider "unknown" with the raw value kept as the key, so nothing is lost.

from dataclasses import dataclass
from typing import Optional
from urllib.parse import unquote, urlparse

from app.core.config import settings

PROVIDER_GCS = "gcs"
PROVIDER_LOCAL = "local"
PROVIDER_UNKNOWN = "unknown"

_GCS_HOST = "storage.googleapis.com"
_LOCAL_PREFIX = "/uploads/"


@dataclass(frozen=True)
class StorageLocator:
    storage_provider: str
    bucket: Optional[str]
    storage_key: str


def parse_file_url(file_url: Optional[str]) -> StorageLocator:
    if not file_url:
        return StorageLocator(PROVIDER_UNKNOWN, None, "")

    cdn_base = getattr(settings, "GCS_CDN_BASE_URL", None)
    backend_base = (settings.BACKEND_BASE_URL or "").rstrip("/")

    if cdn_base and file_url.startswith(cdn_base.rstrip("/") + "/"):
        key = file_url[len(cdn_base.rstrip("/")) + 1:]
        return StorageLocator(PROVIDER_GCS, None, unquote(key))

    if file_url.startswith(f"https://{_GCS_HOST}/"):
        bucket, _, key = urlparse(file_url).path.lstrip("/").partition("/")
        if bucket and key:
            return StorageLocator(PROVIDER_GCS, bucket, unquote(key))

    if backend_base and file_url.startswith(backend_base + _LOCAL_PREFIX):
        return StorageLocator(PROVIDER_LOCAL, None, file_url[len(backend_base + _LOCAL_PREFIX):])

    if file_url.startswith(_LOCAL_PREFIX):
        return StorageLocator(PROVIDER_LOCAL, None, file_url[len(_LOCAL_PREFIX):])

    return StorageLocator(PROVIDER_UNKNOWN, None, file_url)
