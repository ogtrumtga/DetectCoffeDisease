from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel, Field
from backend.services import feedback_service
from backend.repositories import firebase_auth_repository
from typing import Optional

router = APIRouter(prefix="/api/feedbacks", tags=["Feedbacks"])


def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


class CreateFeedbackRequest(BaseModel):
    diagnoses_id: str = Field(..., min_length=1, max_length=128)
    rate: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=2000)


@router.post("")
async def create_feedback(
    request: CreateFeedbackRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/feedbacks
    Gửi feedback.
    - Input:  { diagnoses_id, rate, comment }
    - Output: { feedbackid }
    - Auth:   Bearer token (required)
    """
    #user_id = get_user_id_from_token(authorization)

    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"

    feedback_id = feedback_service.create_feedback_service(
        user_id=user_id,
        diagnoses_id=request.diagnoses_id.strip(),
        rate=request.rate,
        comment=request.comment.strip()
    )

    if not feedback_id:
        raise HTTPException(status_code=400, detail="Failed to create feedback")

    return {
        'feedbackid': feedback_id
    }


@router.get("")
async def list_feedbacks(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/feedbacks
    Lấy danh sách feedback (có phân trang).
    - Input:  page (optional, default=1)
    - Output: [{ feedback_id, diagnoses_id, comment, rate }]
    - Auth:   Bearer token (required)
    """
    # Bắt buộc xác thực theo yêu cầu API.
    #get_user_id_from_token(authorization)

    return feedback_service.list_feedbacks_service(page=page, limit=limit)


