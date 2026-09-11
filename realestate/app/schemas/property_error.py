from typing import Optional, List, Dict, Any

class PropertyError(Exception):
    """Base exception for property-related errors"""
    def __init__(self, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

class PropertyNotFoundError(PropertyError):
    def __init__(self, property_id: str):
        super().__init__(
            message=f"Property with ID {property_id} not found",
            status_code=404,
            details={"property_id": property_id}
        )

class PropertyValidationError(PropertyError):
    def __init__(self, message: str, errors: Dict[str, str]):
        super().__init__(
            message=message,
            status_code=400,
            details={"validation_errors": errors}
        )

class PropertyPermissionError(PropertyError):
    def __init__(self, message: str = "Not authorized to perform this action"):
        super().__init__(
            message=message,
            status_code=403
        )

class PropertyFileUploadError(PropertyError):
    def __init__(self, message: str, filename: Optional[str] = None):
        details = {"filename": filename} if filename else {}
        super().__init__(
            message=f"File upload failed: {message}",
            status_code=500,
            details=details
        )