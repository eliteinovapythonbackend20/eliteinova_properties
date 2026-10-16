# app/services/document_verification_service.py
#
# Admin verification of pending user document versions: verify, reject (reason
# required), and the approval/rejection notification. Each decision records one
# activity through EventAuditService. A notification failure is logged and never
# undoes the decision.

import html
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.document_catalog import document_label
from app.models.event_audit_log import EventStatus
from app.models.user import User
from app.models.user_document import UserDocument
from app.repositories.document_repository import DocumentStateError, UserDocumentRepository, sync_legacy_vendor_row
from app.services.event_audit_service import EventAuditService, resolve_actor_name


class DocumentVerificationService:
    def __init__(self, db: AsyncSession, email_service=None, events: Optional[EventAuditService] = None):
        self.db = db
        self.documents = UserDocumentRepository(db)
        self.events = events or EventAuditService(db)
        self._email_service = email_service

    async def _row(self, document_id: int) -> UserDocument:
        row = await self.documents.get(document_id)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document version not found")
        return row

    @staticmethod
    def _state_error(exc: DocumentStateError) -> HTTPException:
        code = status.HTTP_400_BAD_REQUEST if "reason" in str(exc) else status.HTTP_409_CONFLICT
        return HTTPException(status_code=code, detail=str(exc))

    async def _record_decision(self, *, admin: dict, row: UserDocument, decided: EventStatus, reason: Optional[str] = None):
        admin_name = await resolve_actor_name(self.db, admin["user_id"])
        owner_name = await resolve_actor_name(self.db, row.user_id)
        label = document_label(row.document_key)
        event = "VERIFY" if decided == EventStatus.COMPLETED else "REJECT"
        past = "verified" if event == "VERIFY" else "rejected"
        possessive = f"{owner_name}'s " if owner_name else ""
        metadata = {"document_key": row.document_key, "version": row.version, "target_user_id": row.user_id}
        if reason:
            metadata["reason"] = reason
        await self.events.record(
            event_type=event,
            event_action=event.lower(),
            display_message=f"{admin_name or 'An admin'} {past} {possessive}{label} (v{row.version})",
            status_value=decided,
            actor_type="admin",
            actor_user_id=admin["user_id"],
            actor_display_name=admin_name,
            user_id=row.user_id,
            entity_type="USER_DOCUMENT",
            entity_id=str(row.id),
            metadata=metadata,
        )

    async def verify(self, *, admin: dict, document_id: int) -> UserDocument:
        row = await self._row(document_id)
        try:
            await self.documents.verify(row, verifier_id=admin["user_id"])
        except DocumentStateError as exc:
            raise self._state_error(exc)
        # A profile row that points at this document now shows the verified file.
        await sync_legacy_vendor_row(self.db, row)
        await self._record_decision(admin=admin, row=row, decided=EventStatus.COMPLETED)
        await self.db.commit()
        await self._notify(row, approved=True)
        return row

    async def reject(self, *, admin: dict, document_id: int, reason: str) -> UserDocument:
        row = await self._row(document_id)
        try:
            await self.documents.reject(row, reason)
        except DocumentStateError as exc:
            raise self._state_error(exc)
        await self._record_decision(admin=admin, row=row, decided=EventStatus.REJECTED, reason=row.rejection_reason)
        await self.db.commit()
        await self._notify(row, approved=False)
        return row

    async def _notify(self, row: UserDocument, *, approved: bool) -> None:
        try:
            user = (await self.db.execute(select(User).where(User.id == row.user_id))).scalar_one_or_none()
            if user is None or not user.email:
                return
            label = document_label(row.document_key)
            if approved:
                subject = f"Your {label} has been verified"
                body = f"Your {html.escape(label)} document has been verified and is now active on your account."
                text = f"Your {label} document has been verified and is now active on your account."
            else:
                reason = html.escape(row.rejection_reason or "")
                subject = f"Your {label} needs to be re-uploaded"
                body = (f"Your {html.escape(label)} document could not be verified.<br><br>"
                        f"<strong>Reason:</strong> {reason}<br><br>Please upload a new copy.")
                text = (f"Your {label} document could not be verified.\n\nReason: {row.rejection_reason}\n\n"
                        "Please upload a new copy.")
            service = self._email_service
            if service is None:
                from app.services.email_service import get_email_service
                service = await get_email_service()
            await service.send_email(to_email=user.email, subject=subject, html_content=body, text_content=text)
        except Exception as exc:  # the decision is already committed; a failed email must not undo it
            print(f"Document notification failed for version {row.id}: {exc}")
