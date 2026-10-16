# app/api/event_audit_controller.py
#
# Admin Dashboard -> Recent Activities. Read-only; activities are written by the
# services through EventAuditService, never by a route.

from typing import Any, Dict

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.core.database import get_db
from app.schemas.event_audit_card import ActivityView, RecentActivitiesResponse
from app.services.event_audit_service import EventAuditService, activity_view, require_valid_limit

router = APIRouter(prefix="/api/v1/admin/activities", tags=["Admin Recent Activities"])


@router.get("", response_model=RecentActivitiesResponse)
async def recent_activities(
    limit: int = Query(20),
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows = await EventAuditService(db).recent(require_valid_limit(limit))
    return RecentActivitiesResponse(data=[ActivityView.model_validate(activity_view(r)) for r in rows])
