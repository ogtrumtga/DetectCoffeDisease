"""
Script reset Firestore — Xóa collection history, chỉ giữ diagnoses.

Chạy script này để:
  1. Xóa toàn bộ collection history (đã gộp vào diagnoses)
  2. Xóa toàn bộ collection diagnoses cũ (nếu có)
  3. Tạo lại collection diagnoses với schema mới
  4. Tạo collection diseases (danh sách bệnh được hỗ trợ)
  5. Tạo sample data để test

Lưu ý: Script này XÓA DỮ LIỆU — chỉ chạy trong môi trường dev/test!
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import db
from datetime import datetime


def delete_collection(collection_name: str):
    """Xóa toàn bộ documents trong một collection."""
    print(f"\n🗑️  Đang xóa collection '{collection_name}'...")
    try:
        docs = db.collection(collection_name).stream()
        count = 0
        for doc in docs:
            doc.reference.delete()
            count += 1
        print(f"✅ Đã xóa {count} documents từ '{collection_name}'")
    except Exception as e:
        print(f"❌ Lỗi khi xóa '{collection_name}': {e}")


def create_diseases_collection():
    """Tạo collection diseases với danh sách bệnh được hỗ trợ."""
    print("\n📋 Đang tạo collection 'diseases'...")
    
    diseases = [
        {
            'id': 'healthy',
            'name': 'Healthy (Khỏe mạnh)',
            'name_vi': 'Lá khỏe mạnh',
            'description': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh.',
            'treatment': 'Tiếp tục chăm sóc bình thường. Bón phân định kỳ và tưới nước đầy đủ.',
            'severity': 'none',
            'color': '#4CAF50',
        },
        {
            'id': 'rust',
            'name': 'Coffee Rust (Gỉ sắt)',
            'name_vi': 'Bệnh gỉ sắt',
            'description': 'Bệnh gỉ sắt do nấm Hemileia vastatrix. Triệu chứng: đốm vàng cam mặt dưới lá, lá rụng sớm.',
            'treatment': 'Phun thuốc chống nấm (đồng oxychloride, mancozeb). Cải thiện thoát nước. Tỉa cành tăng thông thoáng.',
            'severity': 'high',
            'color': '#FF5722',
        },
        {
            'id': 'cercospora',
            'name': 'Cercospora Leaf Spot (Đốm lá)',
            'name_vi': 'Bệnh đốm lá Cercospora',
            'description': 'Bệnh đốm lá do nấm Cercospora coffeicola. Triệu chứng: đốm tròn nâu, viền vàng.',
            'treatment': 'Phun thuốc chống nấm. Loại bỏ lá bệnh. Tránh tưới nước lên lá.',
            'severity': 'medium',
            'color': '#FF9800',
        },
        {
            'id': 'miner',
            'name': 'Leaf Miner (Sâu đục lá)',
            'name_vi': 'Sâu đục lá',
            'description': 'Sâu đục lá cà phê (Leucoptera coffeella). Triệu chứng: đường hầm uốn khúc, lá khô rụng.',
            'treatment': 'Phun thuốc trừ sâu sinh học. Thu gom tiêu hủy lá bệnh. Dùng bẫy dính màu vàng.',
            'severity': 'medium',
            'color': '#FFC107',
        },
        {
            'id': 'phoma',
            'name': 'Phoma Leaf Spot (Đốm lá Phoma)',
            'name_vi': 'Bệnh đốm lá Phoma',
            'description': 'Bệnh đốm lá do nấm Phoma. Triệu chứng: đốm nâu đen, lan rộng gây rụng lá.',
            'treatment': 'Phun thuốc chống nấm. Cải thiện thoát nước. Tránh tưới quá nhiều.',
            'severity': 'medium',
            'color': '#795548',
        },
    ]
    
    try:
        for disease in diseases:
            disease_id = disease.pop('id')
            db.collection('diseases').document(disease_id).set(disease)
        print(f"✅ Đã tạo {len(diseases)} diseases")
    except Exception as e:
        print(f"❌ Lỗi khi tạo diseases: {e}")


def create_sample_diagnoses():
    """Tạo sample diagnoses để test."""
    print("\n🧪 Đang tạo sample diagnoses...")
    
    # User ID mẫu (thay bằng UID thật nếu có)
    sample_user_id = "eEFeBhhDxPesbvxzybGQh1guG7n1"
    
    samples = [
        {
            'userId': sample_user_id,
            'diseaseKey': 'rust',
            'diseaseName': 'Coffee Rust (Gỉ sắt)',
            'diseaseNameVi': 'Bệnh gỉ sắt',
            'confidence': 0.92,
            'severity': 'high',
            'color': '#FF5722',
            'description': 'Bệnh gỉ sắt do nấm Hemileia vastatrix.',
            'treatment': 'Phun thuốc chống nấm (đồng oxychloride, mancozeb).',
            'imageUrl': 'https://example.com/sample1.jpg',
            'imageId': 'sample_img_001',
            'summary': {'Rust': 15, 'Phoma': 2},
            'detections': [],
            'diseaseIDs': ['rust', 'phoma'],
            'modelVersion': 'best.pt',
            'processingTime': 1.23,
            'createdAt': datetime.utcnow(),
        },
        {
            'userId': sample_user_id,
            'diseaseKey': 'healthy',
            'diseaseName': 'Healthy (Khỏe mạnh)',
            'diseaseNameVi': 'Lá khỏe mạnh',
            'confidence': 0.98,
            'severity': 'none',
            'color': '#4CAF50',
            'description': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh.',
            'treatment': 'Tiếp tục chăm sóc bình thường.',
            'imageUrl': 'https://example.com/sample2.jpg',
            'imageId': 'sample_img_002',
            'summary': {},
            'detections': [],
            'diseaseIDs': [],
            'modelVersion': 'best.pt',
            'processingTime': 0.87,
            'createdAt': datetime.utcnow(),
        },
    ]
    
    try:
        for sample in samples:
            db.collection('diagnoses').add(sample)
        print(f"✅ Đã tạo {len(samples)} sample diagnoses")
    except Exception as e:
        print(f"❌ Lỗi khi tạo sample diagnoses: {e}")


def main():
    print("=" * 60)
    print("🔄 RESET FIRESTORE — XÓA HISTORY, CHỈ GIỮ DIAGNOSES")
    print("=" * 60)
    print("\n⚠️  CẢNH BÁO: Script này sẽ XÓA DỮ LIỆU!")
    print("   - Xóa toàn bộ collection 'history'")
    print("   - Xóa toàn bộ collection 'diagnoses' cũ")
    print("   - Tạo lại collection 'diseases'")
    print("   - Tạo sample data mới")
    
    confirm = input("\n❓ Bạn có chắc chắn muốn tiếp tục? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("\n❌ Đã hủy.")
        return
    
    # Bước 1: Xóa collection history
    delete_collection('history')
    
    # Bước 2: Xóa collection diagnoses cũ
    delete_collection('diagnoses')
    
    # Bước 3: Xóa và tạo lại diseases
    delete_collection('diseases')
    create_diseases_collection()
    
    # Bước 4: Tạo sample diagnoses
    create_sample_diagnoses()
    
    print("\n" + "=" * 60)
    print("✅ HOÀN TẤT RESET FIRESTORE!")
    print("=" * 60)
    print("\n📌 Các collection hiện tại:")
    print("   - diseases: Danh sách bệnh được hỗ trợ")
    print("   - diagnoses: Lịch sử chẩn đoán (gộp cả metadata)")
    print("   - images: Metadata ảnh từ Cloudinary")
    print("\n📌 Collection đã xóa:")
    print("   - history: Đã gộp vào diagnoses")
    print("\n🚀 Bạn có thể chạy backend và test API ngay!")


if __name__ == '__main__':
    main()
