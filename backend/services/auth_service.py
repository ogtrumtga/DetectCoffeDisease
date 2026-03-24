"""
Auth service.

Xử lý nghiệp vụ liên quan đến đăng nhập, đăng ký, token.
Đây là lớp trung gian giữa api layer và firebase repositories.
"""


def login_user_service():
    """Xử lý logic đăng nhập, kiểm tra email/pass và trả về token."""
    pass


def register_user_service():
    """Xử lý logic đăng ký tài khoản mới, tạo user profile mặc định."""
    pass


def logout_user_service():
    """Đăng xuất user, thu hồi refresh tokens nếu cần."""
    pass


def refresh_access_token_service():
    """Làm mới access token dựa trên refresh token hợp lệ."""
    pass


def get_current_user_service():
    """Lấy thông tin user hiện tại từ token đã xác thực."""
    pass

