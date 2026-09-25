"""Business logic for the admin dashboard's property surface.

Kept separate from PropertyService on purpose (see AdminDashboardRepository's
docstring) - admin moderation has different rules than vendor authoring
(every status visible, no ownership check, no vendor-contact formatting), so
it gets its own service instead of growing extra branches inside the
vendor/public-facing one.
"""

from datetime import date
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status

from app.core.response_utils import strip_none_values
from app.repositories.admin_dashboard_repository import AdminDashboardRepository
from app.services.file_service import FileService


class AdminDashboardService:
    def __init__(self, repository: AdminDashboardRepository, file_service: Optional[FileService] = None):
        self.repository = repository
        self.file_service = file_service or FileService()

    # ------------------------------------------------------------------
    @staticmethod
    def _cover_image(media_list) -> Optional[str]:
        if not media_list:
            return None
        primary = next((m for m in media_list if m.is_primary and m.media_type == "image"), None)
        if primary:
            return primary.file_url
        first_image = next((m for m in media_list if m.media_type == "image"), None)
        return first_image.file_url if first_image else None

    @staticmethod
    def _posted_by_name(prop) -> Optional[str]:
        """Who posted this listing, displayed as a person's name for
        Owner/Agent but a company name for Builder/Property Management -
        matching how each role actually presents itself (an owner has no
        company; a builder's/PM's own name is secondary to their company)."""
        posted_by = prop.posted_by
        if posted_by == "OWNER":
            detail = getattr(prop, "owner_details", None)
            return detail.owner_name if detail else None
        if posted_by == "AGENT":
            detail = getattr(prop, "agent_details", None)
            return detail.agent_name if detail else None
        if posted_by == "BUILDER":
            detail = getattr(prop, "builder_details", None)
            return detail.company_name if detail else None
        if posted_by == "PROPERTY_MANAGEMENT":
            detail = getattr(prop, "property_management_details", None)
            return detail.company_name if detail else None
        return None

    def _to_card(self, prop) -> Dict[str, Any]:
        """Moderation-list card - just enough to identify, locate, and act on
        a listing (no vendor KYC/contact block; this is an internal admin
        view, but it's still a list view, not a full detail view)."""
        return strip_none_values({
            "id": prop.id,
            "userId": prop.user_id,
            "vendorEmail": prop.user.email if getattr(prop, "user", None) else None,
            "postedBy": prop.posted_by,
            "postedByName": self._posted_by_name(prop),
            "propertyCategory": prop.property_category,
            "listingPurpose": prop.listing_purpose,
            "propertyType": prop.property_type,
            # Independent of propertyType - only Land & Plots listings
            # actually have this set (e.g. "Residential Land", "Agricultural
            # Land"); every other category leaves it null, and the frontend
            # only shows it when there's a real value to show.
            "subCategory": prop.sub_category,
            "propertyTitle": prop.property_title,
            "status": prop.status or "Active",
            "featured": bool(prop.featured),
            "verificationStatus": prop.verification_status or "Not Verified",
            "address": prop.address,
            "district": prop.district,
            "city": prop.city,
            "state": prop.state,
            "area": prop.area,
            "pinCode": prop.pin_code,
            "latitude": prop.latitude,
            "longitude": prop.longitude,
            "expectedPrice": float(prop.expected_price) if prop.expected_price is not None else None,
            # Optional negotiation range a vendor can fill alongside the
            # required expectedPrice (see the posting forms' "budget range" /
            # min-max fields) - not every property has one set.
            "priceMin": float(prop.price_min) if prop.price_min is not None else None,
            "priceMax": float(prop.price_max) if prop.price_max is not None else None,
            "description": prop.property_discription,
            "coverImage": self._cover_image(getattr(prop, "media", None)),
            "createdAt": prop.created_at.isoformat() if prop.created_at else None,
            "updatedAt": prop.updated_at.isoformat() if prop.updated_at else None,
        })

    # ------------------------------------------------------------------
    async def list_properties(
        self,
        page: int = 1,
        limit: int = 20,
        posted_by: Optional[str] = None,
        property_category: Optional[str] = None,
        property_type: Optional[str] = None,
        sub_category: Optional[str] = None,
        status: Optional[str] = None,
        listing_purpose: Optional[str] = None,
        featured: Optional[bool] = None,
        verification_status: Optional[str] = None,
        search: Optional[str] = None,
        created_from: Optional[date] = None,
        created_to: Optional[date] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        properties, total = await self.repository.list_properties(
            skip=skip, limit=limit, posted_by=posted_by,
            property_category=property_category, property_type=property_type,
            sub_category=sub_category,
            status=status, listing_purpose=listing_purpose,
            featured=featured, verification_status=verification_status, search=search,
            created_from=created_from, created_to=created_to,
        )
        data = [self._to_card(p) for p in properties]
        total_pages = (total + limit - 1) // limit if limit else 0
        return {
            "data": data,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "totalPages": total_pages,
            },
        }

    async def get_property_stats(
        self,
        posted_by: Optional[str] = None,
        property_category: Optional[str] = None,
        property_type: Optional[str] = None,
        sub_category: Optional[str] = None,
        created_from: Optional[date] = None,
        created_to: Optional[date] = None,
    ) -> Dict[str, Any]:
        return await self.repository.get_property_stats(
            posted_by=posted_by, property_category=property_category, property_type=property_type,
            sub_category=sub_category, created_from=created_from, created_to=created_to,
        )

    async def update_property_status(self, property_id: str, new_status: str) -> Dict[str, Any]:
        prop = await self.repository.update_property_status(property_id, new_status)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        await self.repository.commit()
        return {"id": prop.id, "status": prop.status}

    async def update_property(self, property_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        # The schema's `description` is user-facing; the model column is
        # `property_discription` (pre-existing name in app.models.property).
        if "description" in fields:
            fields = {**fields, "property_discription": fields.pop("description")}
        prop = await self.repository.update_property(property_id, fields)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        await self.repository.commit()
        # _to_card touches relationships (user/owner_details/...) that a bare
        # update_property() row doesn't have eager-loaded - refetch with them.
        full_prop = await self.repository.get_property_with_relations(property_id)
        return self._to_card(full_prop)

    async def delete_property(self, property_id: str) -> Dict[str, Any]:
        prop = await self.repository.get_property_with_media(property_id)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

        file_paths: List[str] = []
        for media in prop.media or []:
            if media.file_url:
                file_paths.append(media.file_url)
            if media.thumbnail_url:
                file_paths.append(media.thumbnail_url)
        for doc in prop.documents or []:
            if doc.file_url:
                file_paths.append(doc.file_url)

        await self.repository.delete_property(property_id)
        await self.repository.commit()

        if file_paths:
            try:
                await self.file_service.delete_files(file_paths)
            except Exception as e:
                print(f"Failed to delete property files from storage: {e}")

        return {"deleted": True, "id": property_id}
