"""Business logic for the admin dashboard's customer-management surface.

Kept separate from AdminDashboardService on purpose (see
AdminCustomerRepository's docstring) - customer moderation has different
rules and a different shape than property moderation, so it gets its own
service instead of growing extra branches inside that one.

Mirrors AdminDashboardService's own convention: the controller validates the
request body with a Pydantic schema and hands this service a plain dict
(`body.model_dump(exclude_unset=True)`-style) - these methods never import
the schema classes themselves, keeping the service/schema layers decoupled
the same way admin_dashboard_service.update_property does.

Identity: a user with role=USER IS the customer - `user_id` (users.id, the
EP... string) is the handle used throughout, both as the method parameter
and as the only "which customer" field in every response (`userId`). The
internal integer `Customer.id` PK is never surfaced.
"""

import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status

from app.core.response_utils import strip_none_values
from app.repositories.admin_customer_repository import AdminCustomerRepository

# camelCase (as sent by the frontend / dumped from the request schemas) ->
# the Customer model's actual column name. `status` is deliberately absent -
# it lives on the joined User row and is routed there separately.
CUSTOMER_FIELD_MAP = {
    "fullName": "full_name",
    "phoneNumber": "phone_number",
    "alternatePhone": "alternate_phone",
    "profilePicture": "profile_picture",
    "bio": "bio",
    "address": "address",
    "city": "city",
    "state": "state",
    "district": "district",
    "country": "country",
    "pincode": "pincode",
    "customerType": "customer_type",
    "dateOfBirth": "date_of_birth",
    "gender": "gender",
    "maritalStatus": "marital_status",
    "occupation": "occupation",
    "employmentType": "employment_type",
    "companyName": "company_name",
    "designation": "designation",
    "annualIncome": "annual_income",
    "preferredContactChannel": "preferred_contact_channel",
    "preferredContactTime": "preferred_contact_time",
    "preferredLanguage": "preferred_language",
    "newsletterOptIn": "newsletter_opt_in",
    "emailVerified": "email_verified",
    "phoneVerified": "phone_verified",
    "kycStatus": "kyc_status",
    "kycAadhaarVerified": "kyc_aadhaar_verified",
    "kycPanVerified": "kyc_pan_verified",
    "kycGstVerified": "kyc_gst_verified",
    "kycReraVerified": "kyc_rera_verified",
    "aadhaarDocUrl": "aadhaar_doc_url",
    "panDocUrl": "pan_doc_url",
    "gstDocUrl": "gst_doc_url",
    "reraDocUrl": "rera_doc_url",
}

KYC_FIELD_MAP = {
    "kycStatus": "kyc_status",
    "aadhaarVerified": "kyc_aadhaar_verified",
    "panVerified": "kyc_pan_verified",
    "gstVerified": "kyc_gst_verified",
    "reraVerified": "kyc_rera_verified",
}

# CustomerRequirement's field set is deliberately minimal - it backs a
# future requirement-filter page whose actual form hasn't been designed
# yet. Do not add buyer/tenant-specific fields here speculatively.
REQUIREMENT_FIELD_MAP = {
    "propertyCategory": "property_category",
    "listingPurpose": "listing_purpose",
    "propertyType": "property_type",
    "bedrooms": "bedrooms",
    "preferredLocation": "preferred_location",
    "city": "city",
    "state": "state",
    "budgetMin": "budget_min",
    "budgetMax": "budget_max",
    "furnishingStatus": "furnishing_status",
    "notes": "notes",
    "isActive": "is_active",
}


