from typing import Dict, Optional
from app.core.config import settings
from app.core.storage.base import StorageProvider
from app.core.storage.gcs_storage import GCSStorage
from app.core.storage.local_storage import LocalStorage

class StorageFactory:
    """Factory class to create the appropriate storage provider.

    Two logical destinations - "public" (property images/videos, vendor
    profile photos) and "private" (KYC/legal documents) - each cached as
    its own instance. For GCS this means two real buckets with different
    IAM/public-access posture. For local (dev), there's no bucket concept,
    so both keys resolve to the same single instance.
    """

    _instances: Dict[str, StorageProvider] = {}

    @classmethod
    def get_storage(cls, bucket: str = "public") -> StorageProvider:
        if bucket not in cls._instances:
            cls._instances[bucket] = cls._create_storage(bucket)
        return cls._instances[bucket]

    @classmethod
    def _create_storage(cls, bucket: str) -> StorageProvider:
        storage_type = settings.STORAGE_TYPE.lower()

        if storage_type == "gcs":
            bucket_name = (
                settings.GCS_PRIVATE_BUCKET if bucket == "private" else settings.GCS_PUBLIC_BUCKET
            )
            return GCSStorage(bucket_name=bucket_name)
        else:
            return LocalStorage()

    @classmethod
    def reset(cls):
        for instance in cls._instances.values():
            if hasattr(instance, 'shutdown'):
                instance.shutdown()
        cls._instances = {}
