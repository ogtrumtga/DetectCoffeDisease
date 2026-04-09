"""
Diagnosis Service — Coffee Disease Detection.

Xử lý toàn bộ vòng đời chẩn đoán:
  1. Upload ảnh lên Cloudinary
  2. Chạy YOLO (best.pt) để dự đoán bệnh
  3. Lưu kết quả đầy đủ vào collection diagnoses (không còn collection history riêng)
  4. Tạo notification nếu phát hiện bệnh nghiêm trọng

Collection diagnoses chứa tất cả: metadata lịch sử + chi tiết chẩn đoán.
"""
from backend.repositories import firebase_diagnosis_repository as diagnosis_repo
from backend.repositories import firebase_storage_repository as storage_repo
from backend.repositories import firebase_notification_repository as notification_repo
from backend.repositories import firebase_image_repository as image_repo
from backend.repositories import firebase_disease_repository as disease_repo
from backend.repositories import firebase_treatment_repository as treatment_repo
from typing import Dict, Any, Optional, List
from datetime import datetime
from io import BytesIO
import os
import importlib
import numpy as np

import requests
from PIL import Image


MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'predict_models', 'best.pt')
_YOLO_MODEL = None
_DISEASES_CACHE: Optional[Dict[str, Dict[str, Any]]] = None
_TREATMENTS_CACHE: Optional[Dict[str, Dict[str, Any]]] = None


# ── Helper functions để load disease và treatment từ Firestore ──────────────

def _load_diseases_from_firestore() -> Dict[str, Dict[str, Any]]:
    """Load tất cả diseases từ Firestore và cache lại."""
    global _DISEASES_CACHE
    
    if _DISEASES_CACHE is not None:
        return _DISEASES_CACHE
    
    print("[Disease] Loading diseases from Firestore...")
    diseases = disease_repo.get_all_diseases()
    
    _DISEASES_CACHE = {}
    for disease in diseases:
        # Hỗ trợ cả key viết hoa và viết thường
        disease_id = disease.get('id') or disease.get('Id')
        if disease_id:
            _DISEASES_CACHE[disease_id.lower()] = {
                'id': disease_id,
                'name': disease.get('name') or disease.get('Name', ''),
                'description': disease.get('description') or disease.get('Description', ''),
            }
    
    print(f"[Disease] Loaded {len(_DISEASES_CACHE)} diseases")
    return _DISEASES_CACHE


def _load_treatments_from_firestore() -> Dict[str, Dict[str, Any]]:
    """Load tất cả treatments từ Firestore và cache lại."""
    global _TREATMENTS_CACHE
    
    if _TREATMENTS_CACHE is not None:
        return _TREATMENTS_CACHE
    
    print("[Treatment] Loading treatments from Firestore...")
    # Query tất cả treatments
    from backend.config import db
    docs = db.collection('treatments').stream()
    
    _TREATMENTS_CACHE = {}
    for doc in docs:
        data = doc.to_dict() or {}
        disease_id = data.get('diseaseId')
        if disease_id:
            _TREATMENTS_CACHE[disease_id.lower()] = {
                'diseaseId': disease_id,
                'steps': data.get('steps', []),
                'medicine': data.get('medicine', []),
                'severity': data.get('severity', 'none'),
                'color': data.get('color', '#4CAF50'),
            }
    
    print(f"[Treatment] Loaded {len(_TREATMENTS_CACHE)} treatments")
    return _TREATMENTS_CACHE


def _get_disease_info(disease_key: str) -> Dict[str, Any]:
    """Lấy thông tin bệnh từ Firestore (có cache)."""
    diseases = _load_diseases_from_firestore()
    treatments = _load_treatments_from_firestore()
    
    disease_key_lower = disease_key.lower()
    
    # Lấy disease info
    disease = diseases.get(disease_key_lower, {
        'id': disease_key,
        'name': 'Unknown Disease',
        'description': 'No description available',
    })
    
    # Lấy treatment info
    treatment = treatments.get(disease_key_lower, {
        'steps': ['No treatment information available'],
        'medicine': [],
        'severity': 'none',
        'color': '#9E9E9E',
    })
    
    # Kết hợp thông tin
    return {
        'id': disease.get('id'),
        'name': disease.get('name'),
        'description': disease.get('description'),
        'steps': treatment.get('steps'),
        'medicine': treatment.get('medicine'),
        'severity': treatment.get('severity'),
        'color': treatment.get('color'),
    }


def reload_disease_cache():
    """Reload cache (dùng khi có thay đổi trong Firestore)."""
    global _DISEASES_CACHE, _TREATMENTS_CACHE
    _DISEASES_CACHE = None
    _TREATMENTS_CACHE = None
    print("[Cache] Disease and treatment cache cleared")


# ── Upload ảnh ────────────────────────────────────────────────────────────────

def upload_image_to_cloudinary_service(user_id: str, image_file: Any) -> Dict[str, Any]:
    """
    Upload ảnh lên Cloudinary, lưu metadata vào collection images.
    Trả về imageID (document id trong collection images).
    """
    try:
        print(f"\n[Upload] Starting upload for user: {user_id}")
        
        if not image_file:
            return {'success': False, 'message': 'Image file is required'}

        content_type = getattr(image_file, 'content_type', '') or ''
        if not content_type.startswith('image/'):
            return {'success': False, 'message': 'Only image files are allowed'}

        print(f"[Upload] Content type: {content_type}")

        cloud_name = "dz89vwzco"
        api_key = "131793621143365"
        api_secret = "HEJ3cGLQ-uPHkca7SfbW5KDp01M"

        try:
            cloudinary = importlib.import_module('cloudinary')
            cloudinary_uploader = importlib.import_module('cloudinary.uploader')
        except ModuleNotFoundError:
            return {'success': False, 'message': 'Cloudinary not installed. Run: pip install cloudinary'}

        cloudinary.config(cloud_name=cloud_name, api_key=api_key, api_secret=api_secret, secure=True)

        file_bytes = image_file.file.read() if hasattr(image_file, 'file') else None
        if not file_bytes:
            return {'success': False, 'message': 'Empty image file'}

        file_size_mb = len(file_bytes) / (1024 * 1024)
        print(f"[Upload] File size: {file_size_mb:.2f} MB")
        
        if file_size_mb > 10:
            return {'success': False, 'message': 'Image too large. Maximum 10MB allowed.'}

        print(f"[Upload] Uploading to Cloudinary...")
        upload_result = cloudinary_uploader.upload(
            file_bytes,
            folder=f'diagnosis/{user_id}',
            resource_type='image',
            overwrite=False,
            timeout=30,  # Timeout 30s cho Cloudinary
        )

        public_id = upload_result.get('public_id')
        image_url = upload_result.get('secure_url') or upload_result.get('url')

        if not public_id or not image_url:
            return {'success': False, 'message': 'Upload succeeded but missing Cloudinary response data'}

        print(f"[Upload] Cloudinary upload success: {public_id}")
        print(f"[Upload] Saving metadata to Firebase...")

        image_id = image_repo.insert_image_metadata(user_id=user_id, public_id=public_id, image_url=image_url)
        if not image_id:
            return {'success': False, 'message': 'Failed to save image metadata to Firebase'}

        print(f"[Upload] Complete! ImageID: {image_id}")
        return {'success': True, 'imageID': image_id}

    except Exception as e:
        error_msg = str(e)
        print(f"[Upload] ERROR: {error_msg}")
        
        # Xử lý các lỗi cụ thể
        if 'timeout' in error_msg.lower():
            return {'success': False, 'message': 'Upload timeout. Please try again with a smaller image.'}
        elif 'connection' in error_msg.lower():
            return {'success': False, 'message': 'Connection error. Please check your internet connection.'}
        elif 'cloudinary' in error_msg.lower():
            return {'success': False, 'message': 'Cloudinary service error. Please try again later.'}
        else:
            return {'success': False, 'message': f'Upload error: {error_msg}'}


