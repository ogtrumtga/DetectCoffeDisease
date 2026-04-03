"""
Notification API endpoints.
Prefix: /api/notifications
"""
from fastapi import APIRouter, HTTPException, Header, Query
from backend.services import notification_service
from backend.repositories import firebase_auth_repository
from typing import Optional

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


# ── Helper: xác thực Bearer token ──────────────────────────────────────────
def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


# ── 1. GET /api/notifications ───────────────────────────────────────────────
@router.get("")
async def list_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/notifications
    Lấy danh sách thông báo của user.
    - Input:  page, limit (query params)
    - Output: [{ id, type, title, message, isRead, createdAt }]
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    result = notification_service.list_notifications_service(user_id, page=page, limit=limit)
    return result


# ── 2. POST /api/notifications/{id}/read ────────────────────────────────────
@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/notifications/{id}/read
    Đánh dấu một thông báo là đã đọc.
    - Input:  notification_id (path param)
    - Output: { message }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    result = notification_service.mark_notification_read_service(notification_id, user_id)
    
    if not result['success']:
        raise HTTPException(status_code=404, detail=result['message'])
    
    return result


# ── 3. POST /api/notifications/mark-all-read ────────────────────────────────
@router.post("/mark-all-read")
async def mark_all_notifications_read(
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/notifications/mark-all-read
    Đánh dấu tất cả thông báo là đã đọc.
    - Input:  -
    - Output: { message }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    result = notification_service.mark_all_notifications_read_service(user_id)
    
    if not result['success']:
        raise HTTPException(status_code=500, detail=result['message'])
    
    return result
