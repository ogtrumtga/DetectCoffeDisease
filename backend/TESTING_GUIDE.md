# 🧪 HƯỚNG DẪN TEST API

## 📋 Chuẩn bị

### 1. Chạy server
```bash
uvicorn backend.main:app --reload
```

Đợi thấy dòng:
```
INFO:     Application startup complete.
```

### 2. Mở Swagger UI
```
http://127.0.0.1:8000/docs
```

---

## 🔐 BƯỚC 1: Lấy Token

### 1.1. Đăng ký user mới

Click `POST /auth/register` → **Try it out** → Nhập:
```json
{
  "email": "test@gmail.com",
  "password": "123456",
  "displayName": "Test User"
}
```

Click **Execute** → Copy `idToken` trong response.

### 1.2. Authorize

Click nút **Authorize 🔓** (góc trên bên phải) → Nhập:
```
Bearer <paste_token_vào_đây>
```

Click **Authorize** → **Close**.

---

## 📝 BƯỚC 2: Test History API

### 2.1. Tạo lịch sử mới

`POST /api/history` → **Try it out** → Nhập:
```json
{
  "imageId": "img_001",
  "predictions": {
    "disease": "rust",
    "confidence": 0.95,
    "treatment": "Phun thuốc chống gỉ sắt"
  }
}
```

**Execute** → Nhận `id` trong response → Copy lại.

### 2.2. Lấy danh sách lịch sử

`GET /api/history` → **Try it out** → **Execute**

Kết quả:
```json
{
  "success": true,
  "data": [
    {
      "inferenceId": "...",
      "imageId": "img_001",
      "predictions": {...},
      "createdAt": "..."
    }
  ]
}
```

### 2.3. Lấy chi tiết

`GET /api/history/{id}` → Nhập `id` từ bước 2.1 → **Execute**

### 2.4. Xóa một bản ghi

`DELETE /api/history/{id}` → Nhập `id` → **Execute**

### 2.5. Xóa toàn bộ

`DELETE /api/history` → **Execute**

---

## 👥 BƯỚC 3: Test Community API

### 3.1. Tạo bài đăng

`POST /api/community/posts` → **Try it out** → Nhập:
```json
{
  "title": "Cách phòng bệnh gỉ sắt",
  "content": "Bệnh gỉ sắt là một trong những bệnh phổ biến...",
  "tags": ["rust", "prevention"]
}
```

**Execute** → Copy `post_id`.

### 3.2. Lấy danh sách bài đăng

`GET /api/community/posts` → **Try it out** → **Execute**

Kết quả có `author` info (manual JOIN):
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "author": {
        "id": "...",
        "displayName": "Test User",
        "photoURL": ""
      },
      "likesCount": 0,
      "commentsCount": 0,
      "isLiked": false
    }
  ]
}
```

### 3.3. Like bài đăng

`POST /api/community/posts/{post_id}/like` → Nhập `post_id` → **Execute**

Response:
```json
{
  "success": true,
  "action": "liked"
}
```

Gọi lại lần nữa → `action: "unliked"` (toggle).

### 3.4. Thêm comment

`POST /api/community/posts/{post_id}/comments` → Nhập:
```json
{
  "content": "Bài viết rất hữu ích!"
}
```

**Execute** → Nhận `comment_id`.

### 3.5. Lấy danh sách comment

`GET /api/community/posts/{post_id}/comments` → **Execute**

Kết quả có `author` info:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "content": "Bài viết rất hữu ích!",
      "author": {
        "id": "...",
        "displayName": "Test User",
        "photoURL": ""
      },
      "createdAt": "..."
    }
  ]
}
```

### 3.6. Tìm kiếm bài đăng

`GET /api/community/posts/search` → Nhập `q=gỉ sắt` → **Execute**

### 3.7. Xóa bài đăng

`DELETE /api/community/posts/{post_id}` → **Execute**

---

## 🔔 BƯỚC 4: Test Notification API

### 4.1. Lấy danh sách thông báo

`GET /api/notifications` → **Execute**

### 4.2. Đánh dấu đã đọc

`POST /api/notifications/{id}/read` → Nhập `notification_id` → **Execute**

### 4.3. Đánh dấu tất cả đã đọc

`POST /api/notifications/mark-all-read` → **Execute**

---

## ✅ CHECKLIST

### History API
- [ ] POST - Tạo lịch sử mới
- [ ] GET - Lấy danh sách (có pagination)
- [ ] GET /{id} - Lấy chi tiết
- [ ] DELETE /{id} - Xóa một bản ghi
- [ ] DELETE - Xóa toàn bộ

### Community API
- [ ] POST /posts - Tạo bài đăng
- [ ] GET /posts - Lấy danh sách (có author info)
- [ ] GET /posts/{id} - Lấy chi tiết
- [ ] DELETE /posts/{id} - Xóa bài đăng
- [ ] POST /posts/{id}/like - Like/Unlike
- [ ] POST /posts/{id}/comments - Thêm comment
- [ ] GET /posts/{id}/comments - Lấy comments (có author info)
- [ ] GET /posts/search - Tìm kiếm

### Notification API
- [ ] GET - Lấy danh sách
- [ ] POST /{id}/read - Đánh dấu đã đọc
- [ ] POST /mark-all-read - Đánh dấu tất cả

---

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra đã Authorize chưa
- Token có đúng format `Bearer <token>` không
- Token có hết hạn không (đăng ký lại)

### Lỗi 404 Not Found
- Kiểm tra `id` có đúng không
- Document có tồn tại trong Firestore không

### Lỗi 403 Forbidden
- Chỉ owner mới xóa được post/comment của mình
- Kiểm tra đang dùng đúng user không

### Response trống
- Firestore chưa có data
- Tạo data mới bằng POST endpoints

---

## 📊 Kiểm tra Firestore

Vào Firebase Console để xem data:
```
https://console.firebase.google.com/
→ Chọn project "coffe-detect"
→ Firestore Database
```

Collections cần kiểm tra:
- `users` - User profiles
- `posts` - Bài đăng
- `comments` - Bình luận
- `likes` - Lượt thích
- `history` - Lịch sử chẩn đoán
- `notifications` - Thông báo

---

## 🎯 Test Scenarios

### Scenario 1: User tạo bài đăng và nhận tương tác
1. User A đăng ký → Lấy token A
2. User A tạo bài đăng → Nhận post_id
3. User B đăng ký → Lấy token B
4. User B like bài đăng của A
5. User B comment vào bài đăng của A
6. User A xem notifications → Thấy ai đã like/comment

### Scenario 2: User chẩn đoán bệnh
1. User đăng ký → Lấy token
2. (Giả lập) Chụp ảnh lá cà phê
3. (Giả lập) Model trả kết quả
4. Lưu vào history
5. Xem lại danh sách history
6. Xem chi tiết một lần chẩn đoán
7. Xóa lịch sử cũ

### Scenario 3: Community interaction
1. User tạo nhiều bài đăng
2. Test pagination (page=1, page=2)
3. Test search
4. Test like/unlike toggle
5. Test delete post → Comments và likes cũng bị xóa (cascading)