# ── Predict từ imageId ────────────────────────────────────────────────────────

def predict_disease_by_image_id_service(
    user_id: str,
    image_id: str,
    img_size: int = 640,
    conf_threshold: float = 0.05,  # Tăng từ 0.001 lên 0.05 để lọc noise
) -> Dict[str, Any]:
    """
    Chạy YOLO (best.pt) trên ảnh đã upload, lưu kết quả vào collection diagnoses.

    Flow:
      1. Lấy imageURL từ collection images
      2. Download ảnh, chạy YOLO
      3. Lưu kết quả đầy đủ vào diagnoses (bao gồm cả metadata lịch sử)
      4. Tạo notification nếu bệnh nghiêm trọng

    Returns:
      {
        'success': True,
        'data': {
          'diagnosisId': '...',
          'imageId': '...',
          'imageUrl': '...',
          'summary': {'Rust': 40},
          'diseaseID': ['Rust'],
          'primaryDisease': 'rust',
          'primaryDiseaseName': 'Bệnh gỉ sắt',
          'confidence': 0.92,
          'severity': 'high',
          'description': '...',
          'treatment': '...',
          'totalDetections': 40,
          'processingTime': 1.23,
          'createdAt': '...'
        }
      }
    """
    try:
        if not image_id:
            return {'success': False, 'message': 'imageId is required'}

        image_meta = image_repo.get_image_metadata_by_id(image_id)
        if not image_meta:
            return {'success': False, 'message': 'Image not found'}
        if image_meta.get('userId') != user_id:
            return {'success': False, 'message': 'Access denied'}

        image_url = image_meta.get('imageURL')
        if not image_url:
            return {'success': False, 'message': 'imageURL is missing for this imageId'}

        # Download và chạy YOLO
        response = requests.get(image_url, timeout=20)
        if response.status_code != 200:
            return {'success': False, 'message': f'Cannot download image (status={response.status_code})'}

        # Chạy 2 pipeline tiền xử lý và chọn kết quả tốt hơn để tăng độ ổn định:
        # - balanced: tăng khả năng làm rõ vùng bệnh
        # - natural: giữ màu/texture gần ảnh gốc
        processed_balanced = _preprocess_image_for_model(response.content, img_size=img_size)
        result_balanced = _run_yolo_prediction(
            processed_balanced,
            img_size=img_size,
            conf_threshold=conf_threshold
        )

        processed_natural = _preprocess_image_natural(response.content, img_size=img_size)
        result_natural = _run_yolo_prediction(
            processed_natural,
            img_size=img_size,
            conf_threshold=max(0.03, conf_threshold - 0.01)
        )

        def _score_prediction(result: Dict[str, Any]) -> float:
            detections_count = len(result.get("detections", []))
            confidence = float(result.get("primaryConfidence", 0.0))
            return detections_count * 0.1 + confidence

        score_balanced = _score_prediction(result_balanced)
        score_natural = _score_prediction(result_natural)
        prediction_result = result_balanced if score_balanced >= score_natural else result_natural
        print(f"[Predict] Selected pipeline: {'balanced' if prediction_result is result_balanced else 'natural'}")
        print(f"[Predict] Scores -> balanced={round(score_balanced, 4)}, natural={round(score_natural, 4)}")

        # Kiểm tra xem có phải lá cà phê không
        is_valid = prediction_result.get('isValidCoffeeLeaf', True)
        summary = prediction_result.get('summary', {})
        detections = prediction_result.get('detections', [])
        primary_disease_raw = prediction_result.get('primaryDisease', 'unknown')
        primary_confidence = prediction_result.get('primaryConfidence', 0.0)
        processing_time = prediction_result.get('processingTime', 0.0)
        
        # Validation logic nâng cao
        total_detections = len(detections)
        
        print(f"[Validation] Total detections: {total_detections}")
        print(f"[Validation] Primary confidence: {round(primary_confidence * 100, 1)}%")
        
        # Case 1: Không detect được gì → Không phải lá cà phê
        if total_detections == 0:
            print(f"[Validation] REJECTED: No detections")
            return {
                'success': False,
                'message': '❌ Không phát hiện lá cà phê trong ảnh.\n\n📸 Vui lòng chụp lại với:\n• Ảnh lá cà phê rõ nét\n• Ánh sáng đầy đủ\n• Lá chiếm 70-80% khung hình'
            }
        
        # Case 2: Confidence thấp → chỉ cảnh báo, không reject cứng
        if primary_confidence < 0.08:
            print(f"[Validation] WARNING: Very low confidence ({round(primary_confidence * 100, 1)}%)")
        
        # Case 3: Detect quá ít objects (<2) và confidence thấp (20-40%) → Nghi ngờ
        # Case 3: Detect quá ít objects (<2) và confidence thấp (15-40%) → Nghi ngờ
        if total_detections < 2 and primary_confidence < 0.40:
            print(f"[Validation] WARNING: Few detections ({total_detections}) with medium confidence ({round(primary_confidence * 100, 1)}%)")
            # Không reject nữa, chỉ warning
        
        # Case 4: OK - Tiếp tục xử lý
        print(f"[Validation] PASSED: {total_detections} detections, {round(primary_confidence * 100, 1)}% confidence")
        
        if not is_valid and primary_disease_raw in ['not_coffee_leaf', 'unknown'] and total_detections == 0:
            print(f"[Validation] REJECTED: Invalid coffee leaf flag")
            return {
                'success': False,
                'message': '❌ Không thể nhận diện ảnh.\n\nVui lòng chụp ảnh lá cà phê với điều kiện tốt hơn.'
            }

        primary_key = primary_disease_raw.lower()
        disease_info = _get_disease_info(primary_key)

        raw_disease_ids = list(summary.keys())
        disease_ids = _filter_existing_disease_ids(raw_disease_ids)

        # Format treatment text từ steps và medicine
        treatment_text = ""
        if disease_info.get('steps'):
            treatment_text += "Các bước điều trị:\n"
            for i, step in enumerate(disease_info['steps'], 1):
                treatment_text += f"{i}. {step}\n"
        
        if disease_info.get('medicine'):
            treatment_text += "\nThuốc điều trị:\n"
            for i, med in enumerate(disease_info['medicine'], 1):
                treatment_text += f"• {med}\n"
        
        # Lưu vào diagnoses (gộp cả metadata lịch sử)
        diagnosis_data = {
            'diseaseKey': primary_key,
            'diseaseName': disease_info['name'],
            'diseaseNameVi': disease_info['name'],  # Sử dụng name thay vì name_vi
            'confidence': primary_confidence,
            'description': disease_info['description'],
            'treatment': treatment_text.strip() or 'No treatment information available',
            'severity': disease_info['severity'],
            'color': disease_info['color'],
            'imageUrl': image_url,
            'imageId': image_id,
            'summary': summary,
            'detections': detections,
            'diseaseIDs': disease_ids,
            'modelVersion': 'best.pt',
            'processingTime': processing_time,
        }

        diagnosis_id = diagnosis_repo.insert_diagnosis(user_id, diagnosis_data)
        if not diagnosis_id:
            return {'success': False, 'message': 'Failed to save diagnosis'}

        # Notification nếu bệnh nghiêm trọng
        if disease_info['severity'] == 'high':
            notification_repo.insert_notification(user_id, {
                'type': 'diagnosis_alert',
                'title': '⚠️ Phát hiện bệnh nghiêm trọng!',
                'message': f'Cây cà phê của bạn có thể bị {disease_info["name"]}. Vui lòng xử lý ngay!',
                'data': {'diagnosisId': diagnosis_id, 'diseaseKey': primary_key, 'severity': 'high'},
            })

        return {
            'success': True,
            'data': {
                'diagnosisId': diagnosis_id,
                'imageId': image_id,
                'imageUrl': image_url,
                'summary': summary,
                'diseaseID': disease_ids,
                'primaryDisease': primary_key,
                'primaryDiseaseName': disease_info['name'],
                'confidence': primary_confidence,
                'severity': disease_info['severity'],
                'color': disease_info['color'],
                'description': disease_info['description'],
                'treatment': treatment_text.strip() or 'No treatment information available',
                'totalDetections': sum(summary.values()),
                'processingTime': processing_time,
                'createdAt': datetime.utcnow().isoformat(),
            }
        }
    except Exception as e:
        print(f"Error in predict_disease_by_image_id_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── Lấy danh sách lịch sử chẩn đoán ─────────────────────────────────────────

def list_diagnoses_service(user_id: str, page: int = 1, limit: int = 10) -> Dict[str, Any]:
    """
    Lấy danh sách lịch sử chẩn đoán của user (có phân trang).
    Thay thế hoàn toàn GET /api/history.
    """
    try:
        offset = (page - 1) * limit
        diagnoses = diagnosis_repo.query_diagnoses_by_user(user_id, limit=limit, offset=offset)

        result = []
        for d in diagnoses:
            created_at = d.get('createdAt')
            result.append({
                'diagnosisId': d['id'],
                'diseaseKey': d.get('diseaseKey'),
                'diseaseName': d.get('diseaseNameVi') or d.get('diseaseName'),
                'confidence': d.get('confidence'),
                'severity': d.get('severity'),
                'color': d.get('color'),
                'imageUrl': d.get('imageUrl'),
                'imageId': d.get('imageId'),
                'summary': d.get('summary', {}),
                'createdAt': created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at) if created_at else None,
            })

        return {'success': True, 'data': result, 'page': page, 'total': len(result)}
    except Exception as e:
        print(f"Error in list_diagnoses_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── Lấy chi tiết một chẩn đoán ───────────────────────────────────────────────

def get_diagnosis_detail_service(diagnosis_id: str, user_id: str) -> Dict[str, Any]:
    """
    Lấy chi tiết đầy đủ một kết quả chẩn đoán.
    Thay thế GET /api/history/{id}.
    """
    try:
        diagnosis = diagnosis_repo.get_diagnosis_by_id(diagnosis_id)
        if not diagnosis:
            return {'success': False, 'message': 'Diagnosis not found'}
        if diagnosis.get('userId') != user_id:
            return {'success': False, 'message': 'Access denied'}

        created_at = diagnosis.get('createdAt')
        return {
            'success': True,
            'data': {
                'diagnosisId': diagnosis['id'],
                'diseaseKey': diagnosis.get('diseaseKey'),
                'diseaseName': diagnosis.get('diseaseName'),
                'diseaseNameVi': diagnosis.get('diseaseNameVi'),
                'confidence': diagnosis.get('confidence'),
                'severity': diagnosis.get('severity'),
                'color': diagnosis.get('color'),
                'description': diagnosis.get('description'),
                'treatment': diagnosis.get('treatment'),
                'imageUrl': diagnosis.get('imageUrl'),
                'imageId': diagnosis.get('imageId'),
                'summary': diagnosis.get('summary', {}),
                'diseaseIDs': diagnosis.get('diseaseIDs', []),
                'detections': diagnosis.get('detections', []),
                'modelVersion': diagnosis.get('modelVersion'),
                'processingTime': diagnosis.get('processingTime'),
                'createdAt': created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at) if created_at else None,
            }
        }
    except Exception as e:
        print(f"Error in get_diagnosis_detail_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── Xóa một chẩn đoán ────────────────────────────────────────────────────────

def delete_diagnosis_service(diagnosis_id: str, user_id: str) -> Dict[str, Any]:
    """Xóa một kết quả chẩn đoán. Thay thế DELETE /api/history/{id}."""
    try:
        success = diagnosis_repo.delete_diagnosis_by_id(diagnosis_id, user_id)
        if success:
            return {'success': True, 'message': 'Diagnosis deleted successfully'}
        return {'success': False, 'message': 'Diagnosis not found or unauthorized'}
    except Exception as e:
        print(f"Error in delete_diagnosis_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── Xóa toàn bộ chẩn đoán của user ──────────────────────────────────────────

def delete_all_diagnoses_service(user_id: str) -> Dict[str, Any]:
    """Xóa toàn bộ lịch sử chẩn đoán. Thay thế DELETE /api/history."""
    try:
        all_docs = diagnosis_repo.query_diagnoses_by_user(user_id, limit=10000)
        count = len(all_docs)
        success = diagnosis_repo.delete_all_diagnoses_of_user(user_id)
        if not success:
            return {'success': False, 'message': 'Failed to clear diagnoses'}
        return {'success': True, 'count': count}
    except Exception as e:
        print(f"Error in delete_all_diagnoses_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── Thông tin bệnh ────────────────────────────────────────────────────────────

def get_disease_info_service(disease_id: str) -> Dict[str, Any]:
    """Lấy thông tin bệnh từ collection diseases."""
    try:
        disease = diagnosis_repo.get_disease_by_id(disease_id)
        if not disease:
            return {'success': False, 'message': 'Disease not found'}
        return {
            'success': True,
            'data': {
                'name': disease.get('name') or disease.get('diseaseName') or '',
                'description': disease.get('description') or '',
            }
        }
    except Exception as e:
        print(f"Error in get_disease_info_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


def list_supported_diseases_service() -> Dict[str, Any]:
    """Danh sách các bệnh cà phê được model hỗ trợ."""
    try:
        diseases_dict = _load_diseases_from_firestore()
        treatments_dict = _load_treatments_from_firestore()
        
        diseases = []
        for key, disease in diseases_dict.items():
            treatment = treatments_dict.get(key, {})
            diseases.append({
                'key': key,
                'name': disease.get('name', ''),
                'description': disease.get('description', ''),
                'severity': treatment.get('severity', 'none'),
                'color': treatment.get('color', '#9E9E9E'),
            })
        
        return {'success': True, 'diseases': diseases, 'total': len(diseases)}
    except Exception as e:
        print(f"Error in list_supported_diseases_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}', 'diseases': [], 'total': 0}


def get_diagnosis_statistics_service(user_id: str) -> Dict[str, Any]:
    """Thống kê lịch sử chẩn đoán của user."""
    try:
        all_diagnoses = diagnosis_repo.query_diagnoses_by_user(user_id, limit=10000)
        total = len(all_diagnoses)
        disease_counts: Dict[str, int] = {}
        severity_counts = {'none': 0, 'low': 0, 'medium': 0, 'high': 0}

        for d in all_diagnoses:
            key = d.get('diseaseKey', 'unknown')
            sev = d.get('severity', 'none')
            disease_counts[key] = disease_counts.get(key, 0) + 1
            severity_counts[sev] = severity_counts.get(sev, 0) + 1

        most_common = None
        if disease_counts:
            top_key = max(disease_counts, key=disease_counts.get)
            info = _get_disease_info(top_key)
            if info:
                most_common = {'key': top_key, 'name': info['name'], 'count': disease_counts[top_key]}

        return {
            'success': True,
            'statistics': {
                'total': total,
                'healthy_count': disease_counts.get('healthy', 0),
                'diseased_count': total - disease_counts.get('healthy', 0),
                'severity_counts': severity_counts,
                'most_common_disease': most_common,
                'disease_breakdown': disease_counts,
            }
        }
    except Exception as e:
        print(f"Error in get_diagnosis_statistics_service: {e}")
        return {'success': False, 'message': f'Error: {str(e)}'}


# ── YOLO helpers ──────────────────────────────────────────────────────────────

def _load_yolo_model():
    """Lazy-load YOLO model từ best.pt."""
    global _YOLO_MODEL
    if _YOLO_MODEL is not None:
        return _YOLO_MODEL
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f'Model file not found: {MODEL_PATH}')
    ultralytics = importlib.import_module('ultralytics')
    _YOLO_MODEL = ultralytics.YOLO(MODEL_PATH)
    return _YOLO_MODEL


def _preprocess_image_for_model(image_bytes: bytes, img_size: int = 640) -> Image.Image:
    """
    Tiền xử lý cân bằng để giữ đặc trưng thật của lá.
    Tránh các bước quá mạnh gây sai lệch texture/màu.
    """
    try:
        from PIL import ImageEnhance
        import numpy as np
        import cv2
        
        print(f"[Preprocess] Starting balanced preprocessing...")
        
        # Load ảnh
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
        original_size = image.size
        print(f"[Preprocess] Original: {original_size}")
        
        # Convert to numpy for advanced processing
        img_array = np.array(image)
        
        # STEP 1: Đánh giá độ mờ để adaptive sharpen
        blur_score = _estimate_blur_variance(img_array)
        print(f"[Preprocess] Blur score: {round(blur_score, 2)}")

        # STEP 2: Denoise nhẹ
        print(f"[Preprocess] Applying light denoise...")
        img_array = cv2.fastNlMeansDenoisingColored(img_array, None, 5, 5, 7, 15)
        
        # STEP 3: Unsharp theo mức mờ (ảnh càng mờ thì sharpen cao hơn một chút)
        sharpen_strength = 1.18 if blur_score >= 120 else 1.28
        blur_subtract = -0.18 if blur_score >= 120 else -0.28
        print(f"[Preprocess] Applying adaptive unsharp mask...")
        gaussian = cv2.GaussianBlur(img_array, (0, 0), 1.2)
        img_array = cv2.addWeighted(img_array, sharpen_strength, gaussian, blur_subtract, 0)
        
        # Convert back to PIL
        image = Image.fromarray(img_array)
        
        # STEP 4: Smart crop mức vừa phải
        image = _optimized_smart_crop(image)

        # STEP 5: Resize with letterbox (không ép méo tỉ lệ ảnh)
        image = _resize_with_letterbox(image, img_size=img_size)
        print(f"[Preprocess] Resized with letterbox to: {img_size}x{img_size}")
        
        # STEP 6: Convert to numpy
        img_array = np.array(image)
        
        # STEP 7: Adaptive Brightness
        brightness = _calculate_brightness(image)
        print(f"[Preprocess] Brightness: {round(brightness)}")
        
        if brightness < 95:
            print(f"[Preprocess] Image dark, applying gamma correction")
            img_array = _adaptive_gamma_correction(img_array)
        elif brightness > 180:
            print(f"[Preprocess] Image bright, applying gamma correction")
            img_array = _adaptive_gamma_correction(img_array)
        
        # STEP 8: CLAHE cân bằng
        print(f"[Preprocess] Applying balanced CLAHE...")
        img_array = _balanced_clahe(img_array)
        
        # STEP 9: Tăng màu nhẹ vùng bệnh
        print(f"[Preprocess] Applying moderate disease color boost...")
        img_array = _moderate_color_boost(img_array)
        
        # STEP 10: Làm sắc nét nhẹ
        print(f"[Preprocess] Applying light edge enhancement...")
        img_array = _enhance_edges(img_array)
        
        # STEP 11: Convert back to PIL
        image = Image.fromarray(img_array)
        
        # STEP 12: Final sharpening nhẹ
        print(f"[Preprocess] Applying final sharpening...")
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.15 if blur_score >= 120 else 1.25)
        
        # STEP 10: Final contrast nhẹ
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.08)
        
        # STEP 11: Final color nhẹ
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.08)
        
        print(f"[Preprocess] ✅ Balanced preprocessing completed")
        
        return image
        
    except Exception as e:
        print(f"[Preprocess] ERROR: {e}")
        print(f"[Preprocess] Fallback to standard preprocessing")
        try:
            image = Image.open(BytesIO(image_bytes)).convert('RGB')
            
            # Standard enhancement
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(2.0)
            
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(1.4)
            
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.3)
            
            return image.resize((img_size, img_size), Image.Resampling.LANCZOS)
        except:
            image = Image.open(BytesIO(image_bytes)).convert('RGB')
            return image.resize((img_size, img_size), Image.Resampling.LANCZOS)


def _preprocess_image_natural(image_bytes: bytes, img_size: int = 640) -> Image.Image:
    """
    Pipeline nhẹ để giữ đặc trưng tự nhiên của ảnh.
    Dùng như nhánh fallback khi pipeline balanced làm giảm độ nhận diện.
    """
    try:
        from PIL import ImageEnhance
        import numpy as np
        import cv2

        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = _optimized_smart_crop(image)
        image = _resize_with_letterbox(image, img_size=img_size)

        img_array = np.array(image)
        brightness = _calculate_brightness(image)

        if brightness < 90 or brightness > 185:
            img_array = _adaptive_gamma_correction(img_array)

        # CLAHE và sharpen rất nhẹ để tránh phá texture gốc
        img_array = _gentle_clahe(img_array)
        image = Image.fromarray(img_array)

        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.08)
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.05)
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.04)

        return image
    except Exception as e:
        print(f"[PreprocessNatural] Failed: {e}, fallback to balanced pipeline")
        return _preprocess_image_for_model(image_bytes, img_size=img_size)


def _aggressive_smart_crop(image: Image.Image) -> Image.Image:
    """
    AGGRESSIVE Smart Crop - Crop SÁT vào lá, bỏ hết background.
    
    Strategy:
    1. Detect leaf regions với threshold cao
    2. Crop TIGHT vào vùng lá chính (padding chỉ 10%)
    3. Minimum crop 30% (không chấp nhận crop quá nhỏ)
    4. Fallback to tight center crop
    """
    try:
        import numpy as np
        import cv2
        
        img_array = np.array(image)
        height, width = img_array.shape[:2]
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        
        # Detect GREEN leaves (healthy) - Threshold cao hơn
        lower_green = np.array([35, 30, 30])
        upper_green = np.array([80, 255, 255])
        mask_green = cv2.inRange(hsv, lower_green, upper_green)
        
        # Detect YELLOW/BROWN (diseased) - QUAN TRỌNG
        lower_yellow = np.array([15, 30, 30])
        upper_yellow = np.array([35, 255, 255])
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
        
        # Detect BROWN/RED (severe)
        lower_brown = np.array([0, 30, 30])
        upper_brown = np.array([15, 255, 255])
        mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
        
        # Combine masks
        mask = cv2.bitwise_or(mask_green, mask_yellow)
        mask = cv2.bitwise_or(mask, mask_brown)
        
        # Morphological operations - Mạnh hơn
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Get largest contour
            largest = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest)
            
            # TIGHT padding - CHỈ 10% để crop sát
            margin_x = int(w * 0.10)
            margin_y = int(h * 0.10)
            
            x = max(0, x - margin_x)
            y = max(0, y - margin_y)
            w = min(width - x, w + 2 * margin_x)
            h = min(height - y, h + 2 * margin_y)
            
            # Validate - Chấp nhận từ 30% trở lên
            crop_ratio = (w * h) / (width * height)
            
            if crop_ratio >= 0.30:
                cropped = image.crop((x, y, x + w, y + h))
                print(f"[Crop] ✅ TIGHT crop: {width}x{height} → {w}x{h} ({round(crop_ratio*100)}% retained)")
                return cropped
            else:
                print(f"[Crop] ⚠️ Crop too small ({round(crop_ratio*100)}%), using tight center crop")
        else:
            print(f"[Crop] ⚠️ No leaf detected, using tight center crop")
        
        # Fallback: Tight center crop 85% - Bỏ nhiều background
        margin = 0.075
        x = int(width * margin)
        y = int(height * margin)
        w = int(width * (1 - 2 * margin))
        h = int(height * (1 - 2 * margin))
        
        print(f"[Crop] Tight center crop 85%: {width}x{height} → {w}x{h}")
        return image.crop((x, y, x + w, y + h))
        
    except Exception as e:
        print(f"[Crop] ERROR: {e}, returning original")
        return image


