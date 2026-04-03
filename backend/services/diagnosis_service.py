"""
Diagnosis (Coffee Disease Detection) service.

Xử lý:
- Nhận ảnh lá cà phê
- Gọi model ML để dự đoán bệnh
- Chuẩn hóa kết quả chẩn đoán
- Lưu vào diagnoses (full detail) + history (metadata)
- Tạo notification nếu cần
"""
from backend.repositories import firebase_diagnosis_repository as diagnosis_repo
from backend.repositories import firebase_history_repository as history_repo
from backend.repositories import firebase_storage_repository as storage_repo
from backend.repositories import firebase_notification_repository as notification_repo
from backend.repositories import firebase_image_repository as image_repo
from typing import Dict, Any, Optional, List
from datetime import datetime
from io import BytesIO
import os
import importlib

import requests
from PIL import Image


MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'predict_models', 'version1.pt')
_YOLO_MODEL = None


# Danh sách bệnh cà phê được hỗ trợ
SUPPORTED_DISEASES = {
    'healthy': {
        'name': 'Healthy (Khỏe mạnh)',
        'name_vi': 'Lá khỏe mạnh',
        'description': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh.',
        'treatment': 'Tiếp tục chăm sóc bình thường. Bón phân định kỳ và tưới nước đầy đủ.',
        'severity': 'none',
        'color': '#4CAF50'
    },
    'rust': {
        'name': 'Coffee Rust (Gỉ sắt)',
        'name_vi': 'Bệnh gỉ sắt',
        'description': 'Bệnh gỉ sắt do nấm Hemileia vastatrix gây ra. Triệu chứng: Các đốm màu vàng cam trên mặt dưới lá, lá rụng sớm.',
        'treatment': 'Phun thuốc chống nấm (đồng oxychloride, mancozeb). Cải thiện thoát nước. Tỉa cành để tăng thông thoáng. Bón phân cân đối.',
        'severity': 'high',
        'color': '#FF5722'
    },
    'cercospora': {
        'name': 'Cercospora Leaf Spot (Đốm lá)',
        'name_vi': 'Bệnh đốm lá Cercospora',
        'description': 'Bệnh đốm lá do nấm Cercospora coffeicola. Triệu chứng: Các đốm tròn màu nâu trên lá, có viền vàng.',
        'treatment': 'Phun thuốc chống nấm. Loại bỏ lá bệnh. Tránh tưới nước lên lá. Cải thiện dinh dưỡng cho cây.',
        'severity': 'medium',
        'color': '#FF9800'
    },
    'miner': {
        'name': 'Leaf Miner (Sâu đục lá)',
        'name_vi': 'Sâu đục lá',
        'description': 'Sâu đục lá cà phê (Leucoptera coffeella). Triệu chứng: Đường hầm uốn khúc trên lá, lá bị khô và rụng.',
        'treatment': 'Phun thuốc trừ sâu sinh học. Thu gom và tiêu hủy lá bệnh. Sử dụng bẫy dính màu vàng. Thả thiên địch tự nhiên.',
        'severity': 'medium',
        'color': '#FFC107'
    },
    'phoma': {
        'name': 'Phoma Leaf Spot (Đốm lá Phoma)',
        'name_vi': 'Bệnh đốm lá Phoma',
        'description': 'Bệnh đốm lá do nấm Phoma. Triệu chứng: Các đốm màu nâu đen, có thể lan rộng và gây rụng lá.',
        'treatment': 'Phun thuốc chống nấm. Cải thiện thoát nước. Tránh tưới nước quá nhiều. Bón phân hợp lý.',
        'severity': 'medium',
        'color': '#795548'
    }
}


