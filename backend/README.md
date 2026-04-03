# Backend API - Coffee Disease Detection

Backend API sử dụng FastAPI và Firebase Admin SDK.

## 📋 Tổng quan

- **Framework**: FastAPI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Language**: Python 3.14

## 🚀 Cài đặt

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

### 3. Cài thêm email-validator

```bash
pip install "pydantic[email]"
```

## 🏃 Chạy server

### Development mode

```bash
uvicorn backend.main:app --reload
```

Server sẽ chạy tại: http://localhost:8000

## 📚 API Documentation

Sau khi chạy server, truy cập:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Chi tiết API**: Xem file `API_ENDPOINTS.md`

## 📦 Cấu trúc API

### ✅ Đã hoàn thành

1. **Authentication** (`/auth`)
   - Register, verify token, logout

2. **User Profile** (`/user`)
   - Get/update profile, avatar, delete account

3. **History** (`/api/history`)
   - CRUD lịch sử chẩn đoán bệnh
   - Pagination support

4. **Community** (`/api/community`)
   - Posts: CRUD, search
   - Likes: Toggle like/unlike
   - Comments: Add, list
   - Manual JOIN với users collection

5. **Notifications** (`/api/notifications`)
   - List, mark as read, mark all read

### 🔨 Chưa implement

- **Diagnosis** (`/api/diagnosis`) - AI model integration
- **Weather** (`/api/weather`) - Weather API integration

## 🗂️ Cấu trúc thư mục

```
backend/
├── api/                    # API endpoints (FastAPI routers)
│   ├── auth_api.py        ✅ Authentication
│   ├── user_api.py        ✅ User profile
│   ├── history_api.py     ✅ History CRUD
│   ├── community_api.py   ✅ Posts, likes, comments
│   ├── notification_api.py ✅ Notifications
│   ├── diagnosis_api.py   ❌ Chưa implement
│   └── weather_api.py     ❌ Chưa implement
│
├── services/              # Business logic
│   ├── auth_service.py
│   ├── user_service.py
│   ├── history_service.py
│   ├── community_service.py
│   └── notification_service.py
│
├── repositories/          # Firebase operations
│   ├── firebase_auth_repository.py
│   ├── firebase_user_repository.py
│   ├── firebase_history_repository.py
│   ├── firebase_post_repository.py
│   ├── firebase_comment_repository.py
│   ├── firebase_like_repository.py
│   └── firebase_notification_repository.py
│
├── config.py             # Firebase config
├── main.py               # FastAPI app entry point
├── requirements.txt      # Python dependencies
├── DATABASE_SCHEMA.md    # Database schema documentation
├── API_ENDPOINTS.md      # API documentation
└── test_api.py          # API test script
```

## 🧪 Testing

### 1. Swagger UI (Recommended)
```
http://localhost:8000/docs
```

### 2. Test Script
```bash
python backend/test_api.py
```

### 3. cURL
Xem examples trong `API_ENDPOINTS.md`

## 🔗 Mối quan hệ Database

Firestore không có JOIN, mối quan hệ được xử lý thủ công trong code:

```
users (1) ──────┬─────── (n) posts
                ├─────── (n) comments
                ├─────── (n) likes
                ├─────── (n) history
                └─────── (n) notifications

posts (1) ──────┬─────── (n) comments
                └─────── (n) likes
```

Chi tiết xem `DATABASE_SCHEMA.md`

## 🔒 Security

- Bearer token authentication
- Firebase Admin SDK verification
- Ownership checks (user chỉ xóa được data của mình)
- CORS middleware configured

## 📈 Performance Optimizations

- **Denormalization**: `likesCount`, `commentsCount` trong posts
- **Pagination**: Tất cả list endpoints
- **Batch queries**: Lấy nhiều users cùng lúc khi JOIN
- **Indexes**: Composite indexes cho queries phức tạp

## 🐛 Troubleshooting

### Lỗi: `No module named 'fastapi'`
```bash
pip install -r backend/requirements.txt
```

### Lỗi: `email-validator is not installed`
```bash
pip install "pydantic[email]"
```

### Lỗi: `serviceAccountKey.json not found`
- Tải file từ Firebase Console
- Đặt vào `backend/serviceAccountKey.json`

### Server không chạy được
```bash
# Kiểm tra port 8000 có bị chiếm không
netstat -ano | findstr :8000

# Chạy trên port khác
uvicorn backend.main:app --reload --port 8001
```

## 📝 Notes

- Python 3.14 yêu cầu pydantic >= 2.10.0
- Firestore queries có giới hạn 100 documents/query
- Search posts dùng simple text matching (production nên dùng Algolia)
- Notification tự động chưa implement (cần webhook/trigger)
