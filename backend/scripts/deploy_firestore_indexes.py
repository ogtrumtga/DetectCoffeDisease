#!/usr/bin/env python3
"""
Script để deploy Firestore indexes lên Firebase
Chạy script này khi gặp lỗi "The query requires an index"
"""

import subprocess
import sys
import os

def deploy_firestore_indexes():
    """Deploy Firestore indexes từ firestore.indexes.json"""
    
    print("=" * 60)
    print("DEPLOY FIRESTORE INDEXES")
    print("=" * 60)
    
    # Kiểm tra file firestore.indexes.json tồn tại
    indexes_file = os.path.join(os.path.dirname(__file__), "..", "firestore.indexes.json")
    if not os.path.exists(indexes_file):
        print("❌ Không tìm thấy file firestore.indexes.json")
        return False
    
    print(f"✓ Tìm thấy file: {indexes_file}")
    
    # Kiểm tra Firebase CLI đã cài đặt chưa
    try:
        result = subprocess.run(
            ["firebase", "--version"],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✓ Firebase CLI version: {result.stdout.strip()}")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Firebase CLI chưa được cài đặt")
        print("   Cài đặt bằng: npm install -g firebase-tools")
        return False
    
    # Deploy indexes
    print("\n📤 Đang deploy Firestore indexes...")
    try:
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        result = subprocess.run(
            ["firebase", "deploy", "--only", "firestore:indexes"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            check=True
        )
        
        print("✅ Deploy thành công!")
        print("\n" + result.stdout)
        
        print("\n" + "=" * 60)
        print("LƯU Ý:")
        print("- Indexes có thể mất vài phút để build xong")
        print("- Kiểm tra status tại:")
        print("  https://console.firebase.google.com/project/coffe-detect/firestore/indexes")
        print("=" * 60)
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Deploy thất bại: {e}")
        print(f"\nOutput: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False

if __name__ == "__main__":
    success = deploy_firestore_indexes()
    sys.exit(0 if success else 1)
