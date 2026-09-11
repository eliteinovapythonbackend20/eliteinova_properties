# app/api/profile_controller.py
from enum import Enum
import json
from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, UploadFile, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.property_repository import PropertyRepository
from app.services.profile_service import ProfileService, get_profile_service
from app.core.response_utils import strip_none_values
from app.core.file_mappings import DOC_TYPE_MAPPING, FILE_MAPPINGS, PRIMARY_IMAGE_FIELDS
from app.api.dependencies import require_authenticated, require_vendor
from app.models.property import PropertyStatus
from app.services.field_mapping_service import FieldMappingService
from app.services.file_extraction_service import FileExtractionService

router = APIRouter()

class VendorType(str, Enum):
    OWNER = "owner"
    AGENT = "agent"
    BUILDER = "builder"
    PROPERTY_MANAGEMENT = "property-management"


def _assert_role_matches(current_user: Dict[str, Any], vendor_type: VendorType) -> None:
   
    vendor_types = current_user.get("vendor_types") or []
    
    normalized_roles = {
        str(role).strip().lower().replace("_", "-") for role in vendor_types
    }

    if vendor_type.value not in normalized_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account is not registered as a '{vendor_type.value}' vendor.",
        )



@router.get("/{vendor_type}")
async def get_vendor_profile(
    vendor_type: VendorType,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    # _assert_role_matches(current_user, vendor_type)
    vendor_type = vendor_type
    user_id = current_user.get("user_id")
    profile  = await service.get_vendor_profile(user_id)
    email = current_user.get("user").email
    user = {"emailAddress":email}
    profile.update(user)
    properties = await service.get_vendor_properties(user_id, vendor_type)
    return strip_none_values({"success": True, "profile": profile, "properties":properties})


@router.put("/{vendor_type}")
async def update_vendor_profile(
    vendor_type: VendorType,
    update_data: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.update_vendor_profile(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        update_data=update_data,
    )
    return strip_none_values({"success": True, "data": data, "message": "Profile updated successfully"})


@router.post("/{vendor_type}/photo")
async def upload_vendor_profile_photo(
    vendor_type: VendorType,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_profile_photo(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        file=file,
    )
    return strip_none_values({"success": True, "data": data, "message": "Profile photo uploaded successfully"})


@router.delete("/{vendor_type}/photo")
async def delete_vendor_profile_photo(
    vendor_type: VendorType,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_profile_photo(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
    )
    return strip_none_values({"success": True, "data": data, "message": "Profile photo deleted"})


@router.post("/{vendor_type}/logo")
async def upload_vendor_logo(
    vendor_type: VendorType,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_logo(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        file=file,
    )
    return strip_none_values({"success": True, "data": data, "message": "Logo uploaded successfully"})


@router.delete("/{vendor_type}/logo")
async def delete_vendor_logo(
    vendor_type: VendorType,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_logo(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
    )
    return strip_none_values({"success": True, "data": data, "message": "Logo deleted"})



@router.get("/{vendor_type}/properties")
async def get_vendor_properties(
    vendor_type: VendorType,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    skip = (page - 1) * limit
    data = await service.get_vendor_properties(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        skip=skip,
        limit=limit,
        status=status_filter,
    )
    return strip_none_values(data)


@router.get("/{vendor_type}/properties/search")
async def search_vendor_properties(
    vendor_type: VendorType,
    q: Optional[str] = Query(None, description="Keyword to search title/city/area/address"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    skip = (page - 1) * limit
    data = await service.search_vendor_properties(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        keyword=q,
        skip=skip,
        limit=limit,
    )
    return strip_none_values(data)


@router.get("/{vendor_type}/properties/{property_id}")
async def get_vendor_property_detail(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.get_vendor_property_detail(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
    )
    return strip_none_values({"success": True, "data": data})


# @router.put("/{vendor_type}/properties/{property_id}")
# async def update_vendor_property(
#     vendor_type: VendorType,
#     property_id: str,
#     update_data: Dict[str, Any] = Body(...),
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: ProfileService = Depends(get_profile_service),
# ):
#     # _assert_role_matches(current_user, vendor_type)
#     data = await service.update_vendor_property(
#         user_id=current_user.get("user_id"),
#         vendor_type=vendor_type.value,
#         property_id=property_id,
#         update_data=update_data,
#     )
#     return strip_none_values({"success": True, "data": data, "message": "Property updated successfully"})



@router.put("/{vendor_type}/properties/{property_id}")
async def update_vendor_property(
    vendor_type: VendorType,
    property_id: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    content_type = request.headers.get("content-type", "").lower()
    data = None

    # Parse request data (supports both JSON and FormData)
    if "application/json" in content_type or not content_type:
        try:
            data = await request.json()
        except Exception:
            data = None

    if data is None:
        form = await request.form()
        if "property_data" in form:
            raw = form.get("property_data")
            if isinstance(raw, str):
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid JSON in property_data: {str(e)}"
                    )
            else:
                data = raw
        else:
            data = {}
            for key, value in form.multi_items():
                if key in {"images", "video", "documents"}:
                    continue
                if isinstance(value, UploadFile):
                    continue
                if key in data:
                    current = data[key]
                    if isinstance(current, list):
                        current.append(value)
                    else:
                        data[key] = [current, value]
                else:
                    data[key] = value

        if not data and len(form) == 1 and "property_data" not in form:
            try:
                data = dict(form)
            except Exception:
                data = {}

    if data is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="property_data is required"
        )

    separated_files, cleaned_data, file_metadata = FileExtractionService().extract_and_separate_files(data)

    mapped_data = FieldMappingService().map_frontend_to_db_fields(cleaned_data)

    result = await service.update_vendor_property_with_files(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        update_data=mapped_data,
        separated_files=separated_files,
        file_metadata=file_metadata,
    )
    
    return strip_none_values({"success": True, "data": result, "message": "Property updated successfully"})




@router.delete("/{vendor_type}/properties/{property_id}")
async def delete_vendor_property(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_property(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
    )
    return strip_none_values({"success": True, "data": data, "message": "Property deleted successfully"})


# In profile_controller.py
@router.patch("/{vendor_type}/properties/{property_id}/status")
async def update_vendor_property_status(
    vendor_type: VendorType,
    property_id: str,
    new_status: str = Body(..., embed=True, alias="status"),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    status_upper = new_status.upper()
    
    if status_upper not in ["ACTIVE", "INACTIVE"]:
        raise HTTPException(400, f"Invalid status: {new_status}. Allowed: ACTIVE, INACTIVE")
    
    data = await service.update_vendor_property_status(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        new_status=status_upper,
    )
    return strip_none_values({"success": True, "data": data, "message": "Status updated successfully"})

@router.post("/{vendor_type}/properties/{property_id}/images")
async def upload_vendor_property_image(
    vendor_type: VendorType,
    property_id: str,
    request: Request,
    order: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_property_image(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        file=file,
        order=order,
    )
    return strip_none_values({"success": True, "data": data, "message": "Image uploaded successfully"})


@router.delete("/{vendor_type}/properties/{property_id}/images/{image_index}")
async def delete_vendor_property_image(
    vendor_type: VendorType,
    property_id: str,
    image_index: int,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_property_image(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        image_index=image_index,
    )
    return strip_none_values({"success": True, "data": data, "message": "Image deleted successfully"})


@router.post("/{vendor_type}/properties/{property_id}/cover")
async def set_vendor_property_cover(
    vendor_type: VendorType,
    property_id: str,
    media_id: int = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.set_vendor_property_cover(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        media_id=media_id,
    )
    return strip_none_values({"success": True, "data": data, "message": "Cover image updated"})


@router.post("/{vendor_type}/properties/{property_id}/video")
async def upload_vendor_property_video(
    vendor_type: VendorType,
    property_id: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_property_video(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
        file=file,
    )
    return strip_none_values({"success": True, "data": data, "message": "Video uploaded successfully"})


@router.delete("/{vendor_type}/properties/{property_id}/video")
async def delete_vendor_property_video(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_property_video(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        property_id=property_id,
    )
    return strip_none_values({"success": True, "data": data, "message": "Video deleted successfully"})


@router.post("/{vendor_type}/documents/{doc_type}")
async def upload_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_document(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        doc_type=doc_type,
        file=file,
    )
    return strip_none_values({"success": True, "data": data, "message": f"{doc_type} uploaded successfully"})


@router.get("/{vendor_type}/documents/{doc_type}")
async def get_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.get_vendor_document(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        doc_type=doc_type,
    )
    return strip_none_values({"success": True, "data": data})


@router.delete("/{vendor_type}/documents/{doc_type}")
async def delete_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    _assert_role_matches(current_user, vendor_type)
    data = await service.delete_vendor_document(
        user_id=current_user.get("user_id"),
        vendor_type=vendor_type.value,
        doc_type=doc_type,
    )
    return strip_none_values({"success": True, "data": data, "message": f"{doc_type} deleted successfully"})


async def _get_single_file_from_form(request: Request) -> UploadFile:
    form = await request.form()
    for _key, value in form.multi_items():
        if isinstance(value, UploadFile):
            return value
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid request. Expected multipart form data containing a file.",
    )


@router.post("/upload-profile-file")
async def upload_profile_file(
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service)
):
    form = await request.form()

    field = None
    file = None

    for key, value in form.multi_items():
        if isinstance(value, UploadFile):
            field = key
            file = value

    if not field or not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request. Expected { fieldName: File }"
        )

    profile_fields = [
        'profilePhoto', 'agencyLogo', 'companyLogo', 'passportPhoto'
    ]

    if field not in profile_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid profile field '{field}'. Must be one of: {', '.join(profile_fields)}"
        )

    if field not in FILE_MAPPINGS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Field '{field}' not found in mappings"
        )

    config = FILE_MAPPINGS[field]
    category = config['category']
    is_document = config['is_document']

    if is_document:
        doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
        setattr(file, 'doc_type', doc_type)
    else:
        setattr(file, 'field_name', field)

    setattr(file, 'field', field)
    setattr(file, 'category', category)
    setattr(file, 'is_document', is_document)

    is_primary = field in PRIMARY_IMAGE_FIELDS

    result = await service.upload_single_file(
        file=file,
        field=field,
        category=category,
        is_document=is_document,
        is_primary=is_primary,
        property_id=None,
        user_id=current_user.get("user_id"),
    )

    return strip_none_values({
        'success': True,
        'data': result,
        'message': f'{field} uploaded successfully'
    })


@router.post("/upload/file")
async def upload_file(
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service)
):
    form = await request.form()

    field = None
    file = None
    property_id = form.get("propertyId")

    for key, value in form.multi_items():
        if isinstance(value, UploadFile):
            field = key
            file = value

    if not field or not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request. Expected { fieldName: File }"
        )
    if field not in FILE_MAPPINGS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Field '{field}' not found in mappings"
        )

    config = FILE_MAPPINGS[field]
    category = config['category']
    is_document = config['is_document']

    if is_document:
        doc_type = DOC_TYPE_MAPPING.get(field, 'other_supporting_document')
        setattr(file, 'doc_type', doc_type)
    else:
        setattr(file, 'field_name', field)

    setattr(file, 'field', field)
    setattr(file, 'category', category)
    setattr(file, 'is_document', is_document)

    is_primary = field in PRIMARY_IMAGE_FIELDS

    result = await service.upload_single_file(
        file=file,
        field=field,
        category=category,
        is_document=is_document,
        is_primary=is_primary,
        property_id=property_id,
        user_id=current_user.get("user_id"),
    )
    return strip_none_values({
        'success': True,
        'data': result,
        'message': f'{field} uploaded successfully'
    })


@router.get("/profile-files")
async def get_profile_files(
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service)
):
    files = await service.get_user_profile_files(current_user.get("user_id"))
    return strip_none_values({
        'success': True,
        'data': files
    })


@router.delete("/profile-file/{file_path:path}")
async def delete_profile_file(
    file_path: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service)
):
    await service.delete_profile_file(
        file_path=file_path,
        user_id=current_user.get("user_id")
    )
    return strip_none_values({
        'success': True,
        'message': 'File deleted successfully'
    })


