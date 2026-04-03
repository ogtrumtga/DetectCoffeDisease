"""
Test script for API endpoints.
Run: python backend/test_api.py
"""
import requests
import json

import os
import sys

# Ensure "backend" package is importable when running: python backend/test_api.py
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.repositories import firebase_auth_repository as auth_repo

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_register():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    # Use a unique email each run to avoid "email already in use" errors.
    import time
    unique_email = f"test_{int(time.time())}@example.com"
    data = {
        "email": unique_email,
        "password": "password123",
        "displayName": "Test User"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        body = response.json()
        # Current backend register returns user info (no idToken).
        token = body.get("idToken")
        if token:
            return token

        user = body.get("user") or {}
        uid = user.get("uid")
        if not uid:
            return None

        # Try generating a Firebase custom token to use as Bearer for protected endpoints.
        # If the backend strictly requires ID tokens, these calls may still fail (401/403).
        return auth_repo.firebase_generate_custom_token(uid)
    return None

def test_history_api(token):
    """Test history endpoints"""
    print("\n=== Testing History API ===")
    
    # Create history
    print("\n1. Creating history entry...")
    data = {
        "imageId": "img_test_001",
        "predictions": {
            "disease": "rust",
            "confidence": 0.95
        }
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/history", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    
    # Get history list
    print("\n2. Getting history list...")
    response = requests.get(f"{BASE_URL}/api/history?page=1", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_community_api(token):
    """Test community endpoints"""
    print("\n=== Testing Community API ===")
    
    # Create post
    print("\n1. Creating post...")
    data = {
        "title": "Test Post",
        "content": "This is a test post about coffee diseases",
        "tags": ["test", "coffee"]
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/community/posts", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Get posts
    print("\n2. Getting posts...")
    response = requests.get(f"{BASE_URL}/api/community/posts?page=1&limit=10")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def main():
    print("Starting API Tests...")
    
    # Test health
    if not test_health():
        print("Health check failed!")
        return
    
    # Test register and get token
    token = test_register()
    if not token:
        print("Registration failed!")
        return
    
    print(f"\nGot token: {token[:50]}...")
    
    # Test APIs
    test_history_api(token)
    test_community_api(token)
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()
