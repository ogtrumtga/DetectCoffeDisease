#!/usr/bin/env python3
"""
Test upload ảnh trực tiếp đến backend
Chạy: python test_upload_direct.py
"""

import requests
import sys
import os

API_URL = 'http://192.168.36.1:8000'

def test_backend_connection():
    """Test kết nối backend"""
    print("=" * 60)
    print("TEST KẾT NỐI BACKEND")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.ok:
            print(f"✅ Backend đang chạy!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend trả về: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Không kết nối được backend!")
        print(f"   Error: {e}")
        print("\n💡 Kiểm tra:")
        print("   - Backend có đang chạy không?")
        print("   - Chạy: python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000")
        return False

def test_upload_image():
    """Test upload ảnh"""
    print("\n" + "=" * 60)
    print("TEST UPLOAD ẢNH")
    print("=" * 60)
    
    # Tạo ảnh test đơn giản
    from PIL import Image
    import io
    
    # Tạo ảnh test 100x100 màu xanh
    img = Image.new('RGB', (100, 100), color='green')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    try:
        print("Đang upload ảnh test...")
        
        files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
        data = {'token': 'fake-token-for-test'}
        
        response = requests.post(
            f"{API_URL}/api/diagnosis/upload-image",
            files=files,
            data=data,
            timeout=30
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 401:
            print("\n⚠️  Token không hợp lệ (expected)")
            print("   Đây là OK - backend đã nhận request!")
            print("   Vấn đề là token fake, không phải kết nối")
            return True
        elif response.ok:
            print("\n✅ Upload thành công!")
            data = response.json()
            print(f"   ImageID: {data.get('imageID')}")
            return True
        else:
            print(f"\n❌ Upload thất bại: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("\n❌ Request timeout!")
        print("   Backend nhận request nhưng xử lý quá lâu")
        print("   Có thể Cloudinary chậm hoặc backend bị treo")
        return False
    except Exception as e:
        print(f"\n❌ Upload error: {e}")
        return False

def main():
    # Test 1: Kết nối
    if not test_backend_connection():
        print("\n❌ Backend không chạy. Dừng test.")
        sys.exit(1)
    
    # Test 2: Upload
    test_upload_image()
    
    print("\n" + "=" * 60)
    print("KẾT LUẬN")
    print("=" * 60)
    print("Nếu thấy '401 Token không hợp lệ' → Backend hoạt động TỐT!")
    print("Vấn đề là ở app React Native, không phải backend.")
    print("\n💡 Debug tiếp:")
    print("   1. Kiểm tra IP trong .env app")
    print("   2. Kiểm tra firewall")
    print("   3. Kiểm tra cùng WiFi")
    print("=" * 60)

if __name__ == "__main__":
    main()
