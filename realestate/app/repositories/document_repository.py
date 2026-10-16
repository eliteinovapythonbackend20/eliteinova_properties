# app/repositories/document_repository.py
#
# Writes and reads for the file/document foundation: file_assets (physical
# objects), user_documents (user-owned, versioned, verified) and the reference
# check that stops a stored object being deleted while any record still points
# at it.
#
# Database-only. Storage is never called from here.
#
# Version lifecycle (user_documents):
#   upload    -> new row, status pending. If a verified/legacy version is live it
#                stays live (is_current) until this one is approved.
#   verify    -> pending becomes verified and live; the previous live version
#                becomes superseded and is kept.
#   reject    -> pending becomes rejected, with a reason. It is never live.
#   release   -> the live version becomes deleted; its object is kept.

from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.document_catalog import DocumentLevel, level_for, resolve_document_key
from app.core.storage.locator import parse_file_url
from app.models.file_asset import FileAsset
from app.models.property_document import PropertyDocument
from app.models.user_document import UserDocument


class DocumentStateError(Exception):
    """A verification, rejection or replacement was not allowed in the current state."""


class FileAssetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create(
        self,
        *,
        file_url: str,
        original_name: Optional[str],
        mime_type: Optional[str] = None,
        size_bytes: Optional[int] = None,
        visibility: str = "private",
    ) -> FileAsset:
        locator = parse_file_url(file_url)
        bucket_match = FileAsset.bucket.is_(None) if locator.bucket is None else FileAsset.bucket == locator.bucket
        existing = (await self.db.execute(
            select(FileAsset).where(
                FileAsset.storage_provider == locator.storage_provider,
                bucket_match,
                FileAsset.storage_key == locator.storage_key,
            )
        )).scalar_one_or_none()
        if existing:
            return existing

        asset = FileAsset(
            storage_provider=locator.storage_provider,
            bucket=locator.bucket,
            storage_key=locator.storage_key,
            original_name=(original_name or "unnamed")[:255],
            mime_type=mime_type,
            size_bytes=size_bytes,
            visibility=visibility,
            status="active",
            file_url=file_url,
        )
        self.db.add(asset)
        await self.db.flush()
        return asset

    async def find_by_url(self, file_url: Optional[str]) -> Optional[FileAsset]:
        if not file_url:
            return None
        locator = parse_file_url(file_url)
        bucket_match = FileAsset.bucket.is_(None) if locator.bucket is None else FileAsset.bucket == locator.bucket
        return (await self.db.execute(
            select(FileAsset).where(
                FileAsset.storage_provider == locator.storage_provider,
                bucket_match,
                FileAsset.storage_key == locator.storage_key,
            )
        )).scalar_one_or_none()

    async def is_referenced(self, file_url: Optional[str]) -> bool:
        """True if any record still points at this stored object. Checked by
        asset and by raw URL, so legacy rows that predate file_assets count too.

        A user_documents row with status 'deleted' or 'rejected' does not count:
        that status means the owner explicitly doesn't want this copy anymore, so
        it must not keep the object alive forever. A 'superseded' row still does -
        it is kept for audit history by design."""
        if not file_url:
            return False
        asset = await self.find_by_url(file_url)
        if asset is not None:
            in_user = (await self.db.execute(
                select(func.count()).select_from(UserDocument).where(
                    UserDocument.file_asset_id == asset.id,
                    UserDocument.status.notin_(("deleted", "rejected")),
                )
            )).scalar_one()
            if in_user:
                return True
            in_property_by_asset = (await self.db.execute(
                select(func.count()).select_from(PropertyDocument).where(PropertyDocument.file_asset_id == asset.id)
            )).scalar_one()
            if in_property_by_asset:
                return True

        in_property_by_url = (await self.db.execute(
            select(func.count()).select_from(PropertyDocument).where(PropertyDocument.file_url == file_url)
        )).scalar_one()
        return in_property_by_url > 0

    async def mark_deleted(self, file_url: Optional[str]) -> None:
        """Flip the asset's status once its physical object has actually been
        removed from storage. No-ops if the object was never recorded or is
        already marked deleted."""
        asset = await self.find_by_url(file_url)
        if asset is not None and asset.status != "deleted":
            asset.status = "deleted"
            await self.db.flush()


class UserDocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, document_id: int) -> Optional[UserDocument]:
        return (await self.db.execute(
            select(UserDocument).where(UserDocument.id == document_id)
        )).scalar_one_or_none()

    async def current(self, user_id: str, document_key: str) -> Optional[UserDocument]:
        """The live version: what the user sees as their document."""
        return (await self.db.execute(
            select(UserDocument).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
                UserDocument.is_current.is_(True),
            )
        )).scalar_one_or_none()

    async def list_current(self, user_id: str) -> List[UserDocument]:
        return list((await self.db.execute(
            select(UserDocument).where(UserDocument.user_id == user_id, UserDocument.is_current.is_(True))
            .order_by(UserDocument.document_key)
        )).scalars().all())

    async def list_versions(self, user_id: str, document_key: Optional[str] = None) -> List[UserDocument]:
        query = select(UserDocument).where(UserDocument.user_id == user_id)
        if document_key:
            query = query.where(UserDocument.document_key == document_key)
        return list((await self.db.execute(
            query.order_by(UserDocument.document_key, UserDocument.version)
        )).scalars().all())

    async def add_version(
        self,
        *,
        user_id: str,
        document_key: str,
        file_asset_id: int,
        legacy_document_type: Optional[str] = None,
        legacy_source: Optional[str] = None,
        legacy_ref: Optional[str] = None,
    ) -> UserDocument:
        """Record an upload as a new pending version.

        An earlier pending upload that was never approved is superseded. A live
        version stays live until this one is verified.
        """
        stale_pending = (await self.db.execute(
            select(UserDocument).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
                UserDocument.status == "pending",
            )
        )).scalars().all()
        for old in stale_pending:
            old.status = "superseded"
            old.is_current = False
        if stale_pending:
            await self.db.flush()
        # Read the live version only after clearing stale pendings: a pending first
        # upload may have been the current row, and it is no longer live.
        live = await self.current(user_id, document_key)

        max_version = (await self.db.execute(
            select(func.max(UserDocument.version)).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
            )
        )).scalar_one()

        row = UserDocument(
            user_id=user_id,
            file_asset_id=file_asset_id,
            document_key=document_key,
            version=(max_version or 0) + 1,
            status="pending",
            # Becomes live immediately only when nothing else is live.
            is_current=live is None,
            legacy_source=legacy_source,
            legacy_document_type=legacy_document_type,
            legacy_ref=legacy_ref,
        )
        self.db.add(row)
        await self.db.flush()
        return row

    async def replace_verified(
        self,
        *,
        user_id: str,
        document_key: str,
        file_asset_id: int,
        legacy_document_type: Optional[str] = None,
        legacy_source: Optional[str] = None,
        legacy_ref: Optional[str] = None,
    ) -> tuple["UserDocument", Optional["UserDocument"]]:
        """Record a replacement upload as the new live, verified version immediately -
        mirrors user_media_service.record_upload(). Only call this when the current
        live version is already verified/legacy; a first-ever upload for a key that
        has never been verified still goes through add_version() as pending, for
        admin review.

        The previous live version becomes superseded (same as admin verification),
        and is returned so the caller can free its storage object if nothing else
        still needs it - this is a true replace, not an accumulating version chain.
        """
        stale_pending = (await self.db.execute(
            select(UserDocument).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
                UserDocument.status == "pending",
            )
        )).scalars().all()
        for old in stale_pending:
            old.status = "superseded"
            old.is_current = False
        if stale_pending:
            await self.db.flush()

        previous = await self.current(user_id, document_key)
        max_version = (await self.db.execute(
            select(func.max(UserDocument.version)).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
            )
        )).scalar_one()

        if previous is not None:
            previous.is_current = False
            previous.status = "superseded"
            await self.db.flush()  # clear the live slot before the partial unique index sees the new one

        row = UserDocument(
            user_id=user_id,
            file_asset_id=file_asset_id,
            document_key=document_key,
            version=(max_version or 0) + 1,
            status="verified",
            is_current=True,
            verified_at=datetime.now(timezone.utc),
            legacy_source=legacy_source,
            legacy_document_type=legacy_document_type,
            legacy_ref=legacy_ref,
        )
        self.db.add(row)
        await self.db.flush()
        return row, previous

    async def verify(self, row: UserDocument, verifier_id: str) -> UserDocument:
        if row.status != "pending":
            raise DocumentStateError(f"Only a pending version can be verified (this one is {row.status})")
        live = await self.current(row.user_id, row.document_key)
        if live is not None and live.id != row.id:
            live.is_current = False
            live.status = "superseded"
            await self.db.flush()  # clear the live slot before the partial unique index sees the new one
        row.status = "verified"
        row.is_current = True
        row.verified_at = datetime.now(timezone.utc)
        row.verified_by = verifier_id
        row.rejection_reason = None
        await self.db.flush()
        return row

    async def reject(self, row: UserDocument, reason: str) -> UserDocument:
        if row.status != "pending":
            raise DocumentStateError(f"Only a pending version can be rejected (this one is {row.status})")
        cleaned = (reason or "").strip()
        if not cleaned:
            raise DocumentStateError("A rejection reason is required")
        row.status = "rejected"
        row.is_current = False
        row.rejection_reason = cleaned
        await self.db.flush()
        return row

    async def release(self, user_id: str, document_key: str) -> List["UserDocument"]:
        """Hide the user's document. The rows are kept (status 'deleted'); the
        caller decides whether their storage objects can now be freed - see
        FileAssetRepository.is_referenced(). Returns the rows just released, or
        [] if there was nothing to release."""
        live = await self.current(user_id, document_key)
        pending = (await self.db.execute(
            select(UserDocument).where(
                UserDocument.user_id == user_id,
                UserDocument.document_key == document_key,
                UserDocument.status == "pending",
            )
        )).scalars().all()
        if live is None and not pending:
            return []
        released: List[UserDocument] = []
        if live is not None:
            live.is_current = False
            live.status = "deleted"
            released.append(live)
        for candidate in pending:
            if live is not None and candidate.id == live.id:
                continue  # a first-ever upload is both "live" and "pending" at once
            candidate.status = "deleted"
            candidate.is_current = False
            released.append(candidate)
        await self.db.flush()
        return released


