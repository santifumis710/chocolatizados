"""Admin authentication: HMAC-signed bearer token, password from env."""

import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import Header, HTTPException, status

SESSION_TTL_SECONDS = 7 * 24 * 3600


def _admin_password() -> str:
    pw = os.getenv("ADMIN_PASSWORD")
    if not pw:
        raise RuntimeError(
            "ADMIN_PASSWORD env var is not set. Admin auth cannot operate."
        )
    return pw


def _signing_key() -> bytes:
    # Derive the HMAC key from the password so rotating the password
    # invalidates every outstanding session in one move.
    return hashlib.sha256(_admin_password().encode("utf-8")).digest()


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + pad)


def issue_token() -> str:
    payload = {"sub": "admin", "exp": int(time.time()) + SESSION_TTL_SECONDS}
    payload_b64 = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    sig = hmac.new(_signing_key(), payload_b64.encode("ascii"), hashlib.sha256).digest()
    return f"{payload_b64}.{_b64url(sig)}"


def verify_password(candidate: str) -> bool:
    return hmac.compare_digest(candidate.encode("utf-8"), _admin_password().encode("utf-8"))


def _verify_token(token: str) -> dict:
    try:
        payload_b64, sig_b64 = token.split(".", 1)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token format")

    expected_sig = hmac.new(
        _signing_key(), payload_b64.encode("ascii"), hashlib.sha256
    ).digest()
    if not hmac.compare_digest(expected_sig, _b64url_decode(sig_b64)):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token signature")

    try:
        payload = json.loads(_b64url_decode(payload_b64))
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")

    if payload.get("sub") != "admin":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid subject")
    if int(payload.get("exp", 0)) < int(time.time()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired")

    return payload


def require_admin(authorization: str = Header(default="")) -> None:
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    _verify_token(authorization[7:].strip())
