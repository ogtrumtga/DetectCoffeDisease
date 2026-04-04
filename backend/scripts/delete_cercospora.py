"""
Script xóa bệnh 'cercospora' khỏi Firestore.
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db

def delete_cercospora():
    print("\n🗑️  Đang xóa bệnh 'cercospora' khỏi Firebase...")
    
    try:
        # Xóa document 'cercospora' trong collection 'diseases'
        db.collection('diseases').document('cercospora').delete()
        print("  ✅ Đã xóa thành công bệnh 'cercospora' khỏi Firestore!")
        
        # Kiểm tra xem còn tồn tại không
        doc = db.collection('diseases').document('cercospora').get()
        if not doc.exists:
            print("  ✅ Xác nhận: Document 'cercospora' đã không còn tồn tại")
        else:
            print("  ⚠️  Cảnh báo: Document vẫn còn tồn tại")
            
    except Exception as e:
        print(f"  ❌ Lỗi khi xóa: {e}")
        return False
    
    print("\n✨ Hoàn thành!")
    return True

if __name__ == '__main__':
    delete_cercospora()