class AdminCustomerService:
    def __init__(self, repository: AdminCustomerRepository):
        self.repository = repository

    # ------------------------------------------------------------------
    @staticmethod
    def _cover_image(media_list) -> Optional[str]:
        """Identical logic to AdminDashboardService._cover_image - primary
        image if set, else the first image, else null. Duplicated rather
        than imported, matching this codebase's already-established
        separation between the property-admin and customer-admin stacks."""
        if not media_list:
            return None
        primary = next((m for m in media_list if m.is_primary and m.media_type == "image"), None)
        if primary:
            return primary.file_url
        first_image = next((m for m in media_list if m.media_type == "image"), None)
        return first_image.file_url if first_image else None

    def _to_card(self, customer) -> Dict[str, Any]:
        user = getattr(customer, "user", None)
        return strip_none_values({
            "userId": customer.user_id,
            "fullName": customer.full_name,
            "email": user.email if user else None,
            "phoneNumber": customer.phone_number,
            "alternatePhone": customer.alternate_phone,
            "profilePicture": customer.profile_picture,
            "bio": customer.bio,
            "address": customer.address,
            "city": customer.city,
            "state": customer.state,
            "district": customer.district,
            "country": customer.country,
            "pincode": customer.pincode,
            "customerType": customer.customer_type,
            "status": user.status if user else None,
            "kycStatus": customer.kyc_status,
            "kycAadhaarVerified": bool(customer.kyc_aadhaar_verified),
            "kycPanVerified": bool(customer.kyc_pan_verified),
            "kycGstVerified": bool(customer.kyc_gst_verified),
            "kycReraVerified": bool(customer.kyc_rera_verified),
            "aadhaarDocUrl": customer.aadhaar_doc_url,
            "panDocUrl": customer.pan_doc_url,
            "gstDocUrl": customer.gst_doc_url,
            "reraDocUrl": customer.rera_doc_url,
            "emailVerified": bool(customer.email_verified),
            "phoneVerified": bool(customer.phone_verified),
            "occupation": customer.occupation,
            "employmentType": customer.employment_type,
            "companyName": customer.company_name,
            "designation": customer.designation,
            "annualIncome": float(customer.annual_income) if customer.annual_income is not None else None,
            "dateOfBirth": customer.date_of_birth.isoformat() if customer.date_of_birth else None,
            "gender": customer.gender,
            "maritalStatus": customer.marital_status,
            "preferredContactChannel": customer.preferred_contact_channel,
            "preferredContactTime": customer.preferred_contact_time,
            "preferredLanguage": customer.preferred_language,
            "newsletterOptIn": bool(customer.newsletter_opt_in),
            "createdAt": user.created_at.isoformat() if user and user.created_at else None,
            "updatedAt": user.updated_at.isoformat() if user and user.updated_at else None,
        })

    def _to_requirement_card(self, req) -> Dict[str, Any]:
        return strip_none_values({
            "id": req.id,
            "userId": req.user_id,
            "propertyCategory": req.property_category,
            "listingPurpose": req.listing_purpose,
            "propertyType": req.property_type,
            "bedrooms": req.bedrooms,
            "preferredLocation": req.preferred_location,
            "city": req.city,
            "state": req.state,
            "budgetMin": float(req.budget_min) if req.budget_min is not None else None,
            "budgetMax": float(req.budget_max) if req.budget_max is not None else None,
            "furnishingStatus": req.furnishing_status,
            "notes": req.notes,
            "isActive": bool(req.is_active),
            "createdAt": req.created_at.isoformat() if req.created_at else None,
            "updatedAt": req.updated_at.isoformat() if req.updated_at else None,
        })

    def _base_activity_fields(self, row) -> Dict[str, Any]:
        """Shared join-through fields common to saved-properties, wishlist,
        and (mostly) property-views cards - one place for the
        user/customer-profile/property lookups so the three _to_*_card
        methods below don't repeat the null-guarding."""
        user = getattr(row, "user", None)
        customer = getattr(user, "customer", None) if user else None
        prop = getattr(row, "property", None)
        return {
            "customerName": customer.full_name if customer else None,
            "customerEmail": user.email if user else None,
            "customerPhone": customer.phone_number if customer else None,
            "propertyId": row.property_id,
            "propertyTitle": prop.property_title if prop else None,
            "propertyType": prop.property_type if prop else None,
            "propertyCategory": prop.property_category if prop else None,
            "listingPurpose": prop.listing_purpose if prop else None,
            "city": prop.city if prop else None,
            "state": prop.state if prop else None,
            "address": prop.address if prop else None,
            "price": float(prop.expected_price) if prop and prop.expected_price is not None else None,
            "propertyStatus": prop.status if prop else None,
            "coverImage": self._cover_image(getattr(prop, "media", None)) if prop else None,
        }

    def _to_saved_property_card(self, row) -> Dict[str, Any]:
        return strip_none_values({
            "id": row.id,
            "userId": row.user_id,
            **self._base_activity_fields(row),
            "notes": row.notes,
            "savedAt": row.saved_at.isoformat() if row.saved_at else None,
        })

    def _to_wishlist_card(self, row) -> Dict[str, Any]:
        prop = getattr(row, "property", None)
        current_price = float(prop.expected_price) if prop and prop.expected_price is not None else None
        price_at_add = float(row.price_at_add) if row.price_at_add is not None else None
        price_changed = price_at_add is not None and current_price is not None and price_at_add != current_price

        is_new = False
        if prop is not None and prop.created_at:
            created_at = prop.created_at
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            is_new = (datetime.now(timezone.utc) - created_at) <= timedelta(days=7)

        return strip_none_values({
            "id": row.id,
            "userId": row.user_id,
            **self._base_activity_fields(row),
            "priceAtAdd": price_at_add,
            "currentPrice": current_price,
            "priceChanged": price_changed,
            "isNew": is_new,
            "addedAt": row.added_at.isoformat() if row.added_at else None,
        })

    def _to_property_view_card(self, row) -> Dict[str, Any]:
        user = getattr(row, "user", None)
        customer = getattr(user, "customer", None) if user else None
        prop = getattr(row, "property", None)
        return strip_none_values({
            "id": row.id,
            "userId": row.user_id,
            "customerName": customer.full_name if customer else None,
            "propertyId": row.property_id,
            "propertyTitle": prop.property_title if prop else None,
            "viewCount": row.view_count,
            "firstViewedAt": row.first_viewed_at.isoformat() if row.first_viewed_at else None,
            "lastViewedAt": row.last_viewed_at.isoformat() if row.last_viewed_at else None,
        })

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
    # Customers
    # ------------------------------------------------------------------
    async def list_customers(
        self, page: int = 1, limit: int = 20, customer_type: Optional[str] = None,
        status: Optional[str] = None, kyc_status: Optional[str] = None,
        search: Optional[str] = None, city: Optional[str] = None, state: Optional[str] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        customers, total = await self.repository.list_customers(
            skip=skip, limit=limit, customer_type=customer_type, status=status,
            kyc_status=kyc_status, search=search, city=city, state=state,
        )
        return {
            "data": [self._to_card(c) for c in customers],
            "pagination": self._paginate(total, page, limit),
        }

    async def get_customer_stats(
        self, customer_type: Optional[str] = None, status: Optional[str] = None,
        kyc_status: Optional[str] = None, search: Optional[str] = None,
        city: Optional[str] = None, state: Optional[str] = None,
    ) -> Dict[str, Any]:
        return await self.repository.get_customer_stats(
            customer_type=customer_type, status=status, kyc_status=kyc_status,
            search=search, city=city, state=state,
        )

    async def get_customer(self, user_id: str) -> Dict[str, Any]:
        customer = await self.repository.get_customer_by_user_id(user_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return self._to_card(customer)

    async def create_customer(self, data: Dict[str, Any]) -> Dict[str, Any]:
        existing = await self.repository.get_user_by_email(data["email"])
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        password = data.get("password") or secrets.token_urlsafe(12)
        create_status = data.get("status")

        customer_fields: Dict[str, Any] = {"full_name": data["fullName"], "phone_number": data["phoneNumber"]}
        skip_keys = {"fullName", "email", "phoneNumber", "password", "status"}
        for key, value in data.items():
            if key in skip_keys or value is None:
                continue
            customer_fields[CUSTOMER_FIELD_MAP.get(key, key)] = value

        customer = await self.repository.create_customer(
            email=data["email"], password=password, status=create_status, customer_fields=customer_fields,
        )
        await self.repository.commit()
        return self._to_card(customer)

    async def update_customer(self, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        if not fields:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

        # `status` lives on the joined User row - route it separately from
        # the Customer-column update.
        new_status = fields.pop("status", None)
        customer_fields = {CUSTOMER_FIELD_MAP.get(k, k): v for k, v in fields.items()}

        if customer_fields:
            updated = await self.repository.update_customer_fields(user_id, customer_fields)
            if not updated:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        if new_status is not None:
            updated = await self.repository.update_user_status(user_id, new_status)
            if not updated:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

        await self.repository.commit()
        full_customer = await self.repository.get_customer_by_user_id(user_id)
        if not full_customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return self._to_card(full_customer)

    async def update_status(self, user_id: str, new_status: str) -> Dict[str, Any]:
        updated = await self.repository.update_user_status(user_id, new_status)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        await self.repository.commit()
        full_customer = await self.repository.get_customer_by_user_id(user_id)
        return self._to_card(full_customer)

    async def update_kyc(self, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        mapped = {KYC_FIELD_MAP[k]: v for k, v in fields.items() if k in KYC_FIELD_MAP}
        if not mapped:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        updated = await self.repository.update_customer_fields(user_id, mapped)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        await self.repository.commit()
        full_customer = await self.repository.get_customer_by_user_id(user_id)
        return self._to_card(full_customer)

    async def delete_customer(self, user_id: str) -> Dict[str, Any]:
        deleted = await self.repository.delete_customer(user_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        await self.repository.commit()
        return {"success": True}

    # ------------------------------------------------------------------
    # Requirements
    # ------------------------------------------------------------------
    async def list_requirements(self, user_id: str) -> Dict[str, Any]:
        customer = await self.repository.get_customer_by_user_id(user_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        rows = await self.repository.list_requirements(user_id)
        return {"data": [self._to_requirement_card(r) for r in rows]}

    async def create_requirement(self, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        customer = await self.repository.get_customer_by_user_id(user_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        mapped = {REQUIREMENT_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        req = await self.repository.create_requirement(user_id, mapped)
        await self.repository.commit()
        return self._to_requirement_card(req)

    async def update_requirement(self, requirement_id: int, fields: Dict[str, Any]) -> Dict[str, Any]:
        if not fields:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        mapped = {REQUIREMENT_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        req = await self.repository.update_requirement(requirement_id, mapped)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
        await self.repository.commit()
        return self._to_requirement_card(req)

    async def delete_requirement(self, requirement_id: int) -> Dict[str, Any]:
        deleted = await self.repository.delete_requirement(requirement_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
        await self.repository.commit()
        return {"success": True}

    # ------------------------------------------------------------------
    # Saved properties / wishlist / property views (admin-wide)
    # ------------------------------------------------------------------
    async def list_saved_properties(
        self, page: int = 1, limit: int = 20, search: Optional[str] = None, user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        rows, total = await self.repository.list_saved_properties(
            skip=skip, limit=limit, search=search, user_id=user_id,
        )
        return {
            "data": [self._to_saved_property_card(r) for r in rows],
            "pagination": self._paginate(total, page, limit),
        }

    async def delete_saved_property(self, saved_id: int) -> Dict[str, Any]:
        deleted = await self.repository.delete_saved_property(saved_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved property not found")
        await self.repository.commit()
        return {"success": True}

    async def list_wishlist(
        self, page: int = 1, limit: int = 20, search: Optional[str] = None, user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        rows, total = await self.repository.list_wishlist(
            skip=skip, limit=limit, search=search, user_id=user_id,
        )
        return {
            "data": [self._to_wishlist_card(r) for r in rows],
            "pagination": self._paginate(total, page, limit),
        }

    async def delete_wishlist_item(self, wishlist_id: int) -> Dict[str, Any]:
        deleted = await self.repository.delete_wishlist_item(wishlist_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found")
        await self.repository.commit()
        return {"success": True}

    async def list_property_views(
        self, page: int = 1, limit: int = 20, user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        skip = (page - 1) * limit
        rows, total = await self.repository.list_property_views(skip=skip, limit=limit, user_id=user_id)
        return {
            "data": [self._to_property_view_card(r) for r in rows],
            "pagination": self._paginate(total, page, limit),
        }
