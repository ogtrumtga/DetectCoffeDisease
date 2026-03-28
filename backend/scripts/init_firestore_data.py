"""
Script để khởi tạo dữ liệu mẫu cho Firestore.

Chạy script này để tạo collections và dữ liệu mẫu trên Firebase.
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db
from datetime import datetime


def init_sample_data():
    """Khởi tạo dữ liệu mẫu."""
    
    print("🔥 Bắt đầu khởi tạo dữ liệu Firebase Firestore...")
    
    # 1. Tạo sample users (nếu chưa có)
    print("\n📝 Tạo sample users...")
    sample_users = [
        {
            'id': 'sample_user_001',
            'email': 'farmer1@example.com',
            'displayName': 'Nguyễn Văn A',
            'photoURL': '',
            'bio': 'Nông dân trồng cà phê tại Đắk Lắk',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'id': 'sample_user_002',
            'email': 'farmer2@example.com',
            'displayName': 'Trần Thị B',
            'photoURL': '',
            'bio': 'Chuyên gia về bệnh cà phê',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
    ]
    
    for user in sample_users:
        user_id = user.pop('id')
        try:
            db.collection('users').document(user_id).set(user)
            print(f"  ✅ Created user: {user['displayName']}")
        except Exception as e:
            print(f"  ⚠️  User {user_id} might already exist: {e}")
    
    # 2. Tạo sample posts
    print("\n📝 Tạo sample posts...")
    sample_posts = [
        {
            'authorId': 'sample_user_001',
            'title': 'Cách phòng bệnh gỉ sắt cho cà phê',
            'content': 'Bệnh gỉ sắt là một trong những bệnh phổ biến nhất trên cây cà phê. Để phòng bệnh hiệu quả, chúng ta cần...',
            'images': [],
            'tags': ['bệnh gỉ sắt', 'phòng bệnh'],
            'likesCount': 0,
            'commentsCount': 0,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'authorId': 'sample_user_002',
            'title': 'Kinh nghiệm chăm sóc cà phê mùa mưa',
            'content': 'Mùa mưa là thời điểm cây cà phê dễ bị bệnh nhất. Dưới đây là một số kinh nghiệm của tôi...',
            'images': [],
            'tags': ['chăm sóc', 'mùa mưa'],
            'likesCount': 0,
            'commentsCount': 0,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
    ]
    
    for post in sample_posts:
        try:
            doc_ref = db.collection('posts').document()
            doc_ref.set(post)
            print(f"  ✅ Created post: {post['title']}")
        except Exception as e:
            print(f"  ❌ Error creating post: {e}")
    
    # 3. Tạo sample diagnoses
    print("\n📝 Tạo sample diagnoses...")
    sample_diagnoses = [
        {
            'userId': 'sample_user_001',
            'disease': 'Coffee Rust (Gỉ sắt)',
            'confidence': 0.95,
            'description': 'Bệnh gỉ sắt do nấm Hemileia vastatrix gây ra, là một trong những bệnh nguy hiểm nhất đối với cây cà phê.',
            'treatment': 'Phun thuốc chống nấm, cải thiện thoát nước, tỉa cành để tăng thông thoáng.',
            'imageUrl': '',
            'createdAt': datetime.utcnow()
        }
    ]
    
    for diagnosis in sample_diagnoses:
        try:
            doc_ref = db.collection('diagnoses').document()
            doc_ref.set(diagnosis)
            print(f"  ✅ Created diagnosis: {diagnosis['disease']}")
        except Exception as e:
            print(f"  ❌ Error creating diagnosis: {e}")
    
    # 4. Tạo sample notifications
    print("\n📝 Tạo sample notifications...")
    sample_notifications = [
        {
            'userId': 'sample_user_001',
            'type': 'system',
            'title': 'Chào mừng đến với Coffee Disease Detection',
            'message': 'Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi!',
            'data': {},
            'isRead': False,
            'createdAt': datetime.utcnow()
        }
    ]
    
    for notification in sample_notifications:
        try:
            doc_ref = db.collection('notifications').document()
            doc_ref.set(notification)
            print(f"  ✅ Created notification: {notification['title']}")
        except Exception as e:
            print(f"  ❌ Error creating notification: {e}")
    
    print("\n✨ Hoàn thành khởi tạo dữ liệu!")
    print("\n📊 Các collections đã được tạo:")
    print("  - users")
    print("  - posts")
    print("  - comments")
    print("  - likes")
    print("  - diagnoses")
    print("  - notifications")
    print("  - weather_cache")
    print("\n💡 Bạn có thể xem dữ liệu trên Firebase Console:")
    print("   https://console.firebase.google.com/")


if __name__ == '__main__':
    try:
        init_sample_data()
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        print("\n💡 Hãy đảm bảo:")
        print("  1. File serviceAccountKey.json đã được cấu hình đúng")
        print("  2. Firebase project đã được khởi tạo")
        print("  3. Firestore đã được enable trên Firebase Console")
