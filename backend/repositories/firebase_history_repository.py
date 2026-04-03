"""
Firebase History repository.

Làm việc với collection lưu lịch sử chẩn đoán (metadata only).
Collection: history

Mối quan hệ:
- history.userId → users
- history.diagnosisId → diagnoses
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def query_histories_by_user(user_id: str, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Query danh sách lịch sử chẩn đoán theo user (có phân trang)."""
    try:
        # Avoid composite index requirement by filtering in Python.
        docs = db.collection('history').stream()
        histories = []
        for doc in docs:
            data = doc.to_dict()
            if data.get('userId') != user_id:
                continue
            data['id'] = doc.id
            histories.append(data)

        histories.sort(key=lambda x: x.get('createdAt') or datetime.min, reverse=True)
        return histories[offset: offset + limit]
    except Exception as e:
        print(f"Error querying histories: {e}")
        return []


def get_history_by_id(history_id: str) -> Optional[Dict[str, Any]]:
    """Lấy một bản ghi lịch sử theo id."""
    try:
        doc = db.collection('history').document(history_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting history: {e}")
        return None


def insert_history(user_id: str, diagnosis_id: str, history_data: Dict[str, Any]) -> Optional[str]:
    """
    Thêm bản ghi lịch sử chẩn đoán mới vào Firestore.
    
    history_data phải có:
    - imageId: str
    - predictions: dict (tóm tắt kết quả)
    """
    try:
        history_data['userId'] = user_id
        history_data['diagnosisId'] = diagnosis_id  # Link to full diagnosis
        history_data['createdAt'] = datetime.utcnow()
        
        doc_ref = db.collection('history').document()
        doc_ref.set(history_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"Error inserting history: {e}")
        return None


def delete_history_by_id(history_id: str, user_id: str) -> bool:
    """Xóa một bản ghi lịch sử theo id (kiểm tra ownership)."""
    try:
        doc_ref = db.collection('history').document(history_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Kiểm tra ownership
        if doc.to_dict().get('userId') != user_id:
            return False
        
        doc_ref.delete()
        return True
    except Exception as e:
        print(f"Error deleting history: {e}")
        return False


def delete_all_histories_of_user(user_id: str) -> bool:
    """Xóa toàn bộ lịch sử chẩn đoán của một user."""
    try:
        docs = db.collection('history').where('userId', '==', user_id).stream()
        
        for doc in docs:
            doc.reference.delete()
        
        return True
    except Exception as e:
        print(f"Error deleting all histories: {e}")
        return False