def _strong_clahe(img_array: np.ndarray) -> np.ndarray:
    """
    STRONG CLAHE - CLAHE mạnh để tăng contrast tối đa.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # STRONG CLAHE với clip limit cao (3.5)
        clahe = cv2.createCLAHE(clipLimit=3.5, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Tăng A, B channels mạnh hơn
        a = np.clip(a * 1.08, 0, 255).astype(np.uint8)
        b = np.clip(b * 1.08, 0, 255).astype(np.uint8)
        
        # Merge back
        lab = cv2.merge([l, a, b])
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return rgb
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _aggressive_enhance_disease_colors(img_array: np.ndarray) -> np.ndarray:
    """
    AGGRESSIVE Enhance Disease Colors - Tăng màu vùng bệnh TỐI ĐA.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Tăng saturation MẠNH ở vùng màu bệnh
        # Hue 0-40: Red/Brown/Yellow (tất cả bệnh)
        disease_mask = ((h >= 0) & (h <= 40)) | ((h >= 165) & (h <= 180))
        
        # Tăng saturation MẠNH (30%)
        s = np.where(disease_mask, np.minimum(s * 1.30, 255), s).astype(np.uint8)
        
        # Tăng value để làm sáng vùng bệnh (15%)
        v = np.where(disease_mask, np.minimum(v * 1.15, 255), v).astype(np.uint8)
        
        # Merge back
        hsv = cv2.merge([h, s, v])
        rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return rgb
    except Exception as e:
        print(f"[EnhanceColors] Failed: {e}")
        return img_array


