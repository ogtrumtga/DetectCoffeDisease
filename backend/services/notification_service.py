"""
Notification service.

Xử lý logic:
- Lấy danh sách thông báo
- Đánh dấu đã đọc
- Đánh dấu tất cả đã đọc
- Tạo notification khi có sự kiện (like, comment, chẩn đoán, ...)
"""


def list_notifications_service():
    """Lấy danh sách thông báo của user hiện tại (có thể phân trang)."""
    pass


def mark_notification_read_service():
    """Đánh dấu một thông báo là đã đọc."""
    pass


def mark_all_notifications_read_service():
    """Đánh dấu tất cả thông báo là đã đọc."""
    pass


def create_notification_for_event_service():
    """Tạo notification mới cho một sự kiện (like, comment, diagnosis,...)."""
    pass

