from datetime import datetime, timedelta, timezone
import random
from os import getenv
from threading import Lock
from types import SimpleNamespace

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import bcrypt as _bcrypt

from app.database import get_db
from app.models import User


if not hasattr(_bcrypt, "__about__"):
    _bcrypt.__about__ = SimpleNamespace(__version__=_bcrypt.__version__)


SECRET_KEY = getenv(
    "SECRET_KEY",
    "cab-booking-project-secret-key-2026"
)

ALGORITHM = getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

security = HTTPBearer()
otp_store: dict[str, dict[str, datetime | str]] = {}
otp_store_lock = Lock()
OTP_EXPIRY_MINUTES = 5


def _credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


def store_otp(email: str, otp: str) -> None:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    with otp_store_lock:
        otp_store[email.lower()] = {
            "otp": otp,
            "expires_at": expires_at,
        }


def get_stored_otp(email: str) -> dict[str, datetime | str] | None:
    with otp_store_lock:
        return otp_store.get(email.lower())


def delete_stored_otp(email: str) -> None:
    with otp_store_lock:
        otp_store.pop(email.lower(), None)


def is_otp_valid(email: str, otp: str) -> bool:
    stored_otp = get_stored_otp(email)

    if not stored_otp:
        return False

    expires_at = stored_otp.get("expires_at")
    if not isinstance(expires_at, datetime):
        return False

    if expires_at < datetime.now(timezone.utc):
        delete_stored_otp(email)
        return False

    return stored_otp.get("otp") == otp


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

    except JWTError as exc:
        raise _credentials_exception() from exc


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    return user


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db),
) -> User:

    token = credentials.credentials

    payload = decode_access_token(token)

    user_id = payload.get("sub")

    if user_id is None:
        raise _credentials_exception()

    try:
        user_id = int(user_id)

    except (TypeError, ValueError):
        raise _credentials_exception()

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise _credentials_exception()

    return user