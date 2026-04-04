"""
Diagnosis API — Coffee Disease Detection.
Prefix: /api/diagnosis

Gộp toàn bộ chức năng lịch sử (history) vào đây.
Collection diagnoses là nguồn dữ liệu duy nhất.
"""
from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Query, Form
from pydantic import BaseModel
from backend.services import diagnosis_service
from backend.repositories import firebase_auth_repository
from typing import Optional

router = APIRouter(prefix="/api/diagnosis", tags=["Diagnosis"])


# ── Auth helper ───────────────────────────────────────────────────────────────

def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return decoded['uid']


# ── Request models ────────────────────────────────────────────────────────────

class PredictByImageIdRequest(BaseModel):
    imageId: str
    imgSize: int = 640
    confThreshold: float = 0.25
    token: Optional[str] = None  # Token từ body (tránh CORS preflight)


# ── 1. POST /api/diagnosis/upload-image ──────────────────────────────────────

@router.post("/upload-image")
async def upload_raw_image(
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    token: Optional[str] = Form(None),  # Token từ FormData
    authorization: Optional[str] = Header(None),  # Token từ header (fallback)
):
    """
    Upload ảnh lên Cloudinary, lưu metadata vào collection images.
    Trả về imageID để dùng cho endpoint /predict.
    
    Token có thể gửi qua:
    - FormData field 'token' (tránh CORS preflight)
    - Header 'Authorization: Bearer <token>' (cách chuẩn)
    """
    print(f"\n{'='*60}")
    print(f"[UPLOAD] Received upload request")
    print(f"[UPLOAD] File: {file.filename if file else 'None'}")
    print(f"[UPLOAD] Image: {image.filename if image else 'None'}")
    print(f"[UPLOAD] Token from form: {'Yes' if token else 'No'}")
    print(f"[UPLOAD] Token from header: {'Yes' if authorization else 'No'}")
    print(f"{'='*60}\n")
    
    # Ưu tiên token từ FormData, fallback sang header
    auth_token = token or (authorization.replace("Bearer ", "") if authorization and authorization.startswith("Bearer ") else None)
    
    if not auth_token:
        print("[UPLOAD] ERROR: No token provided")
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    decoded = firebase_auth_repository.firebase_verify_id_token(auth_token)
    if not decoded:
        print("[UPLOAD] ERROR: Invalid token")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = decoded['uid']
    print(f"[UPLOAD] User ID: {user_id}")
    
    upload_file = file or image
    if not upload_file:
        print("[UPLOAD] ERROR: No file provided")
        raise HTTPException(status_code=400, detail="Missing image file. Send multipart field 'file' or 'image'.")

    print(f"[UPLOAD] Starting Cloudinary upload...")
    result = diagnosis_service.upload_image_to_cloudinary_service(user_id=user_id, image_file=upload_file)
    
    if not result.get('success'):
        print(f"[UPLOAD] ERROR: {result.get('message')}")
        raise HTTPException(status_code=400, detail=result.get('message', 'Failed to upload image'))

    print(f"[UPLOAD] SUCCESS: ImageID = {result['imageID']}")
    return {'imageID': result['imageID']}


# ── 2. POST /api/diagnosis/predict ───────────────────────────────────────────

