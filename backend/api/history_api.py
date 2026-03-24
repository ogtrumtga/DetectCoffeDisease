"""
History API service.

Các hàm dưới đây tương ứng với:
- GET    /api/history
- GET    /api/history/{id}
- POST   /api/history
- DELETE /api/history/{id}
- DELETE /api/history

Chỉ khai báo tên hàm, chưa viết logic.
"""


def list_user_histories():
    """Lấy danh sách lịch sử chẩn đoán của user (có phân trang)."""
    pass


def get_history_detail():
    """Lấy chi tiết một bản ghi lịch sử chẩn đoán."""
    pass


def create_history_entry():
    """Tạo mới bản ghi lịch sử chẩn đoán sau khi model trả kết quả."""
    pass


def delete_history_entry():
    """Xóa một bản ghi lịch sử chẩn đoán theo id."""
    pass


def clear_all_histories():
    """Xóa toàn bộ lịch sử chẩn đoán của user."""
    pass

