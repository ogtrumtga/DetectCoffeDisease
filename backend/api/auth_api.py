"""
Auth API endpoints.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from backend.services import auth_service
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    displayName: Optional[str] = None


class VerifyTokenRequest(BaseModel):
    idToken: str


class LogoutRequest(BaseModel):
    uid: str


@router.post("/register")
async def register(request: RegisterRequest):
    """Đăng ký user mới."""
    result = auth_service.register_user_service(
        email=request.email,
        password=request.password,
        display_name=request.displayName
    )
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


@router.post("/verify-token")
async def verify_token(request: VerifyTokenRequest):
    """Xác thực ID token từ client."""
    result = auth_service.verify_token_service(request.idToken)
    
    if not result['success']:
        raise HTTPException(status_code=401, detail=result['message'])
    
    return result


@router.post("/logout")
async def logout(request: LogoutRequest):
    """Logout user."""
    result = auth_service.logout_user_service(request.uid)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result