def _optimized_smart_crop(image: Image.Image) -> Image.Image:
    """
    Optimized Smart Crop V2 - Crop thông minh tập trung vào lá cà phê.
    
    Strategy:
    1. Detect leaf regions (green + yellow/brown disease areas)
    2. Find optimal bounding box with generous padding
    3. Validate crop size (minimum 20% of original)
    4. Fallback to center crop if detection fails
    """
    try:
        import numpy as np
        import cv2
        
        img_array = np.array(image)
        height, width = img_array.shape[:2]
        
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        
        # Detect GREEN leaves (healthy)
        lower_green = np.array([30, 25, 25])
        upper_green = np.array([85, 255, 255])
        mask_green = cv2.inRange(hsv, lower_green, upper_green)
        
        # Detect YELLOW/BROWN (diseased areas) - QUAN TRỌNG cho detection
        lower_yellow = np.array([12, 25, 25])
        upper_yellow = np.array([38, 255, 255])
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
        
        # Detect BROWN/RED (severe disease)
        lower_brown = np.array([0, 25, 25])
        upper_brown = np.array([18, 255, 255])
        mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
        
        # Combine all masks - Bao gồm cả vùng bệnh
        mask = cv2.bitwise_or(mask_green, mask_yellow)
        mask = cv2.bitwise_or(mask, mask_brown)
        
        # Morphological operations - Làm mịn mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Get largest contour (main leaf area)
            largest = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest)
            
            # Padding lớn hơn để tránh crop quá sát khi user chụp gần
            margin_x = int(w * 0.35)
            margin_y = int(h * 0.35)
            
            x = max(0, x - margin_x)
            y = max(0, y - margin_y)
            w = min(width - x, w + 2 * margin_x)
            h = min(height - y, h + 2 * margin_y)
            
            # Validate crop size - Chấp nhận crop từ 30% trở lên để giữ ngữ cảnh
            crop_ratio = (w * h) / (width * height)
            
            if crop_ratio >= 0.30:
                cropped = image.crop((x, y, x + w, y + h))
                print(f"[Crop] ✅ Smart crop: {width}x{height} → {w}x{h} ({round(crop_ratio*100)}% retained)")
                return cropped
            else:
                print(f"[Crop] ⚠️ Crop too small ({round(crop_ratio*100)}%), using center crop")
        else:
            print(f"[Crop] ⚠️ No leaf detected, using center crop")
        
        # Fallback: Center crop 96% - hạn chế over-crop
        margin = 0.02
        x = int(width * margin)
        y = int(height * margin)
        w = int(width * (1 - 2 * margin))
        h = int(height * (1 - 2 * margin))
        
        print(f"[Crop] Center crop 96%: {width}x{height} → {w}x{h}")
        return image.crop((x, y, x + w, y + h))
        
    except Exception as e:
        print(f"[Crop] ERROR: {e}, returning original")
        return image


