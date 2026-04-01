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
    3. Tạo custom token để user tự động đăng nhập
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
        display_name=user_data.get('displayName'),
        auth_provider='email'  # Đăng ký bằng email/password
    )
    
    if not success:
        return {
            'success': False,
            'message': 'Failed to create user profile in Firestore'
        }
    
    # Tạo custom token để user tự động đăng nhập sau khi đăng ký
    custom_token = auth_repo.firebase_generate_custom_token(user_data['uid'])
    
    # Lấy thông tin user profile
    user_profile = user_repo.get_user_by_id(user_data['uid'])
    
    return {
        'success': True,
        'message': 'User registered successfully',
        'user': user_data,
        'tokens': {
            'customToken': custom_token,
            'idToken': None  # Client sẽ dùng customToken để lấy idToken
        },
        'userProfile': user_profile
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


def login_user_service(email: str, password: str) -> Dict[str, Any]:
    """
    Đăng nhập user.
    Firebase Admin SDK không hỗ trợ đăng nhập trực tiếp với email/password.
    Client phải sử dụng Firebase Client SDK để đăng nhập và lấy ID token.
    Backend chỉ verify token.
    
    Tuy nhiên, để đáp ứng yêu cầu API, ta có thể:
    1. Verify user tồn tại
    2. Tạo custom token để client có thể đăng nhập
    """
    # Kiểm tra user có tồn tại không
    user_data = auth_repo.firebase_get_user_by_email(email)
    
    if not user_data:
        return {
            'success': False,
            'message': 'Invalid email or password'
        }
    
    # Lấy thông tin user từ Firestore
    user_profile = user_repo.get_user_by_id(user_data['uid'])
    
    # Tạo custom token
    custom_token = auth_repo.firebase_generate_custom_token(user_data['uid'])
    
    if not custom_token:
        return {
            'success': False,
            'message': 'Failed to generate authentication token'
        }
    
    return {
        'success': True,
        'tokens': {
            'customToken': custom_token,
            'idToken': None  # Client sẽ dùng customToken để lấy idToken
        },
        'user': {
            'userId': user_data['uid'],
            'email': user_data['email'],
            'name': user_data.get('displayName'),
            'profile': user_profile
        }
    }


def get_current_user_service(uid: str) -> Dict[str, Any]:
    """
    Lấy thông tin user hiện tại từ uid.
    """
    # Lấy thông tin user từ Firestore
    user_profile = user_repo.get_user_by_id(uid)
    
    if not user_profile:
        return {
            'success': False,
            'message': 'User not found'
        }
    
    return {
        'success': True,
        'user': {
            'userId': uid,
            'email': user_profile.get('email'),
            'name': user_profile.get('displayName'),
            'profile': user_profile
        }
    }
