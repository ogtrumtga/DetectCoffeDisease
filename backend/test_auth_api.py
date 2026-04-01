"""
Test script for Auth API endpoints.
Kiểm tra cấu trúc và logic của các API auth.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def test_api_structure():
    """Test cấu trúc của auth API."""
    print("=" * 60)
    print("🧪 TESTING AUTH API STRUCTURE")
    print("=" * 60)
    
    try:
        from backend.api import auth_api
        print("✅ Import auth_api thành công")
        
        # Kiểm tra router
        router = auth_api.router
        print(f"✅ Router prefix: {router.prefix}")
        print(f"✅ Router tags: {router.tags}")
        
        # Lấy danh sách routes
        routes = []
        for route in router.routes:
            method = list(route.methods)[0] if hasattr(route, 'methods') else 'N/A'
            path = route.path
            name = route.name
            routes.append((method, path, name))
        
        print(f"\n📋 Tìm thấy {len(routes)} endpoints:\n")
        
        expected_apis = {
            'POST /auth/register': False,
            'POST /auth/login': False,
            'POST /auth/logout': False,
            'POST /auth/refresh': False,
            'GET /auth/me': False,
        }
        
        for method, path, name in routes:
            route_key = f"{method} {path}"
            print(f"  {method:6} {path:20} → {name}")
            
            # Check expected APIs
            for expected in expected_apis:
                if expected in route_key:
                    expected_apis[expected] = True
        
        print("\n" + "=" * 60)
        print("📊 KIỂM TRA CÁC API YÊU CẦU:")
        print("=" * 60)
        
        all_found = True
        for api, found in expected_apis.items():
            status = "✅" if found else "❌"
            print(f"{status} {api}")
            if not found:
                all_found = False
        
        print("\n" + "=" * 60)
        if all_found:
            print("✅ TẤT CẢ API ĐÃ ĐƯỢC IMPLEMENT!")
        else:
            print("⚠️  CÓ API CHƯA ĐƯỢC IMPLEMENT!")
        print("=" * 60)
        
        return all_found
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_request_models():
    """Test các request models."""
    print("\n" + "=" * 60)
    print("🧪 TESTING REQUEST MODELS")
    print("=" * 60)
    
    try:
        from backend.api.auth_api import (
            RegisterRequest,
            LoginRequest,
            RefreshTokenRequest
        )
        
        # Test RegisterRequest
        print("\n1️⃣  RegisterRequest:")
        reg = RegisterRequest(email="test@example.com", password="123456", name="Test User")
        print(f"   ✅ email: {reg.email}")
        print(f"   ✅ password: {reg.password}")
        print(f"   ✅ name: {reg.name}")
        
        # Test LoginRequest
        print("\n2️⃣  LoginRequest:")
        login = LoginRequest(email="test@example.com", password="123456")
        print(f"   ✅ email: {login.email}")
        print(f"   ✅ password: {login.password}")
        
        # Test RefreshTokenRequest
        print("\n3️⃣  RefreshTokenRequest:")
        refresh = RefreshTokenRequest(refresh_token="dummy_token")
        print(f"   ✅ refresh_token: {refresh.refresh_token}")
        
        print("\n✅ Tất cả request models hoạt động tốt!")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_service_functions():
    """Test các service functions có tồn tại không."""
    print("\n" + "=" * 60)
    print("🧪 TESTING SERVICE FUNCTIONS")
    print("=" * 60)
    
    try:
        from backend.services import auth_service
        
        required_functions = [
            'register_user_service',
            'login_user_service',
            'logout_user_service',
            'get_current_user_service',
            'verify_token_service'
        ]
        
        all_exist = True
        for func_name in required_functions:
            if hasattr(auth_service, func_name):
                print(f"✅ {func_name}")
            else:
                print(f"❌ {func_name} - KHÔNG TÌM THẤY!")
                all_exist = False
        
        if all_exist:
            print("\n✅ Tất cả service functions đã được implement!")
        else:
            print("\n⚠️  Có service functions chưa được implement!")
        
        return all_exist
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n🚀 BẮT ĐẦU KIỂM TRA AUTH API\n")
    
    result1 = test_api_structure()
    result2 = test_request_models()
    result3 = test_service_functions()
    
    print("\n" + "=" * 60)
    print("📊 KẾT QUẢ TỔNG HỢP")
    print("=" * 60)
    print(f"API Structure:      {'✅ PASS' if result1 else '❌ FAIL'}")
    print(f"Request Models:     {'✅ PASS' if result2 else '❌ FAIL'}")
    print(f"Service Functions:  {'✅ PASS' if result3 else '❌ FAIL'}")
    print("=" * 60)
    
    if result1 and result2 and result3:
        print("\n🎉 TẤT CẢ TESTS ĐỀU PASS!")
        sys.exit(0)
    else:
        print("\n⚠️  CÓ TESTS FAIL!")
        sys.exit(1)
