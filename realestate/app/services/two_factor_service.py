from datetime import datetime, timezone
from typing import Dict, List

from fastapi import HTTPException, status

from app.core import totp
from app.core.security import Security
from app.models.user import User
from app.repositories.user_repository import UserRepository


class TwoFactorService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def _get_user(self, user_id: str) -> User:
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def begin_setup(self, user_id: str) -> Dict[str, str]:
        user = await self._get_user(user_id)
        if user.totp_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Two-factor authentication is already enabled",
            )

        # Reuse a secret that was issued but never confirmed. Generating a new
        # one on every call would invalidate a QR code the user already scanned.
        if user.totp_secret:
            secret = totp.decrypt_secret(user.totp_secret)
        else:
            secret = totp.generate_secret()
            await self.user_repository.update_totp_fields(user_id, {
                "totp_secret": totp.encrypt_secret(secret),
                "totp_last_counter": None,
            })

        uri = totp.build_provisioning_uri(secret, user.email)
        return {
            "secret": secret,
            "otpauth_uri": uri,
            "qr_code": totp.render_qr_data_uri(uri),
        }

    async def confirm_setup(self, user_id: str, code: str) -> List[str]:
        user = await self._get_user(user_id)
        if user.totp_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Two-factor authentication is already enabled",
            )
        if not user.totp_secret:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start two-factor setup before verifying a code",
            )

        secret = totp.decrypt_secret(user.totp_secret)
        counter = totp.match_code_counter(secret, code, None)
        if counter is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid authentication code")

        recovery_codes = totp.generate_recovery_codes()
        await self.user_repository.update_totp_fields(user_id, {
            "totp_enabled": True,
            "totp_verified_at": datetime.now(timezone.utc),
            "totp_last_counter": counter,
            "totp_recovery_code_hashes": [totp.hash_recovery_code(c) for c in recovery_codes],
        })
        return recovery_codes

    async def complete_login(self, pending_token: str, code: str) -> User:
        user_id = totp.read_pending_2fa_token(pending_token)
        user = await self.user_repository.get_user_by_id(user_id)
        if not user or not user.totp_enabled or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid two-factor session")

        await self._verify_code(user, code)
        return user

    async def disable(self, user_id: str, password: str, code: str) -> None:
        user = await self._get_user(user_id)
        if not user.totp_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Two-factor authentication is not enabled",
            )
        if not user.password_hash or not Security.verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password is incorrect")

        await self._verify_code(user, code)
        await self.user_repository.update_totp_fields(user_id, {
            "totp_enabled": False,
            "totp_secret": None,
            "totp_verified_at": None,
            "totp_last_counter": None,
            "totp_recovery_code_hashes": None,
        })

    async def _verify_code(self, user: User, code: str) -> None:
        if totp.is_totp_code(code):
            secret = totp.decrypt_secret(user.totp_secret)
            counter = totp.find_matching_counter(secret, code)
            if counter is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")
            if user.totp_last_counter is not None and counter <= user.totp_last_counter:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="This code was already used. Wait for the next code in your authenticator app.",
                )
            await self.user_repository.update_totp_fields(user.id, {"totp_last_counter": counter})
            return

        remaining = list(user.totp_recovery_code_hashes or [])
        digest = totp.hash_recovery_code(code)
        if digest not in remaining:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")
        remaining.remove(digest)
        await self.user_repository.update_totp_fields(user.id, {"totp_recovery_code_hashes": remaining})
