"""
Auth API service.

Các hàm dưới đây tương ứng với:
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/refresh
- GET  /api/auth/me

Chỉ khai báo tên hàm, chưa viết logic.
"""


def login_user():
    """Đăng nhập user, trả về access/refresh token."""
    pass


def register_user():
    """Đăng ký tài khoản mới."""
    pass


def logout_user():
    """Đăng xuất, vô hiệu hóa refresh token hiện tại."""
    pass


def refresh_access_token():
    """Làm mới access token từ refresh token hợp lệ."""
    pass


def get_current_user():
    """Lấy thông tin user hiện tại từ access token."""
    pass

