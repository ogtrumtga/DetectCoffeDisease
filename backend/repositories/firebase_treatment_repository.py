"""
Firebase Treatment repository.

Luu tru va truy van treatment cho tung benh.
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def get_treatment_by_disease(disease_id: str) -> Optional[Dict[str, Any]]:
    """Lay treatment duy nhat theo disease_id."""
    try:
        docs = db.collection('treatments').where('disease_id', '==', disease_id).limit(1).stream()
        for doc in docs:
            data = doc.to_dict() or {}
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting treatment by disease: {e}")
        return None


def query_treatments_by_disease(disease_id: str, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Lay danh sach treatment theo disease_id (co phan trang)."""
    try:
        docs = db.collection('treatments').where('disease_id', '==', disease_id).stream()

        treatments = []
        for doc in docs:
            data = doc.to_dict() or {}
            data['id'] = doc.id
            treatments.append(data)

        treatments.sort(key=lambda x: x.get('createdAt') or datetime.min, reverse=True)
        return treatments[offset: offset + limit]
    except Exception as e:
        print(f"Error querying treatments: {e}")
        return []


def insert_treatment(user_id: str, disease_id: str, steps: List[str], medicine: List[str]) -> Optional[str]:
    """Them treatment moi."""
    try:
        existing = get_treatment_by_disease(disease_id)
        if existing:
            return None

        now = datetime.utcnow()
        payload = {
            'disease_id': disease_id,
            'steps': steps,
            'medicine': medicine,
            'createdBy': user_id,
            'createdAt': now,
            'updatedAt': now,
        }

        doc_ref = db.collection('treatments').document()
        doc_ref.set(payload)
        return doc_ref.id
    except Exception as e:
        print(f"Error inserting treatment: {e}")
        return None


def update_treatment(treatment_id: str, user_id: str, steps: List[str], medicine: List[str]) -> Optional[datetime]:
    """Cap nhat treatment theo id (kiem tra owner)."""
    try:
        doc_ref = db.collection('treatments').document(treatment_id)
        doc = doc_ref.get()

        if not doc.exists:
            return None

        current = doc.to_dict() or {}
        #if current.get('createdBy') != user_id:
        #   return None

        updated_at = datetime.utcnow()
        doc_ref.update({
            'steps': steps,
            'medicine': medicine,
            'updatedAt': updated_at,
        })
        return updated_at
    except Exception as e:
        print(f"Error updating treatment: {e}")
        return None
