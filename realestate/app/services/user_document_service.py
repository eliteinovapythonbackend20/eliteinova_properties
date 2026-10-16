# app/services/user_document_service.py
#
# User-owned documents (USER_DOCUMENT level): list, get current, upload a new
# version, release, and issue a view URL. Business rules only; storage and the
# database are reached through the file service and repositories. Each change
# records one activity through EventAuditService.

from typing import Any, Dict, List, Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.document_catalog import DocumentLevel, UNCLASSIFIED, document_label, level_for, resolve_document_key
from app.models.file_asset import FileAsset
from app.models.user_document import UserDocument
from app.repositories.document_repository import FileAssetRepository, UserDocumentRepository
from app.services.document_access_service import DocumentAccessService
from app.services.event_audit_service import EventAuditService, resolve_actor_name
from app.services.file_service import FileService
from app.models.event_audit_log import EventStatus


class UserDocumentService:
    def __init__(
        self,
        db: AsyncSession,
        file_service: Optional[FileService] = None,
        access: Optional[DocumentAccessService] = None,
        events: Optional[EventAuditService] = None,
    ):
        self.db = db
        self.file_service = file_service or FileService()
        self.events = events or EventAuditService(db)
        self.access = access or DocumentAccessService(db, events=self.events)
        self.documents = UserDocumentRepository(db)
        self.assets = FileAssetRepository(db)

    @staticmethod
    def _user_key(raw_key: str) -> str:
        """Map a route key or frontend field name to a canonical USER_DOCUMENT key, or 400."""
        key = resolve_document_key(raw_key, property_scoped=False)
        if key == UNCLASSIFIED or level_for(key) != DocumentLevel.USER_DOCUMENT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{raw_key}' is not a user document type",
            )
        return key

    async def list_current(self, user_id: str) -> List[UserDocument]:
        return await self.documents.list_current(user_id)

    async def get_current(self, user_id: str, raw_key: str) -> UserDocument:
        key = self._user_key(raw_key)
        row = await self.documents.current(user_id, key)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{key}' document on file")
        return row

    async def upload_version(
        self, *, user_id: str, raw_key: str, file: UploadFile
    ) -> UserDocument:
        """Store a new pending version. The live version (if any) stays live until an admin verifies it."""
        key = self._user_key(raw_key)
        previous = await self.documents.current(user_id, key)

        result = await self.file_service.upload_document(file=file, user_id=user_id, property_id="profile", idx=0, doc_type=key)
        size_bytes = int(result.get("file_size_kb") or 0) * 1024 or None
        asset = await self.assets.get_or_create(
            file_url=result["file_url"],
            original_name=result.get("stored_filename") or file.filename,
            mime_type=result.get("mime_type") or file.content_type,
            size_bytes=size_bytes,
            visibility="private",
        )
        row = await self.documents.add_version(
            user_id=user_id,
            document_key=key,
            file_asset_id=asset.id,
            legacy_document_type=raw_key,
        )
        actor = await resolve_actor_name(self.db, user_id)
        label = document_label(key)
        event, past = ("REPLACE", "replaced") if previous is not None else ("UPLOAD", "uploaded")
        await self.events.record(
            event_type=event,
            event_action=event.lower(),
            display_message=f"{actor or 'A user'} {past} {label} (v{row.version})",
            status_value=EventStatus.PENDING,
            actor_type="user",
            actor_user_id=user_id,
            actor_display_name=actor,
            user_id=user_id,
            entity_type="USER_DOCUMENT",
            entity_id=str(row.id),
            metadata={"document_key": key, "version": row.version,
                      **({"previous_version": previous.version} if previous else {})},
        )
        await self.db.commit()
        return row

    async def release(self, *, user_id: str, raw_key: str) -> None:
        key = self._user_key(raw_key)
        live = await self.documents.current(user_id, key)
        released = await self.documents.release(user_id, key)
        if not released:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{key}' document on file")
        actor = await resolve_actor_name(self.db, user_id)
        await self.events.record(
            event_type="DELETE",
            event_action="delete",
            display_message=f"{actor or 'A user'} deleted {document_label(key)}",
            status_value=EventStatus.COMPLETED,
            actor_type="user",
            actor_user_id=user_id,
            actor_display_name=actor,
            user_id=user_id,
            entity_type="USER_DOCUMENT",
            entity_id=str(live.id) if live else None,
            metadata={"document_key": key, **({"version": live.version} if live else {})},
        )
        await self.db.commit()
        # Now that the DB rows are committed as 'deleted', free each object's
        # storage - but only if nothing else (another version's history, or a
        # property that reused it) still needs it.
        for row in released:
            asset = await self.db.get(FileAsset, row.file_asset_id)
            if asset is None or not asset.file_url:
                continue
            if await self.assets.is_referenced(asset.file_url):
                continue
            await self.file_service.delete_files([asset.file_url])
            await self.assets.mark_deleted(asset.file_url)
        await self.db.commit()

    async def access_url(self, *, requester: Dict[str, Any], raw_key: str) -> str:
        """Signed view URL for the live version, for its owner or an admin."""
        key = self._user_key(raw_key)
        # Always the caller's own document. Admins view other users' documents
        # through the admin routes, which address a version by its id.
        row = await self.documents.current(requester["user_id"], key)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{key}' document on file")
        return await self.access.issue_user_document_url(requester=requester, row=row)