@router.post("/predict")
async def predict_disease(
    request: PredictByImageIdRequest,
    authorization: Optional[str] = Header(None),
):
    """
    Chạy YOLO (best.pt) trên ảnh đã upload, lưu kết quả vào collection diagnoses.

    Input:  { imageId, imgSize?, confThreshold?, token? }
    Output: {
      diagnosisId, imageId, imageUrl,
      summary, diseaseID[], primaryDisease, primaryDiseaseName,
      confidence, severity, color, description, treatment,
      totalDetections, processingTime, createdAt
    }
    
    Token có thể gửi qua:
    - Body field 'token' (tránh CORS preflight)
    - Header 'Authorization: Bearer <token>' (cách chuẩn)
    """
    # Ưu tiên token từ body, fallback sang header
    auth_token = request.token or (authorization.replace("Bearer ", "") if authorization and authorization.startswith("Bearer ") else None)
    
    if not auth_token:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    decoded = firebase_auth_repository.firebase_verify_id_token(auth_token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = decoded['uid']

    result = diagnosis_service.predict_disease_by_image_id_service(
        user_id=user_id,
        image_id=request.imageId,
        img_size=request.imgSize,
        conf_threshold=request.confThreshold,
    )

    if not result.get('success'):
        msg = (result.get('message') or '').lower()
        status = 404 if 'not found' in msg else 403 if 'access denied' in msg else 400
        raise HTTPException(status_code=status, detail=result.get('message'))

    return result.get('data', {})


# ── 3. GET /api/diagnosis — danh sách lịch sử ────────────────────────────────

@router.get("")
async def list_diagnoses(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    authorization: Optional[str] = Header(None),
):
    """
    Lấy danh sách lịch sử chẩn đoán của user (có phân trang).
    Thay thế GET /api/history.

    Output: {
      data: [{ diagnosisId, diseaseName, confidence, severity, imageUrl, createdAt, ... }],
      page, total
    }
    """
    user_id = get_user_id_from_token(authorization)
    result = diagnosis_service.list_diagnoses_service(user_id, page=page, limit=limit)
    return result


# ── 4. GET /api/diagnosis/diseases/{id} ──────────────────────────────────────

@router.get("/diseases/{id}")
async def get_disease_info(id: str):
    """
    Lấy thông tin bệnh từ collection diseases.
    Output: { name, description }
    """
    result = diagnosis_service.get_disease_info_service(id)
    if not result.get('success'):
        msg = (result.get('message') or '').lower()
        raise HTTPException(status_code=404 if 'not found' in msg else 400, detail=result.get('message'))
    return result.get('data', {})


# ── 5. GET /api/diagnosis/statistics ─────────────────────────────────────────

@router.get("/statistics")
async def get_statistics(authorization: Optional[str] = Header(None)):
    """
    Thống kê lịch sử chẩn đoán của user.
    Output: { total, healthy_count, diseased_count, severity_counts, most_common_disease, disease_breakdown }
    """
    user_id = get_user_id_from_token(authorization)
    result = diagnosis_service.get_diagnosis_statistics_service(user_id)
    return result


# ── 6. GET /api/diagnosis/supported-diseases ─────────────────────────────────

@router.get("/supported-diseases")
async def list_supported_diseases():
    """Danh sách các bệnh cà phê được model hỗ trợ."""
    return diagnosis_service.list_supported_diseases_service()


# ── 7. GET /api/diagnosis/{id} — chi tiết ────────────────────────────────────

@router.get("/{id}")
async def get_diagnosis_detail(
    id: str,
    authorization: Optional[str] = Header(None),
):
    """
    Lấy chi tiết đầy đủ một kết quả chẩn đoán.
    Thay thế GET /api/history/{id}.

    Output: {
      diagnosisId, diseaseKey, diseaseName, diseaseNameVi,
      confidence, severity, color, description, treatment,
      imageUrl, imageId, summary, diseaseIDs, detections,
      modelVersion, processingTime, createdAt
    }
    """
    user_id = get_user_id_from_token(authorization)
    result = diagnosis_service.get_diagnosis_detail_service(id, user_id)

    if not result.get('success'):
        msg = (result.get('message') or '').lower()
        status = 404 if 'not found' in msg else 403 if 'access denied' in msg else 400
        raise HTTPException(status_code=status, detail=result.get('message'))

    return result.get('data', {})


# ── 8. DELETE /api/diagnosis/{id} ────────────────────────────────────────────

@router.delete("/{id}")
async def delete_diagnosis(
    id: str,
    authorization: Optional[str] = Header(None),
):
    """
    Xóa một kết quả chẩn đoán.
    Thay thế DELETE /api/history/{id}.
    """
    user_id = get_user_id_from_token(authorization)
    result = diagnosis_service.delete_diagnosis_service(id, user_id)

    if not result.get('success'):
        raise HTTPException(status_code=404, detail=result.get('message'))

    return result


# ── 9. DELETE /api/diagnosis — xóa toàn bộ ──────────────────────────────────

@router.delete("")
async def delete_all_diagnoses(authorization: Optional[str] = Header(None)):
    """
    Xóa toàn bộ lịch sử chẩn đoán của user.
    Thay thế DELETE /api/history.
    """
    user_id = get_user_id_from_token(authorization)
    result = diagnosis_service.delete_all_diagnoses_service(user_id)

    if not result.get('success'):
        raise HTTPException(status_code=500, detail=result.get('message'))

    return result