def _resize_with_letterbox(image: Image.Image, img_size: int = 640) -> Image.Image:
    """
    Resize giữ nguyên tỉ lệ, sau đó pad ra ảnh vuông để tránh méo hình.
    Cách này thường ổn định hơn ép trực tiếp (w,h) -> (img_size,img_size).
    """
    try:
        w, h = image.size
        if w <= 0 or h <= 0:
            return image.resize((img_size, img_size), Image.Resampling.LANCZOS)

        scale = min(img_size / w, img_size / h)
        new_w = max(1, int(round(w * scale)))
        new_h = max(1, int(round(h * scale)))

        resized = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (img_size, img_size), (0, 0, 0))
        paste_x = (img_size - new_w) // 2
        paste_y = (img_size - new_h) // 2
        canvas.paste(resized, (paste_x, paste_y))
        return canvas
    except Exception as e:
        print(f"[Resize] Letterbox failed: {e}, fallback to direct resize")
        return image.resize((img_size, img_size), Image.Resampling.LANCZOS)


def _balanced_clahe(img_array: np.ndarray) -> np.ndarray:
    """
    Balanced CLAHE - CLAHE cân bằng tối ưu cho detection.
    Áp dụng trên LAB color space để giữ màu tự nhiên.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # CLAHE với clip limit cân bằng (2.2)
        clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Tăng nhẹ A, B channels để giữ màu
        a = np.clip(a * 1.03, 0, 255).astype(np.uint8)
        b = np.clip(b * 1.03, 0, 255).astype(np.uint8)
        
        # Merge back
        lab = cv2.merge([l, a, b])
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return rgb
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _enhance_disease_colors(img_array: np.ndarray) -> np.ndarray:
    """
    Enhance Disease Colors - Tăng cường màu vùng bệnh (vàng, nâu, đỏ).
    Giúp model detect tốt hơn các vết bệnh.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Tăng saturation ở vùng màu bệnh
        # Hue 0-18: Red/Brown (Rust severe, Cercospora)
        # Hue 18-38: Yellow/Orange (Rust, Miner)
        disease_mask = ((h >= 0) & (h <= 38)) | ((h >= 170) & (h <= 180))
        
        # Tăng saturation vừa phải (15%) để làm nổi bật
        s = np.where(disease_mask, np.minimum(s * 1.15, 255), s).astype(np.uint8)
        
        # Tăng nhẹ value để làm sáng vùng bệnh (7%)
        v = np.where(disease_mask, np.minimum(v * 1.07, 255), v).astype(np.uint8)
        
        # Merge back
        hsv = cv2.merge([h, s, v])
        rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return rgb
    except Exception as e:
        print(f"[EnhanceColors] Failed: {e}")
        return img_array


def _gentle_clahe(img_array: np.ndarray) -> np.ndarray:
    """
    Gentle CLAHE - CLAHE nhẹ nhàng, không quá mạnh.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # CLAHE với clip limit thấp hơn (2.0 thay vì 3.5)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Merge back
        lab = cv2.merge([l, a, b])
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return rgb
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _moderate_clahe(img_array: np.ndarray) -> np.ndarray:
    """
    Moderate CLAHE - CLAHE vừa phải, cân bằng tốt.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # CLAHE với clip limit vừa phải (2.5)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Tăng nhẹ A, B channels
        a = np.clip(a * 1.05, 0, 255).astype(np.uint8)
        b = np.clip(b * 1.05, 0, 255).astype(np.uint8)
        
        # Merge back
        lab = cv2.merge([l, a, b])
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return rgb
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _subtle_color_boost(img_array: np.ndarray) -> np.ndarray:
    """
    Subtle Color Boost - Tăng màu rất nhẹ, chỉ ở vùng bệnh.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Chỉ tăng saturation nhẹ ở vùng màu bệnh (hue 10-35)
        disease_mask = (h >= 10) & (h <= 35)
        
        # Tăng rất nhẹ (10% thay vì 40%)
        s = np.where(disease_mask, np.minimum(s * 1.10, 255), s).astype(np.uint8)
        
        # Merge back
        hsv = cv2.merge([h, s, v])
        rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return rgb
    except Exception as e:
        print(f"[ColorBoost] Failed: {e}")
        return img_array


def _moderate_color_boost(img_array: np.ndarray) -> np.ndarray:
    """
    Moderate Color Boost - Tăng màu vừa phải ở vùng bệnh.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Tăng saturation ở vùng màu bệnh (hue 10-40)
        disease_mask = (h >= 10) & (h <= 40)
        
        # Tăng vừa phải (18%)
        s = np.where(disease_mask, np.minimum(s * 1.18, 255), s).astype(np.uint8)
        
        # Tăng nhẹ value để làm sáng vùng bệnh
        v = np.where(disease_mask, np.minimum(v * 1.08, 255), v).astype(np.uint8)
        
        # Merge back
        hsv = cv2.merge([h, s, v])
        rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return rgb
    except Exception as e:
        print(f"[ColorBoost] Failed: {e}")
        return img_array


def _calculate_brightness(image: Image.Image) -> float:
    """Tính độ sáng trung bình của ảnh."""
    try:
        from PIL import ImageStat
        stat = ImageStat.Stat(image)
        return sum(stat.mean) / 3
    except:
        return 128


def _estimate_blur_variance(img_array: np.ndarray) -> float:
    """
    Ước lượng độ mờ bằng variance của Laplacian.
    Giá trị thấp hơn nghĩa là ảnh mờ hơn.
    """
    try:
        import cv2

        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        return float(cv2.Laplacian(gray, cv2.CV_64F).var())
    except Exception:
        return 150.0


def _strong_clahe_v2(img_array: np.ndarray) -> np.ndarray:
    """
    Strong CLAHE V2 - CLAHE mạnh hơn cho ảnh mờ.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # STRONG CLAHE với clip limit cao (4.0)
        clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Tăng A, B channels mạnh hơn
        a = np.clip(a * 1.12, 0, 255).astype(np.uint8)
        b = np.clip(b * 1.12, 0, 255).astype(np.uint8)
        
        # Merge back
        lab = cv2.merge([l, a, b])
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return rgb
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _aggressive_color_boost(img_array: np.ndarray) -> np.ndarray:
    """
    Aggressive Color Boost - Tăng màu vùng bệnh TỐI ĐA.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Tăng saturation MẠNH ở vùng màu bệnh
        # Hue 0-45: Red/Brown/Yellow (tất cả bệnh)
        disease_mask = ((h >= 0) & (h <= 45)) | ((h >= 160) & (h <= 180))
        
        # Tăng saturation MẠNH (35%)
        s = np.where(disease_mask, np.minimum(s * 1.35, 255), s).astype(np.uint8)
        
        # Tăng value để làm sáng vùng bệnh (20%)
        v = np.where(disease_mask, np.minimum(v * 1.20, 255), v).astype(np.uint8)
        
        # Merge back
        hsv = cv2.merge([h, s, v])
        rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return rgb
    except Exception as e:
        print(f"[ColorBoost] Failed: {e}")
        return img_array


def _enhance_edges_advanced(img_array: np.ndarray) -> np.ndarray:
    """
    Advanced Edge Enhancement - Làm nổi bật viền vết bệnh mạnh mẽ.
    """
    try:
        import cv2
        
        # Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Sobel edge detection (X + Y)
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        sobel = np.sqrt(sobelx**2 + sobely**2)
        sobel = np.uint8(np.clip(sobel, 0, 255))
        
        # Normalize
        sobel = cv2.normalize(sobel, None, 0, 255, cv2.NORM_MINMAX)
        
        # Convert to 3 channels
        sobel_3ch = cv2.cvtColor(sobel, cv2.COLOR_GRAY2RGB)
        
        # Blend with original (stronger blend)
        enhanced = cv2.addWeighted(img_array, 1.0, sobel_3ch, 0.4, 0)
        
        return enhanced
    except Exception as e:
        print(f"[EdgeEnhance] Failed: {e}")
        return img_array


