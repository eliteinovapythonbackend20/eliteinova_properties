from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Path, Request
from typing import Optional, List, Dict, Any
import json

from app.schemas.property_request import PropertyCreateMultipart, PropertyUpdateMultipart
from app.schemas.property_response import PropertyResponse, PropertyListResponse, PropertyMediaResponse, PropertyDocumentResponse
from app.schemas.property_error import PropertyError
from app.services.property_service import PropertyService
from app.services.field_mapping_service import FieldMappingService
from app.services.file_extraction_service import FileExtractionService
from app.api.dependencies import require_vendor, require_authenticated, get_current_user_optional
from app.core.response_utils import strip_none_values
from app.core.database import get_db
from app.repositories.property_repository import PropertyRepository
from app.repositories.profile_repository import VendorProfileRepository
from app.schemas.property_filter import PropertyFilter
from app.services.filter_service import FilterService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

async def get_property_service(db: AsyncSession = Depends(get_db)):
    repository = PropertyRepository(db)
    vendor_profile_repository = VendorProfileRepository(db)
    return PropertyService(
        repository=repository,
        vendor_profile_repository=vendor_profile_repository
    )

async def get_filter_service(db: AsyncSession = Depends(get_db)) -> FilterService:
    return FilterService(PropertyRepository(db))

# ============================================
# PUBLIC BROWSE ENDPOINTS (URL-driven navigation)
# These MUST be declared before GET /{property_id} so the literal
# paths are not swallowed by the path parameter.
# ============================================

def _browse_params(request: Request) -> Dict[str, Any]:
    params: Dict[str, Any] = {}
    for key, value in request.query_params.multi_items():
        if key in params:
            existing = params[key]
            params[key] = existing + [value] if isinstance(existing, list) else [existing, value]
        else:
            params[key] = value
    return params

@router.get("/by-category")
async def get_properties_by_category(
    request: Request,
    property_category: str,
    service: FilterService = Depends(get_filter_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    params = _browse_params(request)
    params["propertyCategory"] = property_category
    return strip_none_values(await service.run(PropertyFilter.model_validate(params)))

@router.get("/by-property-type")
async def get_properties_by_property_type(
    request: Request,
    property_type: str,
    service: FilterService = Depends(get_filter_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    params = _browse_params(request)
    params["propertyType"] = property_type
    return strip_none_values(await service.run(PropertyFilter.model_validate(params)))

@router.get("/by-purpose")
async def get_properties_by_purpose(
    request: Request,
    listing_purpose: str,
    service: FilterService = Depends(get_filter_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    params = _browse_params(request)
    params["listingPurpose"] = listing_purpose
    return strip_none_values(await service.run(PropertyFilter.model_validate(params)))

# ============================================
# MAIN PROPERTY CRUD ENDPOINTS
# ============================================

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PropertyResponse)
async def create_property(
    property_data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    video: Optional[UploadFile] = File(None),
    documents: Optional[List[UploadFile]] = File(None),
    document_types: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: PropertyService = Depends(get_property_service)
):
    """Create a new property with multipart data

    - **images**: cover image first, then additional property images (position 0 = primary)
    - **documents**: mix of vendor KYC docs and property docs
    - **document_types**: comma-separated type per file in `documents`, same order
      (e.g. 'aadhaarCard,saleDeed,floorPlan' or already-canonical 'aadhaar_card,sale_deed,floor_plan')
    """
    try:
        data = json.loads(property_data)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON in property_data: {str(e)}"
        )

    data['user_id'] = current_user.get("user_id")
    if images:
        data['images'] = images
    if video:
        data['video'] = video
    if documents:
        data['documents'] = documents
    if document_types:
        data['document_types'] = [t.strip() for t in document_types.split(',') if t.strip()]

    extraction_service = FileExtractionService()
    separated_files, cleaned_data, file_metadata = extraction_service.extract_and_separate_files(data)
    
    mapping_service = FieldMappingService()
    mapped_data = mapping_service.map_frontend_to_db_fields(cleaned_data)
    
    posted_by = (mapped_data.get('posted_by') or '').upper()
    valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
    if posted_by not in valid_posted_by:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
        )
    
    try:
        result = await service.create_property(
            posted_by=posted_by,
            property_data=mapped_data,
            separated_files=separated_files,
            file_metadata=file_metadata,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create property: {str(e)}"
        )

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
    service: PropertyService = Depends(get_property_service)
):
    """Get a single property by ID with all relations"""
    try:
        result = await service.get_property_by_id(property_id)
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch property: {str(e)}"
        )

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    property_data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    video: Optional[UploadFile] = File(None),
    documents: Optional[List[UploadFile]] = File(None),
    document_types: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """Update an existing property"""
    try:
        data = json.loads(property_data)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON: {str(e)}"
        )

    data['user_id'] = current_user.get("user_id")
    if images:
        data['images'] = images
    if video:
        data['video'] = video
    if documents:
        data['documents'] = documents
    if document_types:
        data['document_types'] = [t.strip() for t in document_types.split(',') if t.strip()]

    extraction_service = FileExtractionService()
    separated_files, cleaned_data, file_metadata = extraction_service.extract_and_separate_files(data)
    
    mapping_service = FieldMappingService()
    mapped_data = mapping_service.map_frontend_to_db_fields(cleaned_data)
    
    status_val = mapped_data.pop('status', None)
    
    try:
        result = await service.update_property(
            property_id=property_id,
            update_data=mapped_data,
            new_status=status_val,
            separated_files=separated_files,
            file_metadata=file_metadata,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update property: {str(e)}"
        )

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """Delete a property and all associated files"""
    try:
        await service.delete_property(
            property_id=property_id,
            user_id=current_user.get("user_id")
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete property: {str(e)}"
        )

@router.get("/", response_model=PropertyListResponse)
async def get_all_properties(
    page: int = 1,
    limit: int = 20,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
    service: PropertyService = Depends(get_property_service)
):
    """Get all properties with pagination"""
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be greater than 0"
        )
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )
    
    skip = (page - 1) * limit
    try:
        result = await service.get_all_properties(skip=skip, limit=limit)
        return strip_none_values(result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch properties: {str(e)}"
        )

# ============================================
# PROPERTY MEDIA MANAGEMENT ENDPOINTS
# ============================================

