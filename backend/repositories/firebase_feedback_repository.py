"""
Firebase Feedback repository.

Lưu trữ và truy vấn feedback từ Firestore.
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def insert_feedback(user_id: str, diagnoses_id: str, rate: int, comment: str) -> Optional[str]:
    """Thêm một feedback mới."""
    try:
        doc_ref = db.collection('feedbacks').document()
        doc_ref.set({
            'userId': user_id,
            'diagnoses_id': diagnoses_id,
            'rate': rate,
            'comment': comment,
            'createdAt': datetime.utcnow(),
        })
        return doc_ref.id
    except Exception as e:
        print(f"Error creating feedback: {e}")
        return None


def query_feedbacks(limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Lấy danh sách feedback, sort mới nhất trước, có phân trang."""
    try:
        feedbacks = []

        for collection_name in ('feedbacks', 'feedback'):
            docs = db.collection(collection_name).stream()
            for doc in docs:
                data = doc.to_dict() or {}
                data['id'] = doc.id
                feedbacks.append(data)

        feedbacks.sort(key=lambda x: x.get('createdAt') or datetime.min, reverse=True)
        return feedbacks[offset: offset + limit]
    except Exception as e:
        print(f"Error listing feedbacks: {e}")
        return []
