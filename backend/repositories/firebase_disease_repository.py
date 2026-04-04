"""
Firebase Disease repository.

Truy vấn thông tin bệnh từ collection diseases.
"""
from backend.config import db
from typing import Optional, Dict, Any, List


def get_disease_by_id(disease_id: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin bệnh theo ID."""
    try:
        doc = db.collection('diseases').document(disease_id).get()
        if not doc.exists:
            return None
        
        data = doc.to_dict() or {}
        data['id'] = doc.id
        return data
    except Exception as e:
        print(f"Error getting disease by ID: {e}")
        return None


def get_all_diseases() -> List[Dict[str, Any]]:
    """Lấy danh sách tất cả bệnh."""
    try:
        docs = db.collection('diseases').stream()
        diseases = []
        
        for doc in docs:
            data = doc.to_dict() or {}
            data['id'] = doc.id
            diseases.append(data)
        
        return diseases
    except Exception as e:
        print(f"Error getting all diseases: {e}")
        return []


def disease_exists(disease_id: str) -> bool:
    """Kiểm tra bệnh có tồn tại không."""
    try:
        doc = db.collection('diseases').document(disease_id).get()
        return doc.exists
    except Exception as e:
        print(f"Error checking disease existence: {e}")
        return False
