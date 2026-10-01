"""Routes for the customer-facing self-service surface ("my own" profile,
saved properties, wishlist, requirements, property requests) - backs
CustomerProfile.jsx's Personal Info / Saved Properties / Wishlist / Requested
Properties tabs.

Every route is gated by require_customer (role "user", or "admin" for
parity with require_vendor's own admin-inclusive convention) and is always
scoped to the authenticated caller's own user_id - there is no path param
anywhere in this file that identifies "which customer" (unlike
admin_customer_controller, which is keyed on a path {user_id}). Identity
always comes from current_user, never a request field - see
app.schemas.customer_schemas's module docstring for why.
"""

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi import status as http_status
from starlette.datastructures import UploadFile as StarletteUploadFile

from app.api.dependencies import require_customer, get_customer_service
from app.core.response_utils import strip_none_values
from app.schemas.customer_schemas import (
    CustomerProfileUpdate,
    CustomerRequirementCreate,
    CustomerRequirementUpdate,
    PropertyRequestCreate,
    SavedPropertyCreate,
    WishlistItemCreate,
)
from app.services.customer_service import CustomerService
from app.services.file_service import FileService

router = APIRouter()


async def _get_single_file_from_form(request: Request) -> UploadFile:
    form = await request.form()
    for _key, value in form.multi_items():
        # request.form() yields Starlette's base UploadFile, never FastAPI's
        # subclass - matches profile_controller._get_single_file_from_form's
        # own fix for the same false-negative.
        if isinstance(value, StarletteUploadFile):
            return value
    raise HTTPException(
        status_code=http_status.HTTP_400_BAD_REQUEST,
        detail="Invalid request. Expected multipart form data containing a file.",
    )


# ----------------------------------------------------------------------
# Profile
# ----------------------------------------------------------------------
@router.get("/profile")
async def get_my_profile(
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    data = await service.get_my_profile(current_user.get("user_id"))
    return strip_none_values({"success": True, "data": data})


@router.patch("/profile")
async def update_my_profile(
    body: CustomerProfileUpdate,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.update_my_profile(current_user.get("user_id"), fields)
    return strip_none_values({"success": True, "data": data, "message": "Profile updated successfully"})


@router.post("/profile/photo")
async def upload_my_profile_photo(
    request: Request,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    file = await _get_single_file_from_form(request)
    upload_result = await FileService().upload_image(
        file=file, user_id=current_user.get("user_id"), property_id="profile",
        field_name="profilePhoto", is_primary=True,
    )
    data = await service.set_profile_picture_url(current_user.get("user_id"), upload_result["file_url"])
    return strip_none_values({"success": True, "data": data, "message": "Profile photo uploaded successfully"})


@router.delete("/profile/photo")
async def delete_my_profile_photo(
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    data = await service.set_profile_picture_url(current_user.get("user_id"), None)
    return strip_none_values({"success": True, "data": data, "message": "Profile photo deleted"})


@router.post("/profile/documents/{doc_type}")
async def upload_my_kyc_document(
    doc_type: str,
    request: Request,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    file = await _get_single_file_from_form(request)
    upload_result = await FileService().upload_document(
        file=file, user_id=current_user.get("user_id"), property_id="profile", idx=0
    )
    data = await service.set_kyc_doc_url(current_user.get("user_id"), doc_type, upload_result["file_url"])
    return strip_none_values({"success": True, "data": data, "message": f"{doc_type} document uploaded successfully"})


# ----------------------------------------------------------------------
# Requirements
# ----------------------------------------------------------------------
@router.get("/requirements")
async def list_my_requirements(
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return strip_none_values(await service.list_my_requirements(current_user.get("user_id")))


@router.post("/requirements", status_code=http_status.HTTP_201_CREATED)
async def create_my_requirement(
    body: CustomerRequirementCreate,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.create_my_requirement(current_user.get("user_id"), fields)
    return strip_none_values({"success": True, "data": data})


@router.patch("/requirements/{requirement_id}")
async def update_my_requirement(
    requirement_id: int,
    body: CustomerRequirementUpdate,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.update_my_requirement(requirement_id, current_user.get("user_id"), fields)
    return strip_none_values({"success": True, "data": data})


@router.delete("/requirements/{requirement_id}")
async def delete_my_requirement(
    requirement_id: int,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return await service.delete_my_requirement(requirement_id, current_user.get("user_id"))


# ----------------------------------------------------------------------
# Saved properties
# ----------------------------------------------------------------------
@router.get("/saved-properties")
async def list_my_saved_properties(
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return strip_none_values(await service.list_my_saved_properties(current_user.get("user_id")))


@router.post("/saved-properties/{property_id}", status_code=http_status.HTTP_201_CREATED)
async def save_property(
    property_id: str,
    body: SavedPropertyCreate = SavedPropertyCreate(),
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    data = await service.save_property(current_user.get("user_id"), property_id, body.notes)
    return strip_none_values({"success": True, "data": data})


@router.delete("/saved-properties/{property_id}")
async def unsave_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return await service.unsave_property(current_user.get("user_id"), property_id)


# ----------------------------------------------------------------------
# Wishlist
# ----------------------------------------------------------------------
@router.get("/wishlist")
async def list_my_wishlist(
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return strip_none_values(await service.list_my_wishlist(current_user.get("user_id")))


@router.post("/wishlist/{property_id}", status_code=http_status.HTTP_201_CREATED)
async def add_to_wishlist(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    data = await service.add_to_wishlist(current_user.get("user_id"), property_id)
    return strip_none_values({"success": True, "data": data})


@router.delete("/wishlist/{property_id}")
async def remove_from_wishlist(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return await service.remove_from_wishlist(current_user.get("user_id"), property_id)


# ----------------------------------------------------------------------
# Property requests (purchase / rental) - "Requested Properties"
# ----------------------------------------------------------------------
@router.get("/property-requests")
async def list_my_property_requests(
    requestType: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    return strip_none_values(await service.list_my_property_requests(current_user.get("user_id"), requestType))


@router.post("/property-requests/{property_id}", status_code=http_status.HTTP_201_CREATED)
async def create_my_property_request(
    property_id: str,
    body: PropertyRequestCreate,
    current_user: Dict[str, Any] = Depends(require_customer),
    service: CustomerService = Depends(get_customer_service),
):
    fields = body.model_dump(exclude_unset=True, exclude={"requestType"})
    data = await service.create_my_property_request(
        current_user.get("user_id"), property_id, body.requestType, fields
    )
    return strip_none_values({"success": True, "data": data})
