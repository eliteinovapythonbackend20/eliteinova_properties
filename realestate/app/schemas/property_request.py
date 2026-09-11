from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from fastapi import UploadFile
import json

from app.schemas.property_base import PropertyBaseSchema
from app.schemas.property_vendor_schemas import OwnerDetailsSchema, AgentDetailsSchema, BuilderDetailsSchema, PMDetailsSchema

class PropertyCreateMultipart(BaseModel):
    """Schema for multipart property creation"""
    property_data: str = Field(..., description="JSON string containing property data")
    images: Optional[List[UploadFile]] = Field(None, description="Property images")
    video: Optional[UploadFile] = Field(None, description="Property video")
    documents: Optional[List[UploadFile]] = Field(None, description="Property documents")
    
    @field_validator('property_data')
    @classmethod
    def validate_and_parse_json(cls, v: str) -> Dict[str, Any]:
        try:
            data = json.loads(v)
            # Validate required fields
            required_fields = ['property_category', 'listing_purpose', 'posted_by']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            return data
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in property_data: {str(e)}")

class PropertyUpdateMultipart(BaseModel):
    """Schema for multipart property update"""
    property_data: str = Field(..., description="JSON string containing property data")
    images: Optional[List[UploadFile]] = Field(None, description="Property images")
    video: Optional[UploadFile] = Field(None, description="Property video")
    documents: Optional[List[UploadFile]] = Field(None, description="Property documents")
    
    @field_validator('property_data')
    @classmethod
    def validate_and_parse_json(cls, v: str) -> Dict[str, Any]:
        try:
            return json.loads(v)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in property_data: {str(e)}")

class PropertyCreateRequest(BaseModel):
    """Schema for JSON-only property creation"""
    posted_by: str
    property_data: Dict[str, Any]