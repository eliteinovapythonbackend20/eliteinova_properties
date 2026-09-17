from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Dict, Any

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.repositories.profile_repository import VendorProfileRepository
from app.repositories.property_repository import PropertyRepository
from app.services.property_service import PropertyService
from app.services.profile_service import ProfileService
from app.services.filter_service import FilterService

security = HTTPBearer(auto_error=False)



async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db),VendorProfileRepository(db))

async def get_property_service(db: AsyncSession = Depends(get_db)) -> PropertyService:
    return PropertyService(repository=PropertyRepository(db))

async def get_profile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    return ProfileService(profile_repository=VendorProfileRepository(db))

async def get_filter_service(db: AsyncSession = Depends(get_db)) -> FilterService:
    return FilterService(PropertyRepository(db))

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> Dict[str, Any]:
    """Get current authenticated user"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return await auth_service.get_current_user(credentials.credentials)

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> Optional[Dict[str, Any]]:
    """Get current user if authenticated (optional)"""
    if not credentials:
        return None
    try:
        return await auth_service.get_current_user(credentials.credentials)
    except HTTPException:
        return None

def require_roles(allowed_roles: List[str]):
    """Role-based authorization"""
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role")
        # print(f"User role: {user_role}")  # Debugging line
        if user_role is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found"
            )
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        print(f"Access granted for role: {user_role}")  # Debugging line
        return current_user
    return role_checker

# Pre-defined dependencies
require_admin = require_roles(["admin"])
require_authenticated = require_roles(["admin", "vendor", "user"])
require_vendor = require_roles(["admin", "vendor"])