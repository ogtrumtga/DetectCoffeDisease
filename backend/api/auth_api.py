"""
Auth API endpoints.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from backend.services import auth_service
from backend.repositories import firebase_auth_repository
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Helper: xác thực Bearer token ──────────────────────────────────────────
def get_user_id_from_token(authorization: Optional[str]) -> str:
    """Extract user ID from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


# ── Request models ──────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyTokenRequest(BaseModel):
    idToken: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    uid: str


@router.post("/register")
async def register(request: RegisterRequest):
    """
    POST /api/auth/register
    Đăng ký user mới và tự động đăng nhập.
    - Input:  { email, password, name }
    - Output: { userId, tokens, user }
    - Auth:   None
    """
    result = auth_service.register_user_service(
        email=request.email,
        password=request.password,
        display_name=request.name
    )
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return {
        'success': True,
        'userId': result['user']['uid'],
        'tokens': result['tokens'],
        'user': {
            'userId': result['user']['uid'],
            'email': result['user']['email'],
            'name': result['user'].get('displayName'),
            'profile': result.get('userProfile')
        }
    }


@router.post("/login")
async def login(request: LoginRequest):
    """
    POST /api/auth/login
    Đăng nhập user.
    - Input:  { email, password }
    - Output: { tokens, user }
    - Auth:   None
    
    Note: Firebase Admin SDK không hỗ trợ đăng nhập trực tiếp.
    API này trả về custom token để client có thể đăng nhập.
    """
    result = auth_service.login_user_service(
        email=request.email,
        password=request.password
    )
    
    if not result['success']:
        raise HTTPException(status_code=401, detail=result['message'])
    
    return {
        'success': True,
        'tokens': result['tokens'],
        'user': result['user']
    }


@router.post("/verify-token")
async def verify_token(request: VerifyTokenRequest):
    """Xác thực ID token từ client."""
    result = auth_service.verify_token_service(request.idToken)
    
    if not result['success']:
        raise HTTPException(status_code=401, detail=result['message'])
    
    return result


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """
    POST /api/auth/logout
    Đăng xuất user.
    - Input:  None (Bearer token in header)
    - Output: { message }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    
    result = auth_service.logout_user_service(user_id)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return {
        'success': True,
        'message': result['message']
    }


@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """
    POST /api/auth/refresh
    Refresh access token.
    - Input:  { refresh_token }
    - Output: { access_token }
    - Auth:   None
    
    Note: Firebase Admin SDK không quản lý refresh token trực tiếp.
    Client phải sử dụng Firebase Client SDK để refresh token.
    API này chỉ để đáp ứng yêu cầu, thực tế client nên dùng Firebase SDK.
    """
    # Firebase Admin SDK không hỗ trợ refresh token
    # Client nên sử dụng Firebase Client SDK để refresh
    return {
        'success': False,
        'message': 'Please use Firebase Client SDK to refresh token',
        'note': 'Firebase Admin SDK does not support refresh token operation'
    }


@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    GET /api/auth/me
    Lấy thông tin user hiện tại.
    - Input:  None (Bearer token in header)
    - Output: { userId, email, name }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    
    result = auth_service.get_current_user_service(user_id)
    
    if not result['success']:
        raise HTTPException(status_code=404, detail=result['message'])
    
    user = result['user']
    return {
        'success': True,
        'userId': user['userId'],
        'email': user['email'],
        'name': user['name']
    }
