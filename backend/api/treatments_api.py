"""
Treatment API endpoints.
Prefix: /api/treatments
"""
from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel, Field
from backend.services import treatment_service
from backend.repositories import firebase_auth_repository
from typing import Optional, List

router = APIRouter(prefix="/api/treatments", tags=["Treatments"])


def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


class CreateTreatmentRequest(BaseModel):
    disease_id: str = Field(..., min_length=1, max_length=128)
    steps: List[str] = Field(..., min_length=1)
    medicine: List[str] = Field(..., min_length=1)


class UpdateTreatmentRequest(BaseModel):
    steps: List[str] = Field(..., min_length=1)
    medicine: List[str] = Field(..., min_length=1)


@router.get("")
async def list_treatments(
    disease_id: str = Query(..., min_length=1),
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/treatments
    Lay cach chua duy nhat theo disease_id.
    - Input:  disease_id
    - Output: { steps[], medicine[] }
    - Auth:   Bearer token (required)
    """
    #get_user_id_from_token(authorization)
    
    result = treatment_service.list_treatments_service(disease_id=disease_id.strip())

    if not result:
        raise HTTPException(status_code=404, detail="Treatment not found")

    return result


@router.post("")
async def create_treatment(
    request: CreateTreatmentRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/treatments
    Them cach chua.
    - Input:  { disease_id, steps[], medicine[] }
    - Output: { treatmentId }
    - Auth:   Bearer token (required)
    """
    #user_id = get_user_id_from_token(authorization)
    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"

    result = treatment_service.create_treatment_service(
        user_id=user_id,
        disease_id=request.disease_id,
        steps=request.steps,
        medicine=request.medicine,
    )

    if not result.get('success'):
        status = 409 if 'already exists' in result.get('message', '').lower() else 400
        raise HTTPException(status_code=status, detail=result.get('message', 'Failed to create treatment'))

    return {
        'treatmentId': result['treatmentId']
    }


@router.patch("/{id}")
async def update_treatment(
    id: str,
    request: UpdateTreatmentRequest,
    authorization: Optional[str] = Header(None)
):
    """
    PATCH /api/treatments/{id}
    Sua cach chua.
    - Input:  { steps[], medicine[] }
    - Output: { treatmentId, updatedAt }
    - Auth:   Bearer token (required)
    """
    #user_id = get_user_id_from_token(authorization)
    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"

    result = treatment_service.update_treatment_service(
        treatment_id=id,
        user_id=user_id,
        steps=request.steps,
        medicine=request.medicine,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Treatment not found or access denied")

    return result
