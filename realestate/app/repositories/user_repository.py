from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, update
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.user import User, UserStatus, UserRole
from app.core.security import Security
from app.core.id_generator import IDGenerator
from app.models.customer import Customer
from app.models.vendor_profile import VendorProfile

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def create_user(self, user_data: Dict[str, Any]) -> User:
        try:
            role = user_data.get('role', UserRole.USER)
            user_id = await IDGenerator.generate_user_id(self.db, role)
            
            # Create user
            user = User(
                id=user_id,
                email=user_data.get('email'),
                password_hash=Security.hash_password(user_data.get('password')),
                role=role,
                status=UserStatus.PENDING.value,
            )
            
            self.db.add(user)
            await self.db.flush()  # ✅ Flush to get ID without committing
            
            # Create customer
            if role == "user":
                customer = Customer(
                    user_id=user.id,  # ✅ ID now exists in the database
                    full_name=user_data.get('full_name'),
                    phone_number=user_data.get('phone_number'),
                    address=user_data.get('address'),
                    city=user_data.get('city'),
                    state=user_data.get('state'),
                    district = user_data.get('district'),
                    country=user_data.get('country'),
                )
                
                self.db.add(customer)
                await self.db.commit()
                await self.db.refresh(customer)
            if role == "vendor":
                vendor = VendorProfile(
                    user_id=user.id,  # ✅ ID now exists in the database
                    full_name=user_data.get('full_name'),
                    phone_number=user_data.get('phone_number'),
                    address=user_data.get('address'),
                    city=user_data.get('city'),
                    state=user_data.get('state'),
                    district = user_data.get('district'),
                    country=user_data.get('country'),
                    company_name = user_data.get('company_name')
                )
                self.db.add(vendor)
                await self.db.commit()
                await self.db.refresh(vendor)
            
            await self.db.refresh(user)
            user_obj = { "name":user_data.get("full_name"),
                        "phoneNumber":user_data.get("phoneNumber")
                    }
            user = user.update(user_obj)
            
            return user
            
        except Exception as e:
            print(f"❌ Error in create_user: {e}")
            await self.db.rollback()
            raise e
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def update_last_login(self, user_id: str) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        user.last_login = datetime.utcnow()
        await self.db.commit()
        return True
    
    async def delete_user(self, user_id: str) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        await self.db.delete(user)
        await self.db.commit()
        return True

    # ============================================
    # NEW METHODS FOR PASSWORD MANAGEMENT
    # ============================================

    async def update_password(self, user_id: str, hashed_password: str) -> None:
        """Update user password"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                password_hash=hashed_password,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()

    async def save_reset_token(self, user_id: str, token_hash: str, expires_at: datetime) -> None:
        """Save password reset token"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                reset_token=token_hash,
                reset_token_expires=expires_at,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()

    async def get_by_reset_token(self, token_hash: str) -> Optional[User]:
        """Get user by reset token"""
        now = datetime.utcnow()
        result = await self.db.execute(
            select(User).where(
                User.reset_token == token_hash,
                User.reset_token_expires > now
            )
        )
        return result.scalar_one_or_none()

    async def clear_reset_token(self, user_id: str) -> None:
        """Clear reset token after password reset"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                reset_token=None,
                reset_token_expires=None,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()

    # ============================================
    # NEW METHODS FOR EMAIL VERIFICATION
    # ============================================

    async def save_verification_token(self, user_id: str, token_hash: str, expires_at: datetime) -> None:
        """Save email verification token"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                verification_token=token_hash,
                verification_token_expires=expires_at,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()

    async def get_by_verification_token(self, token_hash: str) -> Optional[User]:
        """Get user by verification token"""
        now = datetime.utcnow()
        result = await self.db.execute(
            select(User).where(
                User.verification_token == token_hash,
                User.verification_token_expires > now
            )
        )
        return result.scalar_one_or_none()

    async def verify_email(self, user_id: str) -> None:
        """Mark email as verified"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                is_verified=True,
                verification_token=None,
                verification_token_expires=None,
                status=UserStatus.ACTIVE,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()

    # ============================================
    # NEW METHODS FOR OAUTH
    # ============================================

    async def create_oauth_user(
        self, 
        email: str, 
        full_name: str, 
        provider: str, 
        provider_id: str
    ) -> User:
        """Create user from OAuth login"""
        user_id = await IDGenerator.generate_user_id(self.db, UserRole.USER)
        
        user = User(
            id=user_id,
            email=email,
            full_name=full_name,
            role=UserRole.USER,
            status=UserStatus.ACTIVE,
            is_verified=True,  # OAuth users are automatically verified
            oauth_provider=provider,
            oauth_provider_id=provider_id,
            preferences={}
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_by_oauth_provider(self, provider: str, provider_id: str) -> Optional[User]:
        """Get user by OAuth provider"""
        result = await self.db.execute(
            select(User).where(
                User.oauth_provider == provider,
                User.oauth_provider_id == provider_id
            )
        )
        return result.scalar_one_or_none()

    # ============================================
    # NEW METHOD FOR UPDATING USER PROFILE
    # ============================================

    async def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Optional[User]:
        """Update user profile"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Update only provided fields
        for key, value in user_data.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        
        user.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(user)
        return user


    async def get_customer_by_user_id(self, user_id:str)-> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.user_id == user_id))
        return result.scalar_one_or_none()