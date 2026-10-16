# app/api/media_controller.py
#
#   user_router      /api/v1/users/me/media                          the caller's reusable media
#   property_router  /api/v1/properties/{property_id}/user-media     references to the caller's media
#
# Responses carry metadata and references only: never a bucket, storage key or permanent URL.
# Viewing returns a short-lived signed URL from the authorized view route.

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Path, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_authenticated
from app.core.database import get_db
from app.models.file_asset import FileAsset
from app.models.property_user_media import PropertyUserMedia
from app.models.user_media import UserMedia
from app.repositories.property_repository import PropertyRepository
from app.schemas.common_response import SuccessResponse, ViewUrlResult
from app.schemas.user_media_card import PropertyUserMediaView, ReuseMediaResult, UserMediaView
from app.services import user_media_service

user_router = APIRouter(prefix="/api/v1/users/me/media", tags=["User Media"])
property_router = APIRouter(prefix="/api/v1/properties/{property_id}/user-media", tags=["Property User Media"])


class ReuseMediaRequest(BaseModel):
    user_media_id: int = Field(..., description="The id of your own current media")
    purpose: str = Field(..., pattern="^(profile_photo|company_logo|agency_logo|business_logo|gst_certificate)$")


def _media_view(row: UserMedia, asset: FileAsset) -> Dict[str, Any]:
    """Metadata only. No storage key, bucket or URL."""
    return {
        "id": row.id,
        "mediaType": row.media_type,
        "version": row.version,
        "status": row.status,
        "isCurrent": row.is_current,
        "fileName": asset.original_name,
        "mimeType": asset.mime_type,
        "sizeBytes": asset.size_bytes,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
    }


@user_router.get("", response_model=SuccessResponse[List[UserMediaView]])
async def list_my_media(
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(
        select(UserMedia).where(UserMedia.user_id == current_user["user_id"], UserMedia.is_current.is_(True))
        .order_by(UserMedia.media_type)
    )).scalars().all()
    out = []
    for row in rows:
        asset = await db.get(FileAsset, row.file_asset_id)
        out.append(UserMediaView.model_validate(_media_view(row, asset)))
    return SuccessResponse[List[UserMediaView]](data=out)


@user_router.get("/{user_media_id}/view-url", response_model=SuccessResponse[ViewUrlResult])
async def my_media_view_url(
    user_media_id: int,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(UserMedia, user_media_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")
    url = await user_media_service.view_url(db, requester=current_user, user_media=row)
    return SuccessResponse[ViewUrlResult](data=ViewUrlResult(viewUrl=url))


@property_router.get("", response_model=SuccessResponse[List[PropertyUserMediaView]])
async def list_property_user_media(
    property_id: str = Path(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    prop = await PropertyRepository(db).get_property_by_id(property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    if current_user.get("role") != "admin" and prop.user_id != current_user.get("user_id"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    refs = (await db.execute(
        select(PropertyUserMedia).where(PropertyUserMedia.property_id == property_id).order_by(PropertyUserMedia.id)
    )).scalars().all()
    out = []
    for ref in refs:
        media = await db.get(UserMedia, ref.user_media_id)
        asset = await db.get(FileAsset, media.file_asset_id)
        out.append(PropertyUserMediaView.model_validate({
            "referenceId": ref.id, "purpose": ref.purpose, "userMediaId": media.id,
            **_media_view(media, asset), "reused": True,
        }))
    return SuccessResponse[List[PropertyUserMediaView]](data=out)


@property_router.post("", status_code=status.HTTP_201_CREATED, response_model=SuccessResponse[ReuseMediaResult])
async def reuse_user_media(
    body: ReuseMediaRequest,
    property_id: str = Path(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    """Reference one of your current media items for this property. The user chooses the item
    explicitly; no file is uploaded, copied or matched."""
    prop = await PropertyRepository(db).get_property_by_id(property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    if prop.user_id != current_user.get("user_id"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    ref = await user_media_service.reference_for_property(
        db, property_id=property_id, actor_id=current_user["user_id"],
        user_media_id=body.user_media_id, purpose=body.purpose,
    )
    await db.commit()
    return SuccessResponse[ReuseMediaResult](
        data=ReuseMediaResult(referenceId=ref.id, purpose=ref.purpose, userMediaId=ref.user_media_id)
    )
