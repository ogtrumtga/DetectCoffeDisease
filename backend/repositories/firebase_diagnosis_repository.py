"""
Firebase Diagnosis repository.

Collection: diagnoses
Mỗi document lưu đầy đủ kết quả chẩn đoán + metadata lịch sử.
Không còn collection history riêng.
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def get_diagnosis_by_id(diagnosis_id: str) -> Optional[Dict[str, Any]]:
    """Lấy kết quả chẩn đoán theo ID."""
    try:
        doc = db.collection('diagnoses').document(diagnosis_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting diagnosis: {e}")
        return None


def get_disease_by_id(disease_id: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin bệnh theo ID từ collection diseases."""
    try:
        doc = db.collection('diseases').document(disease_id).get()
        if doc.exists:
            data = doc.to_dict() or {}
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting disease: {e}")
        return None


def query_diagnoses_by_user(user_id: str, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Query danh sách chẩn đoán theo user, sắp xếp mới nhất trước."""
    try:
        docs = db.collection('diagnoses').stream()
        diagnoses = []
        for doc in docs:
            data = doc.to_dict()
            if data.get('userId') != user_id:
                continue
            data['id'] = doc.id
            diagnoses.append(data)

        diagnoses.sort(key=lambda x: x.get('createdAt') or datetime.min, reverse=True)
        return diagnoses[offset: offset + limit]
    except Exception as e:
        print(f"Error querying diagnoses: {e}")
        return []


def insert_diagnosis(user_id: str, diagnosis_data: Dict[str, Any]) -> Optional[str]:
    """
    Thêm kết quả chẩn đoán mới vào collection diagnoses.

    Fields bắt buộc trong diagnosis_data:
    - diseaseKey: str          — key bệnh (rust, cercospora, ...)
    - diseaseName: str         — tên tiếng Anh
    - diseaseNameVi: str       — tên tiếng Việt
    - confidence: float        — độ tin cậy (0-1)
    - description: str         — mô tả bệnh
    - treatment: str           — hướng điều trị
    - severity: str            — mức độ (none/medium/high)
    - imageUrl: str            — URL ảnh đã chẩn đoán
    - imageId: str (optional)  — ID trong collection images
    - summary: dict (optional) — {'Rust': 3, 'Phoma': 1}
    - detections: list (opt.)  — danh sách detection boxes
    - modelVersion: str        — phiên bản model
    - processingTime: float    — thời gian xử lý (giây)
    """
    try:
        now = datetime.utcnow()
        diagnosis_data['userId'] = user_id
        diagnosis_data['createdAt'] = now
        diagnosis_data.setdefault('modelVersion', 'best.pt')
        diagnosis_data.setdefault('processingTime', 0.0)
        diagnosis_data.setdefault('summary', {})
        diagnosis_data.setdefault('detections', [])

        doc_ref = db.collection('diagnoses').document()
        doc_ref.set(diagnosis_data)
        return doc_ref.id
    except Exception as e:
        print(f"Error inserting diagnosis: {e}")
        return None


def delete_diagnosis_by_id(diagnosis_id: str, user_id: str) -> bool:
    """Xóa kết quả chẩn đoán (kiểm tra ownership)."""
    try:
        doc_ref = db.collection('diagnoses').document(diagnosis_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False
        if doc.to_dict().get('userId') != user_id:
            return False
        doc_ref.delete()
        return True
    except Exception as e:
        print(f"Error deleting diagnosis: {e}")
        return False


def delete_all_diagnoses_of_user(user_id: str) -> bool:
    """Xóa toàn bộ chẩn đoán của user."""
    try:
        docs = db.collection('diagnoses').where('userId', '==', user_id).stream()
        for doc in docs:
            doc.reference.delete()
        return True
    except Exception as e:
        print(f"Error deleting all diagnoses: {e}")
        return False
