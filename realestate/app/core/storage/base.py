# app/core/storage/base.py

from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any, Union
from fastapi import UploadFile
import io

class StorageProvider(ABC):
    """Abstract base class for all storage providers"""
    
    @abstractmethod
    async def upload_file(
        self,
        file: Union[UploadFile, io.BytesIO],
        destination_path: str,
        cache_control: str = 'public, max-age=86400',
        storage_class: str = 'STANDARD',
        content_type: Optional[str] = None
    ) -> str:
        """
        Upload a file to storage
        
        Args:
            file: File to upload (UploadFile or BytesIO)
            destination_path: Path where to store the file
            cache_control: Cache-Control header
            storage_class: Storage class (STANDARD, NEARLINE, etc.)
            content_type: MIME type of the file
        
        Returns:
            URL of the uploaded file
        """
        pass
    
    @abstractmethod
    async def delete_file(self, file_url: str) -> None:
        """
        Delete a file from storage
        
        Args:
            file_url: URL or path of the file to delete
        """
        pass
    
    @abstractmethod
    async def generate_signed_url(self, file_url: str, expiration: int = 3600) -> str:
        """
        Generate a signed URL for temporary access
        
        Args:
            file_url: URL or path of the file
            expiration: Expiration time in seconds
        
        Returns:
            Signed URL for temporary access
        """
        pass
    
    @abstractmethod
    async def file_exists(self, file_url: str) -> bool:
        """
        Check if a file exists in storage
        
        Args:
            file_url: URL or path of the file
        
        Returns:
            True if file exists, False otherwise
        """
        pass