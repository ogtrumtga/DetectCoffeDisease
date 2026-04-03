"""
Firebase Like repository.

Làm việc với collection likes (lượt thích bài đăng).
"""
from backend.config import db
from typing import Optional, Dict, Any
from datetime import datetime


def check_user_liked_post(post_id: str, user_id: str) -> bool:
    """Kiểm tra user đã like bài đăng chưa."""
    try:
        like_id = f"{user_id}_{post_id}"
        doc = db.collection('likes').document(like_id).get()
        return doc.exists
    except Exception as e:
        print(f"Error checking like: {e}")
        return False


def add_like(post_id: str, user_id: str) -> bool:
    """Thêm like."""
    try:
        like_id = f"{user_id}_{post_id}"
        like_data = {
            'postId': post_id,
            'userId': user_id,
            'createdAt': datetime.utcnow()
        }
        
        db.collection('likes').document(like_id).set(like_data)
        return True
    except Exception as e:
        print(f"Error adding like: {e}")
        return False


def remove_like(post_id: str, user_id: str) -> bool:
    """Xóa like."""
    try:
        like_id = f"{user_id}_{post_id}"
        db.collection('likes').document(like_id).delete()
        return True
    except Exception as e:
        print(f"Error removing like: {e}")
        return False


def delete_likes_by_post(post_id: str) -> bool:
    """Xóa tất cả like của một bài đăng."""
    try:
        docs = db.collection('likes').where('postId', '==', post_id).stream()
        
        for doc in docs:
            doc.reference.delete()
        
        return True
    except Exception as e:
        print(f"Error deleting likes: {e}")
        return False
