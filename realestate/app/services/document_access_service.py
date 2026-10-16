# app/services/document_access_service.py
#
# Who may view a private document, and how a view is granted. Every access goes
# through here: signed-URL issuance, the stream endpoint, and the guard on the
# /uploads route. Nothing private is served by a static mount. Each granted view
# records one activity through EventAuditService.

from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.document_catalog import document_label
from app.core.storage.base import StorageProvider
from app.core.storage.local_storage import LocalStorage
from app.core.storage_factory import StorageFactory
from app.models.event_audit_log import EventStatus
from app.models.file_asset import FileAsset
from app.models.property_document import PropertyDocument
from app.models.user_document import UserDocument
from app.services.event_audit_service import EventAuditService, resolve_actor_name


def is_admin(requester: Dict[str, Any]) -> bool:
    return requester.get("role") == "admin"


def may_view_user_document(requester: Dict[str, Any], owner_user_id: str) -> bool:
    """Owner or admin only. Role is not an ownership model: vendor, customer and
    every other role map to the same user_id."""
    return is_admin(requester) or requester.get("user_id") == owner_user_id


def may_view_property_document(
    requester: Dict[str, Any], document_user_id: str, property_owner_id: Optional[str]
) -> bool:
    """Admin, the document's uploader, or the user who owns the property. Being
    marked is_public never grants access."""
    if is_admin(requester):
        return True
    uid = requester.get("user_id")
    return uid == document_user_id or (property_owner_id is not None and uid == property_owner_id)


class DocumentAccessService:
    def __init__(
        self,
        db: AsyncSession,
        storage: Optional[StorageProvider] = None,
        events: Optional[EventAuditService] = None,
    ):
        self.db = db
        self.storage = storage or StorageFactory.get_storage("private")
        self.events = events or EventAuditService(db)

    @staticmethod
    def _expiration() -> int:
        return settings.PRIVATE_DOCUMENT_SIGNED_URL_EXPIRE_SECONDS

    async def _signed(self, file_url: str, claims: Dict[str, Any]) -> str:
        # Claims are non-secret identifiers that the stream route reads back for the activity record.
        return await self.storage.generate_signed_url(file_url, expiration=self._expiration(), **claims)

    async def _record_view(
        self,
        *,
        actor_id: str,
        owner_id: str,
        document_key: str,
        entity_type: str,
        entity_id: str,
        version: Optional[int],
        verb: str = "viewed",
    ) -> None:
        actor = await resolve_actor_name(self.db, actor_id)
        owner = await resolve_actor_name(self.db, owner_id) if owner_id != actor_id else None
        who = f"{actor or 'A user'}"
        whose = f"{owner}'s " if owner else ""
        meta = {"document_key": document_key}
        if version is not None:
            meta["version"] = version
        await self.events.record(
            event_type="DOCUMENT_ACCESSED",
            event_action=verb,
            display_message=f"{who} {verb} {whose}{document_label(document_key)}",
            status_value=EventStatus.COMPLETED,
            actor_type="admin" if owner_id != actor_id else "user",
            actor_user_id=actor_id,
            actor_display_name=actor,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata=meta,
        )

    async def issue_user_document_url(
        self, *, requester: Dict[str, Any], row: UserDocument
    ) -> str:
        if not may_view_user_document(requester, row.user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this document")
        asset = await self.db.get(FileAsset, row.file_asset_id)
        if asset is None or not asset.file_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document has no stored file")

        url = await self._signed(asset.file_url, {"actor": requester["user_id"], "asset_id": asset.id, "doc_id": row.id})
        await self._record_view(
            actor_id=requester["user_id"], owner_id=row.user_id, document_key=row.document_key,
            entity_type="USER_DOCUMENT", entity_id=str(row.id), version=row.version,
        )
        await self.db.commit()
        return url

    async def issue_property_document_url(
        self,
        *,
        requester: Dict[str, Any],
        document: PropertyDocument,
        property_owner_id: Optional[str],
    ) -> str:
        if not may_view_property_document(requester, document.user_id, property_owner_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this document")
        if not document.file_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document has no stored file")

        url = await self._signed(
            document.file_url,
            {"actor": requester["user_id"], "asset_id": document.file_asset_id, "pdoc_id": document.id},
        )
        await self._record_view(
            actor_id=requester["user_id"], owner_id=document.user_id,
            document_key=document.document_key or document.document_type,
            entity_type="PROPERTY_DOCUMENT", entity_id=str(document.id), version=document.version,
        )
        await self.db.commit()
        return url

    async def stream_path(self, token: str) -> Path:
        """Resolve a signed stream token to a file on disk and record the download.

        Only the local provider streams through this route. GCS signs object URLs
        itself, so it never reaches here.
        """
        if not isinstance(self.storage, LocalStorage):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        key, claims = LocalStorage.read_stream_token(token)
        path = self.storage.path_for_key(key)
        if path is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

        actor_id = claims.get("actor")
        doc_id = claims.get("doc_id") or claims.get("pdoc_id")
        if claims.get("kind") == "media":
            # Media streams are not document downloads; they are not written to the document audit.
            return path
        if actor_id:
            entity_id = str(doc_id) if doc_id is not None else None
            actor = await resolve_actor_name(self.db, actor_id)
            await self.events.record(
                event_type="DOCUMENT_ACCESSED",
                event_action="downloaded",
                display_message=f"{actor or 'A user'} downloaded a document",
                status_value=EventStatus.COMPLETED,
                actor_type="user",
                actor_user_id=actor_id,
                actor_display_name=actor,
                entity_type="PROPERTY_DOCUMENT" if claims.get("pdoc_id") else "USER_DOCUMENT",
                entity_id=entity_id,
                metadata={"file_asset_id": claims.get("asset_id")} if claims.get("asset_id") else None,
            )
            await self.db.commit()
        return path

    async def is_private_local_key(self, key: str) -> bool:
        """True if a local file is a private document in any table.

        Used by the /uploads guard. Defaults to not-private for anything that is
        not recorded as a document (public property and profile media).
        """
        asset_private = (await self.db.execute(
            select(func.count()).select_from(FileAsset).where(
                FileAsset.storage_provider == "local",
                FileAsset.storage_key == key,
                FileAsset.visibility == "private",
            )
        )).scalar_one()
        if asset_private:
            return True
        # Any property document stored at this path is private, whatever is_public says.
        suffix = "/uploads/" + key
        in_property = (await self.db.execute(
            select(func.count()).select_from(PropertyDocument).where(
                func.right(PropertyDocument.file_url, len(suffix)) == suffix
            )
        )).scalar_one()
        return in_property > 0
