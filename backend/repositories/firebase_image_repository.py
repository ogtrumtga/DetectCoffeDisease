"""
Firebase Image repository.

Luu metadata anh vao collection images.
"""
from backend.config import db
from typing import Optional, Dict, Any
from datetime import datetime


def insert_image_metadata(user_id: str, public_id: str, image_url: str) -> Optional[str]:
    """
    Tao metadata anh trong collection images.

    Fields:
    - userId
    - publicID
    - imageURL
    - createdAt
    """
    try:
        doc_ref = db.collection('images').document()
        doc_ref.set({
            'userId': user_id,
            'publicID': public_id,
            'imageURL': image_url,
            'createdAt': datetime.utcnow(),
        })
        return doc_ref.id
    except Exception as e:
        print(f"Error inserting image metadata: {e}")
        return None


def get_image_metadata_by_id(image_id: str) -> Optional[Dict[str, Any]]:
    """
    Lay metadata anh trong collection images theo document id.
    """
    try:
        doc = db.collection('images').document(image_id).get()
        if not doc.exists:
            return None

        data = doc.to_dict() or {}
        data['id'] = doc.id
        return data
    except Exception as e:
        print(f"Error getting image metadata: {e}")
        return None
