"""
Firebase Notification repository.

Lưu trữ và truy vấn thông báo cho user.
"""
from backend.config import db
from typing import Optional, Dict, Any, List
from datetime import datetime


def query_notifications_by_user(user_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Query danh sách notification theo user (có sort, phân trang)."""
    try:
        # Avoid composite index requirement by filtering in Python.
        docs = db.collection('notifications').stream()
        notifications = []
        for doc in docs:
            data = doc.to_dict()
            if data.get('userId') != user_id:
                continue
            data['id'] = doc.id
            notifications.append(data)

        notifications.sort(key=lambda x: x.get('createdAt') or datetime.min, reverse=True)
        return notifications[offset: offset + limit]
    except Exception as e:
        print(f"Error getting notifications: {e}")
        return []


def set_notification_read(notification_id: str, user_id: str) -> bool:
    """Đánh dấu một notification là đã đọc."""
    try:
        doc_ref = db.collection('notifications').document(notification_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Kiểm tra ownership
        if doc.to_dict().get('userId') != user_id:
            return False
        
        doc_ref.update({'isRead': True})
        return True
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return False


def set_all_notifications_read(user_id: str) -> bool:
    """Đánh dấu tất cả notification của user là đã đọc."""
    try:
        # Single-field query only (avoids composite index userId + isRead).
        docs = db.collection('notifications').where('userId', '==', user_id).stream()

        for doc in docs:
            data = doc.to_dict() or {}
            if data.get('isRead') is True:
                continue
            doc.reference.update({'isRead': True})

        return True
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        return False


def insert_notification(user_id: str, notification_data: Dict[str, Any]) -> Optional[str]:
    """Thêm một notification mới vào Firestore."""
    try:
        notification_data['userId'] = user_id
        notification_data['isRead'] = False
        notification_data['createdAt'] = datetime.utcnow()
        
        doc_ref = db.collection('notifications').document()
        doc_ref.set(notification_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None

