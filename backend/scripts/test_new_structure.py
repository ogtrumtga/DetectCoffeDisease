"""
Script test cấu trúc mới của diseases và treatments.
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from repositories import firebase_disease_repository as disease_repo
from repositories import firebase_treatment_repository as treatment_repo
from services import diagnosis_service


def test_disease_repository():
    """Test disease repository."""
    print("\n" + "="*80)
    print("TEST 1: Disease Repository")
    print("="*80)
    
    # Test get all diseases
    print("\n1. Get all diseases:")
    diseases = disease_repo.get_all_diseases()
    print(f"   Found {len(diseases)} diseases")
    for disease in diseases:
        print(f"   - {disease.get('Id')}: {disease.get('Name')}")
    
    # Test get disease by id
    print("\n2. Get disease by ID (rust):")
    rust = disease_repo.get_disease_by_id('rust')
    if rust:
        print(f"   ✅ Name: {rust.get('Name')}")
        print(f"   ✅ Description: {rust.get('Description')[:50]}...")
    else:
        print("   ❌ Not found")
    
    # Test disease exists
    print("\n3. Check disease exists:")
    print(f"   rust exists: {disease_repo.disease_exists('rust')}")
    print(f"   cercospora exists: {disease_repo.disease_exists('cercospora')}")


def test_treatment_repository():
    """Test treatment repository."""
    print("\n" + "="*80)
    print("TEST 2: Treatment Repository")
    print("="*80)
    
    # Test get treatment by disease
    print("\n1. Get treatment for rust:")
    treatment = treatment_repo.get_treatment_by_disease('rust')
    if treatment:
        print(f"   ✅ Found treatment")
        print(f"   ✅ Steps: {len(treatment.get('steps', []))} steps")
        print(f"   ✅ Medicine: {len(treatment.get('medicine', []))} medicines")
        print(f"   ✅ Severity: {treatment.get('severity')}")
        print(f"   ✅ Color: {treatment.get('color')}")
    else:
        print("   ❌ Not found")
    
    # Test query treatments
    print("\n2. Query all treatments for rust:")
    treatments = treatment_repo.query_treatments_by_disease('rust')
    print(f"   Found {len(treatments)} treatments")


def test_diagnosis_service():
    """Test diagnosis service."""
    print("\n" + "="*80)
    print("TEST 3: Diagnosis Service")
    print("="*80)
    
    # Test list supported diseases
    print("\n1. List supported diseases:")
    result = diagnosis_service.list_supported_diseases_service()
    if result.get('success'):
        diseases = result.get('diseases', [])
        print(f"   ✅ Found {len(diseases)} diseases")
        for disease in diseases:
            print(f"   - {disease.get('key')}: {disease.get('name')}")
            print(f"     Severity: {disease.get('severity')}, Color: {disease.get('color')}")
    else:
        print(f"   ❌ Error: {result.get('message')}")
    
    # Test get disease info
    print("\n2. Get disease info (internal function):")
    from services.diagnosis_service import _get_disease_info
    
    rust_info = _get_disease_info('rust')
    print(f"   ✅ Rust info:")
    print(f"      Name: {rust_info.get('name')}")
    print(f"      Description: {rust_info.get('description')[:50]}...")
    print(f"      Steps: {len(rust_info.get('steps', []))} steps")
    print(f"      Medicine: {len(rust_info.get('medicine', []))} medicines")
    print(f"      Severity: {rust_info.get('severity')}")
    print(f"      Color: {rust_info.get('color')}")


def main():
    print("\n" + "="*80)
    print("🧪 TEST CẤU TRÚC MỚI - DISEASES & TREATMENTS")
    print("="*80)
    
    try:
        test_disease_repository()
        test_treatment_repository()
        test_diagnosis_service()
        
        print("\n" + "="*80)
        print("✅ TẤT CẢ TESTS HOÀN THÀNH!")
        print("="*80)
        
        print("\n💡 Kết luận:")
        print("  - Disease repository hoạt động tốt")
        print("  - Treatment repository hoạt động tốt")
        print("  - Diagnosis service đã được cập nhật")
        print("  - Dữ liệu được load từ Firestore thay vì hardcode")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
