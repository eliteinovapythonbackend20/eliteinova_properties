"""Response payload for the admin dashboard's Recent Activities feed
(activity_view in app/services/event_audit_service.py)."""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ActivityView(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    actor_name: Optional[str] = Field(None, alias="actorName")
    actor_type: Optional[str] = Field(None, alias="actorType")
    user_id: Optional[str] = Field(None, alias="userId")
    property_id: Optional[str] = Field(None, alias="propertyId")
    message: Optional[str] = None
    event_type: Optional[str] = Field(None, alias="eventType")
    event_action: Optional[str] = Field(None, alias="eventAction")
    status: Optional[str] = None
    status_label: Optional[str] = Field(None, alias="statusLabel")
    entity_type: Optional[str] = Field(None, alias="entityType")
    entity_id: Optional[str] = Field(None, alias="entityId")
    created_at: Optional[str] = Field(None, alias="createdAt")


class RecentActivitiesResponse(BaseModel):
    success: bool = True
    data: List[ActivityView]