class PropertyDocumentRepository:
    """Versioned property documents (property_documents rows with a property_id).

    Same lifecycle as UserDocumentRepository, keyed by property and document key.
    A new upload is pending. Only admin verification makes it live, and the
    previous live version is superseded and kept. A verified or live version is
    never changed in place.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, document_id: int) -> Optional[PropertyDocument]:
        return (await self.db.execute(
            select(PropertyDocument).where(PropertyDocument.id == document_id)
        )).scalar_one_or_none()

    async def current(self, property_id: str, slot_key: str) -> Optional[PropertyDocument]:
        """The live version of one logical file slot."""
        return (await self.db.execute(
            select(PropertyDocument).where(
                PropertyDocument.property_id == property_id,
                PropertyDocument.slot_key == slot_key,
                PropertyDocument.is_current.is_(True),
            ).order_by(PropertyDocument.version.desc())
        )).scalars().first()

    async def add_version(
        self,
        *,
        property_id: str,
        user_id: str,
        slot_key: str,
        document_key: str,
        legacy_document_type: str,
        file_asset_id: int,
        file_url: str,
        file_name: Optional[str],
        mime_type: Optional[str],
        file_size_kb: Optional[int],
        is_public: bool = False,
        subject_type: str = "PROPERTY",
    ) -> PropertyDocument:
        """Record an upload as a new pending version. Nothing becomes live until it is verified,
        so a pending version is never is_current, even when no version is live yet."""
        stale_pending = (await self.db.execute(
            select(PropertyDocument).where(
                PropertyDocument.property_id == property_id,
                PropertyDocument.slot_key == slot_key,
                PropertyDocument.status == "pending",
            )
        )).scalars().all()
        for old in stale_pending:
            old.status = "superseded"
            old.is_current = False
        if stale_pending:
            await self.db.flush()

        max_version = (await self.db.execute(
            select(func.max(PropertyDocument.version)).where(
                PropertyDocument.property_id == property_id,
                PropertyDocument.slot_key == slot_key,
            )
        )).scalar_one()

        row = PropertyDocument(
            property_id=property_id,
            user_id=user_id,
            document_type=legacy_document_type,
            document_key=document_key,
            slot_key=slot_key,
            file_asset_id=file_asset_id,
            file_name=(file_name or "unnamed")[:255],
            mime_type=mime_type,
            file_size_kb=file_size_kb,
            file_url=file_url,
            is_public=is_public,
            version=(max_version or 0) + 1,
            status="pending",
            is_current=False,
            subject_type=subject_type,
        )
        self.db.add(row)
        await self.db.flush()
        return row

    async def verify(self, row: PropertyDocument, verifier_id: str) -> PropertyDocument:
        if row.status != "pending":
            raise DocumentStateError(f"Only a pending version can be verified (this one is {row.status})")
        live = await self.current(row.property_id, row.slot_key)
        if live is not None and live.id != row.id:
            live.is_current = False
            live.status = "superseded"
            await self.db.flush()  # clear the live slot before the partial unique index sees the new one
        row.status = "verified"
        row.is_current = True
        row.verified_at = datetime.now(timezone.utc)
        row.verified_by = verifier_id
        row.rejection_reason = None
        await self.db.flush()
        return row

    async def reject(self, row: PropertyDocument, reason: str) -> PropertyDocument:
        if row.status != "pending":
            raise DocumentStateError(f"Only a pending version can be rejected (this one is {row.status})")
        cleaned = (reason or "").strip()
        if not cleaned:
            raise DocumentStateError("A rejection reason is required")
        row.status = "rejected"
        row.is_current = False
        row.rejection_reason = cleaned
        await self.db.flush()
        return row

    async def remove(self, row: PropertyDocument) -> PropertyDocument:
        """Hide one version. The row and its object are kept for history."""
        if row.status == "deleted":
            raise DocumentStateError("This version was already removed")
        row.status = "deleted"
        row.is_current = False
        await self.db.flush()
        return row


def _is_media(document_key: str) -> bool:
    return level_for(document_key) == DocumentLevel.USER_MEDIA


async def record_vendor_document(
    db: AsyncSession,
    *,
    user_id: str,
    legacy_document_type: str,
    file_url: str,
    file_name: Optional[str],
    mime_type: Optional[str] = None,
    file_size_kb: Optional[int] = None,
    legacy_source: str,
    legacy_ref: str,
) -> Optional[UserDocument]:
    """Record a new user-level document upload as a pending version.

    Returns None for media keys (profile photo, logos), which are not documents.
    """
    key = resolve_document_key(legacy_document_type, property_scoped=False)
    if _is_media(key):
        return None
    asset = await FileAssetRepository(db).get_or_create(
        file_url=file_url,
        original_name=file_name,
        mime_type=mime_type,
        size_bytes=(file_size_kb * 1024) if file_size_kb is not None else None,
        visibility="private",
    )
    return await UserDocumentRepository(db).add_version(
        user_id=user_id,
        document_key=key,
        file_asset_id=asset.id,
        legacy_document_type=legacy_document_type,
        legacy_source=legacy_source,
        legacy_ref=legacy_ref,
    )


async def record_vendor_document_verified(
    db: AsyncSession,
    *,
    user_id: str,
    legacy_document_type: str,
    file_url: str,
    file_name: Optional[str],
    mime_type: Optional[str] = None,
    file_size_kb: Optional[int] = None,
    legacy_source: str,
    legacy_ref: str,
) -> Optional[tuple[UserDocument, Optional[UserDocument]]]:
    """Record a replacement of an already-verified/legacy user-level document.
    The new upload becomes the live, verified version immediately - mirrors
    user_media_service.record_upload(). Only call this when
    has_verified_vendor_document() is True for this key; a first-ever upload
    still goes through record_vendor_document() as pending.

    Returns (new_row, previous_row_or_None), or None for media keys (profile
    photo, logos), which are not documents.
    """
    key = resolve_document_key(legacy_document_type, property_scoped=False)
    if _is_media(key):
        return None
    asset = await FileAssetRepository(db).get_or_create(
        file_url=file_url,
        original_name=file_name,
        mime_type=mime_type,
        size_bytes=(file_size_kb * 1024) if file_size_kb is not None else None,
        visibility="private",
    )
    return await UserDocumentRepository(db).replace_verified(
        user_id=user_id,
        document_key=key,
        file_asset_id=asset.id,
        legacy_document_type=legacy_document_type,
        legacy_source=legacy_source,
        legacy_ref=legacy_ref,
    )


async def release_vendor_document(db: AsyncSession, *, user_id: str, legacy_document_type: str) -> List[UserDocument]:
    """Release the live/pending version(s) in the DB. Returns the rows just
    released so the caller can free their storage objects if nothing else still
    needs them - see FileAssetRepository.is_referenced()."""
    key = resolve_document_key(legacy_document_type, property_scoped=False)
    if _is_media(key):
        return []
    return await UserDocumentRepository(db).release(user_id, key)


async def has_live_vendor_document(db: AsyncSession, *, user_id: str, legacy_document_type: str) -> bool:
    """True if a live version exists, verified or not - a first-ever upload is
    live (is_current) while still pending. The profile row must then not be
    overwritten; see has_verified_vendor_document() to distinguish the two."""
    key = resolve_document_key(legacy_document_type, property_scoped=False)
    if _is_media(key):
        return False
    return await UserDocumentRepository(db).current(user_id, key) is not None


async def has_verified_vendor_document(db: AsyncSession, *, user_id: str, legacy_document_type: str) -> bool:
    """True only if the live version is actually verified/legacy - not merely a
    first-ever upload that is live while still pending review. A True here means
    a replacement upload can be auto-verified immediately (see
    record_vendor_document_verified); a False means it must go to pending."""
    key = resolve_document_key(legacy_document_type, property_scoped=False)
    if _is_media(key):
        return False
    row = await UserDocumentRepository(db).current(user_id, key)
    return row is not None and row.status in ("verified", "legacy")


async def sync_legacy_vendor_row(db: AsyncSession, row: UserDocument) -> None:
    """After verification, point the legacy property_documents row at the
    verified file (pre-migration properties only - see legacy_ref/is_digit
    check below). A vendor-profile document (legacy_source
    'vendor_profile.*') needs no sync step: ProfileService.get_vendor_document(s)
    reads this UserDocument/FileAsset row directly, so there is nothing else
    to keep in sync."""
    if row.legacy_source != "property_documents" or not row.legacy_ref or not row.legacy_ref.isdigit():
        return
    legacy = await db.get(PropertyDocument, int(row.legacy_ref))
    if legacy is None or legacy.property_id is not None:
        return
    asset = await db.get(FileAsset, row.file_asset_id)
    if asset is None:
        return
    legacy.file_asset_id = asset.id
    legacy.document_key = row.document_key
    legacy.version = row.version
    legacy.file_url = asset.file_url
    legacy.file_name = asset.original_name
    legacy.mime_type = asset.mime_type
    legacy.file_size_kb = (asset.size_bytes // 1024) if asset.size_bytes is not None else legacy.file_size_kb
    legacy.status = "verified"
    legacy.is_current = True
    await db.flush()
