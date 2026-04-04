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

### 3. DIAGNOSIS (`/api/diagnosis`)

⚠️ **LƯU Ý**: Collection `history` đã được GỘP vào `diagnoses`. Tất cả API lịch sử giờ nằm trong `/api/diagnosis`.

#### Upload & Predict

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/diagnosis/upload-image` | Upload ảnh lên Cloudinary | ❌ |
| POST | `/api/diagnosis/predict` | Chạy YOLO (best.pt) và lưu kết quả | ✅ |

#### Lịch sử chẩn đoán (thay thế History API)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/diagnosis` | Danh sách lịch sử chẩn đoán | ✅ |
| GET | `/api/diagnosis/{id}` | Chi tiết một chẩn đoán | ✅ |
| DELETE | `/api/diagnosis/{id}` | Xóa một bản ghi | ✅ |
| DELETE | `/api/diagnosis` | Xóa toàn bộ lịch sử | ✅ |

#### Thông tin bệnh

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/diagnosis/diseases/{id}` | Lấy thông tin bệnh theo id | ❌ |
| GET | `/api/diagnosis/supported-diseases` | Danh sách bệnh hỗ trợ | ❌ |
| GET | `/api/diagnosis/statistics` | Thống kê chẩn đoán | ✅ |

**Query params (GET list)**:
- `page` (default: 1)
- `limit` (default: 10)

**Request body (POST /api/diagnosis/upload-image)**:
```json
FormData: {
  "file": <image file>
}
```

**Response (POST /api/diagnosis/upload-image)**:
```json
{
  "imageID": "img_abc123",
  "imageUrl": "https://cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

**Request body (POST /api/diagnosis/predict)**:
```json
{
  "imageId": "img_abc123",
  "imgSize": 640,
  "confThreshold": 0.25
}
```

**Response (POST /api/diagnosis/predict)**:
```json
{
  "diagnosisId": "diag_xyz789",
  "imageId": "img_abc123",
  "imageUrl": "https://cloudinary.com/...",
  "primaryDiseaseName": "Bệnh gỉ sắt",
  "diseaseKey": "rust",
  "confidence": 92.5,
  "severity": "high",
  "color": "#FF5722",
  "description": "Bệnh gỉ sắt là...",
  "treatment": "Phun thuốc...",
  "summary": {
    "healthy": 10,
    "rust": 45,
    "cercospora": 2,
    "miner": 0,
    "phoma": 1
  }
}
```

---

### 4. COMMUNITY (`/api/community`)

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

### 5. NOTIFICATIONS (`/api/notifications`)

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

### Workflow: Chẩn đoán bệnh (Flow mới - Gộp history vào diagnoses)

```
1. User chụp ảnh lá cà phê
   (Frontend xử lý camera)
   ↓
2. Upload ảnh lên Cloudinary
   POST /api/diagnosis/upload-image
   Body: FormData { file: <image> }
   → Nhận imageID
   ↓
3. Chạy YOLO predict
   POST /api/diagnosis/predict
   Body: { imageId, imgSize: 640, confThreshold: 0.25 }
   → Backend tự động:
     - Chạy YOLO (best.pt)
     - Lưu kết quả vào collection diagnoses
     - Trả về diagnosisId + kết quả đầy đủ
   ↓
4. Frontend hiển thị kết quả
   Navigate sang resultScreen với dữ liệu thật
   ↓
5. User xem lịch sử
   GET /api/diagnosis?page=1&limit=10
   → Danh sách các lần chẩn đoán (từ collection diagnoses)
   ↓
6. User xem chi tiết
   GET /api/diagnosis/{diagnosisId}
   → Chi tiết đầy đủ một lần chẩn đoán
   ↓
7. User xóa một bản ghi
   DELETE /api/diagnosis/{diagnosisId}
   ↓
8. User xóa toàn bộ lịch sử
   DELETE /api/diagnosis
```

**Lưu ý**: 
- ❌ Không còn collection `history` riêng
- ✅ Tất cả lịch sử nằm trong collection `diagnoses`
- ✅ Backend tự động lưu khi predict, không cần POST thêm

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
