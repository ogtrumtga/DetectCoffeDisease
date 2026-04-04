"""
Script tái cấu trúc collections diseases và treatments.

Thay đổi:
1. Collection diseases: Chỉ lưu Name, Description, Id (viết hoa chữ cái đầu)
2. Collection treatments: Liên kết với diseases qua diseaseId
3. Xóa dữ liệu cũ và tạo lại cấu trúc mới
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db
from datetime import datetime

# Dữ liệu bệnh mới (chỉ Name, Description, Id)
DISEASES_DATA = {
    'healthy': {
        'Name': 'Healthy (Khỏe mạnh)',
        'Description': 'Lá cà phê khỏe mạnh, không có dấu hiệu bệnh.',
        'Id': 'healthy'
    },
    'rust': {
        'Name': 'Coffee Rust (Gỉ sắt)',
        'Description': 'Bệnh gỉ sắt do nấm Hemileia vastatrix. Triệu chứng: đốm vàng cam mặt dưới lá, lá rụng sớm.',
        'Id': 'rust'
    },
    'miner': {
        'Name': 'Leaf Miner (Sâu đục lá)',
        'Description': 'Sâu đục lá cà phê (Leucoptera coffeella). Triệu chứng: đường hầm uốn khúc, lá khô rụng.',
        'Id': 'miner'
    },
    'phoma': {
        'Name': 'Phoma Leaf Spot (Đốm lá Phoma)',
        'Description': 'Bệnh đốm lá do nấm Phoma. Triệu chứng: đốm nâu đen, lan rộng gây rụng lá.',
        'Id': 'phoma'
    },
}

# Dữ liệu treatments (liên kết với diseases)
TREATMENTS_DATA = {
    'healthy': {
        'diseaseId': 'healthy',
        'steps': [
            'Tiếp tục chăm sóc bình thường',
            'Bón phân định kỳ theo lịch',
            'Tưới nước đầy đủ',
            'Theo dõi sức khỏe cây thường xuyên'
        ],
        'medicine': [
            'Không cần thuốc điều trị',
            'Phân bón NPK cân bằng',
            'Phân hữu cơ vi sinh'
        ],
        'severity': 'none',
        'color': '#4CAF50'
    },
    'rust': {
        'diseaseId': 'rust',
        'steps': [
            'Phun thuốc chống nấm ngay lập tức',
            'Loại bỏ và tiêu hủy lá bệnh',
            'Cải thiện hệ thống thoát nước',
            'Tỉa cành để tăng thông thoáng',
            'Theo dõi và xử lý định kỳ'
        ],
        'medicine': [
            'Đồng oxychloride 50% WP (2-3g/lít nước)',
            'Mancozeb 80% WP (2-2.5g/lít nước)',
            'Tebuconazole 25% EC (0.5ml/lít nước)',
            'Azoxystrobin 25% SC (1ml/lít nước)'
        ],
        'severity': 'high',
        'color': '#FF5722'
    },
    'miner': {
        'diseaseId': 'miner',
        'steps': [
            'Thu gom và tiêu hủy lá bị nhiễm',
            'Phun thuốc trừ sâu sinh học',
            'Sử dụng bẫy dính màu vàng',
            'Thả thiên địch tự nhiên',
            'Kiểm tra định kỳ hàng tuần'
        ],
        'medicine': [
            'Abamectin 1.8% EC (1ml/lít nước)',
            'Bacillus thuringiensis (2-3g/lít nước)',
            'Spinosad 24% SC (0.5ml/lít nước)',
            'Neem oil (dầu neem) 5ml/lít nước'
        ],
        'severity': 'medium',
        'color': '#FFC107'
    },
    'phoma': {
        'diseaseId': 'phoma',
        'steps': [
            'Phun thuốc chống nấm chuyên dụng',
            'Loại bỏ lá bệnh và tiêu hủy',
            'Cải thiện thoát nước, tránh úng',
            'Giảm tưới nước, tránh tưới quá nhiều',
            'Tăng cường thông thoáng cho vườn'
        ],
        'medicine': [
            'Chlorothalonil 75% WP (2g/lít nước)',
            'Mancozeb 80% WP (2-2.5g/lít nước)',
            'Copper hydroxide 77% WP (2g/lít nước)',
            'Propiconazole 25% EC (1ml/lít nước)'
        ],
        'severity': 'medium',
        'color': '#795548'
    },
}


def delete_old_data():
    """Xóa dữ liệu cũ trong diseases và treatments."""
    print("\n🗑️  Xóa dữ liệu cũ...")
    
    # Xóa tất cả documents trong diseases
    try:
        docs = db.collection('diseases').stream()
        count = 0
        for doc in docs:
            doc.reference.delete()
            count += 1
        print(f"  ✅ Đã xóa {count} documents trong 'diseases'")
    except Exception as e:
        print(f"  ⚠️  Lỗi xóa diseases: {e}")
    
    # Xóa tất cả documents trong treatments
    try:
        docs = db.collection('treatments').stream()
        count = 0
        for doc in docs:
            doc.reference.delete()
            count += 1
        print(f"  ✅ Đã xóa {count} documents trong 'treatments'")
    except Exception as e:
        print(f"  ⚠️  Lỗi xóa treatments: {e}")


def create_diseases():
    """Tạo lại collection diseases với cấu trúc mới."""
    print("\n📦 Tạo collection diseases mới...")
    
    for disease_id, data in DISEASES_DATA.items():
        try:
            db.collection('diseases').document(disease_id).set(data)
            print(f"  ✅ Đã tạo disease: {disease_id} - {data['Name']}")
        except Exception as e:
            print(f"  ❌ Lỗi tạo disease {disease_id}: {e}")


def create_treatments():
    """Tạo lại collection treatments với liên kết diseaseId."""
    print("\n📦 Tạo collection treatments mới...")
    
    now = datetime.utcnow()
    admin_user_id = "system_admin"
    
    for disease_id, data in TREATMENTS_DATA.items():
        try:
            treatment_data = {
                **data,
                'createdBy': admin_user_id,
                'createdAt': now,
                'updatedAt': now
            }
            
            # Tạo document với auto-generated ID
            doc_ref = db.collection('treatments').document()
            doc_ref.set(treatment_data)
            
            print(f"  ✅ Đã tạo treatment cho: {disease_id}")
        except Exception as e:
            print(f"  ❌ Lỗi tạo treatment {disease_id}: {e}")


def verify_structure():
    """Kiểm tra cấu trúc đã tạo."""
    print("\n🔍 Kiểm tra cấu trúc...")
    
    # Kiểm tra diseases
    print("\n  📋 Diseases:")
    docs = db.collection('diseases').stream()
    for doc in docs:
        data = doc.to_dict()
        print(f"    - {doc.id}: {data.get('Name')}")
    
    # Kiểm tra treatments
    print("\n  📋 Treatments:")
    docs = db.collection('treatments').stream()
    for doc in docs:
        data = doc.to_dict()
        print(f"    - {doc.id}: diseaseId={data.get('diseaseId')}, steps={len(data.get('steps', []))}, medicine={len(data.get('medicine', []))}")


def main():
    print("\n" + "="*80)
    print("🔄 TÁI CẤU TRÚC DISEASES VÀ TREATMENTS")
    print("="*80)
    
    print("\n⚠️  Cảnh báo: Script này sẽ XÓA toàn bộ dữ liệu cũ!")
    response = input("Bạn có chắc chắn muốn tiếp tục? (yes/no): ")
    
    if response.lower() != 'yes':
        print("\n❌ Đã hủy!")
        return
    
    # Bước 1: Xóa dữ liệu cũ
    delete_old_data()
    
    # Bước 2: Tạo diseases mới
    create_diseases()
    
    # Bước 3: Tạo treatments mới
    create_treatments()
    
    # Bước 4: Kiểm tra
    verify_structure()
    
    print("\n" + "="*80)
    print("✨ HOÀN THÀNH TÁI CẤU TRÚC!")
    print("="*80)
    
    print("\n📊 Cấu trúc mới:")
    print("\n  Collection: diseases")
    print("    Fields: Name, Description, Id")
    print("    Document ID: {diseaseId} (healthy, rust, miner, phoma)")
    
    print("\n  Collection: treatments")
    print("    Fields: diseaseId, steps[], medicine[], severity, color, createdBy, createdAt, updatedAt")
    print("    Relationship: diseaseId → diseases/{diseaseId}")
    
    print("\n💡 Lưu ý:")
    print("  - Đã xóa bệnh 'cercospora' theo yêu cầu")
    print("  - Treatments giờ liên kết với diseases qua diseaseId")
    print("  - Cần cập nhật code để query từ Firestore thay vì hardcode")
    
    print("\n🔧 Các file cần cập nhật:")
    print("  1. backend/services/diagnosis_service.py")
    print("  2. backend/repositories/firebase_diagnosis_repository.py")
    print("  3. backend/DATABASE_SCHEMA.md")
    print("  4. backend/scripts/create_firestore_structure.py")
    print("\n")


if __name__ == '__main__':
    main()
