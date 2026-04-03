"""
Firebase Auth repository.

Chỉ làm nhiệm vụ giao tiếp với Firebase Authentication.
"""
from backend.config import auth_client
from typing import Optional, Dict, Any


def firebase_create_user(email: str, password: str, display_name: str = None) -> Optional[Dict[str, Any]]:
    """Tạo user mới trong Firebase Auth từ email/password."""
    try:
        user = auth_client.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        return {
            'uid': user.uid,
            'email': user.email,
            'displayName': user.display_name
        }
    except Exception as e:
        print(f"Error creating user: {e}")
        return None


def firebase_verify_id_token(id_token: str) -> Optional[Dict[str, Any]]:
    """Xác thực ID token từ client gửi lên."""
    try:
        decoded_token = auth_client.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None


def firebase_generate_custom_token(uid: str) -> Optional[str]:
    """Tạo custom token (nếu dùng backend tự sinh token)."""
    try:
        custom_token = auth_client.create_custom_token(uid)
        return custom_token.decode('utf-8')
    except Exception as e:
        print(f"Error generating custom token: {e}")
        return None


def firebase_revoke_refresh_tokens(uid: str) -> bool:
    """Thu hồi refresh tokens của một user (logout all)."""
    try:
        auth_client.revoke_refresh_tokens(uid)
        return True
    except Exception as e:
        print(f"Error revoking tokens: {e}")
        return False


def firebase_get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin user từ email."""
    try:
        user = auth_client.get_user_by_email(email)
        return {
            'uid': user.uid,
            'email': user.email,
            'displayName': user.display_name,
            'photoURL': user.photo_url
        }
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None


def firebase_delete_user(uid: str) -> bool:
    """Xóa user khỏi Firebase Auth."""
    try:
        auth_client.delete_user(uid)
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