def _enhance_disease_regions(img_array: np.ndarray) -> np.ndarray:
    """
    Tăng cường vùng bệnh - Làm nổi bật các vết bệnh.
    Sử dụng selective enhancement dựa trên màu sắc.
    """
    try:
        import cv2
        
        # Convert to HSV
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        h, s, v = cv2.split(hsv)
        
        # Tăng saturation ở vùng màu bệnh (vàng, nâu, đỏ)
        # Hue: 0-35 (red-yellow-brown range)
        disease_mask = ((h >= 0) & (h <= 35)) | ((h >= 170) & (h <= 180))
        
        # Tăng saturation và value ở vùng bệnh
        s = np.where(disease_mask, np.minimum(s * 1.4, 255), s).astype(np.uint8)
        v = np.where(disease_mask, np.minimum(v * 1.2, 255), v).astype(np.uint8)
        
        # Merge back
        hsv_enhanced = cv2.merge([h, s, v])
        rgb_enhanced = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2RGB)
        
        return rgb_enhanced
    except Exception as e:
        print(f"[EnhanceDisease] Failed: {e}")
        return img_array


def _advanced_clahe_lab(img_array: np.ndarray) -> np.ndarray:
    """
    Advanced CLAHE trên LAB color space.
    Áp dụng CLAHE riêng cho L channel và tăng cường A, B channels.
    """
    try:
        import cv2
        
        # Convert to LAB
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # CLAHE on L channel với clip limit cao hơn
        clahe = cv2.createCLAHE(clipLimit=3.5, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Tăng cường A và B channels (màu sắc)
        a = cv2.normalize(a, None, 0, 255, cv2.NORM_MINMAX)
        b = cv2.normalize(b, None, 0, 255, cv2.NORM_MINMAX)
        
        # Merge back
        lab_enhanced = cv2.merge([l, a, b])
        rgb_enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2RGB)
        
        return rgb_enhanced
    except Exception as e:
        print(f"[CLAHE] Failed: {e}")
        return img_array


def _adaptive_gamma_correction(img_array: np.ndarray) -> np.ndarray:
    """
    Adaptive Gamma Correction - Tự động điều chỉnh gamma theo histogram.
    """
    try:
        import cv2
        
        # Tính mean intensity
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        mean_intensity = np.mean(gray)
        
        # Tính gamma dựa trên mean intensity
        if mean_intensity < 80:
            gamma = 1.0 + (80 - mean_intensity) / 200  # Tối → tăng gamma
        elif mean_intensity > 170:
            gamma = 1.0 - (mean_intensity - 170) / 300  # Sáng → giảm gamma
        else:
            gamma = 1.0  # OK
        
        gamma = np.clip(gamma, 0.6, 1.6)
        
        if gamma != 1.0:
            # Apply gamma correction
            inv_gamma = 1.0 / gamma
            table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype(np.uint8)
            img_array = cv2.LUT(img_array, table)
            print(f"[Gamma] Applied gamma={round(gamma, 2)}")
        
        return img_array
    except Exception as e:
        print(f"[Gamma] Failed: {e}")
        return img_array


def _multi_channel_sharpen(img_array: np.ndarray) -> np.ndarray:
    """
    Multi-channel Sharpening - Tăng sắc nét riêng cho từng kênh màu.
    Giúp làm nổi bật chi tiết vết bệnh tốt hơn.
    """
    try:
        import cv2
        
        # Split channels
        r, g, b = cv2.split(img_array)
        
        # Sharpen kernel
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        
        # Apply sharpening to each channel
        r_sharp = cv2.filter2D(r, -1, kernel)
        g_sharp = cv2.filter2D(g, -1, kernel)
        b_sharp = cv2.filter2D(b, -1, kernel)
        
        # Blend original and sharpened (70% sharp, 30% original)
        r = cv2.addWeighted(r_sharp, 0.7, r, 0.3, 0)
        g = cv2.addWeighted(g_sharp, 0.7, g, 0.3, 0)
        b = cv2.addWeighted(b_sharp, 0.7, b, 0.3, 0)
        
        return cv2.merge([r, g, b])
    except Exception as e:
        print(f"[Sharpen] Failed: {e}")
        return img_array


def _boost_disease_colors(img_array: np.ndarray) -> np.ndarray:
    """
    Boost Disease Colors - Tăng cường màu bệnh (vàng, nâu, đỏ).
    Sử dụng color transformation matrix.
    """
    try:
        import cv2
        
        # Convert to float
        img_float = img_array.astype(np.float32) / 255.0
        r, g, b = cv2.split(img_float)
        
        # Boost yellow/brown (Rust, Miner)
        # Vùng có R > G > B
        yellow_mask = (r > g) & (g > b) & (r > 0.3)
        r = np.where(yellow_mask, np.minimum(r * 1.25, 1.0), r)
        g = np.where(yellow_mask, np.minimum(g * 1.1, 1.0), g)
        b = np.where(yellow_mask, b * 0.85, b)
        
        # Boost red (severe Rust)
        red_mask = (r > g * 1.4) & (r > b * 1.4) & (r > 0.4)
        r = np.where(red_mask, np.minimum(r * 1.2, 1.0), r)
        
        # Boost brown (Phoma, Cercospora)
        brown_mask = (r > 0.25) & (g > 0.15) & (b < 0.25) & (r > g) & (g > b)
        r = np.where(brown_mask, np.minimum(r * 1.15, 1.0), r)
        g = np.where(brown_mask, np.minimum(g * 1.1, 1.0), g)
        
        # Convert back
        img_float = cv2.merge([r, g, b])
        img_array = (img_float * 255).astype(np.uint8)
        
        return img_array
    except Exception as e:
        print(f"[BoostColors] Failed: {e}")
        return img_array


def _enhance_edges(img_array: np.ndarray) -> np.ndarray:
    """
    Edge Enhancement - Làm nổi bật viền vết bệnh.
    Sử dụng Laplacian edge detection và blending.
    """
    try:
        import cv2
        
        # Convert to grayscale for edge detection
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Laplacian edge detection
        laplacian = cv2.Laplacian(gray, cv2.CV_64F, ksize=3)
        laplacian = np.uint8(np.absolute(laplacian))
        
        # Normalize
        laplacian = cv2.normalize(laplacian, None, 0, 255, cv2.NORM_MINMAX)
        
        # Convert back to 3 channels
        laplacian_3ch = cv2.cvtColor(laplacian, cv2.COLOR_GRAY2RGB)
        
        # Blend with original (add edges)
        enhanced = cv2.addWeighted(img_array, 1.0, laplacian_3ch, 0.3, 0)
        
        return enhanced
    except Exception as e:
        print(f"[EnhanceEdges] Failed: {e}")
        return img_array


