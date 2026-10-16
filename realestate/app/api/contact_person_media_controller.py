# app/api/contact_person_media_controller.py
#
#   GET /api/v1/properties/{property_id}/contact-media               list
#   GET /api/v1/properties/{property_id}/contact-media/{id}/view-url signed URL
#
# A contact person's media (poster photo, agency/company logo) for this
# property - public, but still only reachable through this authorized route;
# no bucket, storage key or permanent URL is ever returned directly.
# Create/replace happens only through the property-posting form
# (contact_person_media_service.record_upload) - there is no edit endpoint here.

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_authenticated
from app.core.database import get_db
from app.models.contact_person_media import ContactPersonMedia
from app.models.file_asset import FileAsset
from app.repositories.property_repository import PropertyRepository
from app.schemas.common_response import SuccessResponse, ViewUrlResult
from app.schemas.contact_person_media_card import ContactPersonMediaItem, ContactPersonMediaListResponse
from app.services import contact_person_media_service

router = APIRouter(prefix="/api/v1/properties/{property_id}/contact-media", tags=["Contact Person Media"])


async def _authorized_property(property_id: str, current_user: Dict[str, Any], db: AsyncSession):
    prop = await PropertyRepository(db).get_property_by_id(property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    if current_user.get("role") != "admin" and prop.user_id != current_user.get("user_id"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return prop


@router.get("", response_model=ContactPersonMediaListResponse)
async def list_contact_person_media(
    property_id: str = Path(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    await _authorized_property(property_id, current_user, db)
    rows = (await db.execute(
        select(ContactPersonMedia).where(
            ContactPersonMedia.property_id == property_id, ContactPersonMedia.is_current.is_(True)
        ).order_by(ContactPersonMedia.media_type)
    )).scalars().all()
    out = []
    for row in rows:
        asset = await db.get(FileAsset, row.file_asset_id)
        out.append(ContactPersonMediaItem(
            id=row.id,
            mediaType=row.media_type,
            version=row.version,
            status=row.status,
            fileName=asset.original_name if asset else None,
            mimeType=asset.mime_type if asset else None,
            createdAt=row.created_at.isoformat() if row.created_at else None,
        ))
    return ContactPersonMediaListResponse(data=out)


@router.get("/{media_id}/view-url", response_model=SuccessResponse[ViewUrlResult])
async def contact_person_media_view_url(
    property_id: str = Path(...),
    media_id: int = Path(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    prop = await _authorized_property(property_id, current_user, db)
    row = await db.get(ContactPersonMedia, media_id)
    if row is None or row.property_id != property_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")
    url = await contact_person_media_service.view_url(
        db, requester=current_user, media=row, property_owner_id=prop.user_id
    )
    return SuccessResponse[ViewUrlResult](data=ViewUrlResult(viewUrl=url))
