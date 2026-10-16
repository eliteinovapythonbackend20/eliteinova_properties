# app/services/event_audit_service.py
#
# The one way any module writes an activity record. Every module (users, vendors,
# profiles, properties, leads, projects, documents, future modules) calls
# EventAuditService.record(); nothing writes to event_audit_log directly.
#
# The caller owns the transaction: record() flushes, and the caller commits with
# the business change, so an activity is never recorded for a change that rolled back.

import re
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.display_name import resolve_display_name
from app.models.event_audit_log import EventAuditLog, EventStatus
from app.repositories.profile_repository import VendorProfileRepository
from app.repositories.user_repository import UserRepository

STATUS_LABELS = {
    EventStatus.PENDING.value: "Pending",
    EventStatus.IN_PROGRESS.value: "In Progress",
    EventStatus.COMPLETED.value: "Completed",
    EventStatus.FAILED.value: "Failed",
    EventStatus.REJECTED.value: "Rejected",
    EventStatus.CANCELLED.value: "Cancelled",
}

_EVENT_TYPE = re.compile(r"^[A-Z][A-Z0-9_]{2,59}$")
_EVENT_ACTION = re.compile(r"^[a-z][a-z_]{1,39}$")
_ACTOR_TYPE = re.compile(r"^[a-z_]{2,30}$")
_ENTITY_TYPE = re.compile(r"^[A-Z][A-Z_]{1,39}$")
_MAX_MESSAGE = 500

# Never stored in metadata, by key name (case-insensitive).
_FORBIDDEN_METADATA_KEYS = {
    "url", "file_url", "stored_path", "storedpath", "signed_url", "token", "access_token",
    "refresh_token", "password", "secret", "credentials", "authorization", "content",
}


class EventValidationError(ValueError):
    pass


def _clean_metadata(value: Any) -> Any:
    """Keep JSON primitives only. Drop forbidden keys and any string that looks like a link."""
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            if str(key).lower() in _FORBIDDEN_METADATA_KEYS:
                continue
            cleaned = _clean_metadata(item)
            if cleaned is not None:
                out[str(key)] = cleaned
        return out
    if isinstance(value, list):
        return [c for c in (_clean_metadata(v) for v in value) if c is not None]
    if isinstance(value, str):
        lowered = value.lower()
        # Anywhere in the string, not only at the start: a sentence can carry a link.
        if "http://" in lowered or "https://" in lowered or "token=" in lowered:
            return None
        return value
    if value is None or isinstance(value, (bool, int, float)):
        return value
    raise EventValidationError(f"metadata value of type {type(value).__name__} is not storable")


def build_event(
    *,
    event_type: str,
    event_action: str,
    display_message: str,
    status_value: Any,
    actor_type: str,
    actor_user_id: Optional[str] = None,
    actor_display_name: Optional[str] = None,
    user_id: Optional[str] = None,
    property_id: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Validate and normalise one activity. Pure: no database access."""
    if not _EVENT_TYPE.match(event_type or ""):
        raise EventValidationError("event_type must be UPPER_SNAKE_CASE, e.g. LEADS_RECEIVED")
    if not _EVENT_ACTION.match(event_action or ""):
        raise EventValidationError("event_action must be a lowercase verb, e.g. received")
    message = (display_message or "").strip()
    if not message or len(message) > _MAX_MESSAGE:
        raise EventValidationError(f"display_message must be 1-{_MAX_MESSAGE} characters")
    try:
        status_enum = EventStatus(status_value)
    except ValueError:
        raise EventValidationError(f"status must be one of {', '.join(s.value for s in EventStatus)}")
    if not _ACTOR_TYPE.match(actor_type or ""):
        raise EventValidationError("actor_type must be a lowercase word, e.g. admin, vendor, user")
    if entity_type is not None and not _ENTITY_TYPE.match(entity_type):
        raise EventValidationError("entity_type must be UPPER_SNAKE_CASE, e.g. PROPERTY, USER_DOCUMENT")
    if entity_id is not None and len(str(entity_id)) > 64:
        raise EventValidationError("entity_id is too long")

    cleaned = _clean_metadata(metadata or {})
    if not isinstance(cleaned, dict):
        raise EventValidationError("metadata must be an object")
    return {
        "user_id": user_id,
        "property_id": property_id,
        "actor_user_id": actor_user_id,
        "actor_display_name": (actor_display_name or None) and actor_display_name[:255],
        "actor_type": actor_type,
        "event_type": event_type,
        "event_action": event_action,
        "display_message": message,
        "entity_type": entity_type,
        "entity_id": str(entity_id) if entity_id is not None else None,
        "event_metadata": cleaned or None,
        "status": status_enum.value,
    }


async def resolve_actor_name(db: AsyncSession, user_id: Optional[str]) -> Optional[str]:
    """The name shown to admins: person, company or agency, from the existing display-name rules."""
    if not user_id:
        return None
    return await resolve_display_name(UserRepository(db), VendorProfileRepository(db), user_id)


class EventAuditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def record(
        self,
        *,
        event_type: str,
        event_action: str,
        display_message: str,
        status_value: Any,
        actor_type: str,
        actor_user_id: Optional[str] = None,
        actor_display_name: Optional[str] = None,
        user_id: Optional[str] = None,
        property_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> EventAuditLog:
        """Store one activity in the caller's transaction. Raises EventValidationError on bad input."""
        if actor_user_id and not actor_display_name:
            actor_display_name = await resolve_actor_name(self.db, actor_user_id)
        values = build_event(
            event_type=event_type,
            event_action=event_action,
            display_message=display_message,
            status_value=status_value,
            actor_type=actor_type,
            actor_user_id=actor_user_id,
            actor_display_name=actor_display_name,
            user_id=user_id,
            property_id=property_id,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata=metadata,
        )
        row = EventAuditLog(**values)
        self.db.add(row)
        await self.db.flush()
        return row

    async def recent(
        self,
        limit: int = 20,
        *,
        user_id: Optional[str] = None,
        property_id: Optional[str] = None,
    ) -> List[EventAuditLog]:
        """Newest first. Filter by user_id or property_id for a per-user or per-property feed."""
        limit = max(1, min(limit, 100))
        query = select(EventAuditLog)
        if user_id is not None:
            query = query.where(EventAuditLog.user_id == user_id)
        if property_id is not None:
            query = query.where(EventAuditLog.property_id == property_id)
        result = await self.db.execute(
            query.order_by(EventAuditLog.created_at.desc(), EventAuditLog.id.desc()).limit(limit)
        )
        return list(result.scalars().all())


def activity_view(row: EventAuditLog) -> Dict[str, Any]:
    """The Recent Activities line: [actor] + [activity] + [status]."""
    return {
        "id": row.id,
        "actorName": row.actor_display_name,
        "actorType": row.actor_type,
        "userId": row.user_id,
        "propertyId": row.property_id,
        "message": row.display_message,
        "eventType": row.event_type,
        "eventAction": row.event_action,
        "status": row.status,
        "statusLabel": STATUS_LABELS.get(row.status, row.status),
        "entityType": row.entity_type,
        "entityId": row.entity_id,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
    }


def require_valid_limit(limit: int) -> int:
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="limit must be between 1 and 100")
    return limit
