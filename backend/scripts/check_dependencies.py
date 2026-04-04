#!/usr/bin/env python3
"""
Script kiểm tra dependencies backend đã cài đủ chưa
"""

import sys
import os

def check_dependencies():
    """Kiểm tra tất cả dependencies cần thiết"""
    
    print("=" * 60)
    print("KIỂM TRA BACKEND DEPENDENCIES")
    print("=" * 60)
    
    missing = []
    installed = []
    
    # Danh sách dependencies cần thiết
    required = {
        'fastapi': 'FastAPI framework',
        'uvicorn': 'ASGI server',
        'firebase_admin': 'Firebase Admin SDK',
        'cloudinary': 'Cloudinary SDK (upload ảnh)',
        'ultralytics': 'YOLO model (AI detection)',
        'PIL': 'Pillow (xử lý ảnh)',
        'requests': 'HTTP requests',
        'pydantic': 'Data validation',
    }
    
    for module, description in required.items():
        try:
            __import__(module)
            installed.append(f"✅ {module:20s} - {description}")
        except ImportError:
            missing.append(f"❌ {module:20s} - {description}")
    
    # In kết quả
    if installed:
        print("\n📦 Đã cài đặt:")
        for item in installed:
            print(f"  {item}")
    
    if missing:
        print("\n⚠️  Thiếu dependencies:")
        for item in missing:
            print(f"  {item}")
        print("\n💡 Cài đặt bằng lệnh:")
        print("   pip install -r backend/requirements.txt")
        return False
    
    # Kiểm tra model file
    print("\n🤖 Kiểm tra YOLO model:")
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'predict_models', 'best.pt')
    if os.path.exists(model_path):
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"  ✅ best.pt tồn tại ({size_mb:.1f} MB)")
    else:
        print(f"  ❌ best.pt không tìm thấy tại: {model_path}")
        print("     Model cần thiết để chạy AI detection!")
        return False
    
    # Kiểm tra Cloudinary config
    print("\n☁️  Kiểm tra Cloudinary config:")
    print("  ℹ️  Cloudinary credentials được hardcode trong diagnosis_service.py")
    print("     cloud_name: dz89vwzco")
    print("     Nếu upload ảnh lỗi, kiểm tra credentials trong service")
    
    print("\n" + "=" * 60)
    print("✅ TẤT CẢ DEPENDENCIES ĐÃ SẴN SÀNG!")
    print("=" * 60)
    print("\n🚀 Chạy backend:")
    print("   python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000")
    print("\n")
    
    return True

if __name__ == "__main__":
    success = check_dependencies()
    sys.exit(0 if success else 1)
