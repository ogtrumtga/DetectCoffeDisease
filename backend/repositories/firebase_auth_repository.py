"""
Firebase Auth repository.

Chỉ làm nhiệm vụ giao tiếp với Firebase Authentication.
"""


def firebase_create_user():
    """Tạo user mới trong Firebase Auth từ email/password."""
    pass


def firebase_verify_password():
    """Xác thực email/password với Firebase Auth."""
    pass


def firebase_generate_custom_token():
    """Tạo custom token (nếu dùng backend tự sinh token)."""
    pass


def firebase_verify_id_token():
    """Xác thực ID token từ client gửi lên."""
    pass


def firebase_revoke_refresh_tokens():
    """Thu hồi refresh tokens của một user (logout all)."""
    pass

