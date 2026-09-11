from typing import Optional
from app.core.config import settings
from app.core.storage.base import StorageProvider
from app.core.storage.cloudinary_storage import CloudinaryStorage
from app.core.storage.gcs_storage import GCSStorage
from app.core.storage.local_storage import LocalStorage

class StorageFactory:
    """Factory class to create the appropriate storage provider"""
    
    _instance: Optional[StorageProvider] = None
    
    @classmethod
    def get_storage(cls) -> StorageProvider:
        if cls._instance is None:
            cls._instance = cls._create_storage()
        return cls._instance
    
    @classmethod
    def _create_storage(cls) -> StorageProvider:
        storage_type = settings.STORAGE_TYPE.lower()

        if storage_type == "cloudinary":
            return CloudinaryStorage()
        elif storage_type == "gcs":
            return GCSStorage()
        else:
            return LocalStorage()
    
    @classmethod
    def reset(cls):
        if cls._instance and hasattr(cls._instance, 'shutdown'):
            cls._instance.shutdown()
        cls._instance = None