def upload_image_to_cloudinary_service(user_id: str, image_file: Any) -> Dict[str, Any]:
    """
    Upload anh len Cloudinary va luu metadata vao Firestore collection images.

    Args:
        user_id: UID cua user
        image_file: FastAPI UploadFile

    Returns:
        {'success': True, 'imageID': '...'}
    """
    try:
        if not image_file:
            return {'success': False, 'message': 'Image file is required'}

        content_type = getattr(image_file, 'content_type', '') or ''
        if not content_type.startswith('image/'):
            return {'success': False, 'message': 'Only image files are allowed'}

        cloud_name = "dz89vwzco"
        api_key = "131793621143365"
        api_secret = "HEJ3cGLQ-uPHkca7SfbW5KDp01M"

        if not cloud_name or not api_key or not api_secret:
            return {
                'success': False,
                'message': 'Missing Cloudinary config (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)'
            }

        try:
            cloudinary = importlib.import_module('cloudinary')
            cloudinary_uploader = importlib.import_module('cloudinary.uploader')
        except ModuleNotFoundError:
            return {
                'success': False,
                'message': 'Cloudinary package is not installed. Run: pip install cloudinary'
            }

        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True,
        )

        file_bytes = image_file.file.read() if hasattr(image_file, 'file') else None
        if not file_bytes:
            return {'success': False, 'message': 'Empty image file'}

        upload_result = cloudinary_uploader.upload(
            file_bytes,
            folder=f'diagnosis/{user_id}',
            resource_type='image',
            overwrite=False,
        )

        public_id = upload_result.get('public_id')
        image_url = upload_result.get('secure_url') or upload_result.get('url')

        if not public_id or not image_url:
            return {'success': False, 'message': 'Upload succeeded but missing Cloudinary response data'}

        image_id = image_repo.insert_image_metadata(
            user_id=user_id,
            public_id=public_id,
            image_url=image_url,
        )
        if not image_id:
            return {'success': False, 'message': 'Failed to save image metadata to Firebase'}

        return {
            'success': True,
            'imageID': image_id,
        }

    except Exception as e:
        print(f"Error in upload_image_to_cloudinary_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def predict_disease_by_image_id_service(
    user_id: str,
    image_id: str,
    img_size: int = 640,
    conf_threshold: float = 0.25,
    save_to_history: bool = True
) -> Dict[str, Any]:
    """
    Predict benh tu imageId da luu trong collection images.

    Output:
    {
        'success': True,
        'data': {
            'inferenceId': '...'
            'imageId': '...'
            'summary': {'Rust': 40, 'Phoma': 1},
            'diseaseID': ['Rust', 'Phoma']
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

        response = requests.get(image_url, timeout=20)
        if response.status_code != 200:
            return {'success': False, 'message': f'Cannot download image (status={response.status_code})'}

        processed_image = _preprocess_image_for_model(response.content, img_size=img_size)
        prediction_result = _run_yolo_prediction(processed_image, img_size=img_size, conf_threshold=conf_threshold)

        summary = prediction_result.get('summary', {})
        detections = prediction_result.get('detections', [])

        raw_disease_ids = list(summary.keys())
        disease_ids = _filter_existing_disease_ids(raw_disease_ids)

        diagnosis_id = None
        history_id = None

        if save_to_history:
            primary_disease = prediction_result.get('primaryDisease')
            primary_confidence = prediction_result.get('primaryConfidence', 0.0)

            primary_info = SUPPORTED_DISEASES.get((primary_disease or '').lower(), SUPPORTED_DISEASES['healthy'])
            diagnosis_data = {
                'diseaseKey': (primary_disease or 'healthy').lower(),
                'diseaseName': primary_info['name'],
                'diseaseNameVi': primary_info['name_vi'],
                'confidence': primary_confidence,
                'description': primary_info['description'],
                'treatment': primary_info['treatment'],
                'severity': primary_info['severity'],
                'imageUrl': image_url,
                'modelVersion': 'version1.pt',
                'processingTime': prediction_result.get('processingTime', 0.0),
                'imageId': image_id,
                'summary': summary,
                'detections': detections,
                'diseaseIDs': disease_ids,
            }

            diagnosis_id = diagnosis_repo.insert_diagnosis(user_id, diagnosis_data)
            if not diagnosis_id:
                return {'success': False, 'message': 'Failed to save diagnosis'}

            history_data = {
                'imageId': image_id,
                'predictions': {
                    'summary': summary,
                    'diseaseID': disease_ids,
                    'primaryDisease': primary_disease,
                    'confidence': primary_confidence,
                }
            }
            history_id = history_repo.insert_history(user_id, diagnosis_id, history_data)

        return {
            'success': True,
            'data': {
                'inferenceId': history_id or diagnosis_id,
                'diagnosisId': diagnosis_id,
                'historyId': history_id,
                'imageId': image_id,
                'summary': summary,
                'diseaseID': disease_ids,
                'totalDetections': sum(summary.values()),
                'imgSize': img_size,
            }
        }
    except Exception as e:
        print(f"Error in predict_disease_by_image_id_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def predict_disease_from_image_service(
    user_id: str,
    image_file: Any,
    save_to_history: bool = True
) -> Dict[str, Any]:
    """
    Chẩn đoán bệnh từ ảnh lá cà phê.
    
    Flow:
    1. Upload ảnh lên Firebase Storage
    2. Gọi AI model để dự đoán (giả lập)
    3. Lưu kết quả vào diagnoses (full detail)
    4. Lưu metadata vào history (link to diagnosis)
    5. Tạo notification nếu phát hiện bệnh nghiêm trọng
    
    Args:
        user_id: ID người dùng
        image_file: File ảnh (từ multipart/form-data)
        save_to_history: Có lưu vào lịch sử không (default: True)
    
    Returns:
        Dict chứa kết quả chẩn đoán
    """
    try:
        # 1. Upload ảnh lên Firebase Storage (nếu bucket/billing chưa sẵn sàng vẫn chẩn đoán được)
        # FastAPI UploadFile cần đọc bytes trước khi gửi vào storage repository.
        file_bytes = image_file.file.read() if hasattr(image_file, 'file') else image_file
        image_url = storage_repo.upload_diagnosis_image(user_id, file_bytes)
        storage_skipped = False
        if not image_url:
            storage_skipped = True
            image_url = ''
            print(
                "Firebase Storage upload skipped: enable Billing + Storage in Firebase Console, "
                "or set FIREBASE_STORAGE_BUCKET in .env. Continuing diagnosis without stored image."
            )

        # 2. Gọi AI model để dự đoán bệnh
        # TODO: Thay bằng model thật
        prediction_result = _mock_ai_prediction(image_url or 'local')
        
        disease_key = prediction_result['disease_key']
        confidence = prediction_result['confidence']
        processing_time = prediction_result.get('processing_time', 1.5)
        
        # 3. Lấy thông tin chi tiết về bệnh
        disease_info = SUPPORTED_DISEASES.get(disease_key, SUPPORTED_DISEASES['healthy'])
        
        # 4. Chuẩn bị dữ liệu chẩn đoán đầy đủ
        diagnosis_data = {
            'diseaseKey': disease_key,
            'diseaseName': disease_info['name'],
            'diseaseNameVi': disease_info['name_vi'],
            'confidence': confidence,
            'description': disease_info['description'],
            'treatment': disease_info['treatment'],
            'severity': disease_info['severity'],
            'imageUrl': image_url if image_url else None,
            'modelVersion': 'v1.0',
            'processingTime': processing_time
        }
        
        # 5. Lưu vào diagnoses (full detail)
        diagnosis_id = None
        history_id = None
        
        if save_to_history:
            diagnosis_id = diagnosis_repo.insert_diagnosis(user_id, diagnosis_data)
            
            if not diagnosis_id:
                return {
                    'success': False,
                    'message': 'Failed to save diagnosis'
                }
            
            # 6. Lưu metadata vào history (link to diagnosis)
            history_data = {
                'imageId': (
                    image_url.split('/')[-1]
                    if image_url
                    else f'local_{diagnosis_id}'
                ),
                'predictions': {
                    'disease': disease_key,
                    'confidence': confidence
                }
            }
            
            history_id = history_repo.insert_history(user_id, diagnosis_id, history_data)
            
            # 7. Tạo notification nếu phát hiện bệnh nghiêm trọng
            if disease_info['severity'] == 'high':
                notification_repo.insert_notification(user_id, {
                    'type': 'diagnosis_alert',
                    'title': '⚠️ Phát hiện bệnh nghiêm trọng!',
                    'message': f'Cây cà phê của bạn có thể bị {disease_info["name_vi"]}. Vui lòng xử lý ngay!',
                    'data': {
                        'diagnosisId': diagnosis_id,
                        'historyId': history_id,
                        'diseaseKey': disease_key,
                        'severity': 'high'
                    }
                })
        
        # 8. Trả về kết quả
        out = {
            'success': True,
            'diagnosis_id': diagnosis_id,
            'history_id': history_id,
            'disease': {
                'key': disease_key,
                'name': disease_info['name'],
                'name_vi': disease_info['name_vi'],
                'confidence': confidence,
                'severity': disease_info['severity'],
                'color': disease_info['color']
            },
            'description': disease_info['description'],
            'treatment': disease_info['treatment'],
            'image_url': image_url if image_url else None,
            'processing_time': processing_time,
            'created_at': datetime.utcnow().isoformat()
        }
        if storage_skipped:
            out['storage_skipped'] = True
            out['message'] = (
                'Chẩn đoán đã lưu nhưng ảnh không upload được. '
                'Bật thanh toán (Billing) trên Google Cloud, mở Firebase Storage trong Console, '
                'hoặc đặt FIREBASE_STORAGE_BUCKET đúng tên bucket GCS.'
            )
        return out

    except Exception as e:
        print(f"Error in predict_disease_from_image_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def get_diagnosis_history_service(user_id: str, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
    """
    Lấy lịch sử chẩn đoán của user.
    
    Returns:
        Danh sách lịch sử chẩn đoán, sắp xếp theo thời gian mới nhất
    """
    try:
        diagnoses = diagnosis_repo.query_diagnoses_by_user(user_id, limit=limit, offset=offset)
        
        # Format lại dữ liệu cho frontend
        formatted_diagnoses = []
        for diagnosis in diagnoses:
            formatted_diagnoses.append({
                'id': diagnosis['id'],
                'disease': {
                    'key': diagnosis.get('diseaseKey'),
                    'name': diagnosis.get('diseaseName'),
                    'name_vi': diagnosis.get('diseaseNameVi'),
                    'severity': diagnosis.get('severity')
                },
                'confidence': diagnosis.get('confidence'),
                'image_url': diagnosis.get('imageUrl'),
                'created_at': diagnosis.get('createdAt').isoformat() if diagnosis.get('createdAt') else None
            })
        
        return {
            'success': True,
            'diagnoses': formatted_diagnoses,
            'total': len(formatted_diagnoses)
        }
        
    except Exception as e:
        print(f"Error in get_diagnosis_history_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def get_diagnosis_detail_service(diagnosis_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Lấy chi tiết một kết quả chẩn đoán.
    
    Args:
        diagnosis_id: ID của diagnosis
        user_id: ID người dùng (để kiểm tra quyền)
    """
    try:
        diagnosis = diagnosis_repo.get_diagnosis_by_id(diagnosis_id)
        
        if not diagnosis:
            return None
        
        # Kiểm tra quyền sở hữu
        if diagnosis.get('userId') != user_id:
            return None
        
        return {
            'success': True,
            'diagnosis': {
                'id': diagnosis['id'],
                'disease': {
                    'key': diagnosis.get('diseaseKey'),
                    'name': diagnosis.get('diseaseName'),
                    'name_vi': diagnosis.get('diseaseNameVi'),
                    'severity': diagnosis.get('severity')
                },
                'confidence': diagnosis.get('confidence'),
                'description': diagnosis.get('description'),
                'treatment': diagnosis.get('treatment'),
                'image_url': diagnosis.get('imageUrl'),
                'model_version': diagnosis.get('modelVersion'),
                'processing_time': diagnosis.get('processingTime'),
                'created_at': diagnosis.get('createdAt').isoformat() if diagnosis.get('createdAt') else None
            }
        }
        
    except Exception as e:
        print(f"Error in get_diagnosis_detail_service: {e}")
        return None


