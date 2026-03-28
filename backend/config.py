"""
Backend configuration for Firebase Admin SDK.
"""
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth

load_dotenv()

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Đường dẫn đến service account key file
    service_account_path = os.path.join(
        os.path.dirname(__file__), 
        'serviceAccountKey.json'
    )
    
    # Kiểm tra file có tồn tại không
    if not os.path.exists(service_account_path):
        raise FileNotFoundError(
            f"\n❌ Không tìm thấy file serviceAccountKey.json!\n"
            f"📍 Đường dẫn cần có: {service_account_path}\n\n"
            f"🔧 Hướng dẫn lấy file:\n"
            f"1. Vào: https://console.firebase.google.com/\n"
            f"2. Chọn project 'coffe-detect'\n"
            f"3. Settings (⚙️) → Project settings → Service accounts\n"
            f"4. Click 'Generate new private key'\n"
            f"5. Lưu file vào: {service_account_path}\n"
        )
    
    # Khởi tạo Firebase với service account key
    cred = credentials.Certificate(service_account_path)
    
    firebase_admin.initialize_app(cred, {
        'projectId': 'coffe-detect',
    })

# Firestore client
db = firestore.client()

# Auth client
auth_client = auth
