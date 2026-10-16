# app/services/user_media_service.py
#
# Reusable user media (profile photo, company/agency logo). One current version per user and
# media type. A property may reference a current user media by id; the file is never copied,
# and property-specific media never becomes a user media.
#
# Callers own the transaction: these methods flush; the caller commits.

from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.document_catalog import document_label
from app.core.storage_factory import StorageFactory
from app.core.storage.local_storage import LocalStorage
from app.models.event_audit_log import EventStatus
from app.models.file_asset import FileAsset
from app.models.property_user_media import PropertyUserMedia
from app.models.user_media import USER_MEDIA_TYPES, UserMedia
from app.repositories.document_repository import FileAssetRepository
from app.services import contact_person_media_service
from app.services.event_audit_service import EventAuditService, resolve_actor_name

# Upload field kinds (from the profile image upload) to user media types.
UPLOAD_KIND_TO_MEDIA_TYPE = {"profile": "profile_photo", "company": "company_logo", "agency": "agency_logo"}

MEDIA_CACHE_CONTROL = "private, max-age=604800"  # 7 days in the browser; the signed URL itself stays short-lived


def _current_query(user_id: str, media_type: str):
    return select(UserMedia).where(
        UserMedia.user_id == user_id,
        UserMedia.media_type == media_type,
        UserMedia.is_current.is_(True),
    )


async def current_user_media(db: AsyncSession, user_id: str, media_type: str) -> Optional[UserMedia]:
    return (await db.execute(_current_query(user_id, media_type))).scalar_one_or_none()


async def record_upload(
    db: AsyncSession,
    *,
    user_id: str,
    media_type: str,
    upload_result: Dict[str, Any],
) -> UserMedia:
    """A new upload by the user becomes their current media. The previous current media is
    superseded and kept. This is the user's own explicit upload, never a reuse."""
    if media_type not in USER_MEDIA_TYPES:
        raise ValueError(f"Unknown user media type: {media_type}")
    asset = await FileAssetRepository(db).get_or_create(
        file_url=upload_result["file_url"],
        original_name=upload_result.get("file_name") or upload_result.get("stored_filename"),
        mime_type=upload_result.get("mime_type"),
        size_bytes=(upload_result.get("file_size_kb") or 0) * 1024 or None,
        visibility="public",
    )
    previous = await current_user_media(db, user_id, media_type)
    if previous is not None:
        previous.is_current = False
        previous.status = "superseded"
        await db.flush()
    max_version = max([previous.version] if previous else [0])
    row = UserMedia(
        user_id=user_id,
        media_type=media_type,
        file_asset_id=asset.id,
        version=max_version + 1,
        status="verified",
        is_current=True,
    )
    db.add(row)
    await db.flush()
    return row


async def release(db: AsyncSession, *, user_id: str, media_type: str) -> bool:
    """Hide the user's current media (e.g. deleting a profile photo/logo).
    The version and its object are kept for history, the same as every other
    versioned file in this architecture."""
    current = await current_user_media(db, user_id, media_type)
    if current is None:
        return False
    current.is_current = False
    current.status = "deleted"
    await db.flush()
    return True


async def reference_for_property(
    db: AsyncSession,
    *,
    property_id: str,
    actor_id: str,
    user_media_id: int,
    purpose: str,
) -> PropertyUserMedia:
    """Link one of the actor's current user media to a property. Only a reference."""
    source = await db.get(UserMedia, user_media_id)
    if source is None or source.user_id != actor_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")
    # 'legacy' media was registered from the old profile data and is the user's current media.
    if not source.is_current or source.status not in ("verified", "legacy"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only your current media can be reused")
    if source.media_type != purpose:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This media is not a " + purpose)

    existing = (await db.execute(
        select(PropertyUserMedia).where(
            PropertyUserMedia.property_id == property_id,
            PropertyUserMedia.purpose == purpose,
        )
    )).scalar_one_or_none()
    if existing is not None:
        existing.user_media_id = source.id
        existing.created_by = actor_id
        await db.flush()
        row, action = existing, "replace"
    else:
        row = PropertyUserMedia(property_id=property_id, user_media_id=source.id, purpose=purpose, created_by=actor_id)
        db.add(row)
        await db.flush()
        action = "upload"

    # PropertyUserMedia above is a reference only - it is not what the
    # property's own displayed profilePhotoUrl/companyLogo is read from
    # (see PropertyFormatter._contact_person_media_url, which only reads
    # ContactPersonMedia). Mirror the reuse there too, sharing the same
    # file_asset_id, so a reused photo/logo actually shows up wherever a
    # freshly-uploaded one would.
    await contact_person_media_service.record_reuse(
        db, property_id=property_id, media_type=purpose, file_asset_id=source.file_asset_id,
    )

    actor_name = await resolve_actor_name(db, actor_id)
    verb = "replaced the reference to" if action == "replace" else "linked"
    await EventAuditService(db).record(
        event_type=action.upper(),
        event_action=action,
        display_message=f"{actor_name or 'A user'} {verb} their verified {document_label(purpose)} on a property",
        status_value=EventStatus.COMPLETED,
        actor_type="user",
        actor_user_id=actor_id,
        actor_display_name=actor_name,
        user_id=source.user_id,
        property_id=property_id,
        entity_type="PROPERTY_USER_MEDIA",
        entity_id=str(row.id),
        metadata={"purpose": purpose, "reused_from_user_media_id": source.id},
    )
    return row


async def view_url(db: AsyncSession, *, requester: Dict[str, Any], user_media: UserMedia) -> str:
    """Short-lived signed URL for a user media. Owner or admin only. Caching is set by the stream route."""
    if requester.get("role") != "admin" and requester.get("user_id") != user_media.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this media")
    asset = await db.get(FileAsset, user_media.file_asset_id)
    if asset is None or not asset.file_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media has no stored file")
    storage = StorageFactory.get_storage("public")
    return await storage.generate_signed_url(
        asset.file_url,
        expiration=settings.PRIVATE_DOCUMENT_SIGNED_URL_EXPIRE_SECONDS,
        actor=requester["user_id"],
        kind="media",
    )
