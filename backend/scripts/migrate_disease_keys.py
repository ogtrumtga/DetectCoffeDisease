"""
Script migrate keys của collection diseases từ uppercase sang lowercase.

Chuyển đổi:
- Name → name
- Description → description  
- Id → id

Chạy: python backend/scripts/migrate_disease_keys.py
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from config import db
    print("✅ Kết nối Firebase thành công!")
except Exception as e:
    print(f"❌ Lỗi kết nối Firebase: {e}")
    sys.exit(1)


def migrate_disease_keys():
    """Migrate keys từ uppercase sang lowercase."""
    print("\n" + "="*80)
    print("🔄 MIGRATE DISEASE KEYS: Uppercase → lowercase")
    print("="*80 + "\n")
    
    try:
        # Lấy tất cả documents trong collection diseases
        docs = db.collection('diseases').stream()
        
        count = 0
        updated = 0
        errors = 0
        
        for doc in docs:
            count += 1
            doc_id = doc.id
            data = doc.to_dict() or {}
            
            print(f"\n📄 Document: {doc_id}")
            print(f"   Current data: {data}")
            
            # Check xem có key uppercase không
            has_uppercase = any(key in data for key in ['Name', 'Description', 'Id'])
            has_lowercase = any(key in data for key in ['name', 'description', 'id'])
            
            if has_uppercase:
                # Tạo data mới với lowercase keys
                new_data = {}
                
                # Migrate Name → name
                if 'Name' in data:
                    new_data['name'] = data['Name']
                elif 'name' in data:
                    new_data['name'] = data['name']
                
                # Migrate Description → description
                if 'Description' in data:
                    new_data['description'] = data['Description']
                elif 'description' in data:
                    new_data['description'] = data['description']
                
                # Migrate Id → id
                if 'Id' in data:
                    new_data['id'] = data['Id']
                elif 'id' in data:
                    new_data['id'] = data['id']
                
                # Giữ các fields khác (nếu có)
                for key, value in data.items():
                    if key not in ['Name', 'Description', 'Id', 'name', 'description', 'id']:
                        new_data[key] = value
                
                # Update document
                try:
                    db.collection('diseases').document(doc_id).set(new_data)
                    print(f"   ✅ Updated to: {new_data}")
                    updated += 1
                except Exception as e:
                    print(f"   ❌ Error updating: {e}")
                    errors += 1
            
            elif has_lowercase:
                print(f"   ℹ️  Already using lowercase keys, skipping")
            
            else:
                print(f"   ⚠️  No recognized keys found")
        
        print("\n" + "="*80)
        print("📊 MIGRATION SUMMARY")
        print("="*80)
        print(f"\n  Total documents: {count}")
        print(f"  Updated: {updated}")
        print(f"  Errors: {errors}")
        print(f"  Skipped: {count - updated - errors}")
        
        if updated > 0:
            print("\n✅ Migration completed successfully!")
            print("\n💡 Next steps:")
            print("  1. Verify data on Firebase Console")
            print("  2. Test API endpoints")
            print("  3. Restart backend server")
        else:
            print("\nℹ️  No documents needed migration")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        return False
    
    return True


if __name__ == '__main__':
    print("\n⚠️  WARNING: This script will modify your Firestore data!")
    print("   Make sure you have a backup before proceeding.")
    
    response = input("\n   Continue? (yes/no): ").strip().lower()
    
    if response == 'yes':
        migrate_disease_keys()
    else:
        print("\n❌ Migration cancelled")
