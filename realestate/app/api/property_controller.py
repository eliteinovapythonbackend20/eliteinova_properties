from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Path, Request
from typing import Optional, List, Dict, Any
import json

from app.schemas.property_request import PropertyCreateMultipart, PropertyUpdateMultipart
from app.schemas.property_response import PropertyResponse, PropertyListResponse, PropertyMediaResponse, PropertyDocumentResponse
from app.schemas.property_error import PropertyError
from app.services.property_service import PropertyService
from app.services.field_mapping_service import FieldMappingService
from app.services.file_extraction_service import FileExtractionService
from app.api.dependencies import (
    require_vendor,
    require_authenticated,
    get_current_user_optional,
    get_property_service,
    get_filter_service,
)
from app.core.config import settings
from app.core.response_utils import strip_none_values
from app.schemas.property_filter import PropertyFilter
from app.services.filter_service import FilterService

router = APIRouter()

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

@router.get("/documents/{document_id}/view-url")
async def get_document_view_url(
    document_id: int,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service),
):
    """Generate a fresh, short-lived signed URL to view a private document.

    Minted only on this call - never in advance, never on listing/property
    load, never persisted. Authorized for: admin, the document's own
    owner/uploader, or a user explicitly granted access to the property
    (PropertySharedAccess) - all resolved from the DB, never from anything
    the client claims.
    """
    try:
        view_url = await service.get_document_view_url(document_id, current_user)
        return {
            "success": True,
            "data": {
                "viewUrl": view_url,
                "expiresInSeconds": settings.PRIVATE_DOCUMENT_SIGNED_URL_EXPIRE_SECONDS,
            },
        }
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate document view URL: {str(e)}"
        )


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
    profile_photo: Optional[UploadFile] = File(None),
    company_logo: Optional[UploadFile] = File(None),
    agency_logo: Optional[UploadFile] = File(None),
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
    # Lister photo / logos: each maps to its own column on the role detail table
    # (profile_photo_url / company_logo_url / agency_logo_url) via the existing
    # vendor-profile-image handling - they are neither property images nor documents.
    if profile_photo:
        data['profilePhoto'] = profile_photo
    if company_logo:
        data['companyLogo'] = company_logo
    if agency_logo:
        data['agencyLogo'] = agency_logo

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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    profile_photo: Optional[UploadFile] = File(None),
    company_logo: Optional[UploadFile] = File(None),
    agency_logo: Optional[UploadFile] = File(None),
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
    # Lister photo / logos: each maps to its own column on the role detail table
    # (profile_photo_url / company_logo_url / agency_logo_url) via the existing
    # vendor-profile-image handling - they are neither property images nor documents.
    if profile_photo:
        data['profilePhoto'] = profile_photo
    if company_logo:
        data['companyLogo'] = company_logo
    if agency_logo:
        data['agencyLogo'] = agency_logo

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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    property_id: str = Form(...),
    image: UploadFile = File(...),
    field_name: str = Form("profilePhoto"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Update this listing's poster-photo

    - **property_id**: Which listing this photo is for (a vendor with
      multiple listings can have a different photo per listing)
    - **image**: Profile image file
    - **field_name**: Type of image (profilePhoto, agencyLogo, companyLogo)
    - Updates the vendor's profile image on this property's details row
    """
    try:
        result = await service.update_vendor_profile_image(
            user_id=current_user.get("user_id"),
            property_id=property_id,
            image=image,
            field_name=field_name
        )
        return strip_none_values(result)
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile image: {str(e)}"
        )

@router.delete("/vendor/profile-image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor_profile_image(
    property_id: str = Form(...),
    field_name: str = Form("profilePhoto"),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete this listing's poster-photo

    - **property_id**: Which listing this photo is for
    - **field_name**: Type of image to delete (profilePhoto, agencyLogo, companyLogo)
    """
    try:
        await service.delete_vendor_profile_image(
            user_id=current_user.get("user_id"),
            property_id=property_id,
            field_name=field_name
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch vendor documents: {str(e)}"
        )