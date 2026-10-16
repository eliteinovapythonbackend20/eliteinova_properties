# Office-only auth endpoints, kept out of admin_controller.py on purpose - the
# office login form must never authenticate an admin/vendor/customer's correct
# credentials, so it gets its own router with its own role lock, independent
# of the admin login path. Office accounts have no self-registration or
# password-reset route (an admin provisions them via admin_controller.py's
# /office-users), so there is no parallel to auth_controller's forgot-password
# flow here - credentials-only, same as the account's only way to exist.

from typing import Union

from fastapi import APIRouter, Depends

from app.services.auth_service import AuthService
from app.api.dependencies import get_auth_service
from app.schemas.auth import (
    LoginResponse,
    TwoFactorRequiredResponse,
    TwoFactorVerifyRequest,
    UserLogin,
    UserResponse,
)

router = APIRouter()

OFFICE_ONLY = ["office"]


@router.post("/login", response_model=Union[TwoFactorRequiredResponse, LoginResponse])
async def office_login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Office: login. Same email/password check as /auth/login, but the account
    must actually have role=office - anything else (even a correct password for
    a real admin/vendor/customer account) is rejected here with 403."""
    result = await auth_service.login_restricted(login_data, OFFICE_ONLY)
    if result.get("requires_2fa"):
        return TwoFactorRequiredResponse(pending_token=result["pending_token"])
    return LoginResponse(
        message="Office login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )


@router.post("/2fa/verify", response_model=LoginResponse)
async def office_two_factor_verify(
    verify_data: TwoFactorVerifyRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Office: completes office_login for an office account that has 2FA enabled."""
    result = await auth_service.complete_two_factor_login_restricted(
        verify_data.pending_token, verify_data.code, OFFICE_ONLY
    )
    return LoginResponse(
        message="Office login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )
