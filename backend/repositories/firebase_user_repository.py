"""
Firebase User repository.

Làm việc với Firestore collection liên quan đến user profile.
"""
from backend.config import db
from typing import Optional, Dict, Any
from datetime import datetime


def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Lấy document user theo id từ Firestore."""
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            return user_doc.to_dict()
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None


def create_user_profile(user_id: str, email: str, display_name: str = None, photo_url: str = None) -> bool:
    """Tạo document profile mặc định cho user mới."""
    try:
        user_data = {
            'email': email,
            'displayName': display_name or '',
            'photoURL': photo_url or '',
            'bio': '',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        db.collection('users').document(user_id).set(user_data)
        return True
    except Exception as e:
        print(f"Error creating user profile: {e}")
        return False


def update_user_profile(user_id: str, data: Dict[str, Any]) -> bool:
    """Cập nhật các field profile (tên, bio, ...)."""
    try:
        data['updatedAt'] = datetime.utcnow()
        db.collection('users').document(user_id).update(data)
        return True
    except Exception as e:
        print(f"Error updating user profile: {e}")
        return False


def update_user_avatar_url(user_id: str, avatar_url: str) -> bool:
    """Cập nhật URL avatar trong document user."""
    try:
        db.collection('users').document(user_id).update({
            'photoURL': avatar_url,
            'updatedAt': datetime.utcnow()
        })
        return True
    except Exception as e:
        print(f"Error updating avatar: {e}")
        return False


def delete_user_document(user_id: str) -> bool:
    """Xóa document user khỏi Firestore."""
    try:
        db.collection('users').document(user_id).delete()
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
