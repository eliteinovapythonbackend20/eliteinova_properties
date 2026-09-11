from typing import Any, Dict

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vendor_profile import VendorProfile
from app.repositories.property_repository import VENDOR_MODEL_MAP

class VendorProfileRepository:
    def __init__(self, db: AsyncSession):
            self.db = db


    async def get_vendor_profile(self, user_id:str):
        result = await self.db.execute(
                    select(VendorProfile).where(VendorProfile.user_id == user_id))
        return result.scalar_one_or_none()

    async def update_vendor_profile(self, user_id:str):
        pass