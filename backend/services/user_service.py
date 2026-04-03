"""
User/Profile service.

Chứa logic nghiệp vụ cho profile người dùng:
- Lấy thông tin cá nhân
- Cập nhật thông tin
- Cập nhật avatar
- Xóa tài khoản
"""
from backend.repositories import firebase_user_repository as user_repo
from backend.repositories import firebase_auth_repository as auth_repo
from typing import Dict, Any


def get_my_profile_service(user_id: str) -> Dict[str, Any]:
    """Lấy thông tin profile của user hiện tại."""
    profile = user_repo.get_user_by_id(user_id)
    
    if not profile:
        return {
            'success': False,
            'message': 'User profile not found'
        }
    
    return {
        'success': True,
        'profile': profile
    }


def update_my_profile_service(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate dữ liệu và cập nhật profile (tên, bio, ...)."""
    # Chỉ cho phép update các field an toàn
    allowed_fields = ['displayName', 'bio', 'photoURL']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        return {
            'success': False,
            'message': 'No valid fields to update'
        }
    
    success = user_repo.update_user_profile(user_id, update_data)
    
    if success:
        return {
            'success': True,
            'message': 'Profile updated successfully'
        }
    
    return {
        'success': False,
        'message': 'Failed to update profile'
    }


def update_my_avatar_service(user_id: str, avatar_url: str) -> Dict[str, Any]:
    """Xử lý upload avatar và cập nhật URL avatar của user."""
    success = user_repo.update_user_avatar_url(user_id, avatar_url)
    
    if success:
        return {
            'success': True,
            'message': 'Avatar updated successfully'
        }
    
    return {
        'success': False,
        'message': 'Failed to update avatar'
    }


def delete_my_account_service(user_id: str) -> Dict[str, Any]:
    """Xử lý xóa tài khoản: user document + Firebase Auth."""
    # Xóa profile trong Firestore
    firestore_deleted = user_repo.delete_user_document(user_id)
    
    # Xóa user trong Firebase Auth
    auth_deleted = auth_repo.firebase_delete_user(user_id)
    
    if firestore_deleted and auth_deleted:
        return {
            'success': True,
            'message': 'Account deleted successfully'
        }
    
    return {
        'success': False,
        'message': 'Failed to delete account completely'
    }
