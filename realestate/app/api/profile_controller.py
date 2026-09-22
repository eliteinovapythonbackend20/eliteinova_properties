# app/api/profile_controller.py
from enum import Enum
import json
from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, UploadFile, status, Request
from starlette.datastructures import UploadFile as StarletteUploadFile

from app.services.profile_service import ProfileService, VENDOR_TYPE_MAP
from app.services.property_service import PropertyService
from app.schemas.property_error import PropertyError
from app.core.response_utils import strip_none_values
from app.core.file_mappings import DOC_TYPE_MAPPING, FILE_MAPPINGS, PRIMARY_IMAGE_FIELDS
from app.api.dependencies import require_authenticated, require_vendor, get_property_service, get_profile_service
from app.models.property import PropertyStatus
from app.services.field_mapping_service import FieldMappingService
from app.services.file_extraction_service import FileExtractionService

router = APIRouter()

class VendorType(str, Enum):
    OWNER = "owner"
    AGENT = "agent"
    BUILDER = "builder"
    PROPERTY_MANAGEMENT = "property-management"


@router.get("/{vendor_type}")
async def get_vendor_profile(
    vendor_type: VendorType,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    user_id = current_user.get("user_id")
    profile  = await service.get_vendor_profile(user_id, vendor_type.value)
    email = current_user.get("user").email
    user = {"emailAddress":email}
    profile.update(user)

    posted_by = service.resolve_vendor_type(vendor_type.value)
    properties, total_count = await property_service.get_properties_by_user_and_role(
        user_id=user_id, posted_by=posted_by
    )
    properties_payload = service.format_property_list(properties, total_count, skip=0, limit=20)
    return strip_none_values({"success": True, "profile": profile, "properties": properties_payload})


@router.put("/{vendor_type}")
async def update_vendor_profile(
    vendor_type: VendorType,
    update_data: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
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
    property_service: PropertyService = Depends(get_property_service),
):
    skip = (page - 1) * limit
    posted_by = service.resolve_vendor_type(vendor_type.value)
    properties, total_count = await property_service.get_properties_by_user_and_role(
        user_id=current_user.get("user_id"), posted_by=posted_by, skip=skip, limit=limit, status=status_filter
    )
    data = service.format_property_list(properties, total_count, skip=skip, limit=limit)
    return strip_none_values(data)


@router.get("/{vendor_type}/properties/search")
async def search_vendor_properties(
    vendor_type: VendorType,
    q: Optional[str] = Query(None, description="Keyword to search title/city/area/address"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    skip = (page - 1) * limit
    posted_by = service.resolve_vendor_type(vendor_type.value)
    properties, total_count = await property_service.search_user_properties(
        user_id=current_user.get("user_id"), posted_by=posted_by, keyword=q, skip=skip, limit=limit
    )
    data = service.format_property_list(properties, total_count, skip=skip, limit=limit)
    return strip_none_values(data)


@router.get("/{vendor_type}/properties/{property_id}")
async def get_vendor_property_detail(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)
    full_prop = await property_service.get_property_with_relations_raw(property_id)
    data = service.to_response(full_prop)
    return strip_none_values({"success": True, "data": data})


# @router.put("/{vendor_type}/properties/{property_id}")
# async def update_vendor_property(
#     vendor_type: VendorType,
#     property_id: str,
#     update_data: Dict[str, Any] = Body(...),
#     current_user: Dict[str, Any] = Depends(require_vendor),
#     service: ProfileService = Depends(get_profile_service),
# ):
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
    property_service: PropertyService = Depends(get_property_service),
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

    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    try:
        await property_service.update_property(
            property_id=property_id,
            update_data=mapped_data,
            separated_files=separated_files,
            file_metadata=file_metadata,
            user_id=current_user.get("user_id"),
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update property: {str(e)}"
        )

    updated_property = await property_service.get_property_with_relations_raw(property_id)
    result = service.to_response(updated_property)
    return strip_none_values({"success": True, "data": result, "message": "Property updated successfully"})


@router.delete("/{vendor_type}/properties/{property_id}")
async def delete_vendor_property(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    try:
        await property_service.delete_property(property_id=property_id, user_id=current_user.get("user_id"))
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    return strip_none_values({"success": True, "data": {"deleted": True}, "message": "Property deleted successfully"})


@router.patch("/{vendor_type}/properties/{property_id}/status")
async def update_vendor_property_status(
    vendor_type: VendorType,
    property_id: str,
    new_status: str = Body(..., embed=True, alias="status"),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    status_upper = new_status.upper()

    if status_upper not in ["ACTIVE", "INACTIVE"]:
        raise HTTPException(400, f"Invalid status: {new_status}. Allowed: ACTIVE, INACTIVE")

    canonical_status = (
        PropertyStatus.ACTIVE.value if status_upper == "ACTIVE" else PropertyStatus.INACTIVE.value
    )

    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    updated = await property_service.update_property_status(property_id, canonical_status)
    data = {"id": updated.id, "propertyStatus": updated.status}
    return strip_none_values({"success": True, "data": data, "message": "Status updated successfully"})

@router.post("/{vendor_type}/properties/{property_id}/images")
async def upload_vendor_property_image(
    vendor_type: VendorType,
    property_id: str,
    request: Request,
    order: int = Query(0, ge=0),
    is_cover: bool = Query(False),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    file = await _get_single_file_from_form(request)
    try:
        # "Add Image" only appends to the gallery - it must never assign the
        # cover image on its own (that's decided at property creation, or
        # here explicitly via is_cover=true when the edit-property flow is
        # replacing the cover). Never inferred from order == 0.
        data = await property_service.add_property_image_raw(
            property_id=property_id, file=file, user_id=current_user.get("user_id"),
            is_primary=is_cover, order=order,
        )
    except PropertyError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    return strip_none_values({"success": True, "data": data, "message": "Image uploaded successfully"})


@router.delete("/{vendor_type}/properties/{property_id}/images/{image_index}")
async def delete_vendor_property_image(
    vendor_type: VendorType,
    property_id: str,
    image_index: int,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    deleted = await property_service.delete_property_image_by_order(property_id, image_index)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found at that index")
    return strip_none_values({"success": True, "data": {"deleted": True}, "message": "Image deleted successfully"})


@router.post("/{vendor_type}/properties/{property_id}/cover")
async def set_vendor_property_cover(
    vendor_type: VendorType,
    property_id: str,
    media_id: int = Body(..., embed=True),
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    media = await property_service.set_property_cover_raw(property_id, media_id)
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found on this property")
    data = {"id": media.id, "file_url": media.file_url, "is_primary": media.is_primary}
    return strip_none_values({"success": True, "data": data, "message": "Cover image updated"})


@router.post("/{vendor_type}/properties/{property_id}/video")
async def upload_vendor_property_video(
    vendor_type: VendorType,
    property_id: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    file = await _get_single_file_from_form(request)
    data = await property_service.add_property_video_raw(
        property_id=property_id, file=file, user_id=current_user.get("user_id")
    )
    return strip_none_values({"success": True, "data": data, "message": "Video uploaded successfully"})


@router.delete("/{vendor_type}/properties/{property_id}/video")
async def delete_vendor_property_video(
    vendor_type: VendorType,
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    posted_by = service.resolve_vendor_type(vendor_type.value)
    prop = await property_service.get_property_raw(property_id)
    service.assert_owns_property(prop, current_user.get("user_id"), posted_by)

    await property_service.delete_property_video_raw(property_id)
    return strip_none_values({"success": True, "data": {"deleted": True}, "message": "Video deleted successfully"})


@router.post("/{vendor_type}/documents/{doc_type}")
async def upload_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    file = await _get_single_file_from_form(request)
    data = await service.upload_vendor_document(
        user_id=current_user.get("user_id"), vendor_type=vendor_type.value, doc_type=doc_type, file=file
    )
    return strip_none_values({"success": True, "data": data, "message": f"{doc_type} uploaded successfully"})


@router.get("/{vendor_type}/documents")
async def get_vendor_documents(
    vendor_type: VendorType,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    data = await service.get_vendor_documents(user_id=current_user.get("user_id"), vendor_type=vendor_type.value)
    return strip_none_values({"success": True, "data": data})


@router.get("/{vendor_type}/documents/{doc_type}")
async def get_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    data = await service.get_vendor_document(user_id=current_user.get("user_id"), vendor_type=vendor_type.value, doc_type=doc_type)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{doc_type}' document found")
    return strip_none_values({"success": True, "data": data})


@router.get("/{vendor_type}/documents/{doc_type}/view-url")
async def get_vendor_document_view_url(
    vendor_type: VendorType,
    doc_type: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    view_url = await service.get_vendor_document_view_url(
        user_id=current_user.get("user_id"), vendor_type=vendor_type.value, doc_type=doc_type
    )
    return strip_none_values({"success": True, "data": {"viewUrl": view_url}})


@router.delete("/{vendor_type}/documents/{doc_type}")
async def delete_vendor_document(
    vendor_type: VendorType,
    doc_type: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
):
    deleted = await service.delete_vendor_document(user_id=current_user.get("user_id"), vendor_type=vendor_type.value, doc_type=doc_type)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{doc_type}' document found")
    return strip_none_values({"success": True, "data": {"deleted": deleted}, "message": f"{doc_type} deleted successfully"})


async def _get_single_file_from_form(request: Request) -> UploadFile:
    form = await request.form()
    for _key, value in form.multi_items():
        # request.form() yields Starlette's base UploadFile, never FastAPI's
        # subclass - checking against the FastAPI type here always failed,
        # rejecting every real upload with a false "no file" 400.
        if isinstance(value, StarletteUploadFile):
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

    try:
        result = await service.upload_and_get_file_metadata(
            file=file, field=field, category=category, user_id=current_user.get("user_id")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
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
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
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

    try:
        upload_result = await service.upload_and_get_file_metadata(
            file=file, field=field, category=category, user_id=current_user.get("user_id")
        )
        if property_id and upload_result:
            result = await property_service.attach_uploaded_file_raw(
                property_id=property_id,
                user_id=current_user.get("user_id"),
                field=field,
                category=category,
                is_primary=is_primary,
                upload_result=upload_result,
                file=file,
            )
        else:
            result = upload_result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

    return strip_none_values({
        'success': True,
        'data': result,
        'message': f'{field} uploaded successfully'
    })


@router.get("/profile-files")
async def get_profile_files(
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    user_id = current_user.get("user_id")
    files: Dict[str, Any] = {}
    for role_key, posted_by in VENDOR_TYPE_MAP.items():
        detail_obj = await property_service.get_latest_vendor_detail_raw(user_id, posted_by)
        formatted = service.format_profile_files_for_role(posted_by, detail_obj)
        if formatted:
            files[role_key] = formatted
    return strip_none_values({
        'success': True,
        'data': files
    })


@router.delete("/profile-file/{file_path:path}")
async def delete_profile_file(
    file_path: str,
    current_user: Dict[str, Any] = Depends(require_vendor),
    service: ProfileService = Depends(get_profile_service),
    property_service: PropertyService = Depends(get_property_service),
):
    vendor_documents = await property_service.get_vendor_documents(current_user.get("user_id"))
    await service.delete_profile_file(
        file_path=file_path,
        user_id=current_user.get("user_id"),
        vendor_documents=vendor_documents,
    )
    return strip_none_values({
        'success': True,
        'message': 'File deleted successfully'
    })


