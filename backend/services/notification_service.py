"""
Notification service.

Xử lý logic thông báo cho user.
"""
from backend.repositories import firebase_notification_repository as notif_repo
from typing import Dict, Any, List


def list_notifications_service(user_id: str, page: int = 1, limit: int = 50) -> Dict[str, Any]:
    """
    Service: GET /api/notifications
    Lấy danh sách thông báo của user với đầy đủ thông tin.
    """
    offset = (page - 1) * limit
    notifications = notif_repo.query_notifications_by_user(user_id, limit=limit, offset=offset)
    
    # Format notifications để trả về đầy đủ thông tin user
    formatted_notifications = []
    for notif in notifications:
        # Extract user info từ data field
        data = notif.get('data', {})
        
        # Xác định user info dựa vào type
        user_info = {
            'id': '',
            'name': 'Unknown',
            'avatar': ''
        }
        
        if notif.get('type') == 'like':
            user_info = {
                'id': data.get('likerId', ''),
                'name': data.get('likerName', 'Unknown'),
                'avatar': data.get('likerAvatar', '')
            }
        elif notif.get('type') in ['comment', 'reply']:
            user_info = {
                'id': data.get('commenterId', ''),
                'name': data.get('commenterName', 'Unknown'),
                'avatar': data.get('commenterAvatar', '')
            }
        
        formatted_notifications.append({
            'id': notif.get('id'),
            'type': notif.get('type'),
            'title': notif.get('title'),
            'message': notif.get('message'),
            'user': user_info,
            'postId': data.get('postId'),
            'commentId': data.get('commentId'),
            'createdAt': notif.get('createdAt').isoformat() if notif.get('createdAt') else None,
            'isRead': notif.get('isRead', False),
            'data': data
        })
    
    return {
        'success': True,
        'data': formatted_notifications,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': len(notifications),
            'totalPages': 1
        }
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
