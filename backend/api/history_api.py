"""
History API endpoints.
Prefix: /api/history
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.services import history_service
from backend.repositories import firebase_auth_repository
from typing import Optional, Any, Dict

router = APIRouter(prefix="/api/history", tags=["History"])


# ── Helper: xác thực Bearer token, trả về user_id ──────────────────────────
def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


# ── Request body cho POST ───────────────────────────────────────────────────
class CreateHistoryRequest(BaseModel):
    imageId:     Optional[str]       = None
    predictions: Optional[Any]       = None
    extra:       Optional[Dict[str, Any]] = None


# ── 1. GET /api/history ─────────────────────────────────────────────────────
@router.get("")
async def list_histories(
    page: int = 1,
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/history
    Lấy danh sách lịch sử chẩn đoán của user (có phân trang).
    - Input:  page (query param, default=1)
    - Output: [{ inferenceId, imageId, predictions, createdAt }]
    - Auth:   Bearer token
    """
    user_id = get_user_id_from_token(authorization)
    result = history_service.list_user_histories_service(user_id, page=page)
    return result


# ── 2. GET /api/history/{id} ────────────────────────────────────────────────
@router.get("/{id}")
async def get_history_detail(
    id: str,
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/history/{id}
    Lấy chi tiết một bản ghi lịch sử chẩn đoán.
    - Input:  id (path param)
    - Output: { detail }
    - Auth:   Bearer token
    """
    user_id = get_user_id_from_token(authorization)
    result = history_service.get_history_detail_service(user_id, id)

    if not result['success']:
        status = 404 if 'not found' in result['message'].lower() else 403
        raise HTTPException(status_code=status, detail=result['message'])

    return result


# ── 3. POST /api/history ────────────────────────────────────────────────────
@router.post("")
async def create_history(
    request: CreateHistoryRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/history
    Tạo bản ghi lịch sử chẩn đoán mới.
    - Input:  data (request body: imageId, predictions, ...)
    - Output: { id }
    - Auth:   Bearer token
    """
    user_id = get_user_id_from_token(authorization)

    data = request.dict(exclude_none=True)
    result = history_service.create_history_entry_service(user_id, data)

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])

    return result


# ── 4. DELETE /api/history/{id} ─────────────────────────────────────────────
@router.delete("/{id}")
async def delete_one_history(
    id: str,
    authorization: Optional[str] = Header(None)
):
    """
    DELETE /api/history/{id}
    Xóa một bản ghi lịch sử theo id.
    - Input:  id (path param)
    - Output: { message }
    - Auth:   Bearer token
    """
    user_id = get_user_id_from_token(authorization)
    result = history_service.delete_history_entry_service(user_id, id)

    if not result['success']:
        raise HTTPException(status_code=404, detail=result['message'])

    return result


# ── 5. DELETE /api/history ──────────────────────────────────────────────────
@router.delete("")
async def delete_all_histories(
    authorization: Optional[str] = Header(None)
):
    """
    DELETE /api/history
    Xóa toàn bộ lịch sử chẩn đoán của user.
    - Input:  -
    - Output: { count }
    - Auth:   Bearer token
    """
    user_id = get_user_id_from_token(authorization)
    result = history_service.clear_all_histories_service(user_id)

    if not result['success']:
        raise HTTPException(status_code=500, detail=result['message'])

    return result
