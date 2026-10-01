"""Business logic for the customer-facing self-service surface ("my own"
profile, saved properties, wishlist, requirements, property requests) - the
self-service counterpart to app.services.admin_customer_service.

Mirrors that module's own convention: the controller validates the request
body with a Pydantic schema and hands this service a plain dict
(`body.model_dump(exclude_unset=True)`-style); this service never imports
the schema classes themselves.

Property cards (saved/wishlist/property-request listings) are formatted via
an injected ProfileService.to_response - the exact same shape PropertyCard.jsx
already renders everywhere else in this app, rather than inventing a second,
thinner "card" shape (see app.services.profile_service.ProfileService.to_response).
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status

from app.core.response_utils import strip_none_values
from app.repositories.customer_repository import CustomerRepository
from app.services.profile_service import ProfileService

# camelCase (as dumped from CustomerProfileUpdate) -> the Customer model's
# actual column name. Identical mapping to admin_customer_service's
# CUSTOMER_FIELD_MAP, minus the admin/verification-only keys that
# CustomerProfileUpdate doesn't expose in the first place.
CUSTOMER_FIELD_MAP = {
    "fullName": "full_name",
    "phoneNumber": "phone_number",
    "alternatePhone": "alternate_phone",
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
}

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

PROPERTY_REQUEST_FIELD_MAP = {
    "requestedAmount": "requested_amount",
    "budgetMin": "budget_min",
    "budgetMax": "budget_max",
    "preferredDate": "preferred_date",
    "timeline": "timeline",
    "occupantType": "occupant_type",
    "occupantsCount": "occupants_count",
    "employmentType": "employment_type",
    "companyName": "company_name",
    "monthlyIncome": "monthly_income",
    "financingRequired": "financing_required",
    "siteVisitRequested": "site_visit_requested",
    "siteVisitDate": "site_visit_date",
    "isUrgent": "is_urgent",
    "notes": "notes",
}

DOC_URL_FIELD_BY_TYPE = {
    "aadhaar": "aadhaar_doc_url",
    "pan": "pan_doc_url",
    "gst": "gst_doc_url",
    "rera": "rera_doc_url",
}


class CustomerService:
    def __init__(self, repository: CustomerRepository, profile_service: ProfileService):
        self.repository = repository
        # Reused purely for its to_response property-card formatter - never
        # for its vendor-profile methods (this service has no vendor concerns).
        self.profile_service = profile_service

    # ------------------------------------------------------------------
    @staticmethod
    def _to_profile_card(customer) -> Dict[str, Any]:
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

    def _to_property_request_card(self, req) -> Dict[str, Any]:
        return strip_none_values({
            "id": req.id,
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
            "property": self.profile_service.to_response(req.property),
        })

    # ------------------------------------------------------------------
    # Profile
    # ------------------------------------------------------------------
    async def get_my_profile(self, user_id: str) -> Dict[str, Any]:
        customer = await self.repository.get_customer_by_user_id(user_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
        return self._to_profile_card(customer)

    async def update_my_profile(self, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        if not fields:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        mapped = {CUSTOMER_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        updated = await self.repository.update_customer_fields(user_id, mapped)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
        await self.repository.commit()
        return self._to_profile_card(updated)

    async def set_profile_picture_url(self, user_id: str, file_url: Optional[str]) -> Dict[str, Any]:
        updated = await self.repository.update_customer_fields(user_id, {"profile_picture": file_url})
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
        await self.repository.commit()
        return self._to_profile_card(updated)

    async def set_kyc_doc_url(self, user_id: str, doc_type: str, file_url: str) -> Dict[str, Any]:
        column = DOC_URL_FIELD_BY_TYPE.get(doc_type)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid document type '{doc_type}'. Must be one of: {', '.join(DOC_URL_FIELD_BY_TYPE.keys())}",
            )
        updated = await self.repository.update_customer_fields(user_id, {column: file_url})
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
        await self.repository.commit()
        return self._to_profile_card(updated)

    # ------------------------------------------------------------------
    # Requirements
    # ------------------------------------------------------------------
    async def list_my_requirements(self, user_id: str) -> Dict[str, Any]:
        rows = await self.repository.list_requirements(user_id)
        return {"data": [self._to_requirement_card(r) for r in rows]}

    async def create_my_requirement(self, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        mapped = {REQUIREMENT_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        req = await self.repository.create_requirement(user_id, mapped)
        await self.repository.commit()
        return self._to_requirement_card(req)

    async def update_my_requirement(self, requirement_id: int, user_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        if not fields:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        mapped = {REQUIREMENT_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        req = await self.repository.update_requirement(requirement_id, user_id, mapped)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
        await self.repository.commit()
        return self._to_requirement_card(req)

    async def delete_my_requirement(self, requirement_id: int, user_id: str) -> Dict[str, Any]:
        deleted = await self.repository.delete_requirement(requirement_id, user_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
        await self.repository.commit()
        return {"success": True}

    # ------------------------------------------------------------------
    # Saved properties
    # ------------------------------------------------------------------
    async def list_my_saved_properties(self, user_id: str) -> Dict[str, Any]:
        rows = await self.repository.list_saved_properties(user_id)
        return {"data": [self.profile_service.to_response(r.property) for r in rows if r.property]}

    async def save_property(self, user_id: str, property_id: str, notes: Optional[str]) -> Dict[str, Any]:
        prop = await self.repository.get_property_by_id(property_id)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        existing = await self.repository.get_saved_property(user_id, property_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Property already saved")
        await self.repository.add_saved_property(user_id, property_id, notes)
        await self.repository.commit()
        return {"success": True}

    async def unsave_property(self, user_id: str, property_id: str) -> Dict[str, Any]:
        deleted = await self.repository.remove_saved_property(user_id, property_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved property not found")
        await self.repository.commit()
        return {"success": True}

    # ------------------------------------------------------------------
    # Wishlist
    # ------------------------------------------------------------------
    async def list_my_wishlist(self, user_id: str) -> Dict[str, Any]:
        rows = await self.repository.list_wishlist(user_id)
        return {"data": [self.profile_service.to_response(r.property) for r in rows if r.property]}

    async def add_to_wishlist(self, user_id: str, property_id: str) -> Dict[str, Any]:
        prop = await self.repository.get_property_by_id(property_id)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        existing = await self.repository.get_wishlist_item(user_id, property_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Property already in wishlist")
        price_at_add = float(prop.expected_price) if getattr(prop, "expected_price", None) is not None else None
        await self.repository.add_wishlist_item(user_id, property_id, price_at_add)
        await self.repository.commit()
        return {"success": True}

    async def remove_from_wishlist(self, user_id: str, property_id: str) -> Dict[str, Any]:
        deleted = await self.repository.remove_wishlist_item(user_id, property_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found")
        await self.repository.commit()
        return {"success": True}

    # ------------------------------------------------------------------
    # Property requests (purchase / rental) - "Requested Properties"
    # ------------------------------------------------------------------
    async def list_my_property_requests(self, user_id: str, request_type: Optional[str] = None) -> Dict[str, Any]:
        rows = await self.repository.list_own_property_requests(user_id, request_type)
        return {"data": [self._to_property_request_card(r) for r in rows]}

    async def create_my_property_request(self, user_id: str, property_id: str, request_type: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        prop = await self.repository.get_property_by_id(property_id)
        if not prop:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        mapped = {PROPERTY_REQUEST_FIELD_MAP.get(k, k): v for k, v in fields.items()}
        mapped["request_type"] = request_type
        mapped["status"] = "new"
        mapped["status_history"] = [{
            "status": "new",
            "date": datetime.now(timezone.utc).isoformat(),
            "note": "Request submitted",
        }]
        req = await self.repository.create_property_request(user_id, property_id, mapped)
        await self.repository.commit()
        req = await self.repository.get_own_property_request(req.id, user_id)
        return self._to_property_request_card(req)
