"""
Test Auth API endpoints với mock data.
Kiểm tra response format và error handling.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Mock Firebase trước khi import
sys.modules['firebase_admin'] = MagicMock()
sys.modules['firebase_admin.credentials'] = MagicMock()
sys.modules['firebase_admin.firestore'] = MagicMock()
sys.modules['firebase_admin.auth'] = MagicMock()

# Mock config
with patch('backend.config.db'), \
     patch('backend.config.auth_client'):
    from backend.main import app

client = TestClient(app)


def test_register_api():
    """Test POST /api/auth/register"""
    print("\n" + "=" * 60)
    print("🧪 TEST: POST /api/auth/register")
    print("=" * 60)
    
    # Mock service response
    with patch('backend.services.auth_service.register_user_service') as mock_register:
        mock_register.return_value = {
            'success': True,
            'user': {
                'uid': 'test-user-123',
                'email': 'test@example.com',
                'displayName': 'Test User'
            },
            'tokens': {
                'customToken': 'mock-custom-token',
                'idToken': None
            },
            'userProfile': {
                'displayName': 'Test User',
                'email': 'test@example.com'
            }
        }
        
        response = client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "password": "password123",
                "name": "Test User"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert 'userId' in data
        assert 'tokens' in data
        assert 'user' in data
        assert data['success'] == True
        print("✅ PASS: Register API trả về userId, tokens và user")
        return True


def test_login_api():
    """Test POST /api/auth/login"""
    print("\n" + "=" * 60)
    print("🧪 TEST: POST /api/auth/login")
    print("=" * 60)
    
    with patch('backend.services.auth_service.login_user_service') as mock_login:
        mock_login.return_value = {
            'success': True,
            'tokens': {
                'customToken': 'mock-custom-token',
                'idToken': None
            },
            'user': {
                'userId': 'test-user-123',
                'email': 'test@example.com',
                'name': 'Test User'
            }
        }
        
        response = client.post(
            "/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert 'tokens' in data
        assert 'user' in data
        assert data['success'] == True
        print("✅ PASS: Login API hoạt động đúng")
        return True


def test_logout_api():
    """Test POST /api/auth/logout"""
    print("\n" + "=" * 60)
    print("🧪 TEST: POST /api/auth/logout")
    print("=" * 60)
    
    # Mock verify token
    with patch('backend.repositories.firebase_auth_repository.firebase_verify_id_token') as mock_verify, \
         patch('backend.services.auth_service.logout_user_service') as mock_logout:
        
        mock_verify.return_value = {'uid': 'test-user-123'}
        mock_logout.return_value = {
            'success': True,
            'message': 'User logged out successfully'
        }
        
        response = client.post(
            "/auth/logout",
            headers={"Authorization": "Bearer mock-token"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        assert data['success'] == True
        print("✅ PASS: Logout API hoạt động đúng")
        return True


def test_logout_without_token():
    """Test POST /api/auth/logout without token"""
    print("\n" + "=" * 60)
    print("🧪 TEST: POST /api/auth/logout (No Token)")
    print("=" * 60)
    
    response = client.post("/auth/logout")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 401
    print("✅ PASS: Logout API reject request không có token")
    return True


def test_refresh_api():
    """Test POST /api/auth/refresh"""
    print("\n" + "=" * 60)
    print("🧪 TEST: POST /api/auth/refresh")
    print("=" * 60)
    
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "mock-refresh-token"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # API này trả về message về Firebase SDK limitation
    assert response.status_code == 200
    data = response.json()
    assert 'message' in data
    print("✅ PASS: Refresh API trả về response đúng")
    return True


def test_me_api():
    """Test GET /api/auth/me"""
    print("\n" + "=" * 60)
    print("🧪 TEST: GET /api/auth/me")
    print("=" * 60)
    
    with patch('backend.repositories.firebase_auth_repository.firebase_verify_id_token') as mock_verify, \
         patch('backend.services.auth_service.get_current_user_service') as mock_get_user:
        
        mock_verify.return_value = {'uid': 'test-user-123'}
        mock_get_user.return_value = {
            'success': True,
            'user': {
                'userId': 'test-user-123',
                'email': 'test@example.com',
                'name': 'Test User'
            }
        }
        
        response = client.get(
            "/auth/me",
            headers={"Authorization": "Bearer mock-token"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert 'userId' in data
        assert 'email' in data
        assert 'name' in data
        assert data['success'] == True
        print("✅ PASS: Me API hoạt động đúng")
        return True


def test_me_without_token():
    """Test GET /api/auth/me without token"""
    print("\n" + "=" * 60)
    print("🧪 TEST: GET /api/auth/me (No Token)")
    print("=" * 60)
    
    response = client.get("/auth/me")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 401
    print("✅ PASS: Me API reject request không có token")
    return True


if __name__ == "__main__":
    print("\n🚀 BẮT ĐẦU TEST AUTH API ENDPOINTS\n")
    
    tests = [
        ("Register API", test_register_api),
        ("Login API", test_login_api),
        ("Logout API", test_logout_api),
        ("Logout No Token", test_logout_without_token),
        ("Refresh API", test_refresh_api),
        ("Me API", test_me_api),
        ("Me No Token", test_me_without_token),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ FAIL: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("📊 KẾT QUẢ TỔNG HỢP")
    print("=" * 60)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:10} {name}")
    
    print("=" * 60)
    
    all_pass = all(result for _, result in results)
    if all_pass:
        print("\n🎉 TẤT CẢ TESTS ĐỀU PASS!")
        sys.exit(0)
    else:
        print("\n⚠️  CÓ TESTS FAIL!")
        sys.exit(1)
