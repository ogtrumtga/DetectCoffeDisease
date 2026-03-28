"""
Script xóa các documents mẫu sau khi setup xong Firestore.
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db

def cleanup():
    print("\n🧹 Xóa documents mẫu...")
    
    collections = [
        'users', 'posts', 'comments', 'likes',
        'diagnoses', 'notifications', 'weather_cache'
    ]
    
    for collection_name in collections:
        try:
            # Xóa document _structure_sample
            db.collection(collection_name).document('_structure_sample').delete()
            print(f"  ✅ Đã xóa sample doc trong '{collection_name}'")
        except Exception as e:
            print(f"  ⚠️  Không thể xóa sample doc trong '{collection_name}': {e}")
    
    # Xóa document đặc biệt trong likes
    try:
        db.collection('likes').document('_structure_sample_likes').delete()
        print(f"  ✅ Đã xóa sample doc trong 'likes'")
    except Exception as e:
        print(f"  ⚠️  Không thể xóa sample doc trong 'likes': {e}")
    
    print("\n✨ Hoàn thành cleanup!")

if __name__ == '__main__':
    cleanup()
