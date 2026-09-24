import re
from typing import Any, Dict, Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vendor_profile import VendorProfile
from app.repositories.property_repository import VENDOR_MODEL_MAP
from app.schemas.vendor_profile_details import ROLE_EXTRA_ALIASES, ROLE_EXTRA_COLUMN, ROLE_EXTRA_SCHEMA

# Frontend sends camelCase keys that don't convert 1:1 to the VendorProfile
# column names (spelling/casing differences, or a role-specific label for the
# same shared column - e.g. agent's "agencyName" and builder/PM's
# "authFullName" both land on the one company_name/full_name column). Map
# those explicitly, fall back to a generic camelCase -> snake_case conversion
# for everything else.
_FIELD_ALIASES = {
    "aadhaarNumber": "aadhar_number",
    "pinCode": "pincode",
    "mobileNumber": "phone_number",
    "agencyName": "company_name",
    "authFullName": "full_name",
    "authMobile": "phone_number",
    "authWhatsapp": "whatsapp_number",
    "companyWebsite": "website",
    "facebookPage": "facebook",
    "youtubeChannel": "youtube",
    "linkedIn": "linkedin",
    "preferredMethods": "preferred_contact_method",
    "preferredTimes": "preferred_contact_time",
}

_CAMEL_RE = re.compile(r"(?<!^)(?=[A-Z])")


def _to_snake_case(name: str) -> str:
    return _CAMEL_RE.sub("_", name).lower()


class VendorProfileRepository:
    def __init__(self, db: AsyncSession):
            self.db = db

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()

    async def get_vendor_profile(self, user_id:str):
        result = await self.db.execute(
                    select(VendorProfile).where(VendorProfile.user_id == user_id))
        return result.scalar_one_or_none()

    async def update_vendor_profile(self, user_id: str, posted_by: str, update_data: Dict[str, Any]):
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return None

        extra_aliases = ROLE_EXTRA_ALIASES.get(posted_by, set())
        raw_extra: Dict[str, Any] = {}

        protected = {"id", "user_id"}
        for key, value in update_data.items():
            if key in extra_aliases:
                raw_extra[key] = value
                continue
            column = _FIELD_ALIASES.get(key, _to_snake_case(key))
            if column in protected:
                continue
            if hasattr(profile, column):
                setattr(profile, column, value)

        if raw_extra:
            extra_schema = ROLE_EXTRA_SCHEMA[posted_by]
            extra_column = ROLE_EXTRA_COLUMN[posted_by]
            validated = extra_schema.model_validate(raw_extra).model_dump(exclude_unset=True)
            merged = dict(getattr(profile, extra_column) or {})
            merged.update(validated)
            setattr(profile, extra_column, merged)

        await self.db.flush()
        await self.db.refresh(profile)
        return profile

    # ============================================
    # VENDOR-LEVEL DOCUMENT METADATA (sale deed, GST certificate, ...) -
    # stored inside the role-specific JSONB blob (owner_details/
    # agency_details/builder_details/pm_details) under a "documents" sub-key,
    # keyed by doc_type, so the same user_id can hold separate documents per
    # role instead of colliding on a shared (user_id, doc_type) row. Only
    # metadata lives here - the actual file stays in the private bucket, and
    # a fresh signed URL is minted on demand (see ProfileService.get_vendor_document_view_url).
    # ============================================

    async def get_vendor_document_meta(self, user_id: str, posted_by: str, doc_type: str) -> Optional[Dict[str, Any]]:
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return None
        extra_column = ROLE_EXTRA_COLUMN[posted_by]
        documents = (getattr(profile, extra_column) or {}).get("documents") or {}
        return documents.get(doc_type)

    async def get_vendor_documents_meta(self, user_id: str, posted_by: str) -> Dict[str, Any]:
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return {}
        extra_column = ROLE_EXTRA_COLUMN[posted_by]
        return dict((getattr(profile, extra_column) or {}).get("documents") or {})

    async def upsert_vendor_document_meta(
        self, user_id: str, posted_by: str, doc_type: str, metadata: Dict[str, Any]
    ):
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return None
        extra_column = ROLE_EXTRA_COLUMN[posted_by]
        blob = dict(getattr(profile, extra_column) or {})
        documents = dict(blob.get("documents") or {})
        documents[doc_type] = metadata
        blob["documents"] = documents
        setattr(profile, extra_column, blob)
        await self.db.flush()
        await self.db.refresh(profile)
        return profile

    async def delete_vendor_document_meta(self, user_id: str, posted_by: str, doc_type: str) -> bool:
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return False
        extra_column = ROLE_EXTRA_COLUMN[posted_by]
        blob = dict(getattr(profile, extra_column) or {})
        documents = dict(blob.get("documents") or {})
        if doc_type not in documents:
            return False
        documents.pop(doc_type)
        blob["documents"] = documents
        setattr(profile, extra_column, blob)
        await self.db.flush()
        return True