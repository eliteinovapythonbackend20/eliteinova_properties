"""Request/response schemas for the admin dashboard's Purchase Requests /
Rental Requests surface - backs app.api.admin_property_request_controller.

Kept separate from app.schemas.admin_customer_schemas and
app.schemas.customer_schemas on purpose, same reasoning as those modules'
own docstrings: a distinct admin domain (request moderation) gets its own
schema/repository/service/controller stack. Shares only the status-pipeline
constants and the request_type/status validators with
app.schemas.customer_schemas, imported from there rather than redefined.

Request bodies here are camelCase, responses are camelCase everywhere in
this codebase already via strip_none_values.
"""

from typing import Optional

from pydantic import BaseModel, field_validator

from app.schemas.customer_schemas import (
    PURCHASE_REQUEST_STATUSES,
    RENTAL_REQUEST_STATUSES,
    REQUEST_TYPES,
    _canonicalize,
)

STATUSES_BY_TYPE = {
    "purchase": set(PURCHASE_REQUEST_STATUSES),
    "rental": set(RENTAL_REQUEST_STATUSES),
}


class AdminPropertyRequestListParams(BaseModel):
    page: int = 1
    limit: int = 20
    requestType: Optional[str] = None
    status: Optional[str] = None
    search: Optional[str] = None
    userId: Optional[str] = None
    propertyId: Optional[str] = None

    @field_validator("page")
    @classmethod
    def _validate_page(cls, v: int) -> int:
        if v < 1:
            raise ValueError("page must be greater than 0")
        return v

    @field_validator("limit")
    @classmethod
    def _validate_limit(cls, v: int) -> int:
        if v < 1 or v > 100:
            raise ValueError("limit must be between 1 and 100")
        return v

    @field_validator("requestType")
    @classmethod
    def _validate_request_type(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, REQUEST_TYPES, "requestType")

    # `status` isn't canonicalized here against a single allowed set - its
    # valid values depend on requestType, which may not be present on the
    # same filter call (e.g. filtering status across both types at once from
    # a combined admin view). The controller/service pass it through as a
    # plain string filter; invalid values simply match zero rows.


class AdminPropertyRequestStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("status is required")
        return v.strip().lower().replace(" ", "_")
