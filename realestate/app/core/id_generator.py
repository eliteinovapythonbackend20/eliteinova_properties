from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.property import PropertyCategory, BaseProperty as Property
from app.models.user import User, UserRole


class IDGenerator:
    
    @staticmethod
    def get_role_prefix(role: UserRole) -> str:
        """Get the role-specific prefix"""
        prefix_map = {
            UserRole.USER: "C",      # Customer
            UserRole.VENDOR: "V",    # Vendor
            UserRole.ADMIN: "A",     # Admin
        }
        return prefix_map.get(role, "C")
    
    @staticmethod
    async def generate_user_id(
        db: AsyncSession, 
        role: UserRole,
        prefix: str = "EP"
    ) -> str:
        """Generate a unique user ID with role-based prefix."""
        now = datetime.now()
        year_month = now.strftime("%Y%m")
        role_letter = IDGenerator.get_role_prefix(role)
        
        pattern = f"{prefix}{year_month}{role_letter}"
        result = await db.execute(
            select(func.max(User.id))
            .where(User.id.startswith(pattern))
        )
        latest_id = result.scalar()
        
        if latest_id:
            sequence = int(latest_id[-5:]) + 1
            sequence_str = str(sequence).zfill(5)
        else:
            sequence_str = "00001"
        
        return f"{pattern}{sequence_str}"


    @staticmethod
    def get_property_category(category:PropertyCategory) -> str:
        prefix_map = {
                    PropertyCategory.INDIVIDUAL: "I",      
                    PropertyCategory.APARTMENT: "A",
                    PropertyCategory.COMMERCIAL: "C",
                    PropertyCategory.LAND_PLOT: "L",
                    PropertyCategory.HOSTEL: "H",
                }
        return prefix_map.get(category, "I")

    @staticmethod
    async def generate_property_id(
        db: AsyncSession, 
        category: PropertyCategory,
        user_id: str,
        prefix: str = "EP"
    ) -> str:
        
        now = datetime.now()
        year_month = now.strftime("%Y%m")
        category_letter = IDGenerator.get_property_category(category)
        
        pattern = f"{prefix}{year_month}{category_letter}"
        
        # Query max property ID for this user
        result = await db.execute(
            select(func.max(Property.id))
            .where(Property.user_id == user_id)  # Filter by user_id
            .where(Property.id.startswith(pattern))
        )
        latest_id = result.scalar()
        
        if latest_id:
            # Extract the sequence number and increment
            sequence = int(latest_id[-5:]) + 1
            sequence_str = str(sequence).zfill(5)
        else:
            sequence_str = "00001"
        
        
        return f"{pattern}{sequence_str}"