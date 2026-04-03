"""
Firebase Post repository.

Làm việc với collection posts (bài đăng cộng đồng).
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def get_posts(limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Lấy danh sách bài đăng (có phân trang)."""
    try:
        query = db.collection('posts')\
            .order_by('createdAt', direction='DESCENDING')\
            .limit(limit)\
            .offset(offset)
        
        docs = query.stream()
        posts = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            posts.append(data)
        
        return posts
    except Exception as e:
        print(f"Error getting posts: {e}")
        return []


def get_post_by_id(post_id: str) -> Optional[Dict[str, Any]]:
    """Lấy chi tiết một bài đăng."""
    try:
        doc = db.collection('posts').document(post_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting post: {e}")
        return None


def create_post(user_id: str, post_data: Dict[str, Any]) -> Optional[str]:
    """Tạo bài đăng mới."""
    try:
        post_data['authorId'] = user_id
        post_data['createdAt'] = datetime.utcnow()
        post_data['updatedAt'] = datetime.utcnow()
        post_data['likesCount'] = 0
        post_data['commentsCount'] = 0
        
        doc_ref = db.collection('posts').document()
        doc_ref.set(post_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"Error creating post: {e}")
        return None


def update_post(post_id: str, user_id: str, update_data: Dict[str, Any]) -> bool:
    """Cập nhật bài đăng."""
    try:
        doc_ref = db.collection('posts').document(post_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Kiểm tra ownership
        if doc.to_dict().get('authorId') != user_id:
            return False
        
        update_data['updatedAt'] = datetime.utcnow()
        doc_ref.update(update_data)
        return True
    except Exception as e:
        print(f"Error updating post: {e}")
        return False


def delete_post(post_id: str, user_id: str) -> bool:
    """Xóa bài đăng."""
    try:
        doc_ref = db.collection('posts').document(post_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Kiểm tra ownership
        if doc.to_dict().get('authorId') != user_id:
            return False
        
        doc_ref.delete()
        return True
    except Exception as e:
        print(f"Error deleting post: {e}")
        return False


def increment_likes_count(post_id: str, increment: int = 1) -> bool:
    """Tăng/giảm số lượt like."""
    try:
        from google.cloud.firestore import Increment
        db.collection('posts').document(post_id).update({
            'likesCount': Increment(increment)
        })
        return True
    except Exception as e:
        print(f"Error incrementing likes: {e}")
        return False


def increment_comments_count(post_id: str, increment: int = 1) -> bool:
    """Tăng/giảm số lượt comment."""
    try:
        from google.cloud.firestore import Increment
        db.collection('posts').document(post_id).update({
            'commentsCount': Increment(increment)
        })
        return True
    except Exception as e:
        print(f"Error incrementing comments: {e}")
        return False


def search_posts(query_text: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Tìm kiếm bài đăng (simple search)."""
    try:
        # Note: Firestore không hỗ trợ full-text search native
        # Cần dùng Algolia hoặc Elasticsearch cho production
        # Đây là implementation đơn giản
        all_posts = db.collection('posts')\
            .order_by('createdAt', direction='DESCENDING')\
            .limit(100)\
            .stream()
        
        results = []
        query_lower = query_text.lower()
        
        for doc in all_posts:
            data = doc.to_dict()
            title = data.get('title', '').lower()
            content = data.get('content', '').lower()
            
            if query_lower in title or query_lower in content:
                data['id'] = doc.id
                results.append(data)
                
                if len(results) >= limit:
                    break
        
        return results
    except Exception as e:
        print(f"Error searching posts: {e}")
        return []
