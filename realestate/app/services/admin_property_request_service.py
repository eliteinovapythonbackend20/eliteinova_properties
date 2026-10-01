"""Business logic for the admin dashboard's Purchase Requests / Rental
Requests surface - backs app.api.admin_property_request_controller.

Mirrors admin_customer_service.py's own convention: the controller validates
the request body with a Pydantic schema and hands this service a plain
dict; this service never imports the schema classes themselves except for
the status-pipeline constants used to validate a status transition against
the request's own request_type.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status

from app.core.response_utils import strip_none_values
from app.repositories.admin_property_request_repository import AdminPropertyRequestRepository
from app.schemas.customer_schemas import PURCHASE_REQUEST_STATUSES, RENTAL_REQUEST_STATUSES
from app.services.profile_service import ProfileService

STATUSES_BY_TYPE = {
    "purchase": set(PURCHASE_REQUEST_STATUSES),
    "rental": set(RENTAL_REQUEST_STATUSES),
}


class AdminPropertyRequestService:
    def __init__(self, repository: AdminPropertyRequestRepository, profile_service: ProfileService):
        self.repository = repository
        # Reused purely for its to_response property-card formatter.
        self.profile_service = profile_service

    @staticmethod
    def _cover_image(media_list) -> Optional[str]:
        if not media_list:
            return None
        primary = next((m for m in media_list if m.is_primary and m.media_type == "image"), None)
        if primary:
            return primary.file_url
        first_image = next((m for m in media_list if m.media_type == "image"), None)
        return first_image.file_url if first_image else None

    def _to_card(self, req) -> Dict[str, Any]:
        user = getattr(req, "user", None)
        customer = getattr(user, "customer", None) if user else None
        prop = getattr(req, "property", None)
        return strip_none_values({
            "id": req.id,
            "userId": req.user_id,
            "customerName": customer.full_name if customer else None,
            "customerEmail": user.email if user else None,
            "customerPhone": customer.phone_number if customer else None,
            "propertyId": req.property_id,
            "propertyTitle": prop.property_title if prop else None,
            "propertyType": prop.property_type if prop else None,
            "city": prop.city if prop else None,
            "state": prop.state if prop else None,
            "address": prop.address if prop else None,
            "coverImage": self._cover_image(getattr(prop, "media", None)) if prop else None,
            "requestType": req.request_type,
            "status": req.status,
            "statusHistory": req.status_history or [],
            "requestedAmount": float(req.requested_amount) if req.requested_amount is not None else None,
            "budgetMin": float(req.budget_min) if req.budget_min is not None else None,
            "budgetMax": float(req.budget_max) if req.budget_max is not None else None,
            "preferredDate": req.preferred_date.isoformat() if req.preferred_date else None,
            "timeline": req.timeline,
            "occupantType": req.occupant_type,
            "occupantsCount": req.occupants_count,
            "employmentType": req.employment_type,
            "companyName": req.company_name,
            "monthlyIncome": float(req.monthly_income) if req.monthly_income is not None else None,
            "financingRequired": req.financing_required,
            "siteVisitRequested": bool(req.site_visit_requested),
            "siteVisitDate": req.site_visit_date.isoformat() if req.site_visit_date else None,
            "isUrgent": bool(req.is_urgent),
            "notes": req.notes,
            "createdAt": req.created_at.isoformat() if req.created_at else None,
            "updatedAt": req.updated_at.isoformat() if req.updated_at else None,
        })

    def _to_detail(self, req) -> Dict[str, Any]:
        """Same as _to_card plus the full formatted property object - used
        by the single-request GET (Details screen), not the list (Management
        screen), to keep list payloads light."""
        card = self._to_card(req)
        prop = getattr(req, "property", None)
        if prop:
            card["property"] = self.profile_service.to_response(prop)
        return card

    @staticmethod
    def _paginate(total: int, page: int, limit: int) -> Dict[str, Any]:
        total_pages = (total + limit - 1) // limit if limit else 0
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        }

    # ------------------------------------------------------------------
    async def list_requests(
        self, page: int = 1, limit: int = 20, request_type: Optional[str] = None,
        status_filter: Optional[str] = None, search: Optional[str] = None,
        user_id: Optional[str] = None, property_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        rows, total = await self.repository.list_requests(
            skip=skip, limit=limit, request_type=request_type, status=status_filter,
            search=search, user_id=user_id, property_id=property_id,
        )
        return {
            "data": [self._to_card(r) for r in rows],
            "pagination": self._paginate(total, page, limit),
        }

    async def get_stats(self, request_type: Optional[str] = None) -> Dict[str, Any]:
        return await self.repository.get_stats(request_type=request_type)

    async def get_request(self, request_id: int) -> Dict[str, Any]:
        req = await self.repository.get_request_by_id(request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
        return self._to_detail(req)

    async def update_status(self, request_id: int, new_status: str, note: Optional[str]) -> Dict[str, Any]:
        req = await self.repository.get_request_by_id(request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

        allowed = STATUSES_BY_TYPE.get(req.request_type, set())
        if new_status not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status '{new_status}' for a {req.request_type} request. Allowed: {', '.join(sorted(allowed))}",
            )

        history = list(req.status_history or [])
        history.append({
            "status": new_status,
            "date": datetime.now(timezone.utc).isoformat(),
            "note": note,
        })

        updated = await self.repository.update_status(request_id, new_status, history)
        await self.repository.commit()
        return self._to_card(updated)

    async def delete_request(self, request_id: int) -> Dict[str, Any]:
        deleted = await self.repository.delete_request(request_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
        await self.repository.commit()
        return {"success": True}
