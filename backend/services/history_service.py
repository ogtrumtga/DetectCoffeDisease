"""
History service.

Chứa logic nghiệp vụ cho lịch sử chẩn đoán.

Mối quan hệ:
- history (metadata) → diagnoses (full detail)
"""
from backend.repositories import firebase_history_repository as history_repo
from backend.repositories import firebase_diagnosis_repository as diagnosis_repo
from typing import Dict, Any, List


def list_user_histories_service(user_id: str, page: int = 1) -> Dict[str, Any]:
    """
    Service: GET /api/history
    Lấy danh sách lịch sử chẩn đoán của user (có phân trang).
    """
    limit = 10
    offset = (page - 1) * limit

    histories = history_repo.query_histories_by_user(user_id, limit=limit, offset=offset)

    result = []
    for h in histories:
        result.append({
            'inferenceId': h.get('id'),
            'diagnosisId': h.get('diagnosisId'),  # Link to full diagnosis
            'imageId':     h.get('imageId'),
            'predictions': h.get('predictions'),
            'createdAt':   h.get('createdAt'),
        })

    return {'success': True, 'data': result, 'page': page}


def get_history_detail_service(user_id: str, history_id: str) -> Dict[str, Any]:
    """
    Service: GET /api/history/{id}
    Lấy chi tiết một bản ghi lịch sử chẩn đoán.
    
    Trả về cả history metadata + full diagnosis detail.
    """
    # 1. Lấy history metadata
    history = history_repo.get_history_by_id(history_id)

    if not history:
        return {'success': False, 'message': 'History not found'}

    if history.get('userId') != user_id:
        return {'success': False, 'message': 'Access denied'}

    # 2. Lấy full diagnosis detail (nếu có)
    diagnosis_id = history.get('diagnosisId')
    diagnosis_detail = None
    
    if diagnosis_id:
        diagnosis_detail = diagnosis_repo.get_diagnosis_by_id(diagnosis_id)

    return {
        'success': True,
        'history': history,
        'diagnosis': diagnosis_detail  # Full detail
    }


def create_history_entry_service(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Service: POST /api/history
    Tạo bản ghi lịch sử chẩn đoán mới.
    
    Workflow:
    1. Tạo diagnosis (full detail) trong collection diagnoses
    2. Tạo history (metadata) trong collection history, link đến diagnosis
    """
    # 1. Tạo diagnosis (nếu có đầy đủ thông tin)
    diagnosis_id = None
    
    if 'diagnosis' in data:
        diagnosis_data = data['diagnosis']
        diagnosis_id = diagnosis_repo.insert_diagnosis(user_id, diagnosis_data)
        
        if not diagnosis_id:
            return {'success': False, 'message': 'Failed to create diagnosis'}
    
    # 2. Tạo history metadata
    history_data = {
        'imageId': data.get('imageId'),
        'predictions': data.get('predictions', {})
    }
    
    history_id = history_repo.insert_history(user_id, diagnosis_id or '', history_data)

    if not history_id:
        return {'success': False, 'message': 'Failed to create history'}

    return {
        'success': True,
        'id': history_id,
        'diagnosisId': diagnosis_id
    }


def delete_history_entry_service(user_id: str, history_id: str) -> Dict[str, Any]:
    """
    Service: DELETE /api/history/{id}
    Xóa một bản ghi lịch sử theo id.
    
    Note: Chỉ xóa history, không xóa diagnosis (có thể dùng lại).
    """
    deleted = history_repo.delete_history_by_id(history_id, user_id)

    if not deleted:
        return {'success': False, 'message': 'History not found or access denied'}

    return {'success': True, 'message': 'History deleted successfully'}


def clear_all_histories_service(user_id: str) -> Dict[str, Any]:
    """
    Service: DELETE /api/history
    Xóa toàn bộ lịch sử chẩn đoán của user.
    """
    # Lấy danh sách để đếm trước khi xóa
    all_docs = history_repo.query_histories_by_user(user_id, limit=10000, offset=0)
    count = len(all_docs)

    success = history_repo.delete_all_histories_of_user(user_id)

    if not success:
        return {'success': False, 'message': 'Failed to clear histories'}

    return {'success': True, 'count': count}