def _contrast_stretching(img_array: np.ndarray) -> np.ndarray:
    """
    Contrast Stretching - Kéo giãn độ tương phản.
    Sử dụng percentile-based stretching để tránh outliers.
    """
    try:
        import cv2
        
        # Calculate percentiles (2% and 98%)
        p2 = np.percentile(img_array, 2)
        p98 = np.percentile(img_array, 98)
        
        # Stretch contrast
        img_stretched = np.clip((img_array - p2) * (255.0 / (p98 - p2)), 0, 255).astype(np.uint8)
        
        return img_stretched
    except Exception as e:
        print(f"[ContrastStretch] Failed: {e}")
        return img_array


def _run_yolo_prediction(image: Image.Image, img_size: int = 640, conf_threshold: float = 0.05) -> Dict[str, Any]:
    import time
    started = time.time()
    
    print(f"[YOLO] Starting prediction...")
    print(f"[YOLO] Image size: {img_size}x{img_size}")
    print(f"[YOLO] Confidence threshold: {conf_threshold}")
    
    model = _load_yolo_model()
    print(f"[YOLO] Model loaded in {round(time.time() - started, 2)}s")
    
    # Prediction với settings tối ưu cho detection
    predict_start = time.time()
    
    results = model.predict(
        source=image, 
        imgsz=img_size, 
        conf=conf_threshold,  # Threshold thấp để detect nhiều hơn
        verbose=False,
        device='cpu',
        half=False,
        max_det=300,  # Tăng lên 300 detections
        augment=True,  # Test-time augmentation
        agnostic_nms=False,
        iou=0.35,  # IoU threshold - Giảm để giữ nhiều overlapping boxes
    )
    
    predict_time = round(time.time() - predict_start, 2)
    print(f"[YOLO] Prediction completed in {predict_time}s")
    
    processing_time = round(time.time() - started, 4)

    summary: Dict[str, int] = {}
    detections: List[Dict[str, Any]] = []
    primary_disease = None
    primary_confidence = 0.0
    
    all_confidences = []

    if not results:
        print(f"[YOLO] No results returned")
        return {
            'summary': summary, 
            'detections': detections, 
            'primaryDisease': 'unknown',
            'primaryConfidence': 0.0, 
            'processingTime': processing_time,
            'isValidCoffeeLeaf': False,
        }

    result = results[0]
    names = result.names if hasattr(result, 'names') else {}
    boxes = getattr(result, 'boxes', None)

    if boxes is None or len(boxes) == 0:
        print(f"[YOLO] No objects detected")
        print(f"[YOLO] ⚠️ Model không detect được gì - Có thể:")
        print(f"[YOLO]   1. Ảnh không phải lá cà phê")
        print(f"[YOLO]   2. Ảnh quá mờ/tối/sáng")
        print(f"[YOLO]   3. Lá quá nhỏ trong khung hình")
        return {
            'summary': summary, 
            'detections': detections, 
            'primaryDisease': 'not_coffee_leaf',
            'primaryConfidence': 0.0, 
            'processingTime': processing_time,
            'isValidCoffeeLeaf': False,
        }

    print(f"[YOLO] Detected {len(boxes)} objects")
    
    # Tính weighted confidence cho từng bệnh
    disease_confidence_sum: Dict[str, float] = {}
    disease_count: Dict[str, int] = {}
    disease_max_conf: Dict[str, float] = {}
    disease_area_sum: Dict[str, float] = {}  # Tổng diện tích vùng bệnh
    
    for idx in range(len(boxes)):
        class_id = int(boxes.cls[idx].item())
        confidence = float(boxes.conf[idx].item())
        bbox = [int(x) for x in boxes.xyxy[idx].tolist()]
        disease_name = str(names.get(class_id, str(class_id))).strip()
        
        # Tính diện tích bbox
        area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])

        summary[disease_name] = summary.get(disease_name, 0) + 1
        detections.append({
            'disease': disease_name, 
            'confidence': round(confidence, 4), 
            'bbox': bbox,
            'area': area
        })
        
        all_confidences.append(confidence)
        
        # Tính statistics cho từng bệnh
        disease_confidence_sum[disease_name] = disease_confidence_sum.get(disease_name, 0.0) + confidence
        disease_count[disease_name] = disease_count.get(disease_name, 0) + 1
        disease_max_conf[disease_name] = max(disease_max_conf.get(disease_name, 0.0), confidence)
        disease_area_sum[disease_name] = disease_area_sum.get(disease_name, 0.0) + area
    
    # Chọn primary disease - Weighted scoring V2
    if disease_confidence_sum:
        # Score = (avg_confidence * 0.5) + (max_confidence * 0.25) + (count_weight * 0.15) + (area_weight * 0.10)
        disease_scores = {}
        max_count = max(disease_count.values())
        max_area = max(disease_area_sum.values())
        
        for disease in disease_confidence_sum:
            avg_conf = disease_confidence_sum[disease] / disease_count[disease]
            max_conf = disease_max_conf[disease]
            count_weight = disease_count[disease] / max_count
            area_weight = disease_area_sum[disease] / max_area
            
            # Weighted score - Ưu tiên confidence và area
            score = (avg_conf * 0.5) + (max_conf * 0.25) + (count_weight * 0.15) + (area_weight * 0.10)
            disease_scores[disease] = score
            
            print(f"[YOLO] {disease}: avg={round(avg_conf*100,1)}%, max={round(max_conf*100,1)}%, count={disease_count[disease]}, area={round(area_weight*100)}%, score={round(score,3)}")
        
        primary_disease = max(disease_scores, key=disease_scores.get)
        # Primary confidence = average confidence của bệnh đó
        primary_confidence = disease_confidence_sum[primary_disease] / disease_count[primary_disease]
        
        overall_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0.0
        
        print(f"[YOLO] ✅ Primary: {primary_disease}")
        print(f"[YOLO]    - Avg confidence: {round(primary_confidence * 100, 1)}%")
        print(f"[YOLO]    - Max confidence: {round(disease_max_conf[primary_disease] * 100, 1)}%")
        print(f"[YOLO]    - Count: {disease_count[primary_disease]}")
        print(f"[YOLO]    - Overall: {round(overall_confidence * 100, 1)}%")
    
    is_valid = primary_confidence >= 0.001  # Threshold rất thấp
    
    if not is_valid:
        print(f"[YOLO] ⚠️ Confidence too low ({round(primary_confidence * 100, 1)}%)")
    
    print(f"[YOLO] Summary: {summary}")
    print(f"[YOLO] Total processing time: {processing_time}s")

    return {
        'summary': summary,
        'detections': detections,
        'primaryDisease': primary_disease or 'unknown',
        'primaryConfidence': primary_confidence,
        'processingTime': processing_time,
        'isValidCoffeeLeaf': is_valid,
    }


def _filter_existing_disease_ids(raw_ids: List[str]) -> List[str]:
    filtered: List[str] = []
    for raw_id in raw_ids:
        disease_id = _resolve_disease_id(raw_id)
        if disease_id and disease_id not in filtered:
            filtered.append(disease_id)
    return filtered


def _resolve_disease_id(raw_id: str) -> Optional[str]:
    if not raw_id:
        return None
    base = raw_id.strip()
    for candidate in [base, base.lower(), base.title(), base.upper()]:
        disease = diagnosis_repo.get_disease_by_id(candidate)
        if disease:
            return disease.get('id') or candidate
    return None
