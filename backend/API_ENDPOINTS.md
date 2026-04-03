# 📡 API ENDPOINTS - COFFEE DISEASE DETECTION

## 🔐 Authentication

Tất cả endpoints (trừ public) yêu cầu Bearer token trong header:
```
Authorization: Bearer <idToken>
```

---

## 📋 DANH SÁCH API

### 1. AUTHENTICATION (`/auth`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký user mới | ❌ |
| POST | `/auth/verify-token` | Xác thực ID token | ❌ |
| POST | `/auth/logout` | Logout user | ❌ |

---

### 2. USER PROFILE (`/user`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/user/profile?user_id={uid}` | Lấy profile | ❌ |
| PUT | `/user/profile?user_id={uid}` | Cập nhật profile | ✅ |
| PUT | `/user/avatar?user_id={uid}` | Cập nhật avatar | ✅ |
| DELETE | `/user/account?user_id={uid}` | Xóa tài khoản | ✅ |

---

### 3. HISTORY (`/api/history`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/history` | Danh sách lịch sử chẩn đoán | ✅ |
| GET | `/api/history/{id}` | Chi tiết lịch sử | ✅ |
| POST | `/api/history` | Tạo bản ghi lịch sử | ✅ |
| DELETE | `/api/history/{id}` | Xóa một bản ghi | ✅ |
| DELETE | `/api/history` | Xóa toàn bộ lịch sử | ✅ |

**Query params**:
- `page` (default: 1)
- `limit` (default: 10)

**Request body (POST)**:
```json
{
  "imageId": "img_001",
  "predictions": {
    "disease": "rust",
    "confidence": 0.95
  }
}
```

---

### 4. DIAGNOSIS (`/api/diagnosis`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/diagnosis/upload-image` | Upload ảnh và lưu metadata vào `images` | ❌ |
| POST | `/api/diagnosis/predict` | Dự đoán bệnh từ `imageId` (YOLO `version1.pt`) | ✅ |
| GET | `/api/diagnosis/diseases/{id}` | Lấy thông tin bệnh theo id | ❌ |
| GET | `/api/diagnosis/{id}` | Lấy chi tiết kết quả theo `inferenceId` | ✅ |

**Request body (POST /api/diagnosis/predict)**:
```json
{
  "imageId": "<id trong collection images>"
}
```

**Response (POST /api/diagnosis/predict)**:
```json
{
  "inferenceId": "history_or_diagnosis_id",
  "imageId": "abc123",
  "summary": {
    "Rust": 40,
    "Phoma": 1
  },
  "diseaseID": ["Rust", "Phoma"],
  "totalDetections": 41,
  "imgSize": 640
}
```

---

### 5. COMMUNITY (`/api/community`)

#### Posts

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/community/posts` | Danh sách bài đăng | ❌ (optional) |
| POST | `/api/community/posts` | Tạo bài đăng mới | ✅ |
| GET | `/api/community/posts/{id}` | Chi tiết bài đăng | ❌ (optional) |
| DELETE | `/api/community/posts/{id}` | Xóa bài đăng | ✅ |
| GET | `/api/community/posts/search?q=...` | Tìm kiếm bài đăng | ❌ |

**Query params (GET list)**:
- `page` (default: 1)
- `limit` (default: 20)

**Request body (POST)**:
```json
{
  "title": "Cách phòng bệnh gỉ sắt",
  "content": "Nội dung bài viết...",
  "images": ["url1", "url2"],
  "tags": ["rust", "prevention"]
}
```

#### Likes

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/community/posts/{id}/like` | Like/Unlike bài đăng (toggle) | ✅ |

#### Comments

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/community/posts/{id}/comments` | Danh sách comment | ❌ |
| POST | `/api/community/posts/{id}/comments` | Thêm comment | ✅ |

**Request body (POST comment)**:
```json
{
  "content": "Bài viết rất hữu ích!"
}
```

---

### 6. NOTIFICATIONS (`/api/notifications`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/notifications` | Danh sách thông báo | ✅ |
| POST | `/api/notifications/{id}/read` | Đánh dấu đã đọc | ✅ |
| POST | `/api/notifications/mark-all-read` | Đánh dấu tất cả đã đọc | ✅ |

**Query params (GET)**:
- `page` (default: 1)
- `limit` (default: 50)

---

## 🔗 MỐI QUAN HỆ GIỮA CÁC API

### Workflow: Tạo bài đăng và tương tác

```
1. User đăng ký/đăng nhập
   POST /auth/register
   → Nhận idToken

2. Tạo bài đăng
   POST /api/community/posts
   Header: Authorization: Bearer <idToken>
   Body: { title, content, images, tags }
   → Nhận post_id

3. User khác like bài đăng
   POST /api/community/posts/{post_id}/like
   → Toggle like/unlike
   → Tạo notification cho tác giả (tự động)

4. User khác comment
   POST /api/community/posts/{post_id}/comments
   Body: { content }
   → Tạo notification cho tác giả (tự động)

5. Tác giả xem thông báo
   GET /api/notifications
   → Thấy ai đã like/comment

6. Đánh dấu đã đọc
   POST /api/notifications/{id}/read
```

### Workflow: Chẩn đoán bệnh và lưu lịch sử

```
1. User chụp ảnh lá cà phê
   (Frontend xử lý)

2. Gửi ảnh lên model AI
  POST /api/diagnosis/predict

3. Nhận kết quả chẩn đoán
   Response: { disease, confidence, treatment, ... }

4. Lưu vào lịch sử
   POST /api/history
   Body: { imageId, predictions: {...} }

5. Xem lại lịch sử
   GET /api/history
   → Danh sách các lần chẩn đoán

6. Xem chi tiết một lần chẩn đoán
   GET /api/history/{id}
```

---

## 📊 RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "page": 1,
  "limit": 20
}
```

---

## 🧪 TESTING

### 1. Swagger UI
```
http://localhost:8000/docs
```

### 2. cURL Examples

#### Register
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123456",
    "displayName": "Test User"
  }'
```

#### Get Posts
```bash
curl -X GET "http://localhost:8000/api/community/posts?page=1&limit=20"
```

#### Create Post (with auth)
```bash
curl -X POST http://localhost:8000/api/community/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post"
  }'
```

#### Like Post
```bash
curl -X POST http://localhost:8000/api/community/posts/{post_id}/like \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 SECURITY

### Authentication Flow
1. User đăng ký → Firebase tạo user
2. User đăng nhập → Firebase trả về idToken
3. Client gửi idToken trong header mỗi request
4. Backend verify token với Firebase Admin SDK
5. Nếu valid → cho phép truy cập

### Authorization
- Chỉ tác giả mới xóa được bài đăng/comment của mình
- Chỉ owner mới xóa được lịch sử của mình
- Notification chỉ owner mới xem được

---

## 📈 PERFORMANCE

### Denormalization
Để tránh query nhiều lần:
- `posts.likesCount` - Số lượt like (không cần count collection likes)
- `posts.commentsCount` - Số comment (không cần count collection comments)

### Caching
- Weather data được cache trong Firestore
- User profile có thể cache ở client

### Pagination
Tất cả list endpoints đều hỗ trợ phân trang với `page` và `limit`

---

## 🚀 DEPLOYMENT

### Environment Variables
```env
FIREBASE_PROJECT_ID=coffe-detect
FIREBASE_SERVICE_ACCOUNT_PATH=backend/serviceAccountKey.json
```

### Run Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Production
- Sử dụng gunicorn với uvicorn workers
- Enable HTTPS
- Rate limiting
- CORS configuration
