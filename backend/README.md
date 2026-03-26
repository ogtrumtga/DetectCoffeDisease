# Backend API - Coffee Disease Detection

Backend API sử dụng FastAPI và Firebase Admin SDK.

## Cài đặt

### 1. Cài đặt Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Firebase Admin SDK

Bạn cần tải Service Account Key từ Firebase Console:

1. Vào Firebase Console: https://console.firebase.google.com
2. Chọn project "coffe-detect"
3. Vào Settings (⚙️) → Project settings → Service accounts
4. Click "Generate new private key"
5. Lưu file JSON vào `backend/serviceAccountKey.json`

### 3. Cập nhật config.py

Mở file `backend/config.py` và sửa dòng:

```python
# Thay đổi từ:
cred = credentials.ApplicationDefault()

# Thành:
cred = credentials.Certificate("backend/serviceAccountKey.json")
```

## Chạy server

### Development mode

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Hoặc:

```bash
python backend/main.py
```

Server sẽ chạy tại: http://localhost:8000

## API Documentation

Sau khi chạy server, truy cập:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /auth/register` - Đăng ký user mới
- `POST /auth/verify-token` - Xác thực token
- `POST /auth/logout` - Logout user

### User Profile

- `GET /user/profile?user_id={uid}` - Lấy profile
- `PUT /user/profile?user_id={uid}` - Cập nhật profile
- `PUT /user/avatar?user_id={uid}` - Cập nhật avatar
- `DELETE /user/account?user_id={uid}` - Xóa tài khoản

## Cấu trúc thư mục

```
backend/
├── api/              # API endpoints (FastAPI routers)
├── services/         # Business logic
├── repositories/     # Firebase operations
├── models/           # Data models (Pydantic)
├── config.py         # Firebase config
├── main.py           # FastAPI app entry point
└── requirements.txt  # Python dependencies
```

## Testing với curl

### Register user

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### Get profile

```bash
curl http://localhost:8000/user/profile?user_id=USER_ID_HERE
```
