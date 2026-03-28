"""
Diagnosis (Coffee Disease Detection) service.

Xử lý:
- Nhận ảnh lá cà phê
- Gọi model ML để dự đoán bệnh
- Chuẩn hóa kết quả chẩn đoán
- Lưu vào lịch sử
- Tạo notification nếu cần
"""
from backend.repositories import firebase_history_repository as history_repo
from backend.repositories import firebase_storage_repository as storage_repo
from backend.repositories import firebase_notification_repository as notification_repo
from typing import Dict, Any, Optional, List
from datetime import datetime
import os


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
    3. Lưu kết quả vào lịch sử (collection: diagnoses)
    4. Tạo notification nếu phát hiện bệnh nghiêm trọng
    
    Args:
        user_id: ID người dùng
        image_file: File ảnh (từ multipart/form-data)
        save_to_history: Có lưu vào lịch sử không (default: True)
    
    Returns:
        Dict chứa kết quả chẩn đoán
    """
    try:
        # 1. Upload ảnh lên Firebase Storage
        image_url = storage_repo.upload_diagnosis_image(user_id, image_file)
        
        if not image_url:
            return {
                'success': False,
                'message': 'Failed to upload image'
            }
        
        # 2. Gọi AI model để dự đoán bệnh
        # TODO: Thay bằng model thật
        prediction_result = _mock_ai_prediction(image_url)
        
        disease_key = prediction_result['disease_key']
        confidence = prediction_result['confidence']
        
        # 3. Lấy thông tin chi tiết về bệnh
        disease_info = SUPPORTED_DISEASES.get(disease_key, SUPPORTED_DISEASES['healthy'])
        
        # 4. Chuẩn bị dữ liệu chẩn đoán
        diagnosis_data = {
            'diseaseKey': disease_key,
            'diseaseName': disease_info['name'],
            'diseaseNameVi': disease_info['name_vi'],
            'confidence': confidence,
            'description': disease_info['description'],
            'treatment': disease_info['treatment'],
            'severity': disease_info['severity'],
            'imageUrl': image_url,
            'createdAt': datetime.utcnow()
        }
        
        # 5. Lưu vào lịch sử (nếu được yêu cầu)
        diagnosis_id = None
        if save_to_history:
            diagnosis_id = history_repo.insert_history(user_id, diagnosis_data)
            
            # 6. Tạo notification nếu phát hiện bệnh nghiêm trọng
            if disease_info['severity'] == 'high':
                notification_repo.insert_notification(user_id, {
                    'type': 'diagnosis_alert',
                    'title': '⚠️ Phát hiện bệnh nghiêm trọng!',
                    'message': f'Cây cà phê của bạn có thể bị {disease_info["name_vi"]}. Vui lòng xử lý ngay!',
                    'data': {
                        'diagnosisId': diagnosis_id,
                        'diseaseKey': disease_key,
                        'severity': 'high'
                    }
                })
        
        # 7. Trả về kết quả
        return {
            'success': True,
            'diagnosis_id': diagnosis_id,
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
            'image_url': image_url,
            'created_at': diagnosis_data['createdAt'].isoformat()
        }
        
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
        histories = history_repo.query_histories_by_user(user_id, limit=limit, offset=offset)
        
        # Format lại dữ liệu cho frontend
        formatted_histories = []
        for history in histories:
            formatted_histories.append({
                'id': history['id'],
                'disease': {
                    'key': history.get('diseaseKey'),
                    'name': history.get('diseaseName'),
                    'name_vi': history.get('diseaseNameVi'),
                    'severity': history.get('severity')
                },
                'confidence': history.get('confidence'),
                'image_url': history.get('imageUrl'),
                'created_at': history.get('createdAt').isoformat() if history.get('createdAt') else None
            })
        
        return {
            'success': True,
            'histories': formatted_histories,
            'total': len(formatted_histories)
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
        diagnosis = history_repo.get_history_by_id(diagnosis_id)
        
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
                'created_at': diagnosis.get('createdAt').isoformat() if diagnosis.get('createdAt') else None
            }
        }
        
    except Exception as e:
        print(f"Error in get_diagnosis_detail_service: {e}")
        return None


def delete_diagnosis_service(diagnosis_id: str, user_id: str) -> Dict[str, Any]:
    """Xóa một kết quả chẩn đoán khỏi lịch sử."""
    try:
        success = history_repo.delete_history_by_id(diagnosis_id, user_id)
        
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
        # Lấy tất cả lịch sử
        all_histories = history_repo.query_histories_by_user(user_id, limit=1000)
        
        total_diagnoses = len(all_histories)
        disease_counts = {}
        severity_counts = {'none': 0, 'low': 0, 'medium': 0, 'high': 0}
        
        for history in all_histories:
            disease_key = history.get('diseaseKey', 'unknown')
            severity = history.get('severity', 'none')
            
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
            'confidence': 0.95
        }
    """
    import random
    
    # Giả lập kết quả dự đoán
    diseases = list(SUPPORTED_DISEASES.keys())
    disease_key = random.choice(diseases)
    confidence = round(random.uniform(0.7, 0.99), 2)
    
    return {
        'disease_key': disease_key,
        'confidence': confidence
    }
