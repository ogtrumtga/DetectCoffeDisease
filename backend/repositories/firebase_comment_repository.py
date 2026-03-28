"""
Firebase Comment repository.

Làm việc với collection comments (bình luận bài đăng).
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def get_comments_by_post(post_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Lấy danh sách comment của một bài đăng."""
    try:
        query = db.collection('comments')\
            .where('postId', '==', post_id)\
            .order_by('createdAt', direction='ASCENDING')\
            .limit(limit)\
            .offset(offset)
        
        docs = query.stream()
        comments = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            comments.append(data)
        
        return comments
    except Exception as e:
        print(f"Error getting comments: {e}")
        return []


def create_comment(post_id: str, user_id: str, content: str) -> Optional[str]:
    """Tạo comment mới."""
    try:
        comment_data = {
            'postId': post_id,
            'authorId': user_id,
            'content': content,
            'createdAt': datetime.utcnow()
        }
        
        doc_ref = db.collection('comments').document()
        doc_ref.set(comment_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"Error creating comment: {e}")
        return None


def delete_comment(comment_id: str, user_id: str) -> bool:
    """Xóa comment."""
    try:
        doc_ref = db.collection('comments').document(comment_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Kiểm tra ownership
        if doc.to_dict().get('authorId') != user_id:
            return False
        
        doc_ref.delete()
        return True
    except Exception as e:
        print(f"Error deleting comment: {e}")
        return False


def delete_comments_by_post(post_id: str) -> bool:
    """Xóa tất cả comment của một bài đăng."""
    try:
        docs = db.collection('comments').where('postId', '==', post_id).stream()
        
        for doc in docs:
            doc.reference.delete()
        
        return True
    except Exception as e:
        print(f"Error deleting comments: {e}")
        return False
