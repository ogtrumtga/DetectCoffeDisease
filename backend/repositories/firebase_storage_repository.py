"""
Firebase Storage repository.

Quản lý upload/xóa file (ảnh avatar, ảnh lá cà phê, ...).
"""
from firebase_admin import storage
from datetime import datetime
import uuid
import os


def upload_avatar(user_id: str, file_data: bytes, file_extension: str = 'jpg') -> str:
    """
    Upload ảnh avatar và trả về URL public.
    
    Args:
        user_id: ID người dùng
        file_data: Dữ liệu file (bytes)
        file_extension: Phần mở rộng file (jpg, png, ...)
    
    Returns:
        URL public của ảnh
    """
    try:
        bucket = storage.bucket()
        
        # Tạo tên file unique
        filename = f"avatars/{user_id}/{uuid.uuid4()}.{file_extension}"
        
        # Upload file
        blob = bucket.blob(filename)
        blob.upload_from_string(file_data, content_type=f'image/{file_extension}')
        
        # Make public
        blob.make_public()
        
        return blob.public_url
        
    except Exception as e:
        print(f"Error uploading avatar: {e}")
        return None


def upload_diagnosis_image(user_id: str, file_data: bytes, file_extension: str = 'jpg') -> str:
    """
    Upload ảnh lá cà phê để chẩn đoán.
    
    Args:
        user_id: ID người dùng
        file_data: Dữ liệu file (bytes)
        file_extension: Phần mở rộng file
    
    Returns:
        URL public của ảnh
    """
    try:
        bucket = storage.bucket()
        
        # Tạo tên file với timestamp
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"diagnoses/{user_id}/{timestamp}_{uuid.uuid4()}.{file_extension}"
        
        # Upload file
        blob = bucket.blob(filename)
        blob.upload_from_string(file_data, content_type=f'image/{file_extension}')
        
        # Make public
        blob.make_public()
        
        return blob.public_url
        
    except Exception as e:
        print(f"Error uploading diagnosis image: {e}")
        return None


def upload_post_image(user_id: str, file_data: bytes, file_extension: str = 'jpg') -> str:
    """
    Upload ảnh cho bài đăng cộng đồng.
    
    Args:
        user_id: ID người dùng
        file_data: Dữ liệu file (bytes)
        file_extension: Phần mở rộng file
    
    Returns:
        URL public của ảnh
    """
    try:
        bucket = storage.bucket()
        
        # Tạo tên file
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"posts/{user_id}/{timestamp}_{uuid.uuid4()}.{file_extension}"
        
        # Upload file
        blob = bucket.blob(filename)
        blob.upload_from_string(file_data, content_type=f'image/{file_extension}')
        
        # Make public
        blob.make_public()
        
        return blob.public_url
        
    except Exception as e:
        print(f"Error uploading post image: {e}")
        return None


def delete_file_by_url(file_url: str) -> bool:
    """
    Xóa file trong Storage dựa trên URL.
    
    Args:
        file_url: URL public của file
    
    Returns:
        True nếu xóa thành công
    """
    try:
        bucket = storage.bucket()
        
        # Extract blob name from URL
        # URL format: https://storage.googleapis.com/{bucket_name}/{blob_name}
        blob_name = file_url.split(f'{bucket.name}/')[-1]
        
        # Delete blob
        blob = bucket.blob(blob_name)
        blob.delete()
        
        return True
        
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False


def delete_file_by_path(file_path: str) -> bool:
    """
    Xóa file trong Storage dựa trên path.
    
    Args:
        file_path: Path của file (e.g., "avatars/user123/image.jpg")
    
    Returns:
        True nếu xóa thành công
    """
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file_path)
        blob.delete()
        
        return True
        
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False
