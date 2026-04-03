"""
Diagnosis API endpoints.
Prefix: /api/diagnosis
"""
from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from pydantic import BaseModel
from backend.services import diagnosis_service
from backend.repositories import firebase_auth_repository
from typing import Optional

router = APIRouter(prefix="/api/diagnosis", tags=["Diagnosis"])


class PredictByImageIdRequest(BaseModel):
    imageId: str


def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


@router.post("/upload-image")
async def upload_raw_image(
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    #authorization: Optional[str] = Header(None)
):
    """
    POST /api/diagnosis/upload-image

    Upload anh goc len Cloudinary, luu metadata vao Firestore collection images,
    sau do tra ve imageID (document id trong images).
    """
    #user_id = get_user_id_from_token(authorization)
    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"
    upload_file = file or image
    if not upload_file:
        raise HTTPException(status_code=400, detail="Missing image file. Send multipart field 'file' (or 'image').")

    result = diagnosis_service.upload_image_to_cloudinary_service(
        user_id=user_id,
        image_file=upload_file,
    )

    if not result.get('success'):
        raise HTTPException(status_code=400, detail=result.get('message', 'Failed to upload image'))

    return {
        'imageID': result['imageID']
    }


@router.post("/predict")
async def predict_disease_by_image_id(
    request: PredictByImageIdRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/diagnosis/predict

    Input:  { imageId }
    Output: { inferenceId, imageId, summary, diseaseID[] }
    Auth: Bearer token
    """
    #user_id = get_user_id_from_token(authorization)
    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"

    result = diagnosis_service.predict_disease_by_image_id_service(
        user_id=user_id,
        image_id=request.imageId,
        img_size=640,
        conf_threshold=0.25,
        save_to_history=True,
    )

    if not result.get('success'):
        message = (result.get('message') or '').lower()
        status = 404 if 'not found' in message else 403 if 'access denied' in message else 400
        raise HTTPException(status_code=status, detail=result.get('message', 'Failed to predict disease'))

    return result.get('data', {})


@router.get("/diseases/{id}")
async def get_disease_info(id: str):
    """
    GET /api/diagnosis/diseases/{id}

    Lấy thông tin bệnh từ collection diseases.
    Output: { name, description }
    """
    result = diagnosis_service.get_disease_info_service(id)

    if not result.get('success'):
        message = (result.get('message') or '').lower()
        status = 404 if 'not found' in message else 400
        raise HTTPException(status_code=status, detail=result.get('message', 'Failed to get disease info'))

    return result.get('data', {})


@router.get("/{id}")
async def get_diagnosis_result_detail(
    id: str,
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/diagnosis/{id}

    Lấy chi tiết kết quả sau khi predict theo inferenceId.
    Output: { imageId, diseaseID[] }
    """
    #user_id = get_user_id_from_token(authorization)
    user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"
    result = diagnosis_service.get_inference_detail_service(id, user_id)

    if not result.get('success'):
        message = (result.get('message') or '').lower()
        status = 404 if 'not found' in message else 403 if 'access denied' in message else 400
        raise HTTPException(status_code=status, detail=result.get('message', 'Failed to get diagnosis detail'))

    return result.get('data', {})
