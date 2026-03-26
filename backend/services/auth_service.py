"""
Auth service.

Xử lý logic nghiệp vụ cho authentication:
- Đăng ký
- Đăng nhập
- Xác thực token
"""
from backend.repositories import firebase_auth_repository as auth_repo
from backend.repositories import firebase_user_repository as user_repo
from typing import Optional, Dict, Any


def register_user_service(email: str, password: str, display_name: str = None) -> Dict[str, Any]:
    """
    Đăng ký user mới.
    1. Tạo user trong Firebase Auth
    2. Tạo profile trong Firestore
    """
    # Tạo user trong Firebase Auth
    user_data = auth_repo.firebase_create_user(email, password, display_name)
    
    if not user_data:
        return {
            'success': False,
            'message': 'Failed to create user in Firebase Auth'
        }
    
    # Tạo profile trong Firestore
    success = user_repo.create_user_profile(
        user_id=user_data['uid'],
        email=user_data['email'],
        display_name=user_data.get('displayName')
    )
    
    if not success:
        return {
            'success': False,
            'message': 'Failed to create user profile in Firestore'
        }
    
    return {
        'success': True,
        'message': 'User registered successfully',
        'user': user_data
    }


def verify_token_service(id_token: str) -> Dict[str, Any]:
    """
    Xác thực ID token từ client.
    Trả về thông tin user nếu token hợp lệ.
    """
    decoded_token = auth_repo.firebase_verify_id_token(id_token)
    
    if not decoded_token:
        return {
            'success': False,
            'message': 'Invalid token'
        }
    
    # Lấy thông tin user từ Firestore
    user_profile = user_repo.get_user_by_id(decoded_token['uid'])
    
    return {
        'success': True,
        'user': {
            'uid': decoded_token['uid'],
            'email': decoded_token.get('email'),
            'profile': user_profile
        }
    }


def logout_user_service(uid: str) -> Dict[str, Any]:
    """
    Logout user - thu hồi refresh tokens.
    """
    success = auth_repo.firebase_revoke_refresh_tokens(uid)
    
    if success:
        return {
            'success': True,
            'message': 'User logged out successfully'
        }
    
    return {
        'success': False,
        'message': 'Failed to logout user'
    }
