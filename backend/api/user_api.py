"""
User API endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.services import user_service
from typing import Optional, Dict, Any

router = APIRouter(prefix="/user", tags=["User Profile"])


class UpdateProfileRequest(BaseModel):
    displayName: Optional[str] = None
    bio: Optional[str] = None
    photoURL: Optional[str] = None


class UpdateAvatarRequest(BaseModel):
    avatarUrl: str


# Helper function để extract user_id từ token (sẽ implement sau)
async def get_current_user_id(authorization: str = None) -> str:
    """Extract user ID from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    from backend.repositories import firebase_auth_repository
    decoded = firebase_auth_repository.firebase_verify_id_token(token)
    
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return decoded['uid']


@router.get("/profile")
async def get_profile(user_id: str):
    """Lấy thông tin profile của user."""
    result = user_service.get_my_profile_service(user_id)
    
    if not result['success']:
        raise HTTPException(status_code=404, detail=result['message'])
    
    return result


@router.put("/profile")
async def update_profile(user_id: str, request: UpdateProfileRequest):
    """Cập nhật thông tin profile."""
    data = request.dict(exclude_none=True)
    result = user_service.update_my_profile_service(user_id, data)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


@router.put("/avatar")
async def update_avatar(user_id: str, request: UpdateAvatarRequest):
    """Cập nhật avatar."""
    result = user_service.update_my_avatar_service(user_id, request.avatarUrl)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


@router.delete("/account")
async def delete_account(user_id: str):
    """Xóa tài khoản."""
    result = user_service.delete_my_account_service(user_id)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result
