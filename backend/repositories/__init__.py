"""
Data access layer (repositories).

Chuyên giao tiếp với Firebase (Auth, Firestore, Storage).
Mỗi repository tập trung cho một loại dữ liệu/domain cụ thể.
"""

# Import all repositories for easy access
from . import firebase_auth_repository
from . import firebase_user_repository
from . import firebase_post_repository
from . import firebase_comment_repository
from . import firebase_like_repository
from . import firebase_diagnosis_repository
from . import firebase_notification_repository
from . import firebase_feedback_repository
from . import firebase_treatment_repository
from . import firebase_storage_repository
from . import firebase_weather_repository
from . import firebase_image_repository

__all__ = [
    'firebase_auth_repository',
    'firebase_user_repository',
    'firebase_post_repository',
    'firebase_comment_repository',
    'firebase_like_repository',
    'firebase_diagnosis_repository',
    'firebase_notification_repository',
    'firebase_feedback_repository',
    'firebase_treatment_repository',
    'firebase_storage_repository',
    'firebase_weather_repository',
    'firebase_image_repository',
]