@router.post("/{property_id}/images", response_model=List[PropertyMediaResponse])
async def add_property_images(
    property_id: str,
    images: List[UploadFile] = File(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Add new images to a property
    
    - **images**: List of image files to upload
    - Images are appended to existing images
    """
    try:
        result = await service.add_property_images(
            property_id=property_id,
            images=images,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add images: {str(e)}"
        )

@router.delete("/{property_id}/images/{image_index}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_image_by_index(
    property_id: str,
    image_index: int = Path(..., description="The order index of the image to delete (0-based)"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete a specific image from a property by its order index
    
    - **image_index**: 0-based index of the image to delete
    - The first image (index 0) is the cover image
    - After deletion, remaining images maintain their order
    """
    try:
        await service.delete_property_image_by_index(
            property_id=property_id,
            image_index=image_index,
            user_id=current_user.get("user_id")
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {str(e)}"
        )

@router.post("/{property_id}/images/{image_id}/set-cover", response_model=PropertyMediaResponse)
async def set_cover_image(
    property_id: str,
    image_id: int = Path(..., description="The ID of the image to set as cover"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Set a specific image as the cover/primary image
    
    - **image_id**: The database ID of the image
    - Only one image can be cover at a time
    - The selected image becomes the cover
    """
    try:
        result = await service.set_cover_image(
            property_id=property_id,
            media_id=image_id,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to set cover image: {str(e)}"
        )

@router.post("/{property_id}/video", response_model=PropertyMediaResponse)
async def add_property_video(
    property_id: str,
    video: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Add or replace property video
    
    - **video**: Video file to upload
    - Replaces existing video if present
    """
    try:
        result = await service.add_property_video(
            property_id=property_id,
            video=video,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add video: {str(e)}"
        )

@router.delete("/{property_id}/video", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_video(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """Delete property video"""
    try:
        await service.delete_property_video(
            property_id=property_id,
            user_id=current_user.get("user_id")
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete video: {str(e)}"
        )

# ============================================
# PROPERTY DOCUMENT MANAGEMENT ENDPOINTS
# ============================================

@router.post("/{property_id}/documents", response_model=List[PropertyDocumentResponse])
async def add_property_documents(
    property_id: str,
    documents: List[UploadFile] = File(...),
    document_types: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Add documents to a property
    
    - **documents**: List of document files
    - **document_types**: Optional comma-separated list of document types matching the files
    - If document_types not provided, types are auto-detected from filenames
    """
    try:
        # Parse document types if provided
        doc_types = None
        if document_types:
            doc_types = [t.strip() for t in document_types.split(',') if t.strip()]
        
        result = await service.add_property_documents(
            property_id=property_id,
            documents=documents,
            document_types=doc_types,
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add documents: {str(e)}"
        )

@router.delete("/{property_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_document(
    property_id: str,
    document_id: int = Path(..., description="The ID of the document to delete"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete a specific document from a property
    
    - **document_id**: The database ID of the document
    """
    try:
        await service.delete_property_document(
            property_id=property_id,
            document_id=document_id,
            user_id=current_user.get("user_id")
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )

# ============================================
# VENDOR PROFILE IMAGE MANAGEMENT
# ============================================

@router.post("/vendor/profile-image", response_model=Dict[str, Any])
async def update_vendor_profile_image(
    image: UploadFile = File(...),
    field_name: str = Form("profilePhoto"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Update vendor profile image
    
    - **image**: Profile image file
    - **field_name**: Type of image (profilePhoto, agencyLogo, companyLogo)
    - Updates the vendor's profile image in their details table
    """
    try:
        result = await service.update_vendor_profile_image(
            user_id=current_user.get("user_id"),
            image=image,
            field_name=field_name
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile image: {str(e)}"
        )

@router.delete("/vendor/profile-image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor_profile_image(
    field_name: str = Form("profilePhoto"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete vendor profile image
    
    - **field_name**: Type of image to delete (profilePhoto, agencyLogo, companyLogo)
    """
    try:
        await service.delete_vendor_profile_image(
            user_id=current_user.get("user_id"),
            field_name=field_name
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete profile image: {str(e)}"
        )

# ============================================
# VENDOR DOCUMENT MANAGEMENT
# ============================================

@router.post("/vendor/documents", response_model=PropertyDocumentResponse)
async def upload_vendor_document(
    document: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Upload a vendor document
    
    - **document**: Document file
    - **document_type**: Type of document (aadhaar_card, pan_card, gst_certificate, etc.)
    - Vendor documents are not tied to a specific property
    """
    try:
        result = await service.upload_vendor_document(
            user_id=current_user.get("user_id"),
            document=document,
            document_type=document_type
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload vendor document: {str(e)}"
        )

@router.delete("/vendor/documents/{document_type}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor_document(
    document_type: str = Path(..., description="The type of document to delete"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete a vendor document
    
    - **document_type**: Type of document to delete (aadhaar_card, pan_card, etc.)
    - Only one document per type is allowed for a vendor
    """
    try:
        await service.delete_vendor_document(
            user_id=current_user.get("user_id"),
            document_type=document_type
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete vendor document: {str(e)}"
        )

@router.get("/vendor/documents", response_model=List[PropertyDocumentResponse])
async def get_vendor_documents(
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """Get all documents for the current vendor"""
    try:
        result = await service.get_vendor_documents(
            user_id=current_user.get("user_id")
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch vendor documents: {str(e)}"
        )











































































# # app/api/property_controller.py

# from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import Optional, List, Dict, Any
# import json
# from datetime import date, datetime

# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.services.property_service import PropertyService
# from app.schemas.property import PropertyCreate, PropertyUpdate
# from app.schemas.filter_schemas import PropertyFilter
# from app.core.response_utils import strip_none_values
# from app.core.file_mappings import (
#     get_file_mapping,
#     get_field_category,
#     is_vendor_profile_image,
#     is_property_image,
#     is_property_video,
#     is_vendor_document,
#     is_property_document,
#     get_document_type,
#     VENDOR_PROFILE_IMAGE_TO_DB_COLUMN,
#     FILE_MAPPINGS
# )
# from app.api.dependencies import (
#     get_current_user,
#     get_current_user_optional,
#     require_authenticated,
#     require_admin,
#     require_vendor
# )
# from app.models.user import UserRole
# from app.repositories.profile_repository import VendorProfileRepository

# router = APIRouter()

# async def get_property_service(db: AsyncSession = Depends(get_db)):
#     repository = PropertyRepository(db)
#     vendor_profile_repository = VendorProfileRepository(db)
#     return PropertyService(repository, vendor_profile_repository)


# def extract_int(value, default: Optional[int] = 0) -> Optional[int]:
#     if value is None:
#         return default
#     if isinstance(value, bool):
#         return default
#     if isinstance(value, int):
#         return value
#     if isinstance(value, float):
#         return int(value)
#     try:
#         str_value = str(value).strip()
#         digits = ''.join(filter(str.isdigit, str_value))
#         return int(digits) if digits else default
#     except (ValueError, TypeError):
#         return default


# def extract_float(value, default: Optional[float] = None) -> Optional[float]:
#     if value is None or value == '':
#         return default
#     if isinstance(value, bool):
#         return default
#     if isinstance(value, (int, float)):
#         return float(value)
#     try:
#         cleaned = ''.join(c for c in str(value) if c.isdigit() or c == '.')
#         return float(cleaned) if cleaned else default
#     except (ValueError, TypeError):
#         return default


# def extract_and_separate_files(data: Dict[str, Any]) -> tuple:
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     data = cleaned_data
    
#     vendor_profile_images = {}    
#     property_images = []       
#     property_video = None     
#     vendor_documents = []      
#     property_documents = []
#     file_metadata = {}
    
#     print("\n" + "="*80)
#     print("📂 EXTRACTING AND SEPARATING FILES")
#     print("="*80)
    
#     keys_to_process = list(data.keys())
    
#     for field in keys_to_process:
#         value = data.get(field)
#         if value is None:
#             continue
        
#         # Check if this field has a mapping
#         mapping = get_file_mapping(field)
#         if not mapping:
#             print(f"  ⚠️ No mapping found for field: {field}")
#             continue
        
#         category = get_field_category(field)
#         print(f"\n  🔍 Processing: {field} (Category: {category})")
        
#         if is_vendor_profile_image(field):
#             if hasattr(value, 'file') or isinstance(value, UploadFile):
#                 vendor_profile_images[field] = value
#                 db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field)
#                 print(f"    ✅ Vendor Profile Image: {field} → {db_column}")
                
#                 file_metadata[field] = {
#                     'field': field,
#                     'category': 'vendor_profile_image',
#                     'db_column': db_column,
#                     'doc_type': get_document_type(field)
#                 }
#                 del data[field]

#         elif is_property_image(field):
#             if isinstance(value, list):
#                 for idx, file_obj in enumerate(value):
#                     if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                         property_images.append(file_obj)
#                         is_primary = (idx == 0 and field == 'coverImage')
#                         print(f"    ✅ Property Image {idx}: {field} (primary={is_primary})")
                        
#                         file_metadata[f"{field}_{idx}"] = {
#                             'field': field,
#                             'category': 'property_image',
#                             'index': idx,
#                             'is_primary': is_primary
#                         }
#             elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                 property_images.append(value)
#                 print(f"    ✅ Property Image: {field}")
                
#                 file_metadata[field] = {
#                     'field': field,
#                     'category': 'property_image',
#                     'is_primary': True
#                 }
            
#             del data[field]
#         elif is_property_video(field):
#             if hasattr(value, 'file') or isinstance(value, UploadFile):
#                 property_video = value
#                 print(f"    ✅ Property Video: {field}")
                
#                 file_metadata[field] = {
#                     'field': field,
#                     'category': 'property_video'
#                 }
#                 del data[field]
        
#         elif is_vendor_document(field):
#             doc_type = get_document_type(field)
            
#             if isinstance(value, list):
#                 for idx, file_obj in enumerate(value):
#                     if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                         vendor_documents.append(file_obj)
#                         print(f"    ✅ Vendor Document {idx}: {field} → {doc_type}")
                        
#                         file_metadata[f"{field}_{idx}"] = {
#                             'field': field,
#                             'category': 'vendor_document',
#                             'doc_type': doc_type,
#                             'index': idx
#                         }
#             elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                 vendor_documents.append(value)
#                 print(f"    ✅ Vendor Document: {field} → {doc_type}")
                
#                 file_metadata[field] = {
#                     'field': field,
#                     'category': 'vendor_document',
#                     'doc_type': doc_type
#                 }
            
#             del data[field]
        
#         elif is_property_document(field):
#             doc_type = get_document_type(field)
            
#             if isinstance(value, list):
#                 for idx, file_obj in enumerate(value):
#                     if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                         property_documents.append(file_obj)
#                         print(f"    ✅ Property Document {idx}: {field} → {doc_type}")
                        
#                         file_metadata[f"{field}_{idx}"] = {
#                             'field': field,
#                             'category': 'property_document',
#                             'doc_type': doc_type,
#                             'index': idx
#                         }
#             elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                 property_documents.append(value)
#                 print(f"    ✅ Property Document: {field} → {doc_type}")
                
#                 file_metadata[field] = {
#                     'field': field,
#                     'category': 'property_document',
#                     'doc_type': doc_type
#                 }
            
#             del data[field]
        
#         else:
#             print(f"    ⚠️ Unknown category for field: {field}")
    
#     # Build the result structure
#     separated_files = {
#         'vendor_profile_images': vendor_profile_images,
#         'property_images': property_images,
#         'property_video': property_video,
#         'vendor_documents': vendor_documents,
#         'property_documents': property_documents,
#     }
    
#     print("\n" + "="*80)
#     print("📊 SEPARATION SUMMARY")
#     print("="*80)
#     print(f"  🖼️  Vendor Profile Images: {len(vendor_profile_images)}")
#     print(f"  📸 Property Images: {len(property_images)}")
#     print(f"  🎬 Property Video: {'Yes' if property_video else 'No'}")
#     print(f"  📄 Vendor Documents: {len(vendor_documents)}")
#     print(f"  📄 Property Documents: {len(property_documents)}")
#     print("="*80 + "\n")
    
#     return separated_files, data, file_metadata


# def ensure_date_fields_are_date_objects(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Ensure date fields are properly converted to date objects"""
#     date_fields = ['availableFrom', 'dateOfBirth', 'signatureDate', 'availableTo']
    
#     for field in date_fields:
#         if field in data and data[field] is not None:
#             value = data[field]
            
#             if hasattr(value, 'date') and callable(getattr(value, 'date')):
#                 data[field] = value.date() if hasattr(value, 'date') else value
#                 continue
            
#             if isinstance(value, str) and value.strip():
#                 try:
#                     data[field] = datetime.strptime(value, '%Y-%m-%d').date()
#                 except ValueError:
#                     try:
#                         data[field] = datetime.strptime(value, '%m/%d/%Y').date()
#                     except ValueError:
#                         pass
    
#     return data


# def map_frontend_to_db_fields(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Map frontend field names to database field names"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     data = cleaned_data
#     data = ensure_date_fields_are_date_objects(data)
    
#     field_mapping = {
#         'ownerName': 'owner_name',
#         'contactNumber': 'mobile',
#         'emailId': 'email_id',
#         'addressLine1': 'address_line1',
#         'addressLine2': 'address_line2',
#         'ownerCity': 'owner_city',
#         'ownerDistrict': 'owner_district',      # ✅ Added
#         'ownerState': 'owner_state',
#         'ownerPinCode': 'owner_pin_code',
#         'dateOfBirth': 'date_of_birth',
#         'gender': 'gender',
#         'aadhaarNumber': 'aadhaar_number',
#         'panNumber': 'pan_number',
#         'preferredContactMethod': 'preferred_contact_method',
#         'preferredContactTime': 'preferred_contact_time',
#         'additionalNote': 'additionalnote',      # ✅ Added

#         'agentName': 'agent_name',
#         'agencyName': 'agency_name',
#         'mobileNumber': 'mobile',
#         'officeAddress': 'office_address',
#         'reraNumber': 'rera_registration_number',
#         'activeListings': 'active_listing',
#         'gstNumber': 'gst_number',
#         'serviceAreas': 'service_area',
#         'yearsExperience': 'experience',
#         'agentDateOfBirth': 'date_of_birth',    
#         'agentGender': 'gender',               
#         'agentEmail': 'email_id',
        
        
#         'website': 'website',
#         'facebook': 'facebook',
#         'instagram': 'instagram',
#         'linkedin': 'linkedin',
#         'youtube': 'youtube',

#         'builderName': 'name',
#         'designation': 'designation',
#         'builderMobile': 'mobile',
#         'whatsappNumber': 'whatsapp_number',
#         'builderEmail': 'email',
#         'builderReraNumber': 'rera_registration_number',
#         'builderGstNumber': 'gst_number',
#         'builderExperience': 'experience',
#         'builderAadhaar': 'aadhar_number',
#         'builderPan': 'pan_number',
        
#         'companyName': 'company_name',
#         'companyRegNumber': 'company_reg_number',
#         'companyWebsite': 'company_website',
#         'companyDescription': 'company_description',
        
#         'builderOfficeAddress': 'office_address',
#         'builderCity': 'city',
#         'builderDistrict': 'district',
#         'builderState': 'state',
#         'builderPincode': 'pincode',
#         'builderLandmark': 'landmark',
        
#         'builderWebsite': 'website',
#         'builderFacebook': 'facebook',
#         'builderInstagram': 'instagram',
#         'builderLinkedin': 'linkedin',
#         'builderYoutube': 'youtube',

#         'pmName': 'name',
#         'pmDesignation': 'designation',
#         'pmMobile': 'mobile',
#         'pmWhatsapp': 'whatsapp_number',
#         'pmEmail': 'email',
#         'pmReraNumber': 'rera_registration_number',
#         'pmGstNumber': 'gst_number',
#         'pmExperience': 'experience',
#         'pmAadhaar': 'aadhar_number',
#         'pmPan': 'pan_number',
        
#         'pmCompanyName': 'company_name',
#         'pmCompanyRegNumber': 'company_reg_number',
#         'pmCompanyWebsite': 'company_website',
#         'pmCompanyDescription': 'company_description',
        
#         # PM Address (✅ All exist in PropertyManagementProperty)
#         'pmOfficeAddress': 'office_address',
#         'pmCity': 'city',
#         'pmDistrict': 'district',
#         'pmState': 'state',
#         'pmPincode': 'pincode',
#         'pmLandmark': 'landmark',
        
#         # PM Social Media (✅ All exist in PropertyManagementProperty)
#         'pmWebsite': 'website',
#         'pmFacebook': 'facebook',
#         'pmInstagram': 'instagram',
#         'pmLinkedin': 'linkedin',
#         'pmYoutube': 'youtube',

#         'accountHolderName': 'account_holder_name',
#         'accountNumber': 'account_number',
#         'bankName': 'bank_name',
#         'ifscCode': 'ifsc_code',
#         'upiId': 'upi_id',

#         'signatureDate': 'signature_date',
#         'signaturePlace': 'signature_place',
#         'declarationAccepted': 'declaration_accepted',

#         'propertyCategory': 'property_category',
#         'listingPurpose': 'listing_purpose',
#         'postedBy': 'posted_by',
#         'propertyTitle': 'property_title',
#         'propertyType': 'property_type',
#         'bedrooms': 'bedrooms',
#         'bathrooms': 'bathrooms',
#         'builtUpArea': 'built_up_area',
#         'carpetArea': 'carpet_area',
#         'furnishingStatus': 'furnishing_status',
#         'gardenSpace': 'garden_space',
#         'terrace': 'terrace',
#         'propertyAddress': 'address',
#         'area': 'area',
#         'propertyCity': 'city',
#         'district': 'district',
#         'state': 'state',
#         'pinCode': 'pin_code',
#         'landmark': 'landmark',
#         'parking': 'parking',
#         'petFriendly': 'pet_friendly',
#         'selectedAmenities': 'amenities',
#         'availableFrom': 'available_from',
#         'rentalDuration': 'minimum_duration',
#         'immediateMoveIn': 'immediate_move_in',
#         'expectedPrice': 'expected_price',
#         'priceType': 'price_negotiable',
#         'securityDeposit': 'security_deposit',
#         'maintenance': 'maintenance_amount',
#         'occupancyDetails': 'tenant_type',
#         'tenantType': 'tenant_type',
#         'smokingAllowed': 'smoking_allowed',
#         'dietaryPreference': 'dietary_preference',
#         'propertyCondition': 'property_condition',
#         'ownershipType': 'ownership_type',
#         'loanOutstanding': 'loan_outstanding',
#         'propertyTax': 'property_tax',
#         'titleDeedVerify': 'title_deed_verify',
#         'underconstruction': 'underconstruction',
#         'immediatePossession': 'immediate_possession',
#         'reraApproved': 'rera_approved',
#         'loanEligible': 'loan_eligible',
#         'floorNumber': 'floor_number',
#         'totalFloors': 'total_floors',
#         'propertyAge': 'property_age',
#         'cornerUnit': 'corner_unit',
#         'facingDirection': 'facing_direction',
#         'maintenanceIncluded': 'maintenance_included',
#         'commercialType': 'commercial_type',
#         'businessType': 'business_type',
#         'estimatedFootfall': 'estimated_footfall',
#         'operatingHours': 'operating_hours',
#         'leaseType': 'lease_type',
#         'leaseTerm': 'lease_terms',
#         'leaseTerms': 'lease_terms',
#         'leaseRenewable': 'renewable_option',
#         'renewableOption': 'renewable_option',
#         'zoningType': 'zoning_type',
#         'fitOut': 'fit_out',
#         'ceilingHeight': 'ceiling_height',
#         'frontageWidth': 'frontage_width',
#         'powerLoadCapacity': 'power_load_capacity',
#         'nearbyPlaces': 'nearby_places',
#         'nearbyConnectivity': 'nearby_connectivity',
#         'parkingCapacity': 'parking_capacity',
#         'balcony': 'balcony',
#         'interiorFeatures': 'interior_features',
#         'applianceIncluded': 'appliance_included',
#         'rentalTerm': 'rental_term',
#         'rentalFrequency': 'rental_frequency',
#         'minimumStayDuration': 'minimum_stay_duration',
#         'paymentFrequency': 'payment_frequency',
#         'hostelType': 'hostel_type',
#         'roomType': 'room_type',
#         'sharingType': 'sharing_type',
#         'totalCapacity': 'total_capacity',
#         'hostelCategory': 'hostel_category',
#         'genderType': 'gender_type',
#         'foodIncluded': 'food_included',
#         'foodType': 'food_type',
#         'mealsPerDay': 'meals_per_day',
#         'kitchenAccess': 'kitchen_access',
#         'bathroomType': 'bathroom_type',
#         'utilitiesIncluded': 'utilities_included',
#         'alcoholAllowed': 'alcohol_allowed',
#         'landArea': 'land_area',
#         'landAreaMin': 'land_area_min',
#         'landAreaMax': 'land_area_max',
#         'areaUnit': 'area_unit',
#         'landShape': 'land_shape',
#         'roadWidth': 'road_width',
#         'waterSource': 'water_source',
#         'soilType': 'soil_type',
#         'electricityAvailable': 'electricity_available',
#         'selectedFeature': 'selected_feature',
#         'paymentMode': 'payment_mode',
#         'constructionStatus': 'construction_status',
#         'possessionTimeline': 'possession_timeline',
#         'readyToBuy': 'ready_to_buy',
#     }

#     integer_fields = [
#         'yearsExperience',
#         'activeListings',
#     ]
    
#     for field in integer_fields:
#         if field in data and data[field] is not None:
#             data[field] = extract_int(data[field])
    
#     if 'budgetRange[min]' in data:
#         min_val = extract_float(data.get('budgetRange[min]'))
#         max_val = extract_float(data.get('budgetRange[max]'))
#         data['price_min'] = min_val
#         data['price_max'] = max_val
#         del data['budgetRange[min]']
#         del data['budgetRange[max]']

#     mapped_data = {}
#     for key, value in data.items():
#         print(f"\n Mapping field: {key} with value: {value}")
#         if key in field_mapping:
#             db_field = field_mapping[key]
            
#             if db_field == 'gender' and isinstance(value, str):
#                 value = value.capitalize()
#             elif db_field == 'price_negotiable' and isinstance(value, str):
#                 if value.lower() == 'negotiable':
#                     value = 'Negotiable'
#                 elif value.lower() in ['fixed price', 'fixed']:
#                     value = 'Fixed Price'
            
#             mapped_data[db_field] = convert_value_for_db(db_field, value)
#         else:
#             print(f"⚠️  Unmapped field: {key} with value: {value}")
#             mapped_data[key] = value
    
#     set_default_values(mapped_data)
    
#     return mapped_data


# def convert_value_for_db(field: str, value: Any) -> Any:
#     """Convert values to appropriate database types"""
#     if value is None:
#         return value

#     # Handle date fields
#     date_fields = [
#         'available_from', 'date_of_birth', 'signature_date',
#     ]
    
#     if field in date_fields:
#         if hasattr(value, 'date') and callable(getattr(value, 'date')):
#             return value.date() if hasattr(value, 'date') else value
#         elif hasattr(value, 'year') and hasattr(value, 'month') and hasattr(value, 'day'):
#             return value
#         elif isinstance(value, str) and value.strip():
#             try:
#                 return datetime.strptime(value, '%Y-%m-%d').date()
#             except ValueError:
#                 try:
#                     return datetime.strptime(value, '%m/%d/%Y').date()
#                 except ValueError:
#                     return value
#         else:
#             return value
    
#     # Handle boolean fields
#     boolean_fields = ['declaration_accepted']
    
#     if field in boolean_fields:
#         if isinstance(value, str):
#             return value.lower() in ['yes', 'true', '1', 'y']
#         return bool(value)

#     # Handle Yes/No / free-text string fields - stored as-is
#     string_yes_no_fields = [
#         'parking', 'pet_friendly', 'terrace', 'balcony', 'garden_space',
#         'immediate_move_in', 'maintenance_included', 'title_deed_verify',
#         'underconstruction', 'immediate_possession', 'rera_approved',
#         'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed',
#         'renewable_option', 'ready_to_buy', 'electricity_available',
#         'utilities_included', 'alcohol_allowed', 'food_included',
#     ]

#     if field in string_yes_no_fields and isinstance(value, str):
#         return value
    
#     # Handle JSONB array fields
#     array_fields = [
#         'preferred_contact_method', 'amenities', 'tenant_type', 'nearby_places',
#         'interior_features', 'appliance_included', 'room_type', 'sharing_type',
#         'selected_feature',
#     ]
    
#     if field in array_fields:
#         if isinstance(value, list):
#             return value
#         elif isinstance(value, str):
#             return [item.strip() for item in value.split(',') if item.strip()]

#     # nearby_connectivity is a plain String column - flatten list to string
#     if field == 'nearby_connectivity' and isinstance(value, list):
#         return ', '.join(str(item).strip() for item in value if str(item).strip())

#     # Integer fields
#     integer_fields = [
#         'bedrooms', 'bathrooms', 'floor_number', 'total_floors', 'property_age',
#         'total_capacity', 'land_area', 'land_area_min', 'land_area_max', 
#         'road_width', 'parking_capacity',  # ← Added parking_capacity
#     ]
#     if field in integer_fields:
#         return extract_int(value, default=None)

#     # Float fields (including built_up_area and carpet_area)
#     float_fields = [
#         'expected_price', 'price_min', 'price_max', 'maintenance_amount',
#         'security_deposit', 'built_up_area', 'carpet_area',  # ← Added built_up_area & carpet_area
#     ]
#     if field in float_fields:
#         return extract_float(value)

#     # Enum-like fields - normalized to uppercase
#     enum_fields = ['posted_by', 'listing_purpose', 'property_category']
#     if field in enum_fields and isinstance(value, str):
#         return value.upper()
    
#     return value


# def set_default_values(data: Dict[str, Any]):
#     """Set default values for missing fields"""
#     defaults = {
#         'property_condition': 'Good',
#         'ownership_type': 'Freehold',
#         'price_negotiable': 'Negotiable'
#     }
    
#     for field, default_value in defaults.items():
#         if field not in data or data[field] is None or data[field] == '':
#             data[field] = default_value
    
#     array_fields = ['preferred_contact_method', 'amenities', 'tenant_type']
#     for field in array_fields:
#         if field not in data or data[field] is None:
#             data[field] = []
#         elif isinstance(data[field], str):
#             data[field] = [data[field]]


# # ============================================
# # API ENDPOINTS
# # ============================================

# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_property(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: PropertyService = Depends(get_property_service)
# ):
#     content_type = request.headers.get("content-type", "").lower()
#     data = None

#     if "application/json" in content_type or not content_type:
#         try:
#             data = await request.json()
#         except Exception:
#             data = None

#     if data is None:
#         form = await request.form()
#         if "property_data" in form:
#             raw = form.get("property_data")
#             if isinstance(raw, str):
#                 try:
#                     data = json.loads(raw)
#                 except json.JSONDecodeError as e:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail=f"Invalid JSON in property_data: {str(e)}"
#                     )
#             else:
#                 data = raw
#         else:
#             data = {}
#             for key, value in form.multi_items():
#                 if key in {"images", "video", "documents"}:
#                     continue
#                 if isinstance(value, UploadFile):
#                     continue
#                 if key in data:
#                     current = data[key]
#                     if isinstance(current, list):
#                         current.append(value)
#                     else:
#                         data[key] = [current, value]
#                 else:
#                     data[key] = value

#         if not data and len(form) == 1 and "property_data" not in form:
#             try:
#                 data = dict(form)
#             except Exception:
#                 data = {}

#     if data is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="property_data is required"
#         )

#     data['user_id'] = current_user.get("user_id")
#     data = ensure_date_fields_are_date_objects(data)

#     # ============================================
#     # Extract and separate files using FILE_MAPPINGS
#     # ============================================
#     separated_files, cleaned_data, file_metadata = extract_and_separate_files(data)
    
#     # Map frontend fields to DB fields
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     posted_by = (mapped_data.get('posted_by') or '').upper()
    
#     valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
#     if posted_by not in valid_posted_by:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
#         )
    
#     validated = PropertyCreate(
#         posted_by=posted_by,
#         property_data=mapped_data
#     )
    
#     print(f"*" * 80)
#     print(f"Current user id: {current_user.get('user_id')}")
#     print(f"*" * 80)
    
#     # Create property with separated files
#     response = await service.create_property(
#         posted_by=validated.posted_by,
#         property_data=validated.property_data,
#         separated_files=separated_files,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
    
#     return strip_none_values(response)


# @router.get("/")
# async def get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get all properties with pagination"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-posted-by")
# async def get_properties_by_posted_by(
#     posted_by: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get properties by posted_by (OWNER, AGENT, BUILDER, PROPERTY_MANAGEMENT)"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
        
#     response = await service.get_properties_by_posted_by(
#         posted_by=posted_by,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-category")
# async def get_properties_by_category(
#     property_category: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get properties by property category (RESIDENTIAL, COMMERCIAL, etc.)"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_category(
#         property_category=property_category,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-property-type")
# async def get_properties_by_property_type(
#     property_type: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get properties by property type (APARTMENT, VILLA, PLOT, etc.)"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_property_type(
#         property_type=property_type,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-purpose")
# async def get_properties_by_purpose(
#     listing_purpose: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get properties by listing purpose (RENT, SELL, LEASE)"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_purpose(
#         listing_purpose=listing_purpose,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/{property_id}")
# async def get_property_by_id(
#     property_id: int,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get a single property by ID with all relations"""
#     response = await service.get_property_by_id(property_id)
#     return strip_none_values(response)


# @router.put("/{property_id}")
# async def update_property(
#     property_id: int,
#     property_data: str = Form(...),
#     images: Optional[List[UploadFile]] = File(None),
#     video: Optional[UploadFile] = File(None),
#     documents: Optional[List[UploadFile]] = File(None),
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     try:
#         data = json.loads(property_data)
#     except json.JSONDecodeError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid JSON: {str(e)}"
#         )
    
#     data = ensure_date_fields_are_date_objects(data)
    
#     # Extract and separate files
#     separated_files, cleaned_data, file_metadata = extract_and_separate_files(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     status_val = None
#     if 'status' in mapped_data:
#         status_val = mapped_data['status']
#         del mapped_data['status']
    
#     mapped_data['user_id'] = current_user.get("user_id")
    
#     response = await service.update_property(
#         property_id=property_id,
#         update_data=mapped_data,
#         new_status=status_val,
#         separated_files=separated_files,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Delete a property and all associated files"""
#     response = await service.delete_property(
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# # ============================================
# # ADDITIONAL ENDPOINTS (Optional)
# # ============================================

# @router.get("/my-properties")
# async def get_my_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Get properties owned by the current user"""
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_user_id(
#         user_id=current_user.get("user_id"),
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.post("/{property_id}/status")
# async def update_property_status(
#     property_id: int,
#     status: str,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """Update property status (Published, Draft, Under-Review, Sold, Rented)"""
#     response = await service.update_property_status(
#         property_id=property_id,
#         status=status,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)






















































# from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import Optional, List, Dict, Any
# import json
# from datetime import date, datetime
# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.services.property_service import PropertyService
# from app.schemas.property import PropertyCreate, PropertyUpdate
# from app.schemas.filter_schemas import PropertyFilter
# from app.core.response_utils import strip_none_values
# from app.core.file_mappings import DOC_TYPE_MAPPING, FILE_MAPPINGS, PRIMARY_IMAGE_FIELDS
# from app.api.dependencies import (
#     get_current_user,
#     get_current_user_optional,
#     require_authenticated,
#     require_admin,
#     require_vendor
# )
# from app.models.user import UserRole

# router = APIRouter()

# async def get_property_service(db: AsyncSession = Depends(get_db)):
#     repository = PropertyRepository(db)
#     return PropertyService(repository)



# def extract_int(value, default: Optional[int] = 0) -> Optional[int]:
#     """Safely extract an integer from any value. Pass default=None for
#     nullable columns where 0 would be a misleading fallback (e.g.
#     floor_number, property_age) versus counters that genuinely default to 0."""
#     if value is None:
#         return default
#     if isinstance(value, bool):
#         # bool is technically an int subclass - guard against True/False
#         # sneaking through into a numeric field.
#         return default
#     if isinstance(value, int):
#         return value
#     if isinstance(value, float):
#         return int(value)
#     try:
#         str_value = str(value).strip()
#         # Extract only digits (handles things like "3 BHK", "1,200 sqft")
#         digits = ''.join(filter(str.isdigit, str_value))
#         return int(digits) if digits else default
#     except (ValueError, TypeError):
#         return default


# def extract_float(value, default: Optional[float] = None) -> Optional[float]:
#     """Safely extract a float from any value (frontend may send formatted
#     strings like '25,000' or '12,00,000.50')."""
#     if value is None or value == '':
#         return default
#     if isinstance(value, bool):
#         return default
#     if isinstance(value, (int, float)):
#         return float(value)
#     try:
#         cleaned = ''.join(c for c in str(value) if c.isdigit() or c == '.')
#         return float(cleaned) if cleaned else default
#     except (ValueError, TypeError):
#         return default


# def extract_files_from_data(data: Dict[str, Any]) -> tuple:
#     """Extract files from the data object using shared mappings"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
        
#     data = cleaned_data
    
#     files = {
#         'images': [],
#         'documents': [],
#         'video': None,
#         'profile_image': None
#     }
    
#     file_metadata = {}
    
#     print("\n📂 EXTRACTING FILES FROM DATA")
#     print(f"  Available keys: {list(data.keys())}")
    
#     keys_to_process = list(data.keys())
    
#     for field in keys_to_process:
#         if field in FILE_MAPPINGS:
#             config = FILE_MAPPINGS[field]
#             category = config['category']
#             value = data.get(field)
            
#             if value is not None:
#                 print(f"  📁 Processing: {field} (type: {type(value).__name__})")
                
#                 doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
                
#                 if isinstance(value, list):
#                     print(f"    - Found {len(value)} files")
#                     for idx, file_obj in enumerate(value):
#                         if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                             if hasattr(file_obj, 'file'):
#                                 file_obj.doc_type = doc_type
#                                 file_obj.field_name = field
#                             elif isinstance(file_obj, UploadFile):
#                                 setattr(file_obj, 'doc_type', doc_type)
#                                 setattr(file_obj, 'field_name', field)
                            
#                             if config['is_document']:
#                                 files['documents'].append(file_obj)
#                                 print(f"      - Added document: {getattr(file_obj, 'filename', 'unknown')} as {doc_type}")
#                             elif category == 'images':
#                                 files['images'].append(file_obj)
#                                 print(f"      - Added image: {getattr(file_obj, 'filename', 'unknown')}")
                            
#                             file_metadata[f"{field}_{idx}"] = {
#                                 'doc_type': doc_type,
#                                 'field': field,
#                                 'category': category,
#                                 'index': idx
#                             }
                
#                 elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                     print(f"    - Single file: {getattr(value, 'filename', 'unknown')}")
                    
#                     if hasattr(value, 'file'):
#                         value.doc_type = doc_type
#                         value.field_name = field
#                     elif isinstance(value, UploadFile):
#                         setattr(value, 'doc_type', doc_type)
#                         setattr(value, 'field_name', field)
                    
#                     if category == 'video':
#                         files['video'] = value
#                         print(f"      - Added video")
#                     elif category == 'profile_image':
#                         files['profile_image'] = value
#                         print(f"      - Added profile image")
#                     elif category == 'images':
#                         files['images'].append(value)
#                         print(f"      - Added image")
#                     elif category == 'documents':
#                         files['documents'].append(value)
#                         print(f"      - Added document as {doc_type}")
                    
#                     file_metadata[field] = {
#                         'doc_type': doc_type,
#                         'field': field,
#                         'category': category
#                     }
                
#                 del data[field]
    
#     return files, data, file_metadata


# def ensure_date_fields_are_date_objects(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Ensure date fields are properly converted to date objects"""
#     date_fields = ['availableFrom', 'dateOfBirth', 'signatureDate', 'availableTo']
    
#     for field in date_fields:
#         if field in data and data[field] is not None:
#             value = data[field]
            
#             if hasattr(value, 'date') and callable(getattr(value, 'date')):
#                 data[field] = value.date() if hasattr(value, 'date') else value
#                 continue
            
#             if isinstance(value, str) and value.strip():
#                 try:
#                     data[field] = datetime.strptime(value, '%Y-%m-%d').date()
#                 except ValueError:
#                     try:
#                         data[field] = datetime.strptime(value, '%m/%d/%Y').date()
#                     except ValueError:
#                         pass
    
#     return data


# def map_frontend_to_db_fields(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Map frontend field names to database field names"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     data = cleaned_data
#     data = ensure_date_fields_are_date_objects(data)
    
#     field_mapping = {
#         # Owner/User Info
#         'ownerName': 'owner_name',
#         'contactNumber': 'mobile',
#         'emailId': 'email_id',
#         'addressLine1': 'address_line1',
#         'addressLine2': 'address_line2',
#         'ownerCity': 'owner_city',
#         'ownerState': 'owner_state',
#         'ownerPinCode': 'owner_pin_code',
#         'dateOfBirth': 'date_of_birth',
#         'gender': 'gender',
#         'aadhaarNumber': 'aadhaar_number',
#         'panNumber': 'pan_number',
#         'preferredContactMethod': 'preferred_contact_method',
#         'preferredContactTime': 'preferred_contact_time',


#         'agentName': 'agent_name',
#         'agencyName': 'agency_name',
#         'mobileNumber': 'mobile',
#         'officeAddress': 'office_address',
#         'reraNumber': 'rera_registration_number',
#         'activeListings': 'active_listing',
#         'gstNumber': 'gst_number',
#         'serviceAreas': 'service_area',
#         'yearsExperience': 'experience',

        
#         # Bank Details
#         'accountHolderName': 'account_holder_name',
#         'accountNumber': 'account_number',
#         'bankName': 'bank_name',
#         'ifscCode': 'ifsc_code',
#         'upiId': 'upi_id',
        
#         # Declaration
#         'signatureDate': 'signature_date',
#         'signaturePlace': 'signature_place',
#         'declarationAccepted': 'declaration_accepted',
        
#         # Property Basic Info
#         'propertyCategory': 'property_category',
#         'listingPurpose': 'listing_purpose',
#         'postedBy': 'posted_by',
#         'propertyTitle': 'property_title',
#         'propertyType': 'property_type',
        
#         # Property Details
#         'bedrooms': 'bedrooms',
#         'bathrooms': 'bathrooms',
#         'builtUpArea': 'built_up_area',
#         'carpetArea': 'carpet_area',
#         'furnishingStatus': 'furnishing_status',
#         'gardenSpace': 'garden_space',
#         'terrace': 'terrace',
        
#         # Location
#         'propertyAddress': 'address',
#         'area': 'area',
#         'propertyCity': 'city',
#         'district': 'district',
#         'state': 'state',
#         'pinCode': 'pin_code',
#         'landmark': 'landmark',
        
#         # Features & Amenities
#         'parking': 'parking',
#         'petFriendly': 'pet_friendly',
#         'selectedAmenities': 'amenities',
        
#         # Availability
#         'availableFrom': 'available_from',
#         # CHANGED: model column renamed minimum_rental_duration -> minimum_duration
#         'rentalDuration': 'minimum_duration',
#         'immediateMoveIn': 'immediate_move_in',
        
#         # Pricing
#         'expectedPrice': 'expected_price',
#         'priceType': 'price_negotiable',
#         'securityDeposit': 'security_deposit',
#         'maintenance': 'maintenance_amount',
        
#         # Tenant Preferences
#         'occupancyDetails': 'tenant_type',
#         'tenantType': 'tenant_type',
#         'smokingAllowed': 'smoking_allowed',
#         'dietaryPreference': 'dietary_preference',
        
#         # Property Condition
#         'propertyCondition': 'property_condition',
#         'ownershipType': 'ownership_type',
#         'loanOutstanding': 'loan_outstanding',
        
#         # Sell-specific
#         'propertyTax': 'property_tax',
#         'titleDeedVerify': 'title_deed_verify',
#         'underconstruction': 'underconstruction',
#         'immediatePossession': 'immediate_possession',
#         'reraApproved': 'rera_approved',
#         'loanEligible': 'loan_eligible',
        
#         # Additional
#         'floorNumber': 'floor_number',
#         'totalFloors': 'total_floors',
#         'propertyAge': 'property_age',
#         'cornerUnit': 'corner_unit',
#         'facingDirection': 'facing_direction',
#         'maintenanceIncluded': 'maintenance_included',
#         'commercialType': 'commercial_type',
#         'businessType': 'business_type',
#         'estimatedFootfall': 'estimated_footfall',
#         'operatingHours': 'operating_hours',
#         'leaseType': 'lease_type',
#         # FIXED: was mapped to 'lease_term' (typo) - the model column is
#         # 'lease_terms', so the old mapping silently dropped this field.
#         'leaseTerm': 'lease_terms',
#         'leaseTerms': 'lease_terms',
#         # CHANGED: model column renamed lease_renewable -> renewable_option
#         'leaseRenewable': 'renewable_option',
#         'renewableOption': 'renewable_option',
#         'zoningType': 'zoning_type',
#         'fitOut': 'fit_out',
#         'ceilingHeight': 'ceiling_height',
#         'frontageWidth': 'frontage_width',
#         'powerLoadCapacity': 'power_load_capacity',
#         'nearbyPlaces': 'nearby_places',
#         'nearbyConnectivity': 'nearby_connectivity',
#         'parkingCapacity': 'parking_capacity',
#         'balcony': 'balcony',
#         'interiorFeatures': 'interior_features',
#         'applianceIncluded': 'appliance_included',

#         # NEW: rental terms
#         'rentalTerm': 'rental_term',
#         'rentalFrequency': 'rental_frequency',
#         'minimumStayDuration': 'minimum_stay_duration',
#         'paymentFrequency': 'payment_frequency',

#         # NEW: hostel-specific
#         'hostelType': 'hostel_type',
#         'roomType': 'room_type',
#         'sharingType': 'sharing_type',
#         'totalCapacity': 'total_capacity',
#         'hostelCategory': 'hostel_category',
#         'genderType': 'gender_type',
#         'foodIncluded': 'food_included',
#         'foodType': 'food_type',
#         'mealsPerDay': 'meals_per_day',
#         'kitchenAccess': 'kitchen_access',
#         'bathroomType': 'bathroom_type',
#         'utilitiesIncluded': 'utilities_included',
#         'alcoholAllowed': 'alcohol_allowed',

#         # NEW: land/plot-specific
#         'landArea': 'land_area',
#         'landAreaMin': 'land_area_min',
#         'landAreaMax': 'land_area_max',
#         'areaUnit': 'area_unit',
#         'landShape': 'land_shape',
#         'roadWidth': 'road_width',
#         'waterSource': 'water_source',
#         'soilType': 'soil_type',
#         'electricityAvailable': 'electricity_available',
#         'selectedFeature': 'selected_feature',
#         'paymentMode': 'payment_mode',
#         'constructionStatus': 'construction_status',
#         'possessionTimeline': 'possession_timeline',
#         'readyToBuy': 'ready_to_buy',
#     }

#     integer_fields = [
#         'yearsExperience',
#         'activeListings',
#     ]
    
#     for field in integer_fields:
#         if field in data and data[field] is not None:
#             data[field] = extract_int(data[field])
    
#     if 'budgetRange[min]' in data:
#         min_val = extract_float(data.get('budgetRange[min]'))
#         max_val = extract_float(data.get('budgetRange[max]'))
#         data['price_min'] = min_val
#         data['price_max'] = max_val
#         del data['budgetRange[min]']
#         del data['budgetRange[max]']

#     # NOTE: previously this unconditionally did
#     # `data['yearsExperience'] = int(data['yearsExperience'])`, which raised
#     # a KeyError (500 error) for every non-agent post since owners/builders
#     # don't send yearsExperience at all. The loop above already casts it
#     # safely when present, so nothing further is needed here.

    
#     mapped_data = {}
#     for key, value in data.items():
#         print(f"\n Mapping field: {key} with value: {value}")
#         if key in field_mapping:
#             db_field = field_mapping[key]
            
#             if db_field == 'gender' and isinstance(value, str):
#                 value = value.capitalize()
#             elif db_field == 'price_negotiable' and isinstance(value, str):
#                 if value.lower() == 'negotiable':
#                     value = 'Negotiable'
#                 elif value.lower() in ['fixed price', 'fixed']:
#                     value = 'Fixed Price'
            
#             mapped_data[db_field] = convert_value_for_db(db_field, value)
#         else:
#             print(f"⚠️  Unmapped field: {key} with value: {value}")
#             mapped_data[key] = value
    
#     set_default_values(mapped_data)
    
#     return mapped_data


# def convert_value_for_db(field: str, value: Any) -> Any:
#     """Convert values to appropriate database types"""
#     if value is None:
#         return value

#     # Handle date fields
#     date_fields = [
#         'available_from', 'date_of_birth', 'signature_date',
#     ]
    
#     if field in date_fields:
#         if hasattr(value, 'date') and callable(getattr(value, 'date')):
#             return value.date() if hasattr(value, 'date') else value
#         elif hasattr(value, 'year') and hasattr(value, 'month') and hasattr(value, 'day'):
#             return value
#         elif isinstance(value, str) and value.strip():
#             try:
#                 return datetime.strptime(value, '%Y-%m-%d').date()
#             except ValueError:
#                 try:
#                     return datetime.strptime(value, '%m/%d/%Y').date()
#                 except ValueError:
#                     return value
#         else:
#             return value
    
#     # Handle boolean fields
#     boolean_fields = ['declaration_accepted']
    
#     if field in boolean_fields:
#         if isinstance(value, str):
#             return value.lower() in ['yes', 'true', '1', 'y']
#         return bool(value)

#     # Handle Yes/No / free-text string fields - stored as-is
#     string_yes_no_fields = [
#         'parking', 'pet_friendly', 'terrace', 'balcony', 'garden_space',
#         'immediate_move_in', 'maintenance_included', 'title_deed_verify',
#         'underconstruction', 'immediate_possession', 'rera_approved',
#         'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed',
#         'renewable_option', 'ready_to_buy', 'electricity_available',
#         'utilities_included', 'alcohol_allowed', 'food_included',
#     ]

#     if field in string_yes_no_fields and isinstance(value, str):
#         return value
    
#     # Handle JSONB array fields
#     array_fields = [
#         'preferred_contact_method', 'amenities', 'tenant_type', 'nearby_places',
#         'interior_features', 'appliance_included', 'room_type', 'sharing_type',
#         'selected_feature',
#     ]
    
#     if field in array_fields:
#         if isinstance(value, list):
#             return value
#         elif isinstance(value, str):
#             return [item.strip() for item in value.split(',') if item.strip()]

#     # CHANGED: nearby_connectivity is now a plain String column (was JSONB) -
#     # flatten a list into a comma-separated string rather than storing an
#     # array into a text column.
#     if field == 'nearby_connectivity' and isinstance(value, list):
#         return ', '.join(str(item).strip() for item in value if str(item).strip())

#     # CHANGED: these were String columns before and needed no casting; the
#     # model now types them as Integer, so frontend strings ("3", "1,200 sqft")
#     # need to be coerced or the insert/update will fail.
#     integer_fields = [
#         'bedrooms', 'bathrooms', 'floor_number', 'total_floors', 'property_age',
#         'built_up_area', 'carpet_area', 'total_capacity', 'land_area',
#         'land_area_min', 'land_area_max', 'road_width',
#     ]
#     if field in integer_fields:
#         return extract_int(value, default=None)

#     # CHANGED: these were String columns before; the model now types them
#     # as Float.
#     float_fields = [
#         'expected_price', 'price_min', 'price_max', 'maintenance_amount',
#         'security_deposit',
#     ]
#     if field in float_fields:
#         return extract_float(value)

#     # Handle enum-like fields. These are plain String columns now (not a
#     # SQLAlchemy Enum type) but are still normalized to uppercase for
#     # consistency with PostedBy/ListingPurpose/PropertyCategory values.
#     enum_fields = ['posted_by', 'listing_purpose', 'property_category']
#     if field in enum_fields and isinstance(value, str):
#         return value.upper()
    
#     return value


# def set_default_values(data: Dict[str, Any]):
#     """Set default values for missing fields"""
#     defaults = {
#         'property_condition': 'Good',
#         'ownership_type': 'Freehold',
#         'price_negotiable': 'Negotiable'
#     }
    
#     for field, default_value in defaults.items():
#         if field not in data or data[field] is None or data[field] == '':
#             data[field] = default_value
    
#     array_fields = ['preferred_contact_method', 'amenities', 'tenant_type']
#     for field in array_fields:
#         if field not in data or data[field] is None:
#             data[field] = []
#         elif isinstance(data[field], str):
#             data[field] = [data[field]]


# # ============================================
# # API ENDPOINTS WITH AUTHENTICATION
# # ============================================

# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_property(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: PropertyService = Depends(get_property_service)
# ):
#     content_type = request.headers.get("content-type", "").lower()
#     data = None

#     if "application/json" in content_type or not content_type:
#         try:
#             data = await request.json()
#         except Exception:
#             data = None

#     if data is None:
#         form = await request.form()
#         if "property_data" in form:
#             raw = form.get("property_data")
#             if isinstance(raw, str):
#                 try:
#                     data = json.loads(raw)
#                 except json.JSONDecodeError as e:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail=f"Invalid JSON in property_data: {str(e)}"
#                     )
#             else:
#                 data = raw
#         else:
#             data = {}
#             for key, value in form.multi_items():
#                 if key in {"images", "video", "documents"}:
#                     continue
#                 if isinstance(value, UploadFile):
#                     continue
#                 if key in data:
#                     current = data[key]
#                     if isinstance(current, list):
#                         current.append(value)
#                     else:
#                         data[key] = [current, value]
#                 else:
#                     data[key] = value

#         if not data and len(form) == 1 and "property_data" not in form:
#             try:
#                 data = dict(form)
#             except Exception:
#                 data = {}

#     if data is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="property_data is required"
#         )

#     data['user_id'] = current_user.get("user_id")
#     data = ensure_date_fields_are_date_objects(data)

#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     posted_by = (mapped_data.get('posted_by') or '').upper()
    
#     valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
#     if posted_by not in valid_posted_by:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
#         )
    
#     validated = PropertyCreate(
#         posted_by=posted_by,
#         property_data=mapped_data
#     )
#     print(f"*"*80)
#     print(f"current user id is ${current_user.get("user_id")}")
#     print(f"*"*80)
    
#     response = await service.create_property(
#         posted_by=validated.posted_by,
#         property_data=validated.property_data,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.get("/")
# async def get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# # @router.post("/filter")
# # async def filter_properties(
# #     filter_data: PropertyFilter,
# #     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
# #     service: PropertyService = Depends(get_property_service)
# # ):
# #     response = await service.filter_properties(filter_data)
# #     return strip_none_values(response)


# @router.get("/by-posted-by")
# async def get_properties_by_posted_by(
#     posted_by: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
        
#     response = await service.get_properties_by_posted_by(
#         posted_by=posted_by,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-category")
# async def get_properties_by_category(
#     property_category: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_category(
#         property_category=property_category,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-property-type")
# async def get_properties_by_property_type(
#     property_type: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_property_type(
#         property_type=property_type,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-purpose")
# async def get_properties_by_purpose(
#     listing_purpose: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_purpose(
#         listing_purpose=listing_purpose,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)




# @router.get("/{property_id}")
# async def get_property_by_id(
#     property_id: int,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     response = await service.get_property_by_id(property_id)
#     return strip_none_values(response)


# @router.put("/{property_id}")
# async def update_property(
#     property_id: int,
#     property_data: str = Form(...),
#     images: Optional[List[UploadFile]] = File(None),
#     video: Optional[UploadFile] = File(None),
#     documents: Optional[List[UploadFile]] = File(None),
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     try:
#         data = json.loads(property_data)
#     except json.JSONDecodeError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid JSON: {str(e)}"
#         )
    
#     data = ensure_date_fields_are_date_objects(data)
    
#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     status_val = None
#     if 'status' in mapped_data:
#         status_val = mapped_data['status']
#         del mapped_data['status']
    
#     mapped_data['user_id'] = current_user.get("user_id")
    
#     response = await service.update_property(
#         property_id=property_id,
#         update_data=mapped_data,
#         new_status=status_val,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     response = await service.delete_property(
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)





























































# from PIL.Image import item
# from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import Optional, List, Dict, Any
# import json
# from datetime import date, datetime
# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.services.property_service import PropertyService
# from app.schemas.property import PropertyCreate, PropertyUpdate
# from app.schemas.filter_schemas import PropertyFilter
# from app.core.response_utils import strip_none_values
# from app.api.dependencies import (
#     get_current_user, 
#     get_current_user_optional,
#     require_authenticated,
#     require_admin,
#     require_vendor
# )
# from app.models.user import UserRole

# router = APIRouter()

# async def get_property_service(db: AsyncSession = Depends(get_db)):
#     repository = PropertyRepository(db)
#     return PropertyService(repository)

# def extract_files_from_data(data: Dict[str, Any]) -> tuple:
#     """Extract files from the data object with cache configuration"""
#     cleaned_data = {}
#     for key, value in data.items():
#         # Remove [] from field names (e.g., preferredContactMethod[] -> preferredContactMethod)
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
        
#     # Use cleaned_data for all subsequent processing
#     data = cleaned_data
    
#     files = {
#         'images': [],
#         'documents': [],
#         'video': None,
#         'profile_image': None
#     }
    
#     file_metadata = {}
    
#     doc_type_mapping = {
#         'aadhaarCard': 'aadhaar_card',
#         'panCard': 'pan_card',
#         'passportPhoto': 'passport_photo',
#         'pattaChitta': 'patta_chitta',
#         'saleDeed': 'sale_deed',
#         'rentalAgreement': 'rental_agreement',
#         'propertyTaxReceipt': 'property_tax_receipt',
#         'encumbranceCertificate': 'encumbrance_certificate',
#         'occupancyCertificate': 'occupancy_certificate',
#         'completionCertificate': 'completion_certificate',
#         'buildingApprovalPlan': 'building_approval_plan',
#         'floorPlan': 'floor_plan',
#         'otherSupportingDocs': 'other_supporting_document',
#         'agencyLogo': 'agency_logo',
#         'gstCertificate': 'gst_certificate',
#         'businessRegistrationCertificate': 'business_registration_certificate',
#         'reraCertificate': 'rera_certificate',
#         'leaseAgreement': 'lease_agreement',
#         'tradeLicense': 'trade_license',
#         'fireSafetyCertificate': 'fire_safety_certificate',
#         'companyLogo': 'company_logo',
#         'companyProfileBrochure': 'company_profile_brochure',
#         'companyPanCard': 'company_pan_card',
#         'companyRegistrationCertificate': 'company_registration_certificate',
#         'companyAddressProof': 'company_address_proof',
#         'projectBrochure': 'project_brochure',
#         'authorizedSignatoryIdProof': 'authorized_signatory_id_proof',
#     }
    
#     file_mappings = {
#         'coverImage': {'category': 'images', 'is_document': False},
#         'propertyImages': {'category': 'images', 'is_document': False},
#         'propertyVideo': {'category': 'video', 'is_document': False},
#         'passportPhoto': {'category': 'images', 'is_document': False},
#         'aadhaarCard': {'category': 'documents', 'is_document': True},
#         'panCard': {'category': 'documents', 'is_document': True},
#         'pattaChitta': {'category': 'documents', 'is_document': True},
#         'saleDeed': {'category': 'documents', 'is_document': True},
#         'rentalAgreement': {'category': 'documents', 'is_document': True},
#         'propertyTaxReceipt': {'category': 'documents', 'is_document': True},
#         'encumbranceCertificate': {'category': 'documents', 'is_document': True},
#         'occupancyCertificate': {'category': 'documents', 'is_document': True},
#         'completionCertificate': {'category': 'documents', 'is_document': True},
#         'buildingApprovalPlan': {'category': 'documents', 'is_document': True},
#         'floorPlan': {'category': 'documents', 'is_document': True},
#         'otherSupportingDocs': {'category': 'documents', 'is_document': True},
#         'agencyLogo': {'category': 'images', 'is_document': False},
#         'gstCertificate': {'category': 'documents', 'is_document': True},
#         'businessRegistrationCertificate': {'category': 'documents', 'is_document': True},
#         'reraCertificate': {'category': 'documents', 'is_document': True},
#         'leaseAgreement': {'category': 'documents', 'is_document': True},
#         'tradeLicense': {'category': 'documents', 'is_document': True},
#         'fireSafetyCertificate': {'category': 'documents', 'is_document': True},
#         'companyLogo': {'category': 'images', 'is_document': False},
#         'companyProfileBrochure': {'category': 'documents', 'is_document': True},
#         'companyPanCard': {'category': 'documents', 'is_document': True},
#         'companyRegistrationCertificate': {'category': 'documents', 'is_document': True},
#         'companyAddressProof': {'category': 'documents', 'is_document': True},
#         'projectBrochure': {'category': 'documents', 'is_document': True},
#         'authorizedSignatoryIdProof': {'category': 'documents', 'is_document': True},
#         'profilePhoto':{'category':'images','is_documents':False},
#     }
    
#     print("\n📂 EXTRACTING FILES FROM DATA")
#     print(f"  Available keys: {list(data.keys())}")
    
#     keys_to_process = list(data.keys())
    
#     for field in keys_to_process:
#         if field in file_mappings:
#             config = file_mappings[field]
#             category = config['category']
#             value = data.get(field)
            
#             if value is not None:
#                 print(f"  📁 Processing: {field} (type: {type(value).__name__})")
                
#                 # Get document type from field name mapping
#                 doc_type = doc_type_mapping.get(field, 'other_supporting_document')
                
#                 # Handle list of files
#                 if isinstance(value, list):
#                     print(f"    - Found {len(value)} files")
#                     for idx, file_obj in enumerate(value):
#                         if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                             # Store doc_type as attribute
#                             if hasattr(file_obj, 'file'):
#                                 file_obj.doc_type = doc_type
#                                 file_obj.field_name = field
#                             elif isinstance(file_obj, UploadFile):
#                                 setattr(file_obj, 'doc_type', doc_type)
#                                 setattr(file_obj, 'field_name', field)
                            
#                             # Add to appropriate category
#                             if config['is_document']:
#                                 files['documents'].append(file_obj)
#                                 print(f"      - Added document: {getattr(file_obj, 'filename', 'unknown')} as {doc_type}")
#                             elif category == 'images':
#                                 files['images'].append(file_obj)
#                                 print(f"      - Added image: {getattr(file_obj, 'filename', 'unknown')}")
                            
#                             file_metadata[f"{field}_{idx}"] = {
#                                 'doc_type': doc_type,
#                                 'field': field,
#                                 'category': category,
#                                 'index': idx
#                             }
                
#                 # Handle single file
#                 elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                     print(f"    - Single file: {getattr(value, 'filename', 'unknown')}")
                    
#                     # Store doc_type as attribute
#                     if hasattr(value, 'file'):
#                         value.doc_type = doc_type
#                         value.field_name = field
#                     elif isinstance(value, UploadFile):
#                         setattr(value, 'doc_type', doc_type)
#                         setattr(value, 'field_name', field)
                    
#                     if category == 'video':
#                         files['video'] = value
#                         print(f"      - Added video")
#                     elif category == 'profile_image':
#                         files['profile_image'] = value
#                         print(f"      - Added profile image")
#                     elif category == 'images':
#                         files['images'].append(value)
#                         print(f"      - Added image")
#                     elif category == 'documents':
#                         files['documents'].append(value)
#                         print(f"      - Added document as {doc_type}")
                    
#                     file_metadata[field] = {
#                         'doc_type': doc_type,
#                         'field': field,
#                         'category': category
#                     }
                
#                 # Remove field from data
#                 del data[field]
    
#     return files, data, file_metadata

# # selected
# def ensure_date_fields_are_date_objects(data: Dict[str, Any]) -> Dict[str, Any]:
#     # Frontend field names that need conversion to date objects
#     date_fields = ['availableFrom', 'dateOfBirth', 'signatureDate', 'availableTo']
    
#     for field in date_fields:
#         if field in data and data[field] is not None:
#             value = data[field]
            
#             # If it's already a date/datetime object, keep it
#             if hasattr(value, 'date') and callable(getattr(value, 'date')):
#                 data[field] = value.date() if hasattr(value, 'date') else value
#                 continue
            
#             # If it's a string, convert to date object
#             if isinstance(value, str) and value.strip():
#                 try:
#                     # Try YYYY-MM-DD format first
#                     data[field] = datetime.strptime(value, '%Y-%m-%d').date()
#                 except ValueError:
#                     try:
#                         # Try MM/DD/YYYY format
#                         data[field] = datetime.strptime(value, '%m/%d/%Y').date()
#                     except ValueError:
#                         # If parsing fails, leave as is (will be caught by validator)
#                         pass
    
#     return data

# #selected
# def map_frontend_to_db_fields(data: Dict[str, Any]) -> Dict[str, Any]:

#     cleaned_data = {}
#     for key, value in data.items():
#         # Remove [] from field names (e.g., preferredContactMethod[] -> preferredContactMethod)
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     # Use cleaned_data for all subsequent processing
#     data = cleaned_data
    
#     # ✅ Step 1: Ensure date fields are date objects
#     data = ensure_date_fields_are_date_objects(data)
    
#     field_mapping = {
#         # Owner/User Info
#         'ownerName': 'owner_name',
#         'contactNumber': 'mobile',
#         'emailId': 'email_id',
#         'addressLine1': 'address_line1',
#         'addressLine2': 'address_line2',
#         'ownerCity': 'owner_city',
#         'ownerState': 'owner_state',
#         'ownerPinCode': 'owner_pin_code',
#         'dateOfBirth': 'date_of_birth',
#         'gender': 'gender',
#         'aadhaarNumber': 'aadhaar_number',
#         'panNumber': 'pan_number',
#         'preferredContactMethod': 'preferred_contact_method',
#         'preferredContactTime': 'preferred_contact_time',
        
#         # Bank Details
#         'accountHolderName': 'account_holder_name',
#         'accountNumber': 'account_number',
#         'bankName': 'bank_name',
#         'ifscCode': 'ifsc_code',
#         'upiId': 'upi_id',
        
#         # Declaration
#         'signatureDate': 'signature_date',
#         'signaturePlace': 'signature_place',
#         'declarationAccepted': 'declaration_accepted',
        
#         # Property Basic Info
#         'propertyCategory': 'property_category',
#         'listingPurpose': 'listing_purpose',
#         'postedBy': 'posted_by',
#         'propertyTitle': 'property_title',
#         'propertyType': 'property_type',
        
#         # Property Details
#         'bedrooms': 'bedrooms',
#         'bathrooms': 'bathrooms',
#         'builtUpArea': 'built_up_area',
#         'carpetArea': 'carpet_area',
#         'furnishingStatus': 'furnishing_status',
#         'gardenSpace': 'garden_space',
#         'terrace': 'terrace',
        
#         # Location - All mandatory fields
#         'propertyAddress': 'address',
#         'area': 'area',
#         'propertyCity': 'city',
#         'district': 'district',
#         'state': 'state',
#         'pinCode': 'pin_code',
#         'landmark': 'landmark',
        
#         # Features & Amenities
#         'parking': 'parking',
#         'petFriendly': 'pet_friendly',
#         'selectedAmenities': 'amenities',
        
        
#         # Availability
#         'availableFrom': 'available_from',
#         'rentalDuration': 'minimum_rental_duration',
#         'immediateMoveIn': 'immediate_move_in',
        
#         # Pricing
#         'expectedPrice': 'expected_price',
#         'priceType': 'price_negotiable',
#         'securityDeposit': 'security_deposit',
#         'maintenance': 'maintenance_amount',
        
#         # Tenant Preferences
#         'occupancyDetails': 'tenant_type',
#         'tenantType': 'tenant_type',
#         'smokingAllowed': 'smoking_allowed',
#         'dietaryPreference': 'dietary_preference',
        
#         # Property Condition
#         'propertyCondition': 'property_condition',
#         'ownershipType': 'ownership_type',
#         'loanOutstanding': 'loan_outstanding',
        
#         # Sell-specific
#         'propertyTax': 'property_tax',
#         'titleDeedVerify': 'title_deed_verify',
#         'underconstruction': 'underconstruction',
#         'immediatePossession': 'immediate_possession',
#         'reraApproved': 'rera_approved',
#         'loanEligible': 'loan_eligible',
        
#         # Additional
#         'floorNumber': 'floor_number',
#         'totalFloors': 'total_floors',
#         'propertyAge': 'property_age',
#         'cornerUnit': 'corner_unit',
#         'facingDirection': 'facing_direction',
#         'maintenanceIncluded': 'maintenance_included',

#         'commercialType': 'commercial_type',
#         'businessType': 'business_type',
#         'estimatedFootfall': 'estimated_footfall',
#         'operatingHours': 'operating_hours',
#         'leaseType': 'lease_type',
#         'leaseTerm': 'lease_term',
#         'leaseRenewable': 'lease_renewable',
#         'zoningType': 'zoning_type',
#         'fitOut': 'fit_out',
#         'ceilingHeight': 'ceiling_height',
#         'frontageWidth': 'frontage_width',
#         'powerLoadCapacity': 'power_load_capacity',
#         'nearbyPlaces': 'nearby_places',
#         'parkingCapacity': 'parking_capacity',

#         'balcony': 'balcony',

#         'interiorFeatures': 'interior_features',
#         'applianceIncluded': 'appliance_included'

#     }
#     if 'budgetRange[min]' in data:
#         data['budgetRange'] = {
#             'min': data.get('budgetRange[min]'),
#             'max': data.get('budgetRange[max]')
#         }
#         data['price_min'] = data['budgetRange']['min']
#         data['price_max'] = data['budgetRange']['max']
#         del data['budgetRange[min]']
#         del data['budgetRange[max]']
    
#     mapped_data = {}
#     for key, value in data.items():
#         print(f"\n Mapping field: {key} with value: {value}")
#         if key in field_mapping:
#             db_field = field_mapping[key]
            
#             # Apply transformations based on field
#             if db_field == 'gender' and isinstance(value, str):
#                 value = value.capitalize()
#             elif db_field == 'price_negotiable' and isinstance(value, str):
#                 # Frontend already sends "Fixed Price" or "Negotiable"
#                 # Just ensure proper capitalization
#                 if value.lower() == 'negotiable':
#                     value = 'Negotiable'
#                 elif value.lower() in ['fixed price', 'fixed']:
#                     value = 'Fixed Price'
            
#             mapped_data[db_field] = convert_value_for_db(db_field, value)
#         else:
#             print(f"⚠️  Unmapped field: {key} with value: {value}")
#             mapped_data[key] = value
    
#     # Set defaults
#     set_default_values(mapped_data)
    
#     return mapped_data

# def convert_value_for_db(field: str, value: Any) -> Any:
#     # Handle date fields - convert to string
#     date_fields = [
#         'available_from', 'date_of_birth', 'signature_date',
#     ]
    
#     if field in date_fields and value is not None:
#         # If it's already a date/datetime object, return as is
#         if hasattr(value, 'date') and callable(getattr(value, 'date')):
#             return value.date() if hasattr(value, 'date') else value
#         # If it's a date object directly
#         elif hasattr(value, 'year') and hasattr(value, 'month') and hasattr(value, 'day'):
#             return value
#         # If it's a string, parse to date object
#         elif isinstance(value, str) and value.strip():
#             try:
#                 # Try YYYY-MM-DD format
#                 from datetime import datetime
#                 return datetime.strptime(value, '%Y-%m-%d').date()
#             except ValueError:
#                 try:
#                     # Try MM/DD/YYYY format
#                     return datetime.strptime(value, '%m/%d/%Y').date()
#                 except ValueError:
#                     # If parsing fails, keep as string (will cause DB error)
#                     return value
#         # Otherwise, return as is
#         else:
#             return value
    
#     # Handle boolean fields
#     boolean_fields = [
#         'declaration_accepted'
#     ]
    
#     if field in boolean_fields:
#         if isinstance(value, str):
#             return value.lower() in ['yes', 'true', '1', 'y']
#         return bool(value)

#     string_yes_no_fields = [
#         'parking', 'pet_friendly', 'terrace_balcony', 'garden_space',
#         'immediate_move_in', 'maintenance_included', 'title_deed_verify',
#         'underconstruction', 'immediate_possession', 'rera_approved',
#         'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed'
#     ]

#     if field in string_yes_no_fields and isinstance(value, str):
#         return value
    
#     # Handle JSONB array fields
#     array_fields = [
#         'preferred_contact_method', 'amenities', 'tenant_type','nearby_places',
#         'nearby_access', 'nearby_connectivity', 'interior_features','appliance_included'
#     ]
    
#     if field in array_fields:
#         if isinstance(value, list):
#             print(f"✅ {field} is already a list: {value}")
#             return value
#         elif isinstance(value, str):
#             return [item.strip() for item in value.split(',') if item.strip()]
    
#     # Handle numeric fields
#     numeric_fields = ['security_deposit', 'price_min', 'price_max']
#     if field in numeric_fields and value is not None:
#         try:
#             if isinstance(value, str):
#                 cleaned = ''.join(c for c in value if c.isdigit() or c == '.')
#                 return float(cleaned) if '.' in cleaned else int(cleaned)
#             elif isinstance(value, (int, float)):
#                 return value
#         except (ValueError, TypeError):
#             return None

#     enum_fields = ['posted_by', 'listing_purpose', 'property_category']
#     if field in enum_fields and isinstance(value, str):
#         return value.upper()
    
#     # Return value as-is if no conversion needed
#     return value

# def set_default_values(data: Dict[str, Any]):
#     """Set default values for missing fields"""
#     defaults = {
#         'property_condition': 'Good',
#         'ownership_type': 'Freehold',
#         'price_negotiable': 'Negotiable'
#     }
    
#     for field, default_value in defaults.items():
#         if field not in data or data[field] is None or data[field] == '':
#             data[field] = default_value
    
#     # Ensure arrays are lists
#     array_fields = ['preferred_contact_method', 'amenities', 'tenant_type']
#     for field in array_fields:
#         if field not in data or data[field] is None:
#             data[field] = []
#         elif isinstance(data[field], str):
#             data[field] = [data[field]]

            
# # ============================================
# # API ENDPOINTS WITH AUTHENTICATION
# # ============================================

# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_property(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: PropertyService = Depends(get_property_service)
# ):
#     # print("Received create_property request")
#     # print(f"request data: {request}")
#     """
#     Create a new property.
#     Requires authentication.
#     """
#     content_type = request.headers.get("content-type", "").lower()
#     data = None

#     if "application/json" in content_type or not content_type:
#         try:
#             data = await request.json()
#         except Exception:
#             data = None

#     if data is None:
#         form = await request.form()
#         if "property_data" in form:
#             raw = form.get("property_data")
#             if isinstance(raw, str):
#                 try:
#                     data = json.loads(raw)
#                 except json.JSONDecodeError as e:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail=f"Invalid JSON in property_data: {str(e)}"
#                     )
#             else:
#                 data = raw
#         else:
#             data = {}
#             for key, value in form.multi_items():
#                 if key in {"images", "video", "documents"}:
#                     continue
#                 if isinstance(value, UploadFile):
#                     continue
#                 if key in data:
#                     current = data[key]
#                     if isinstance(current, list):
#                         current.append(value)
#                     else:
#                         data[key] = [current, value]
#                 else:
#                     data[key] = value

#         # If the frontend sent a plain object without a wrapper, use it directly
#         if not data and len(form) == 1 and "property_data" not in form:
#             try:
#                 data = dict(form)
#             except Exception:
#                 data = {}

#     if data is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="property_data is required"
#         )

#     data['user_id'] = current_user.get("user_id")
#     data = ensure_date_fields_are_date_objects(data)

#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     # ✅ Debug: Verify available_from is a string
#     if 'available_from' in mapped_data:
#         print(f"✅ available_from: {mapped_data['available_from']} (type: {type(mapped_data['available_from'])})")
    
#     # Use posted_by directly
#     posted_by = mapped_data.get('posted_by').upper()
    
#     # Validate posted_by
#     valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
#     if posted_by not in valid_posted_by:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
#         )
    
#     # Create property - passing posted_by directly
#     validated = PropertyCreate(
#         posted_by=posted_by,
#         property_data=mapped_data
#     )
    
#     response = await service.create_property(
#         posted_by=validated.posted_by,
#         property_data=validated.property_data,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)

# @router.get("/")
# async def get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400ṣ_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.post("/filter")
# async def filter_properties(
#     filter_data: PropertyFilter,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.filter_properties(filter_data)
#     return strip_none_values(response)

# @router.get("/by-posted-by")
# async def get_properties_by_posted_by(
#     posted_by: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
        
#     response = await service.get_properties_by_posted_by(
#         posted_by=posted_by,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.get("/by-category")
# async def get_properties_by_category(
#     property_category: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_category(
#         property_category=property_category,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.get("/by-property-type")
# async def get_properties_by_property_type(
#     property_type: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_property_type(
#         property_type=property_type,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.get("/by-purpose")
# async def get_properties_by_purpose(
#     listing_purpose: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_purpose(
#         listing_purpose=listing_purpose,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.get("/my-properties")
# async def get_my_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_user(
#         user_id=current_user.get("user_id"),
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.get("/{property_id}")
# async def get_property_by_id(
#     property_id: int,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.get_property_by_id(property_id)
#     return strip_none_values(response)

# @router.put("/{property_id}")
# async def update_property(
#     property_id: int,
#     property_data: str = Form(...),
#     images: Optional[List[UploadFile]] = File(None),
#     video: Optional[UploadFile] = File(None),
#     documents: Optional[List[UploadFile]] = File(None),
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     try:
#         data = json.loads(property_data)
#     except json.JSONDecodeError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid JSON: {str(e)}"
#         )
    
#     # ✅ Ensure date fields are date objects
#     data = ensure_date_fields_are_date_objects(data)
    
#     # Extract files from the data
#     files, cleaned_data, file_metadata = extract_files_from_data(data)
    
#     # Map frontend fields to DB fields
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     # Extract status if present
#     status_val = None
#     if 'status' in mapped_data:
#         status_val = mapped_data['status']
#         del mapped_data['status']
    
#     # ✅ Add user_id for ownership verification
#     mapped_data['user_id'] = current_user.get("user_id")
    
#     response = await service.update_property(
#         property_id=property_id,
#         update_data=mapped_data,
#         status=status_val,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)

# @router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.delete_property(
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)

# # ============================================
# # ADMIN ONLY ENDPOINTS
# # ============================================

# @router.get("/admin/all")
# async def admin_get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Dict[str, Any] = Depends(require_admin),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties_admin(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)

# @router.delete("/admin/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def admin_delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_admin),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.delete_property_admin(property_id)
#     return strip_none_values(response)


































































# before Profile 



# from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import Optional, List, Dict, Any
# import json
# from datetime import date, datetime
# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.services.property_service import PropertyService
# from app.schemas.property import PropertyCreate, PropertyUpdate
# from app.schemas.filter_schemas import PropertyFilter
# from app.core.response_utils import strip_none_values
# from app.api.dependencies import (
#     get_current_user, 
#     get_current_user_optional,
#     require_authenticated,
#     require_admin,
#     require_vendor
# )
# from app.models.user import UserRole

# router = APIRouter()

# async def get_property_service(db: AsyncSession = Depends(get_db)):
#     repository = PropertyRepository(db)
#     return PropertyService(repository)

# # ============================================
# # GLOBAL MAPPINGS - Accessible everywhere in controller
# # ============================================

# DOC_TYPE_MAPPING = {
#     'aadhaarCard': 'aadhaar_card',
#     'panCard': 'pan_card',
#     'passportPhoto': 'passport_photo',
#     'pattaChitta': 'patta_chitta',
#     'saleDeed': 'sale_deed',
#     'rentalAgreement': 'rental_agreement',
#     'propertyTaxReceipt': 'property_tax_receipt',
#     'encumbranceCertificate': 'encumbrance_certificate',
#     'occupancyCertificate': 'occupancy_certificate',
#     'completionCertificate': 'completion_certificate',
#     'buildingApprovalPlan': 'building_approval_plan',
#     'floorPlan': 'floor_plan',
#     'otherSupportingDocs': 'other_supporting_document',
#     'agencyLogo': 'agency_logo',
#     'gstCertificate': 'gst_certificate',
#     'businessRegistrationCertificate': 'business_registration_certificate',
#     'reraCertificate': 'rera_certificate',
#     'leaseAgreement': 'lease_agreement',
#     'tradeLicense': 'trade_license',
#     'fireSafetyCertificate': 'fire_safety_certificate',
#     'companyLogo': 'company_logo',
#     'companyProfileBrochure': 'company_profile_brochure',
#     'companyPanCard': 'company_pan_card',
#     'companyRegistrationCertificate': 'company_registration_certificate',
#     'companyAddressProof': 'company_address_proof',
#     'projectBrochure': 'project_brochure',
#     'authorizedSignatoryIdProof': 'authorized_signatory_id_proof',
# }

# FILE_MAPPINGS = {
#     # Images
#     'coverImage': {'category': 'images', 'is_document': False},
#     'propertyImages': {'category': 'images', 'is_document': False},
#     'passportPhoto': {'category': 'images', 'is_document': False},
#     'agencyLogo': {'category': 'images', 'is_document': False},
#     'companyLogo': {'category': 'images', 'is_document': False},
#     'profilePhoto': {'category': 'images', 'is_document': False},
#     # Video
#     'propertyVideo': {'category': 'video', 'is_document': False},
#     # Documents
#     'aadhaarCard': {'category': 'documents', 'is_document': True},
#     'panCard': {'category': 'documents', 'is_document': True},
#     'pattaChitta': {'category': 'documents', 'is_document': True},
#     'saleDeed': {'category': 'documents', 'is_document': True},
#     'rentalAgreement': {'category': 'documents', 'is_document': True},
#     'propertyTaxReceipt': {'category': 'documents', 'is_document': True},
#     'encumbranceCertificate': {'category': 'documents', 'is_document': True},
#     'occupancyCertificate': {'category': 'documents', 'is_document': True},
#     'completionCertificate': {'category': 'documents', 'is_document': True},
#     'buildingApprovalPlan': {'category': 'documents', 'is_document': True},
#     'floorPlan': {'category': 'documents', 'is_document': True},
#     'otherSupportingDocs': {'category': 'documents', 'is_document': True},
#     'gstCertificate': {'category': 'documents', 'is_document': True},
#     'businessRegistrationCertificate': {'category': 'documents', 'is_document': True},
#     'reraCertificate': {'category': 'documents', 'is_document': True},
#     'leaseAgreement': {'category': 'documents', 'is_document': True},
#     'tradeLicense': {'category': 'documents', 'is_document': True},
#     'fireSafetyCertificate': {'category': 'documents', 'is_document': True},
#     'companyProfileBrochure': {'category': 'documents', 'is_document': True},
#     'companyPanCard': {'category': 'documents', 'is_document': True},
#     'companyRegistrationCertificate': {'category': 'documents', 'is_document': True},
#     'companyAddressProof': {'category': 'documents', 'is_document': True},
#     'projectBrochure': {'category': 'documents', 'is_document': True},
#     'authorizedSignatoryIdProof': {'category': 'documents', 'is_document': True},
# }

# # Fields that are always primary images
# PRIMARY_IMAGE_FIELDS = ['coverImage', 'passportPhoto', 'agencyLogo', 'companyLogo', 'profilePhoto']


# def extract_files_from_data(data: Dict[str, Any]) -> tuple:
#     """Extract files from the data object using global mappings"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
        
#     data = cleaned_data
    
#     files = {
#         'images': [],
#         'documents': [],
#         'video': None,
#         'profile_image': None
#     }
    
#     file_metadata = {}
    
#     print("\n📂 EXTRACTING FILES FROM DATA")
#     print(f"  Available keys: {list(data.keys())}")
    
#     keys_to_process = list(data.keys())
    
#     for field in keys_to_process:
#         if field in FILE_MAPPINGS:
#             config = FILE_MAPPINGS[field]
#             category = config['category']
#             value = data.get(field)
            
#             if value is not None:
#                 print(f"  📁 Processing: {field} (type: {type(value).__name__})")
                
#                 doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
                
#                 if isinstance(value, list):
#                     print(f"    - Found {len(value)} files")
#                     for idx, file_obj in enumerate(value):
#                         if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                             if hasattr(file_obj, 'file'):
#                                 file_obj.doc_type = doc_type
#                                 file_obj.field_name = field
#                             elif isinstance(file_obj, UploadFile):
#                                 setattr(file_obj, 'doc_type', doc_type)
#                                 setattr(file_obj, 'field_name', field)
                            
#                             if config['is_document']:
#                                 files['documents'].append(file_obj)
#                                 print(f"      - Added document: {getattr(file_obj, 'filename', 'unknown')} as {doc_type}")
#                             elif category == 'images':
#                                 files['images'].append(file_obj)
#                                 print(f"      - Added image: {getattr(file_obj, 'filename', 'unknown')}")
                            
#                             file_metadata[f"{field}_{idx}"] = {
#                                 'doc_type': doc_type,
#                                 'field': field,
#                                 'category': category,
#                                 'index': idx
#                             }
                
#                 elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                     print(f"    - Single file: {getattr(value, 'filename', 'unknown')}")
                    
#                     if hasattr(value, 'file'):
#                         value.doc_type = doc_type
#                         value.field_name = field
#                     elif isinstance(value, UploadFile):
#                         setattr(value, 'doc_type', doc_type)
#                         setattr(value, 'field_name', field)
                    
#                     if category == 'video':
#                         files['video'] = value
#                         print(f"      - Added video")
#                     elif category == 'profile_image':
#                         files['profile_image'] = value
#                         print(f"      - Added profile image")
#                     elif category == 'images':
#                         files['images'].append(value)
#                         print(f"      - Added image")
#                     elif category == 'documents':
#                         files['documents'].append(value)
#                         print(f"      - Added document as {doc_type}")
                    
#                     file_metadata[field] = {
#                         'doc_type': doc_type,
#                         'field': field,
#                         'category': category
#                     }
                
#                 del data[field]
    
#     return files, data, file_metadata


# def ensure_date_fields_are_date_objects(data: Dict[str, Any]) -> Dict[str, Any]:
#     # Frontend field names that need conversion to date objects
#     date_fields = ['availableFrom', 'dateOfBirth', 'signatureDate', 'availableTo']
    
#     for field in date_fields:
#         if field in data and data[field] is not None:
#             value = data[field]
            
#             # If it's already a date/datetime object, keep it
#             if hasattr(value, 'date') and callable(getattr(value, 'date')):
#                 data[field] = value.date() if hasattr(value, 'date') else value
#                 continue
            
#             # If it's a string, convert to date object
#             if isinstance(value, str) and value.strip():
#                 try:
#                     # Try YYYY-MM-DD format first
#                     data[field] = datetime.strptime(value, '%Y-%m-%d').date()
#                 except ValueError:
#                     try:
#                         # Try MM/DD/YYYY format
#                         data[field] = datetime.strptime(value, '%m/%d/%Y').date()
#                     except ValueError:
#                         # If parsing fails, leave as is (will be caught by validator)
#                         pass
    
#     return data


# def map_frontend_to_db_fields(data: Dict[str, Any]) -> Dict[str, Any]:

#     cleaned_data = {}
#     for key, value in data.items():
#         # Remove [] from field names (e.g., preferredContactMethod[] -> preferredContactMethod)
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     # Use cleaned_data for all subsequent processing
#     data = cleaned_data
    
#     # ✅ Step 1: Ensure date fields are date objects
#     data = ensure_date_fields_are_date_objects(data)
    
#     field_mapping = {
#         # Owner/User Info
#         'ownerName': 'owner_name',
#         'contactNumber': 'mobile',
#         'emailId': 'email_id',
#         'addressLine1': 'address_line1',
#         'addressLine2': 'address_line2',
#         'ownerCity': 'owner_city',
#         'ownerState': 'owner_state',
#         'ownerPinCode': 'owner_pin_code',
#         'dateOfBirth': 'date_of_birth',
#         'gender': 'gender',
#         'aadhaarNumber': 'aadhaar_number',
#         'panNumber': 'pan_number',
#         'preferredContactMethod': 'preferred_contact_method',
#         'preferredContactTime': 'preferred_contact_time',
        
#         # Bank Details
#         'accountHolderName': 'account_holder_name',
#         'accountNumber': 'account_number',
#         'bankName': 'bank_name',
#         'ifscCode': 'ifsc_code',
#         'upiId': 'upi_id',
        
#         # Declaration
#         'signatureDate': 'signature_date',
#         'signaturePlace': 'signature_place',
#         'declarationAccepted': 'declaration_accepted',
        
#         # Property Basic Info
#         'propertyCategory': 'property_category',
#         'listingPurpose': 'listing_purpose',
#         'postedBy': 'posted_by',
#         'propertyTitle': 'property_title',
#         'propertyType': 'property_type',
        
#         # Property Details
#         'bedrooms': 'bedrooms',
#         'bathrooms': 'bathrooms',
#         'builtUpArea': 'built_up_area',
#         'carpetArea': 'carpet_area',
#         'furnishingStatus': 'furnishing_status',
#         'gardenSpace': 'garden_space',
#         'terrace': 'terrace',
        
#         # Location - All mandatory fields
#         'propertyAddress': 'address',
#         'area': 'area',
#         'propertyCity': 'city',
#         'district': 'district',
#         'state': 'state',
#         'pinCode': 'pin_code',
#         'landmark': 'landmark',
        
#         # Features & Amenities
#         'parking': 'parking',
#         'petFriendly': 'pet_friendly',
#         'selectedAmenities': 'amenities',
        
        
#         # Availability
#         'availableFrom': 'available_from',
#         'rentalDuration': 'minimum_rental_duration',
#         'immediateMoveIn': 'immediate_move_in',
        
#         # Pricing
#         'expectedPrice': 'expected_price',
#         'priceType': 'price_negotiable',
#         'securityDeposit': 'security_deposit',
#         'maintenance': 'maintenance_amount',
        
#         # Tenant Preferences
#         'occupancyDetails': 'tenant_type',
#         'tenantType': 'tenant_type',
#         'smokingAllowed': 'smoking_allowed',
#         'dietaryPreference': 'dietary_preference',
        
#         # Property Condition
#         'propertyCondition': 'property_condition',
#         'ownershipType': 'ownership_type',
#         'loanOutstanding': 'loan_outstanding',
        
#         # Sell-specific
#         'propertyTax': 'property_tax',
#         'titleDeedVerify': 'title_deed_verify',
#         'underconstruction': 'underconstruction',
#         'immediatePossession': 'immediate_possession',
#         'reraApproved': 'rera_approved',
#         'loanEligible': 'loan_eligible',
        
#         # Additional
#         'floorNumber': 'floor_number',
#         'totalFloors': 'total_floors',
#         'propertyAge': 'property_age',
#         'cornerUnit': 'corner_unit',
#         'facingDirection': 'facing_direction',
#         'maintenanceIncluded': 'maintenance_included',

#         'commercialType': 'commercial_type',
#         'businessType': 'business_type',
#         'estimatedFootfall': 'estimated_footfall',
#         'operatingHours': 'operating_hours',
#         'leaseType': 'lease_type',
#         'leaseTerm': 'lease_term',
#         'leaseRenewable': 'lease_renewable',
#         'zoningType': 'zoning_type',
#         'fitOut': 'fit_out',
#         'ceilingHeight': 'ceiling_height',
#         'frontageWidth': 'frontage_width',
#         'powerLoadCapacity': 'power_load_capacity',
#         'nearbyPlaces': 'nearby_places',
#         'parkingCapacity': 'parking_capacity',

#         'balcony': 'balcony',

#         'interiorFeatures': 'interior_features',
#         'applianceIncluded': 'appliance_included'

#     }
#     if 'budgetRange[min]' in data:
#         data['budgetRange'] = {
#             'min': data.get('budgetRange[min]'),
#             'max': data.get('budgetRange[max]')
#         }
#         data['price_min'] = data['budgetRange']['min']
#         data['price_max'] = data['budgetRange']['max']
#         del data['budgetRange[min]']
#         del data['budgetRange[max]']
    
#     mapped_data = {}
#     for key, value in data.items():
#         print(f"\n Mapping field: {key} with value: {value}")
#         if key in field_mapping:
#             db_field = field_mapping[key]
            
#             # Apply transformations based on field
#             if db_field == 'gender' and isinstance(value, str):
#                 value = value.capitalize()
#             elif db_field == 'price_negotiable' and isinstance(value, str):
#                 # Frontend already sends "Fixed Price" or "Negotiable"
#                 # Just ensure proper capitalization
#                 if value.lower() == 'negotiable':
#                     value = 'Negotiable'
#                 elif value.lower() in ['fixed price', 'fixed']:
#                     value = 'Fixed Price'
            
#             mapped_data[db_field] = convert_value_for_db(db_field, value)
#         else:
#             print(f"⚠️  Unmapped field: {key} with value: {value}")
#             mapped_data[key] = value
    
#     # Set defaults
#     set_default_values(mapped_data)
    
#     return mapped_data


# def convert_value_for_db(field: str, value: Any) -> Any:
#     # Handle date fields - convert to string
#     date_fields = [
#         'available_from', 'date_of_birth', 'signature_date',
#     ]
    
#     if field in date_fields and value is not None:
#         # If it's already a date/datetime object, return as is
#         if hasattr(value, 'date') and callable(getattr(value, 'date')):
#             return value.date() if hasattr(value, 'date') else value
#         # If it's a date object directly
#         elif hasattr(value, 'year') and hasattr(value, 'month') and hasattr(value, 'day'):
#             return value
#         # If it's a string, parse to date object
#         elif isinstance(value, str) and value.strip():
#             try:
#                 # Try YYYY-MM-DD format
#                 from datetime import datetime
#                 return datetime.strptime(value, '%Y-%m-%d').date()
#             except ValueError:
#                 try:
#                     # Try MM/DD/YYYY format
#                     return datetime.strptime(value, '%m/%d/%Y').date()
#                 except ValueError:
#                     # If parsing fails, keep as string (will cause DB error)
#                     return value
#         # Otherwise, return as is
#         else:
#             return value
    
#     # Handle boolean fields
#     boolean_fields = [
#         'declaration_accepted'
#     ]
    
#     if field in boolean_fields:
#         if isinstance(value, str):
#             return value.lower() in ['yes', 'true', '1', 'y']
#         return bool(value)

#     string_yes_no_fields = [
#         'parking', 'pet_friendly', 'terrace_balcony', 'garden_space',
#         'immediate_move_in', 'maintenance_included', 'title_deed_verify',
#         'underconstruction', 'immediate_possession', 'rera_approved',
#         'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed'
#     ]

#     if field in string_yes_no_fields and isinstance(value, str):
#         return value
    
#     # Handle JSONB array fields
#     array_fields = [
#         'preferred_contact_method', 'amenities', 'tenant_type','nearby_places',
#         'nearby_access', 'nearby_connectivity', 'interior_features','appliance_included'
#     ]
    
#     if field in array_fields:
#         if isinstance(value, list):
#             print(f"✅ {field} is already a list: {value}")
#             return value
#         elif isinstance(value, str):
#             return [item.strip() for item in value.split(',') if item.strip()]
    
#     # Handle numeric fields
#     numeric_fields = ['security_deposit', 'price_min', 'price_max']
#     if field in numeric_fields and value is not None:
#         try:
#             if isinstance(value, str):
#                 cleaned = ''.join(c for c in value if c.isdigit() or c == '.')
#                 return float(cleaned) if '.' in cleaned else int(cleaned)
#             elif isinstance(value, (int, float)):
#                 return value
#         except (ValueError, TypeError):
#             return None

#     enum_fields = ['posted_by', 'listing_purpose', 'property_category']
#     if field in enum_fields and isinstance(value, str):
#         return value.upper()
    
#     # Return value as-is if no conversion needed
#     return value


# def set_default_values(data: Dict[str, Any]):
#     """Set default values for missing fields"""
#     defaults = {
#         'property_condition': 'Good',
#         'ownership_type': 'Freehold',
#         'price_negotiable': 'Negotiable'
#     }
    
#     for field, default_value in defaults.items():
#         if field not in data or data[field] is None or data[field] == '':
#             data[field] = default_value
    
#     # Ensure arrays are lists
#     array_fields = ['preferred_contact_method', 'amenities', 'tenant_type']
#     for field in array_fields:
#         if field not in data or data[field] is None:
#             data[field] = []
#         elif isinstance(data[field], str):
#             data[field] = [data[field]]


# # ============================================
# # SINGLE FILE UPLOAD ENDPOINT
# # ============================================

# @router.post("/upload-file")
# async def upload_property_file(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """
#     Upload a single file where the field name is the key and the file is the value.
    
#     Frontend sends: { fieldName: fileObject, property_id: "123" }
#     Example: { profilePhoto: File, coverImage: File, aadhaarCard: File, property_id: "123" }
    
#     The field name tells us what type of file it is and how to process it.
#     property_id is optional - if provided, the file will be associated with that property.
#     """
    
#     # Get the form data
#     form = await request.form()
    
#     # Extract the field name and file from the form
#     # Since it's { field: file }, there will be exactly one key-value pair for the file
#     field = None
#     file = None
#     property_id = None
    
#     for key, value in form.multi_items():
#         if isinstance(value, UploadFile):
#             field = key
#             file = value
#         elif key == 'property_id':
#             property_id = int(value) if value else None
    
#     # Validate that we got a field and file
#     if not field or not file:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid request. Expected { fieldName: File } with optional property_id"
#         )
    
#     # Validate field exists in mappings
#     if field not in FILE_MAPPINGS:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid field '{field}'. Must be one of: {', '.join(FILE_MAPPINGS.keys())}"
#         )
    
#     # Validate property_id if provided
#     if property_id:
#         property_obj = await service.repository.get_property_by_id(property_id)
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#             )
        
#         # Check if user owns this property
#         if property_obj.user_id != current_user.get("user_id"):
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="You don't have permission to upload files for this property"
#             )
    
#     config = FILE_MAPPINGS[field]
#     category = config['category']
#     is_document = config['is_document']
    
#     # Set attributes on file for file_service to use
#     if is_document:
#         doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
#         setattr(file, 'doc_type', doc_type)
#     else:
#         setattr(file, 'field_name', field)
    
#     setattr(file, 'field', field)
#     setattr(file, 'category', category)
#     setattr(file, 'is_document', is_document)
    
#     # Determine if this should be primary (for images)
#     is_primary = field in PRIMARY_IMAGE_FIELDS
    
#     # Upload using service
#     result = await service.upload_single_file(
#         file=file,
#         field=field,
#         category=category,
#         is_document=is_document,
#         is_primary=is_primary,
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
    
#     return strip_none_values({
#         'success': True,
#         'data': result,
#         'message': f'{field} uploaded successfully'
#     })


# # ============================================
# # API ENDPOINTS WITH AUTHENTICATION
# # ============================================

# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_property(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: PropertyService = Depends(get_property_service)
# ):
#     """
#     Create a new property.
#     Requires authentication.
#     """
#     content_type = request.headers.get("content-type", "").lower()
#     data = None

#     if "application/json" in content_type or not content_type:
#         try:
#             data = await request.json()
#         except Exception:
#             data = None

#     if data is None:
#         form = await request.form()
#         if "property_data" in form:
#             raw = form.get("property_data")
#             if isinstance(raw, str):
#                 try:
#                     data = json.loads(raw)
#                 except json.JSONDecodeError as e:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail=f"Invalid JSON in property_data: {str(e)}"
#                     )
#             else:
#                 data = raw
#         else:
#             data = {}
#             for key, value in form.multi_items():
#                 if key in {"images", "video", "documents"}:
#                     continue
#                 if isinstance(value, UploadFile):
#                     continue
#                 if key in data:
#                     current = data[key]
#                     if isinstance(current, list):
#                         current.append(value)
#                     else:
#                         data[key] = [current, value]
#                 else:
#                     data[key] = value

#         # If the frontend sent a plain object without a wrapper, use it directly
#         if not data and len(form) == 1 and "property_data" not in form:
#             try:
#                 data = dict(form)
#             except Exception:
#                 data = {}

#     if data is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="property_data is required"
#         )

#     data['user_id'] = current_user.get("user_id")
#     data = ensure_date_fields_are_date_objects(data)

#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     # Use posted_by directly
#     posted_by = mapped_data.get('posted_by').upper()
    
#     # Validate posted_by
#     valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
#     if posted_by not in valid_posted_by:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
#         )
    
#     # Create property - passing posted_by directly
#     validated = PropertyCreate(
#         posted_by=posted_by,
#         property_data=mapped_data
#     )
    
#     response = await service.create_property(
#         posted_by=validated.posted_by,
#         property_data=validated.property_data,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.get("/")
# async def get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.post("/filter")
# async def filter_properties(
#     filter_data: PropertyFilter,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.filter_properties(filter_data)
#     return strip_none_values(response)


# @router.get("/by-posted-by")
# async def get_properties_by_posted_by(
#     posted_by: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
        
#     response = await service.get_properties_by_posted_by(
#         posted_by=posted_by,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-category")
# async def get_properties_by_category(
#     property_category: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_category(
#         property_category=property_category,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-property-type")
# async def get_properties_by_property_type(
#     property_type: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_property_type(
#         property_type=property_type,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-purpose")
# async def get_properties_by_purpose(
#     listing_purpose: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_purpose(
#         listing_purpose=listing_purpose,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/my-properties")
# async def get_my_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_user(
#         user_id=current_user.get("user_id"),
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/{property_id}")
# async def get_property_by_id(
#     property_id: int,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.get_property_by_id(property_id)
#     return strip_none_values(response)


# @router.put("/{property_id}")
# async def update_property(
#     property_id: int,
#     property_data: str = Form(...),
#     images: Optional[List[UploadFile]] = File(None),
#     video: Optional[UploadFile] = File(None),
#     documents: Optional[List[UploadFile]] = File(None),
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     try:
#         data = json.loads(property_data)
#     except json.JSONDecodeError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid JSON: {str(e)}"
#         )
    
#     # Ensure date fields are date objects
#     data = ensure_date_fields_are_date_objects(data)
    
#     # Extract files from the data
#     files, cleaned_data, file_metadata = extract_files_from_data(data)
    
#     # Map frontend fields to DB fields
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     # Extract status if present
#     status_val = None
#     if 'status' in mapped_data:
#         status_val = mapped_data['status']
#         del mapped_data['status']
    
#     # Add user_id for ownership verification
#     mapped_data['user_id'] = current_user.get("user_id")
    
#     response = await service.update_property(
#         property_id=property_id,
#         update_data=mapped_data,
#         status=status_val,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.delete_property(
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# # ============================================
# # ADMIN ONLY ENDPOINTS
# # ============================================

# @router.get("/admin/all")
# async def admin_get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Dict[str, Any] = Depends(require_admin),
#     service: PropertyService = Depends(get_property_service)
# ):

#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties_admin(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.delete("/admin/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def admin_delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_admin),
#     service: PropertyService = Depends(get_property_service)
# ):

#     response = await service.delete_property_admin(property_id)
#     return strip_none_values(response)











































































# from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import Optional, List, Dict, Any
# import json
# from datetime import date, datetime
# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.services.property_service import PropertyService
# from app.schemas.property import PropertyCreate, PropertyUpdate
# from app.schemas.filter_schemas import PropertyFilter
# from app.core.response_utils import strip_none_values
# from app.core.file_mappings import DOC_TYPE_MAPPING, FILE_MAPPINGS, PRIMARY_IMAGE_FIELDS
# from app.api.dependencies import (
#     get_current_user, 
#     get_current_user_optional,
#     require_authenticated,
#     require_admin,
#     require_vendor
# )
# from app.models.user import UserRole

# router = APIRouter()

# async def get_property_service(db: AsyncSession = Depends(get_db)):
#     repository = PropertyRepository(db)
#     return PropertyService(repository)



# def extract_int(value, default=0):
#     """Safely extract integer from any value"""
#     if value is None:
#         return default
#     if isinstance(value, int):
#         return value
#     if isinstance(value, float):
#         return int(value)
#     try:
#         str_value = str(value).strip()
#         # Extract only digits
#         digits = ''.join(filter(str.isdigit, str_value))
#         return int(digits) if digits else default
#     except (ValueError, TypeError):
#         return default


# def extract_files_from_data(data: Dict[str, Any]) -> tuple:
#     """Extract files from the data object using shared mappings"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
        
#     data = cleaned_data
    
#     files = {
#         'images': [],
#         'documents': [],
#         'video': None,
#         'profile_image': None
#     }
    
#     file_metadata = {}
    
#     print("\n📂 EXTRACTING FILES FROM DATA")
#     print(f"  Available keys: {list(data.keys())}")
    
#     keys_to_process = list(data.keys())
    
#     for field in keys_to_process:
#         if field in FILE_MAPPINGS:
#             config = FILE_MAPPINGS[field]
#             category = config['category']
#             value = data.get(field)
            
#             if value is not None:
#                 print(f"  📁 Processing: {field} (type: {type(value).__name__})")
                
#                 doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
                
#                 if isinstance(value, list):
#                     print(f"    - Found {len(value)} files")
#                     for idx, file_obj in enumerate(value):
#                         if hasattr(file_obj, 'file') or isinstance(file_obj, UploadFile):
#                             if hasattr(file_obj, 'file'):
#                                 file_obj.doc_type = doc_type
#                                 file_obj.field_name = field
#                             elif isinstance(file_obj, UploadFile):
#                                 setattr(file_obj, 'doc_type', doc_type)
#                                 setattr(file_obj, 'field_name', field)
                            
#                             if config['is_document']:
#                                 files['documents'].append(file_obj)
#                                 print(f"      - Added document: {getattr(file_obj, 'filename', 'unknown')} as {doc_type}")
#                             elif category == 'images':
#                                 files['images'].append(file_obj)
#                                 print(f"      - Added image: {getattr(file_obj, 'filename', 'unknown')}")
                            
#                             file_metadata[f"{field}_{idx}"] = {
#                                 'doc_type': doc_type,
#                                 'field': field,
#                                 'category': category,
#                                 'index': idx
#                             }
                
#                 elif hasattr(value, 'file') or isinstance(value, UploadFile):
#                     print(f"    - Single file: {getattr(value, 'filename', 'unknown')}")
                    
#                     if hasattr(value, 'file'):
#                         value.doc_type = doc_type
#                         value.field_name = field
#                     elif isinstance(value, UploadFile):
#                         setattr(value, 'doc_type', doc_type)
#                         setattr(value, 'field_name', field)
                    
#                     if category == 'video':
#                         files['video'] = value
#                         print(f"      - Added video")
#                     elif category == 'profile_image':
#                         files['profile_image'] = value
#                         print(f"      - Added profile image")
#                     elif category == 'images':
#                         files['images'].append(value)
#                         print(f"      - Added image")
#                     elif category == 'documents':
#                         files['documents'].append(value)
#                         print(f"      - Added document as {doc_type}")
                    
#                     file_metadata[field] = {
#                         'doc_type': doc_type,
#                         'field': field,
#                         'category': category
#                     }
                
#                 del data[field]
    
#     return files, data, file_metadata


# def ensure_date_fields_are_date_objects(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Ensure date fields are properly converted to date objects"""
#     date_fields = ['availableFrom', 'dateOfBirth', 'signatureDate', 'availableTo']
    
#     for field in date_fields:
#         if field in data and data[field] is not None:
#             value = data[field]
            
#             if hasattr(value, 'date') and callable(getattr(value, 'date')):
#                 data[field] = value.date() if hasattr(value, 'date') else value
#                 continue
            
#             if isinstance(value, str) and value.strip():
#                 try:
#                     data[field] = datetime.strptime(value, '%Y-%m-%d').date()
#                 except ValueError:
#                     try:
#                         data[field] = datetime.strptime(value, '%m/%d/%Y').date()
#                     except ValueError:
#                         pass
    
#     return data


# def map_frontend_to_db_fields(data: Dict[str, Any]) -> Dict[str, Any]:
#     """Map frontend field names to database field names"""
#     cleaned_data = {}
#     for key, value in data.items():
#         clean_key = key.replace('[]', '')
#         cleaned_data[clean_key] = value
    
#     data = cleaned_data
#     data = ensure_date_fields_are_date_objects(data)
    
#     field_mapping = {
#         # Owner/User Info
#         'ownerName': 'owner_name',
#         'contactNumber': 'mobile',
#         'emailId': 'email_id',
#         'addressLine1': 'address_line1',
#         'addressLine2': 'address_line2',
#         'ownerCity': 'owner_city',
#         'ownerState': 'owner_state',
#         'ownerPinCode': 'owner_pin_code',
#         'dateOfBirth': 'date_of_birth',
#         'gender': 'gender',
#         'aadhaarNumber': 'aadhaar_number',
#         'panNumber': 'pan_number',
#         'preferredContactMethod': 'preferred_contact_method',
#         'preferredContactTime': 'preferred_contact_time',


#         'agentName':'agent_name',
#         'agencyName':'agency_name',
#         'mobileNumber':'mobile',
#         'officeAddress':'office_address',
#         'reraNumber':'rera_registration_number',
#         'activeListings':'active_listing',
#         'gstNumber':'gst_number',
#         'serviceAreas':'service_area',
#         'yearsExperience':'experience',

        
#         # Bank Details
#         'accountHolderName': 'account_holder_name',
#         'accountNumber': 'account_number',
#         'bankName': 'bank_name',
#         'ifscCode': 'ifsc_code',
#         'upiId': 'upi_id',
        
#         # Declaration
#         'signatureDate': 'signature_date',
#         'signaturePlace': 'signature_place',
#         'declarationAccepted': 'declaration_accepted',
        
#         # Property Basic Info
#         'propertyCategory': 'property_category',
#         'listingPurpose': 'listing_purpose',
#         'postedBy': 'posted_by',
#         'propertyTitle': 'property_title',
#         'propertyType': 'property_type',
        
#         # Property Details
#         'bedrooms': 'bedrooms',
#         'bathrooms': 'bathrooms',
#         'builtUpArea': 'built_up_area',
#         'carpetArea': 'carpet_area',
#         'furnishingStatus': 'furnishing_status',
#         'gardenSpace': 'garden_space',
#         'terrace': 'terrace',
        
#         # Location
#         'propertyAddress': 'address',
#         'area': 'area',
#         'propertyCity': 'city',
#         'district': 'district',
#         'state': 'state',
#         'pinCode': 'pin_code',
#         'landmark': 'landmark',
        
#         # Features & Amenities
#         'parking': 'parking',
#         'petFriendly': 'pet_friendly',
#         'selectedAmenities': 'amenities',
        
#         # Availability
#         'availableFrom': 'available_from',
#         'rentalDuration': 'minimum_rental_duration',
#         'immediateMoveIn': 'immediate_move_in',
        
#         # Pricing
#         'expectedPrice': 'expected_price',
#         'priceType': 'price_negotiable',
#         'securityDeposit': 'security_deposit',
#         'maintenance': 'maintenance_amount',
        
#         # Tenant Preferences
#         'occupancyDetails': 'tenant_type',
#         'tenantType': 'tenant_type',
#         'smokingAllowed': 'smoking_allowed',
#         'dietaryPreference': 'dietary_preference',
        
#         # Property Condition
#         'propertyCondition': 'property_condition',
#         'ownershipType': 'ownership_type',
#         'loanOutstanding': 'loan_outstanding',
        
#         # Sell-specific
#         'propertyTax': 'property_tax',
#         'titleDeedVerify': 'title_deed_verify',
#         'underconstruction': 'underconstruction',
#         'immediatePossession': 'immediate_possession',
#         'reraApproved': 'rera_approved',
#         'loanEligible': 'loan_eligible',
        
#         # Additional
#         'floorNumber': 'floor_number',
#         'totalFloors': 'total_floors',
#         'propertyAge': 'property_age',
#         'cornerUnit': 'corner_unit',
#         'facingDirection': 'facing_direction',
#         'maintenanceIncluded': 'maintenance_included',
#         'commercialType': 'commercial_type',
#         'businessType': 'business_type',
#         'estimatedFootfall': 'estimated_footfall',
#         'operatingHours': 'operating_hours',
#         'leaseType': 'lease_type',
#         'leaseTerm': 'lease_term',
#         'leaseRenewable': 'lease_renewable',
#         'zoningType': 'zoning_type',
#         'fitOut': 'fit_out',
#         'ceilingHeight': 'ceiling_height',
#         'frontageWidth': 'frontage_width',
#         'powerLoadCapacity': 'power_load_capacity',
#         'nearbyPlaces': 'nearby_places',
#         'parkingCapacity': 'parking_capacity',
#         'balcony': 'balcony',
#         'interiorFeatures': 'interior_features',
#         'applianceIncluded': 'appliance_included'
#     }

#     integer_fields = [
#         'yearsExperience',    
#         'activeListings',     
#     ]
    
#     for field in integer_fields:
#         if field in data and data[field] is not None:
#             data[field] = extract_int(data[field])
    
#     if 'budgetRange[min]' in data:
#         data['budgetRange'] = {
#             'min': data.get('budgetRange[min]'),
#             'max': data.get('budgetRange[max]')
#         }
#         data['price_min'] = data['budgetRange']['min']
#         data['price_max'] = data['budgetRange']['max']
#         del data['budgetRange[min]']
#         del data['budgetRange[max]']


#     data['yearsExperience'] = int(data['yearsExperience'])

    
#     mapped_data = {}
#     for key, value in data.items():
#         print(f"\n Mapping field: {key} with value: {value}")
#         if key in field_mapping:
#             db_field = field_mapping[key]
            
#             if db_field == 'gender' and isinstance(value, str):
#                 value = value.capitalize()
#             elif db_field == 'price_negotiable' and isinstance(value, str):
#                 if value.lower() == 'negotiable':
#                     value = 'Negotiable'
#                 elif value.lower() in ['fixed price', 'fixed']:
#                     value = 'Fixed Price'
            
#             mapped_data[db_field] = convert_value_for_db(db_field, value)
#         else:
#             print(f"⚠️  Unmapped field: {key} with value: {value}")
#             mapped_data[key] = value
    
#     set_default_values(mapped_data)
    
#     return mapped_data


# def convert_value_for_db(field: str, value: Any) -> Any:
#     """Convert values to appropriate database types"""
#     # Handle date fields
#     date_fields = [
#         'available_from', 'date_of_birth', 'signature_date',
#     ]
    
#     if field in date_fields and value is not None:
#         if hasattr(value, 'date') and callable(getattr(value, 'date')):
#             return value.date() if hasattr(value, 'date') else value
#         elif hasattr(value, 'year') and hasattr(value, 'month') and hasattr(value, 'day'):
#             return value
#         elif isinstance(value, str) and value.strip():
#             try:
#                 from datetime import datetime
#                 return datetime.strptime(value, '%Y-%m-%d').date()
#             except ValueError:
#                 try:
#                     return datetime.strptime(value, '%m/%d/%Y').date()
#                 except ValueError:
#                     return value
#         else:
#             return value
    
#     # Handle boolean fields
#     boolean_fields = ['declaration_accepted']
    
#     if field in boolean_fields:
#         if isinstance(value, str):
#             return value.lower() in ['yes', 'true', '1', 'y']
#         return bool(value)

#     # Handle Yes/No string fields
#     string_yes_no_fields = [
#         'parking', 'pet_friendly', 'terrace_balcony', 'garden_space',
#         'immediate_move_in', 'maintenance_included', 'title_deed_verify',
#         'underconstruction', 'immediate_possession', 'rera_approved',
#         'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed'
#     ]

#     if field in string_yes_no_fields and isinstance(value, str):
#         return value
    
#     # Handle JSONB array fields
#     array_fields = [
#         'preferred_contact_method', 'amenities', 'tenant_type', 'nearby_places',
#         'nearby_access', 'nearby_connectivity', 'interior_features', 'appliance_included'
#     ]
    
#     if field in array_fields:
#         if isinstance(value, list):
#             return value
#         elif isinstance(value, str):
#             return [item.strip() for item in value.split(',') if item.strip()]
    
#     # Handle numeric fields
#     numeric_fields = ['security_deposit', 'price_min', 'price_max']
#     if field in numeric_fields and value is not None:
#         try:
#             if isinstance(value, str):
#                 cleaned = ''.join(c for c in value if c.isdigit() or c == '.')
#                 return float(cleaned) if '.' in cleaned else int(cleaned)
#             elif isinstance(value, (int, float)):
#                 return value
#         except (ValueError, TypeError):
#             return None

#     # Handle enum fields
#     enum_fields = ['posted_by', 'listing_purpose', 'property_category']
#     if field in enum_fields and isinstance(value, str):
#         return value.upper()
    
#     return value


# def set_default_values(data: Dict[str, Any]):
#     """Set default values for missing fields"""
#     defaults = {
#         'property_condition': 'Good',
#         'ownership_type': 'Freehold',
#         'price_negotiable': 'Negotiable'
#     }
    
#     for field, default_value in defaults.items():
#         if field not in data or data[field] is None or data[field] == '':
#             data[field] = default_value
    
#     array_fields = ['preferred_contact_method', 'amenities', 'tenant_type']
#     for field in array_fields:
#         if field not in data or data[field] is None:
#             data[field] = []
#         elif isinstance(data[field], str):
#             data[field] = [data[field]]


# # ============================================
# # API ENDPOINTS WITH AUTHENTICATION
# # ============================================

# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_property(
#     request: Request,
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: PropertyService = Depends(get_property_service)
# ):
#     content_type = request.headers.get("content-type", "").lower()
#     data = None

#     if "application/json" in content_type or not content_type:
#         try:
#             data = await request.json()
#         except Exception:
#             data = None

#     if data is None:
#         form = await request.form()
#         if "property_data" in form:
#             raw = form.get("property_data")
#             if isinstance(raw, str):
#                 try:
#                     data = json.loads(raw)
#                 except json.JSONDecodeError as e:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail=f"Invalid JSON in property_data: {str(e)}"
#                     )
#             else:
#                 data = raw
#         else:
#             data = {}
#             for key, value in form.multi_items():
#                 if key in {"images", "video", "documents"}:
#                     continue
#                 if isinstance(value, UploadFile):
#                     continue
#                 if key in data:
#                     current = data[key]
#                     if isinstance(current, list):
#                         current.append(value)
#                     else:
#                         data[key] = [current, value]
#                 else:
#                     data[key] = value

#         if not data and len(form) == 1 and "property_data" not in form:
#             try:
#                 data = dict(form)
#             except Exception:
#                 data = {}

#     if data is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="property_data is required"
#         )

#     data['user_id'] = current_user.get("user_id")
#     data = ensure_date_fields_are_date_objects(data)

#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     posted_by = mapped_data.get('posted_by').upper()
    
#     valid_posted_by = ['OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT']
#     if posted_by not in valid_posted_by:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid posted_by. Must be one of: {', '.join(valid_posted_by)}"
#         )
    
#     validated = PropertyCreate(
#         posted_by=posted_by,
#         property_data=mapped_data
#     )
    
#     response = await service.create_property(
#         posted_by=validated.posted_by,
#         property_data=validated.property_data,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.get("/")
# async def get_all_properties(
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_all_properties(
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# # @router.post("/filter")
# # async def filter_properties(
# #     filter_data: PropertyFilter,
# #     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
# #     service: PropertyService = Depends(get_property_service)
# # ):
# #     response = await service.filter_properties(filter_data)
# #     return strip_none_values(response)


# @router.get("/by-posted-by")
# async def get_properties_by_posted_by(
#     posted_by: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
        
#     response = await service.get_properties_by_posted_by(
#         posted_by=posted_by,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-category")
# async def get_properties_by_category(
#     property_category: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_category(
#         property_category=property_category,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-property-type")
# async def get_properties_by_property_type(
#     property_type: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_property_type(
#         property_type=property_type,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)


# @router.get("/by-purpose")
# async def get_properties_by_purpose(
#     listing_purpose: str,
#     page: int = 1,
#     limit: int = 20,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     if page < 1:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Page must be greater than 0"
#         )
    
#     if limit < 1 or limit > 100:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Limit must be between 1 and 100"
#         )
    
#     skip = (page - 1) * limit
    
#     response = await service.get_properties_by_purpose(
#         listing_purpose=listing_purpose,
#         skip=skip,
#         limit=limit
#     )
#     return strip_none_values(response)




# @router.get("/{property_id}")
# async def get_property_by_id(
#     property_id: int,
#     current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
#     service: PropertyService = Depends(get_property_service)
# ):
#     response = await service.get_property_by_id(property_id)
#     return strip_none_values(response)


# @router.put("/{property_id}")
# async def update_property(
#     property_id: int,
#     property_data: str = Form(...),
#     images: Optional[List[UploadFile]] = File(None),
#     video: Optional[UploadFile] = File(None),
#     documents: Optional[List[UploadFile]] = File(None),
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     try:
#         data = json.loads(property_data)
#     except json.JSONDecodeError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Invalid JSON: {str(e)}"
#         )
    
#     data = ensure_date_fields_are_date_objects(data)
    
#     files, cleaned_data, file_metadata = extract_files_from_data(data)
#     mapped_data = map_frontend_to_db_fields(cleaned_data)
    
#     status_val = None
#     if 'status' in mapped_data:
#         status_val = mapped_data['status']
#         del mapped_data['status']
    
#     mapped_data['user_id'] = current_user.get("user_id")
    
#     response = await service.update_property(
#         property_id=property_id,
#         update_data=mapped_data,
#         status=status_val,
#         images=files['images'] if files['images'] else None,
#         video=files['video'],
#         documents=files['documents'] if files['documents'] else None,
#         file_metadata=file_metadata,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)


# @router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_property(
#     property_id: int,
#     current_user: Dict[str, Any] = Depends(require_authenticated),
#     service: PropertyService = Depends(get_property_service)
# ):
#     response = await service.delete_property(
#         property_id=property_id,
#         user_id=current_user.get("user_id")
#     )
#     return strip_none_values(response)

