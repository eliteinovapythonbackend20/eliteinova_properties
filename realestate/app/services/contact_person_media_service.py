# app/services/contact_person_media_service.py
#
# A contact person's media (poster photo, agency/company logo) submitted with one
# property's form - never the uploader's own reusable USER_MEDIA, never shared
# across properties, never inferred from the GCS path (property_id is a real
# column). Public, like any other media - no admin verification, unlike a
# contact-person DOCUMENT.
#
# Callers own the transaction: these methods flush; the caller commits.

from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.storage_factory import StorageFactory
from app.models.contact_person_media import CONTACT_PERSON_MEDIA_TYPES, ContactPersonMedia
from app.models.file_asset import FileAsset
from app.repositories.document_repository import FileAssetRepository


def _current_query(property_id: str, media_type: str):
    return select(ContactPersonMedia).where(
        ContactPersonMedia.property_id == property_id,
        ContactPersonMedia.media_type == media_type,
        ContactPersonMedia.is_current.is_(True),
    )


async def current(db: AsyncSession, property_id: str, media_type: str) -> Optional[ContactPersonMedia]:
    return (await db.execute(_current_query(property_id, media_type))).scalar_one_or_none()


async def record_upload(
    db: AsyncSession,
    *,
    property_id: str,
    media_type: str,
    upload_result: Dict[str, Any],
) -> ContactPersonMedia:
    """A fresh upload for this property's contact person becomes current. The
    previous current row (if any) is superseded and kept - the same lifecycle
    as USER_MEDIA, just keyed by property instead of user."""
    if media_type not in CONTACT_PERSON_MEDIA_TYPES:
        raise ValueError(f"Unknown contact-person media type: {media_type}")
    asset = await FileAssetRepository(db).get_or_create(
        file_url=upload_result["file_url"],
        original_name=upload_result.get("file_name") or upload_result.get("stored_filename"),
        mime_type=upload_result.get("mime_type"),
        size_bytes=(upload_result.get("file_size_kb") or 0) * 1024 or None,
        visibility="public",
    )
    previous = await current(db, property_id, media_type)
    if previous is not None:
        previous.is_current = False
        previous.status = "superseded"
        await db.flush()
    max_version = max([previous.version] if previous else [0])
    row = ContactPersonMedia(
        property_id=property_id,
        media_type=media_type,
        file_asset_id=asset.id,
        version=max_version + 1,
        status="verified",
        is_current=True,
    )
    db.add(row)
    await db.flush()
    return row


async def record_reuse(
    db: AsyncSession,
    *,
    property_id: str,
    media_type: str,
    file_asset_id: int,
) -> Optional[ContactPersonMedia]:
    """Same supersession lifecycle as record_upload, but for a REUSED file
    (the vendor's own existing, already-verified USER_MEDIA) instead of a
    fresh upload - shares the same file_asset_id, never creates a new
    FileAsset or duplicates the physical file.

    Returns None for a media_type this table doesn't track (currently only
    'business_logo', which isn't one of CONTACT_PERSON_MEDIA_TYPES - it has
    no property-contact display slot). The caller's PropertyUserMedia write
    still proceeds regardless; this is additive, not a replacement.

    Idempotent: if the current row already points at this exact
    file_asset_id, retrying the same reuse is a no-op rather than creating a
    pointless extra version.
    """
    if media_type not in CONTACT_PERSON_MEDIA_TYPES:
        return None
    previous = await current(db, property_id, media_type)
    if previous is not None and previous.file_asset_id == file_asset_id:
        return previous
    if previous is not None:
        previous.is_current = False
        previous.status = "superseded"
        await db.flush()
    max_version = max([previous.version] if previous else [0])
    row = ContactPersonMedia(
        property_id=property_id,
        media_type=media_type,
        file_asset_id=file_asset_id,
        version=max_version + 1,
        status="verified",
        is_current=True,
    )
    db.add(row)
    await db.flush()
    return row


async def release(db: AsyncSession, *, property_id: str, media_type: str) -> bool:
    """Hide the property's current contact-person media. The version and its
    object are kept for history."""
    row = await current(db, property_id, media_type)
    if row is None:
        return False
    row.is_current = False
    row.status = "deleted"
    await db.flush()
    return True


async def view_url(db: AsyncSession, *, requester: Dict[str, Any], media: ContactPersonMedia, property_owner_id: Optional[str]) -> str:
    """Short-lived signed URL. Admin or the property's owner only. Caching is
    set by the stream route."""
    if requester.get("role") != "admin" and requester.get("user_id") != property_owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this media")
    asset = await db.get(FileAsset, media.file_asset_id)
    if asset is None or not asset.file_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media has no stored file")
    storage = StorageFactory.get_storage("public")
    return await storage.generate_signed_url(
        asset.file_url,
        expiration=settings.PRIVATE_DOCUMENT_SIGNED_URL_EXPIRE_SECONDS,
        actor=requester["user_id"],
        kind="media",
    )
