"""Admin login route."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.auth import issue_token, verify_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest) -> LoginResponse:
    if not verify_password(body.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid password")
    return LoginResponse(token=issue_token())
