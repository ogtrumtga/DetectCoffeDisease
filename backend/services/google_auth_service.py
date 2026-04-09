"""
Google Authentication service.

Xử lý đăng nhập/đăng ký bằng Google.
"""
from backend.repositories import firebase_user_repository as user_repo
from typing import Dict, Any


def handle_google_login_service(uid: str, email: str, display_name: str, photo_url: str) -> Dict[str, Any]:
    """
    Xử lý đăng nhập Google.
    - Nếu user đã tồn tại: trả về thông tin (KHÔNG ghi đè photoURL)
    - Nếu user chưa tồn tại: tạo profile mới với photoURL từ Google
    """
    # Kiểm tra user đã tồn tại chưa
    existing_user = user_repo.get_user_by_id(uid)
    
    if existing_user:
        # ✅ User đã tồn tại, trả về thông tin KHÔNG cập nhật photoURL
        # Điều này giữ nguyên avatar đã được user thay đổi
        return {
            'success': True,
            'message': 'Login successful',
            'user': existing_user,
            'is_new_user': False
        }
    
    # User chưa tồn tại, tạo profile mới với photoURL từ Google
    success = user_repo.create_user_profile(
        user_id=uid,
        email=email,
        display_name=display_name,
        photo_url=photo_url,  # Chỉ set khi tạo mới
        auth_provider='google'
    )
    
    if not success:
        return {
            'success': False,
            'message': 'Failed to create user profile'
        }
    
    # Lấy profile vừa tạo
    new_user = user_repo.get_user_by_id(uid)
    
    return {
        'success': True,
        'message': 'User registered successfully',
        'user': new_user,
        'is_new_user': True
    }