def get_inference_detail_service(inference_id: str, user_id: str) -> Dict[str, Any]:
    """
    Lấy chi tiết kết quả theo inference id (id từ predict trả về).

    Response format:
        {
            'success': True,
            'data': {
                'imageId': '...',
                'diseaseID': ['rust']
            }
        }
    """
    try:
        def _extract_disease_ids_from_diagnosis(diagnosis_doc: Dict[str, Any]) -> List[str]:
            """Ưu tiên field diseaseID (array), fallback field cũ để tương thích dữ liệu cũ."""
            if not diagnosis_doc:
                return []

            # Field mới mong muốn: diseaseID = ["Rust", "Miner"]
            disease_ids = diagnosis_doc.get('diseaseID')
            if isinstance(disease_ids, list):
                return [x for x in disease_ids if isinstance(x, str) and x]

            # Backward-compatible với dữ liệu từng lưu là diseaseIDs
            legacy_disease_ids = diagnosis_doc.get('diseaseIDs')
            if isinstance(legacy_disease_ids, list):
                return [x for x in legacy_disease_ids if isinstance(x, str) and x]

            # Backward-compatible kiểu cũ chỉ có diseaseKey
            disease_key = diagnosis_doc.get('diseaseKey')
            if isinstance(disease_key, str) and disease_key:
                return [disease_key]

            return []

        history = history_repo.get_history_by_id(inference_id)

        # Nếu không tìm thấy theo inference id, fallback thử coi như diagnosis id
        if not history:
            diagnosis = diagnosis_repo.get_diagnosis_by_id(inference_id)
            if not diagnosis:
                return {'success': False, 'message': 'Inference not found'}

            if diagnosis.get('userId') != user_id:
                return {'success': False, 'message': 'Access denied'}

            diagnosis_disease_ids = _extract_disease_ids_from_diagnosis(diagnosis)
            return {
                'success': True,
                'data': {
                    'imageId': diagnosis.get('imageUrl') or '',
                    'diseaseID': diagnosis_disease_ids
                }
            }

        if history.get('userId') != user_id:
            return {'success': False, 'message': 'Access denied'}

        image_id = history.get('imageId') or ''
        predictions = history.get('predictions') or {}
        disease_from_history = predictions.get('disease')
        disease_ids_from_history = predictions.get('diseaseID') or []

        disease_ids: List[str] = []

        diagnosis_id = history.get('diagnosisId')
        if diagnosis_id:
            diagnosis = diagnosis_repo.get_diagnosis_by_id(diagnosis_id)
            if diagnosis and diagnosis.get('userId') == user_id:
                diagnosis_disease_ids = _extract_disease_ids_from_diagnosis(diagnosis)
                if diagnosis_disease_ids:
                    disease_ids.extend(diagnosis_disease_ids)

                if not image_id:
                    image_id = diagnosis.get('imageUrl') or ''

        # Fallback dùng summary disease trong history nếu diagnosis không có
        if not disease_ids and isinstance(disease_ids_from_history, list):
            disease_ids.extend([x for x in disease_ids_from_history if isinstance(x, str) and x])

        if not disease_ids and disease_from_history:
            disease_ids.append(disease_from_history)

        return {
            'success': True,
            'data': {
                'imageId': image_id,
                'diseaseID': disease_ids
            }
        }

    except Exception as e:
        print(f"Error in get_inference_detail_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def get_disease_info_service(disease_id: str) -> Dict[str, Any]:
    """
    Lấy thông tin bệnh từ collection diseases.

    Response format:
        {
            'success': True,
            'data': {
                'name': '...',
                'description': '...'
            }
        }
    """
    try:
        disease = diagnosis_repo.get_disease_by_id(disease_id)
        if not disease:
            return {'success': False, 'message': 'Disease not found'}

        return {
            'success': True,
            'data': {
                'name': disease.get('name') or disease.get('diseaseName') or '',
                'description': disease.get('description') or ''
            }
        }
    except Exception as e:
        print(f"Error in get_disease_info_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def delete_diagnosis_service(diagnosis_id: str, user_id: str) -> Dict[str, Any]:
    """Xóa một kết quả chẩn đoán khỏi lịch sử."""
    try:
        success = diagnosis_repo.delete_diagnosis_by_id(diagnosis_id, user_id)
        
        if success:
            return {
                'success': True,
                'message': 'Diagnosis deleted successfully'
            }
        
        return {
            'success': False,
            'message': 'Diagnosis not found or unauthorized'
        }
        
    except Exception as e:
        print(f"Error in delete_diagnosis_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def list_supported_diseases_service() -> Dict[str, Any]:
    """Danh sách các bệnh cà phê được model hỗ trợ."""
    diseases = []
    for key, info in SUPPORTED_DISEASES.items():
        diseases.append({
            'key': key,
            'name': info['name'],
            'name_vi': info['name_vi'],
            'description': info['description'],
            'severity': info['severity'],
            'color': info['color']
        })
    
    return {
        'success': True,
        'diseases': diseases,
        'total': len(diseases)
    }


def get_diagnosis_statistics_service(user_id: str) -> Dict[str, Any]:
    """
    Thống kê lịch sử chẩn đoán của user.
    
    Returns:
        - Tổng số lần chẩn đoán
        - Số lần phát hiện bệnh
        - Bệnh phổ biến nhất
    """
    try:
        # Lấy tất cả diagnoses
        all_diagnoses = diagnosis_repo.query_diagnoses_by_user(user_id, limit=1000)
        
        total_diagnoses = len(all_diagnoses)
        disease_counts = {}
        severity_counts = {'none': 0, 'low': 0, 'medium': 0, 'high': 0}
        
        for diagnosis in all_diagnoses:
            disease_key = diagnosis.get('diseaseKey', 'unknown')
            severity = diagnosis.get('severity', 'none')
            
            disease_counts[disease_key] = disease_counts.get(disease_key, 0) + 1
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        # Tìm bệnh phổ biến nhất
        most_common_disease = None
        if disease_counts:
            most_common_key = max(disease_counts, key=disease_counts.get)
            disease_info = SUPPORTED_DISEASES.get(most_common_key)
            if disease_info:
                most_common_disease = {
                    'key': most_common_key,
                    'name_vi': disease_info['name_vi'],
                    'count': disease_counts[most_common_key]
                }
        
        return {
            'success': True,
            'statistics': {
                'total_diagnoses': total_diagnoses,
                'healthy_count': disease_counts.get('healthy', 0),
                'diseased_count': total_diagnoses - disease_counts.get('healthy', 0),
                'severity_counts': severity_counts,
                'most_common_disease': most_common_disease,
                'disease_breakdown': disease_counts
            }
        }
        
    except Exception as e:
        print(f"Error in get_diagnosis_statistics_service: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _mock_ai_prediction(image_url: str) -> Dict[str, Any]:
    """
    Mock AI prediction (giả lập).
    TODO: Thay bằng model AI thật.
    
    Returns:
        {
            'disease_key': 'rust',
            'confidence': 0.95,
            'processing_time': 1.5
        }
    """
    import random
    
    # Giả lập kết quả dự đoán
    diseases = list(SUPPORTED_DISEASES.keys())
    disease_key = random.choice(diseases)
    confidence = round(random.uniform(0.7, 0.99), 2)
    processing_time = round(random.uniform(0.5, 3.0), 2)
    
    return {
        'disease_key': disease_key,
        'confidence': confidence,
        'processing_time': processing_time
    }


def _load_yolo_model():
    """Lazy-load YOLO model from backend/predict_models/version1.pt."""
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
    Read and resize image to fixed size before model inference.
    """
    image = Image.open(BytesIO(image_bytes)).convert('RGB')
    return image.resize((img_size, img_size))


def _run_yolo_prediction(image: Image.Image, img_size: int = 640, conf_threshold: float = 0.25) -> Dict[str, Any]:
    """
    Run YOLO prediction and convert detections to summary format.
    """
    import time

    started = time.time()
    model = _load_yolo_model()
    results = model.predict(source=image, imgsz=img_size, conf=conf_threshold, verbose=False)
    processing_time = round(time.time() - started, 4)

    summary: Dict[str, int] = {}
    detections: List[Dict[str, Any]] = []
    primary_disease = None
    primary_confidence = 0.0

    if not results:
        return {
            'summary': summary,
            'detections': detections,
            'primaryDisease': primary_disease,
            'primaryConfidence': primary_confidence,
            'processingTime': processing_time,
        }

    result = results[0]
    names = result.names if hasattr(result, 'names') else {}
    boxes = getattr(result, 'boxes', None)

    if boxes is None:
        return {
            'summary': summary,
            'detections': detections,
            'primaryDisease': primary_disease,
            'primaryConfidence': primary_confidence,
            'processingTime': processing_time,
        }

    for idx in range(len(boxes)):
        class_id = int(boxes.cls[idx].item())
        confidence = float(boxes.conf[idx].item())
        bbox = [int(x) for x in boxes.xyxy[idx].tolist()]

        disease_name = names.get(class_id, str(class_id))
        disease_name = str(disease_name).strip()

        summary[disease_name] = summary.get(disease_name, 0) + 1
        detections.append({
            'disease': disease_name,
            'confidence': round(confidence, 4),
            'bbox': bbox,
        })

        if confidence > primary_confidence:
            primary_confidence = confidence
            primary_disease = disease_name

    return {
        'summary': summary,
        'detections': detections,
        'primaryDisease': primary_disease,
        'primaryConfidence': round(primary_confidence, 4),
        'processingTime': processing_time,
    }


def _filter_existing_disease_ids(raw_ids: List[str]) -> List[str]:
    """
    Keep only disease IDs that really exist in Firestore diseases collection.
    """
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
    candidates = [base, base.lower(), base.title(), base.upper()]

    for candidate in candidates:
        disease = diagnosis_repo.get_disease_by_id(candidate)
        if disease:
            return disease.get('id') or candidate

    return None
