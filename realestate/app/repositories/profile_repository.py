import re
from typing import Any, Dict

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vendor_profile import VendorProfile
from app.repositories.property_repository import VENDOR_MODEL_MAP

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
    "officeAddress": "address",
    "officeCity": "city",
    "officeDistrict": "district",
    "officeState": "state",
    "officePinCode": "pincode",
    "companyWebsite": "website",
    "facebookPage": "facebook",
    "youtubeChannel": "youtube",
    "linkedIn": "linkedin",
}

_CAMEL_RE = re.compile(r"(?<!^)(?=[A-Z])")


def _to_snake_case(name: str) -> str:
    return _CAMEL_RE.sub("_", name).lower()


class VendorProfileRepository:
    def __init__(self, db: AsyncSession):
            self.db = db


    async def get_vendor_profile(self, user_id:str):
        result = await self.db.execute(
                    select(VendorProfile).where(VendorProfile.user_id == user_id))
        return result.scalar_one_or_none()

    async def update_vendor_profile(self, user_id: str, update_data: Dict[str, Any]):
        profile = await self.get_vendor_profile(user_id)
        if not profile:
            return None

        protected = {"id", "user_id"}
        for key, value in update_data.items():
            column = _FIELD_ALIASES.get(key, _to_snake_case(key))
            if column in protected:
                continue
            if hasattr(profile, column):
                setattr(profile, column, value)

        await self.db.flush()
        await self.db.refresh(profile)
        return profile