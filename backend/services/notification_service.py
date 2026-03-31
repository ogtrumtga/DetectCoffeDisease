"""
Notification service.

Xử lý logic thông báo cho user.
"""
from backend.repositories import firebase_notification_repository as notif_repo
from typing import Dict, Any, List


def list_notifications_service(user_id: str, page: int = 1, limit: int = 50) -> Dict[str, Any]:
    """
    Service: GET /api/notifications
    Lấy danh sách thông báo của user.
    """
    offset = (page - 1) * limit
    notifications = notif_repo.query_notifications_by_user(user_id, limit=limit, offset=offset)
    
    return {
        'success': True,
        'data': notifications,
        'page': page,
        'limit': limit
    }


def mark_notification_read_service(notification_id: str, user_id: str) -> Dict[str, Any]:
    """
    Service: POST /api/notifications/{id}/read
    Đánh dấu một thông báo là đã đọc.
    """
    success = notif_repo.set_notification_read(notification_id, user_id)
    
    if not success:
        return {
            'success': False,
            'message': 'Notification not found or access denied'
        }
    
    return {
        'success': True,
        'message': 'Notification marked as read'
    }


def mark_all_notifications_read_service(user_id: str) -> Dict[str, Any]:
    """
    Service: POST /api/notifications/mark-all-read
    Đánh dấu tất cả thông báo là đã đọc.
    """
    success = notif_repo.set_all_notifications_read(user_id)
    
    if not success:
        return {
            'success': False,
            'message': 'Failed to mark all notifications as read'
        }
    
    return {
        'success': True,
        'message': 'All notifications marked as read'
    }


def create_notification_service(user_id: str, notif_type: str, title: str, message: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Service: Tạo notification mới (được gọi từ các service khác).
    
    Ví dụ:
    - Khi có người like bài đăng → tạo notification cho tác giả
    - Khi có người comment → tạo notification cho tác giả
    - Khi chẩn đoán xong → tạo notification cho user
    """
    notification_data = {
        'type': notif_type,
        'title': title,
        'message': message,
        'data': data or {}
    }
    
    notif_id = notif_repo.insert_notification(user_id, notification_data)
    
    if not notif_id:
        return {
            'success': False,
            'message': 'Failed to create notification'
        }
    
    return {
        'success': True,
        'notification_id': notif_id
    }
