import base64
import hashlib
import hmac
import io
import secrets
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import pyotp
import qrcode
from cryptography.fernet import Fernet, InvalidToken
from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError

from app.core.config import settings

PENDING_2FA_TOKEN_TYPE = "2fa_pending"
RECOVERY_CODE_COUNT = 8


def generate_secret() -> str:
    return pyotp.random_base32()


def build_provisioning_uri(secret: str, account_email: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(
        name=account_email,
        issuer_name=settings.TOTP_ISSUER,
    )


def render_qr_data_uri(uri: str) -> str:
    image = qrcode.make(uri)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def find_matching_counter(secret: str, code: str) -> Optional[int]:
    totp = pyotp.TOTP(secret)
    now = datetime.now(timezone.utc)
    current = totp.timecode(now)
    for offset in range(-settings.TOTP_VALID_WINDOW, settings.TOTP_VALID_WINDOW + 1):
        if hmac.compare_digest(totp.at(now, offset), code):
            return current + offset
    return None


def match_code_counter(
    secret: str,
    code: str,
    last_used_counter: Optional[int],
) -> Optional[int]:
    """Return the time-step counter the code matched, or None.

    Rejects codes whose counter is not strictly newer than the last accepted
    one, so a captured code cannot be replayed inside its validity window.
    """
    counter = find_matching_counter(secret, code)
    if counter is None:
        return None
    if last_used_counter is not None and counter <= last_used_counter:
        return None
    return counter


def _fernet() -> Fernet:
    if settings.TOTP_ENCRYPTION_KEY:
        key = settings.TOTP_ENCRYPTION_KEY.encode()
    else:
        key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
    return Fernet(key)


def encrypt_secret(secret: str) -> str:
    return _fernet().encrypt(secret.encode()).decode()


def decrypt_secret(token: str) -> str:
    try:
        return _fernet().decrypt(token.encode()).decode()
    except InvalidToken:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stored two-factor secret could not be decrypted",
        )


def generate_recovery_codes() -> List[str]:
    codes = []
    for _ in range(RECOVERY_CODE_COUNT):
        raw = secrets.token_hex(4).upper()
        codes.append(f"{raw[:4]}-{raw[4:]}")
    return codes


def normalize_recovery_code(code: str) -> str:
    return code.replace("-", "").replace(" ", "").upper()


def hash_recovery_code(code: str) -> str:
    return hashlib.sha256(normalize_recovery_code(code).encode()).hexdigest()


def is_totp_code(code: str) -> bool:
    return len(code) == 6 and code.isdigit()


def create_pending_2fa_token(user_id: str, email: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.TWO_FACTOR_PENDING_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": email,
        "user_id": user_id,
        "type": PENDING_2FA_TOKEN_TYPE,
        "exp": expires,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def read_pending_2fa_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Your sign-in session expired. Please log in again.")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid two-factor session. Please log in again.")
    if payload.get("type") != PENDING_2FA_TOKEN_TYPE or not payload.get("user_id"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid two-factor session")
    return payload["user_id"]
