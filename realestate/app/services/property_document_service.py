# app/services/property_document_service.py
#
# Property-level documents (floor plans, sale deeds, additional documents) with the
# same versioned lifecycle as user documents:
#   upload  -> pending version; the live version (if any) stays live
#   verify  -> pending becomes live; the previous live version is superseded and kept
#   reject  -> pending becomes rejected, with a reason; the live version stays live
#   remove  -> one version is hidden; history and the object are kept
#
# Every change records one activity through EventAuditService with user_id and
# property_id set, so the feed can be filtered by property or user.
# Callers own the transaction: these methods flush, the caller commits.

import uuid
from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.document_catalog import document_label, resolve_document_key
from app.models.event_audit_log import EventStatus
from app.models.property_document import PropertyDocument
from app.repositories.document_repository import (
    DocumentStateError,
    FileAssetRepository,
    PropertyDocumentRepository,
)
from app.services.event_audit_service import EventAuditService, resolve_actor_name


class PropertyDocumentService:
    def __init__(self, db: AsyncSession, events: Optional[EventAuditService] = None):
        self.db = db
        self.documents = PropertyDocumentRepository(db)
        self.events = events or EventAuditService(db)

    async def _row(self, document_id: int) -> PropertyDocument:
        row = await self.documents.get(document_id)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document version not found")
        return row

    @staticmethod
    def _state_error(exc: DocumentStateError) -> HTTPException:
        code = status.HTTP_400_BAD_REQUEST if "reason" in str(exc) else status.HTTP_409_CONFLICT
        return HTTPException(status_code=code, detail=str(exc))

    async def _record(
        self,
        *,
        actor_id: str,
        actor_type: str,
        row: PropertyDocument,
        action: str,
        status_value: EventStatus,
        reason: Optional[str] = None,
        extra: Optional[Dict[str, Any]] = None,
    ) -> None:
        actor = await resolve_actor_name(self.db, actor_id)
        label = document_label(row.document_key or row.document_type)
        owner = await resolve_actor_name(self.db, row.user_id) if row.user_id != actor_id else None
        whose = f"{owner}'s " if owner else ""
        verbs = {
            "upload": "uploaded", "replace": "replaced", "verify": "verified",
            "reject": "rejected", "delete": "deleted",
        }
        metadata: Dict[str, Any] = {
            "document_key": row.document_key or row.document_type,
            "version": row.version,
            "target_user_id": row.user_id,
            "subject_type": row.subject_type,
        }
        if reason:
            metadata["reason"] = reason
        if extra:
            metadata.update(extra)
        await self.events.record(
            event_type=action.upper(),
            event_action=action,
            display_message=f"{actor or 'A user'} {verbs[action]} {whose}{label} (v{row.version})",
            status_value=status_value,
            actor_type=actor_type,
            actor_user_id=actor_id,
            actor_display_name=actor,
            user_id=row.user_id,
            property_id=row.property_id,
            entity_type="PROPERTY_DOCUMENT",
            entity_id=str(row.id),
            metadata=metadata,
        )

    async def record_upload(
        self,
        *,
        property_id: str,
        uploader_id: str,
        legacy_document_type: str,
        upload_result: Dict[str, Any],
        slot_key: Optional[str] = None,
        subject_type: str = "PROPERTY",
    ) -> PropertyDocument:
        """Store an uploaded file as a pending version.

        Without slot_key the file starts a new logical slot, so it stays independent
        of other files under the same document key. With slot_key it becomes the next
        version of that slot (a replacement), and only that slot's live version is affected.
        """
        key = resolve_document_key(legacy_document_type, property_scoped=True)
        slot = slot_key or uuid.uuid4().hex
        asset = await FileAssetRepository(self.db).get_or_create(
            file_url=upload_result["file_url"],
            original_name=upload_result.get("file_name") or upload_result.get("stored_filename"),
            mime_type=upload_result.get("mime_type"),
            size_bytes=(upload_result.get("file_size_kb") or 0) * 1024 or None,
            visibility="private",
        )
        live_before = await self.documents.current(property_id, slot)
        row = await self.documents.add_version(
            property_id=property_id,
            user_id=uploader_id,
            slot_key=slot,
            document_key=key,
            legacy_document_type=legacy_document_type,
            file_asset_id=asset.id,
            file_url=upload_result["file_url"],
            file_name=upload_result.get("file_name") or upload_result.get("stored_filename"),
            mime_type=upload_result.get("mime_type"),
            file_size_kb=upload_result.get("file_size_kb"),
            is_public=False,
            subject_type=subject_type,
        )
        await self._record(
            actor_id=uploader_id,
            actor_type="user",
            row=row,
            action="replace" if live_before else "upload",
            status_value=EventStatus.PENDING,
        )
        return row

    async def link_existing_user_document(
        self,
        *,
        property_id: str,
        uploader_id: str,
        user_document_id: int,
        subject_type: str,
    ) -> PropertyDocument:
        """Attach a user's own verified document to this property by reference. No new object.

        The user chose this document explicitly. It must belong to the uploader and be the
        verified, current version. The property record shares the same file_asset.
        """
        from app.models.file_asset import FileAsset
        from app.repositories.document_repository import UserDocumentRepository

        source = await UserDocumentRepository(self.db).get(user_document_id)
        if source is None or source.user_id != uploader_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        if source.status != "verified" or not source.is_current:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only your verified, current document can be reused",
            )
        asset = await self.db.get(FileAsset, source.file_asset_id)
        if asset is None or not asset.file_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document has no stored file")

        row = PropertyDocument(
            property_id=property_id,
            user_id=uploader_id,
            document_type=source.document_key,
            document_key=source.document_key,
            slot_key=uuid.uuid4().hex,
            file_asset_id=asset.id,
            file_url=asset.file_url,
            file_name=asset.original_name,
            mime_type=asset.mime_type,
            file_size_kb=(asset.size_bytes // 1024) if asset.size_bytes is not None else None,
            is_public=False,
            version=1,
            status="verified",
            is_current=True,
            verified_at=source.verified_at,
            verified_by=source.verified_by,
            subject_type=subject_type,
        )
        self.db.add(row)
        await self.db.flush()
        await self._record(
            actor_id=uploader_id,
            actor_type="user",
            row=row,
            action="upload",
            status_value=EventStatus.COMPLETED,
            extra={"reused_from_user_document_id": source.id},
        )
        return row

    async def verify(self, *, admin: Dict[str, Any], document_id: int) -> PropertyDocument:
        row = await self._row(document_id)
        try:
            await self.documents.verify(row, verifier_id=admin["user_id"])
        except DocumentStateError as exc:
            raise self._state_error(exc)
        await self._record(
            actor_id=admin["user_id"], actor_type="admin", row=row,
            action="verify", status_value=EventStatus.COMPLETED,
        )
        await self.db.commit()
        return row

    async def reject(self, *, admin: Dict[str, Any], document_id: int, reason: str) -> PropertyDocument:
        row = await self._row(document_id)
        try:
            await self.documents.reject(row, reason)
        except DocumentStateError as exc:
            raise self._state_error(exc)
        await self._record(
            actor_id=admin["user_id"], actor_type="admin", row=row,
            action="reject", status_value=EventStatus.REJECTED, reason=row.rejection_reason,
        )
        await self.db.commit()
        return row

    async def remove(self, *, actor: Dict[str, Any], row: PropertyDocument) -> None:
        try:
            await self.documents.remove(row)
        except DocumentStateError as exc:
            raise self._state_error(exc)
        await self._record(
            actor_id=actor["user_id"],
            actor_type="admin" if actor.get("role") == "admin" else "user",
            row=row, action="delete", status_value=EventStatus.COMPLETED,
        )
