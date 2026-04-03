"""
Script tạo cấu trúc Firestore Collections cho Coffee Disease Detection App.

Script này sẽ:
1. Tạo tất cả 7 collections cần thiết
2. Tạo document mẫu với cấu trúc đầy đủ
3. In ra hướng dẫn setup indexes và security rules

Chạy: python backend/scripts/create_firestore_structure.py
"""
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from config import db
    print("✅ Kết nối Firebase thành công!")
except Exception as e:
    print(f"❌ Lỗi kết nối Firebase: {e}")
    print("\n💡 Hãy đảm bảo:")
    print("  1. File serviceAccountKey.json đã có trong thư mục backend/")
    print("  2. File backend/config.py đã cấu hình đúng")
    sys.exit(1)


def create_collection_structure(collection_name, sample_doc_id, sample_data):
    """Tạo collection với document mẫu."""
    try:
        db.collection(collection_name).document(sample_doc_id).set(sample_data)
        print(f"  ✅ Collection '{collection_name}' đã được tạo")
        return True
    except Exception as e:
        print(f"  ❌ Lỗi tạo collection '{collection_name}': {e}")
        return False


def main():
    print("\n" + "="*80)
    print("🔥 TẠO CẤU TRÚC FIRESTORE COLLECTIONS - COFFEE DISEASE DETECTION")
    print("="*80 + "\n")
    
    # ========================================================================
    # 1. COLLECTION: users
    # Lưu thông tin profile người dùng
    # ========================================================================
    print("📦 [1/7] Tạo collection: users")
    print("     Mục đích: Lưu thông tin profile người dùng")
    users_sample = {
        'email': 'sample@example.com',
        'displayName': 'Sample User',
        'photoURL': '',
        'bio': '',
        'authProvider': 'email',  # 'email' hoặc 'google'
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }
    create_collection_structure('users', '_structure_sample', users_sample)
    print("     Fields: email, displayName, photoURL, bio, authProvider, createdAt, updatedAt")
    
    # ========================================================================
    # 2. COLLECTION: posts
    # Lưu bài đăng cộng đồng
    # ========================================================================
    print("\n📦 [2/7] Tạo collection: posts")
    print("     Mục đích: Lưu bài đăng cộng đồng")
    posts_sample = {
        'authorId': '_structure_sample',  # FK → users
        'title': 'Sample Post Title',
        'content': 'Sample post content about coffee disease prevention...',
        'images': [],  # Array of image URLs
        'tags': ['sample', 'coffee'],  # Array of tags
        'likesCount': 0,  # Denormalized count
        'commentsCount': 0,  # Denormalized count
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }
    create_collection_structure('posts', '_structure_sample', posts_sample)
    print("     Fields: authorId, title, content, images, tags, likesCount, commentsCount")
    print("     Relationship: authorId → users")
    
    # ========================================================================
    # 3. COLLECTION: comments
    # Lưu bình luận bài đăng
    # ========================================================================
    print("\n📦 [3/7] Tạo collection: comments")
    print("     Mục đích: Lưu bình luận bài đăng")
    comments_sample = {
        'postId': '_structure_sample',  # FK → posts
        'authorId': '_structure_sample',  # FK → users
        'content': 'Sample comment content',
        'createdAt': datetime.utcnow()
    }
    create_collection_structure('comments', '_structure_sample', comments_sample)
    print("     Fields: postId, authorId, content, createdAt")
    print("     Relationships: postId → posts, authorId → users")
    
    # ========================================================================
    # 4. COLLECTION: likes
    # Lưu lượt thích bài đăng
    # ========================================================================
    print("\n📦 [4/7] Tạo collection: likes")
    print("     Mục đích: Lưu lượt thích bài đăng")
    likes_sample = {
        'postId': '_structure_sample',  # FK → posts
        'userId': '_structure_sample',  # FK → users
        'createdAt': datetime.utcnow()
    }
    # Document ID format: {userId}_{postId} để đảm bảo unique
    create_collection_structure('likes', '_structure_sample_likes', likes_sample)
    print("     Fields: postId, userId, createdAt")
    print("     Document ID: {userId}_{postId} (composite key)")
    print("     Relationships: postId → posts, userId → users")
    
    # ========================================================================
    # 5. COLLECTION: diagnoses
    # Lưu kết quả chẩn đoán chi tiết từ AI model
    # ========================================================================
    print("\n📦 [5/8] Tạo collection: diagnoses")
    print("     Mục đích: Lưu kết quả chẩn đoán chi tiết từ AI model")
    diagnoses_sample = {
        'userId': '_structure_sample',  # FK → users
        'diseaseKey': 'healthy',  # Key của bệnh (healthy/rust/cercospora/miner/phoma)
        'diseaseName': 'Healthy (Khỏe mạnh)',  # Tên tiếng Anh
        'diseaseNameVi': 'Lá khỏe mạnh',  # Tên tiếng Việt
        'confidence': 0.95,  # Độ tin cậy (0-1)
        'description': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh.',
        'treatment': 'Tiếp tục chăm sóc bình thường.',
        'severity': 'none',  # none/low/medium/high
        'imageUrl': '',  # URL ảnh đã upload lên Storage
        'modelVersion': 'v1.0',  # Version của AI model
        'processingTime': 1.5,  # Thời gian xử lý (giây)
        'createdAt': datetime.utcnow()
    }
    create_collection_structure('diagnoses', '_structure_sample', diagnoses_sample)
    print("     Fields: userId, diseaseKey, diseaseName, diseaseNameVi, confidence,")
    print("             description, treatment, severity, imageUrl, modelVersion")
    print("     Relationship: userId → users")
    print("     Supported diseases: healthy, rust, cercospora, miner, phoma")
    
    # ========================================================================
    # 6. COLLECTION: history
    # Lưu lịch sử các lần chẩn đoán (metadata only)
    # ========================================================================
    print("\n📦 [6/8] Tạo collection: history")
    print("     Mục đích: Lưu lịch sử các lần chẩn đoán (metadata)")
    history_sample = {
        'userId': '_structure_sample',  # FK → users
        'diagnosisId': '_structure_sample',  # FK → diagnoses
        'imageId': 'img_001',  # ID ảnh trong Storage
        'predictions': {  # Tóm tắt kết quả
            'disease': 'healthy',
            'confidence': 0.95
        },
        'createdAt': datetime.utcnow()
    }
    create_collection_structure('history', '_structure_sample', history_sample)
    print("     Fields: userId, diagnosisId, imageId, predictions, createdAt")
    print("     Relationships: userId → users, diagnosisId → diagnoses")
    print("     Purpose: Lightweight list, link to full diagnosis")
    
    # ========================================================================
    # 7. COLLECTION: notifications
    # Lưu thông báo cho người dùng
    # ========================================================================
    print("\n📦 [7/8] Tạo collection: notifications")
    print("     Mục đích: Lưu thông báo cho người dùng")
    notifications_sample = {
        'userId': '_structure_sample',  # FK → users
        'type': 'system',  # system/like/comment/diagnosis_alert
        'title': 'Sample Notification',
        'message': 'This is a sample notification message',
        'data': {},  # Additional data (postId, diagnosisId, etc.)
        'isRead': False,
        'createdAt': datetime.utcnow()
    }
    create_collection_structure('notifications', '_structure_sample', notifications_sample)
    print("     Fields: userId, type, title, message, data, isRead, createdAt")
    print("     Relationship: userId → users")
    print("     Types: system, like, comment, diagnosis_alert")
    
    # ========================================================================
    # 8. COLLECTION: weather_cache
    # Cache dữ liệu thời tiết
    # ========================================================================
    print("\n📦 [8/8] Tạo collection: weather_cache")
    print("     Mục đích: Cache dữ liệu thời tiết")
    weather_sample = {
        'locationKey': 'sample_location',
        'weatherData': {
            'temperature': 28,
            'humidity': 75,
            'rainfall': 5,
            'forecast': []
        },
        'cachedAt': datetime.utcnow()
    }
    create_collection_structure('weather_cache', '_structure_sample', weather_sample)
    print("     Fields: locationKey, weatherData, cachedAt")
    print("     Document ID: {locationKey}")
    print("     No relationships (independent collection)")
    
    # ========================================================================
    # HOÀN THÀNH
    # ========================================================================
    print("\n" + "="*80)
    print("✨ HOÀN THÀNH TẠO CẤU TRÚC FIRESTORE!")
    print("="*80)
    
    print("\n📊 Tổng kết các collections đã tạo:")
    collections_info = [
        ('users', 'Thông tin profile người dùng', 'email, displayName, photoURL, bio, authProvider'),
        ('posts', 'Bài đăng cộng đồng', 'authorId, title, content, images, tags, likesCount, commentsCount'),
        ('comments', 'Bình luận bài đăng', 'postId, authorId, content'),
        ('likes', 'Lượt thích bài đăng', 'postId, userId'),
        ('diagnoses', 'Kết quả chẩn đoán chi tiết', 'userId, diseaseKey, diseaseName, confidence, imageUrl, treatment'),
        ('history', 'Lịch sử chẩn đoán (metadata)', 'userId, diagnosisId, imageId, predictions'),
        ('notifications', 'Thông báo người dùng', 'userId, type, title, message, isRead'),
        ('weather_cache', 'Cache dữ liệu thời tiết', 'locationKey, weatherData')
    ]
    
    for i, (name, purpose, fields) in enumerate(collections_info, 1):
        print(f"\n  {i}. {name}")
        print(f"     📝 {purpose}")
        print(f"     🔑 Key fields: {fields}")
    
    print("\n🌐 Kiểm tra trên Firebase Console:")
    print("  👉 https://console.firebase.google.com/")
    print("  👉 Chọn project → Firestore Database")
    print("  👉 Bạn sẽ thấy 8 collections với document '_structure_sample'")
    
    print("\n" + "="*80)
    print("⚠️  QUAN TRỌNG: CẦN SETUP THÊM")
    print("="*80)
    
    print("\n1️⃣  TẠO COMPOSITE INDEXES (Bắt buộc cho queries)")
    print("   📍 Vào Firebase Console → Firestore → Indexes → Add Index")
    print("\n   Hoặc chạy lệnh:")
    print("   firebase deploy --only firestore:indexes")
    
    print("\n   📌 Các indexes cần tạo:")
    indexes = [
        ('posts', 'authorId (ASC) + createdAt (DESC)', 'Query bài đăng của user'),
        ('comments', 'postId (ASC) + createdAt (ASC)', 'Query comments của bài đăng'),
        ('likes', 'postId (ASC) + userId (ASC)', 'Query likes của bài đăng'),
        ('diagnoses', 'userId (ASC) + createdAt (DESC)', 'Query kết quả chẩn đoán'),
        ('history', 'userId (ASC) + createdAt (DESC)', 'Query lịch sử chẩn đoán'),
        ('notifications', 'userId (ASC) + isRead (ASC) + createdAt (DESC)', 'Query thông báo chưa đọc')
    ]
    
    for collection, fields, purpose in indexes:
        print(f"\n      Collection: {collection}")
        print(f"      Fields: {fields}")
        print(f"      Purpose: {purpose}")
    
    print("\n2️⃣  SETUP SECURITY RULES")
    print("   📍 Vào Firebase Console → Firestore → Rules")
    print("   📄 Copy nội dung từ file: backend/firestore.rules")
    print("\n   Hoặc chạy lệnh:")
    print("   firebase deploy --only firestore:rules")
    
    print("\n3️⃣  SETUP FIREBASE STORAGE (Cho upload ảnh)")
    print("   📍 Vào Firebase Console → Storage → Get Started")
    print("   📄 Enable Firebase Storage")
    print("   📄 Setup Storage Rules (cho phép upload ảnh)")
    
    print("\n4️⃣  XÓA DOCUMENTS MẪU (Optional)")
    print("   Sau khi setup xong, chạy:")
    print("   python backend/scripts/cleanup_sample_docs.py")
    print("\n   Hoặc xóa thủ công các document có ID '_structure_sample'")
    
    print("\n" + "="*80)
    print("📚 TÀI LIỆU THAM KHẢO")
    print("="*80)
    print("\n  📖 backend/DATABASE_SCHEMA.md - Chi tiết cấu trúc database")
    print("  📖 backend/FIREBASE_COLLECTIONS.md - Mô tả collections")
    print("  📖 backend/VI_DU_MOI_QUAN_HE_FIRESTORE.md - Cách xử lý mối quan hệ")
    print("  📖 backend/HUONG_DAN_CHAN_DOAN_BENH.md - Hướng dẫn chẩn đoán bệnh")
    print("  📖 backend/firestore.rules - Security rules")
    print("  📖 backend/firestore.indexes.json - Indexes config")
    
    print("\n" + "="*80)
    print("🎉 BẠN ĐÃ SẴN SÀNG SỬ DỤNG FIRESTORE!")
    print("="*80)
    
    print("\n💡 Next steps:")
    print("  1. ✅ Kiểm tra collections trên Firebase Console")
    print("  2. ⏳ Tạo composite indexes (Bước 1)")
    print("  3. ⏳ Deploy security rules (Bước 2)")
    print("  4. ⏳ Enable Firebase Storage (Bước 3)")
    print("  5. ⏳ Test API endpoints")
    print("  6. ⏳ Xóa sample documents (Bước 4)")
    
    print("\n🚀 Sau khi hoàn thành, bạn có thể:")
    print("  - Đăng ký/đăng nhập user")
    print("  - Tạo bài đăng cộng đồng")
    print("  - Chẩn đoán bệnh cà phê")
    print("  - Xem lịch sử chẩn đoán")
    print("  - Nhận thông báo")
    print("\n")


if __name__ == '__main__':
    main()
