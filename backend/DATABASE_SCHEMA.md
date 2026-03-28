# 📊 FIRESTORE DATABASE SCHEMA - COFFEE DISEASE DETECTION

## 🎯 TỔNG QUAN HỆ THỐNG

Hệ thống sử dụng 7 collections chính với các mối quan hệ sau:

```
users (1) ──────┬─────── (n) posts
                │
                ├─────── (n) comments
                │
                ├─────── (n) likes
                │
                ├─────── (n) diagnoses
                │
                └─────── (n) notifications

posts (1) ──────┬─────── (n) comments
                │
                └─────── (n) likes

weather_cache (độc lập, không có quan hệ)
```

---

## 📦 CHI TIẾT CÁC COLLECTIONS

### 1. COLLECTION: `users`
**Mục đích**: Lưu thông tin profile người dùng

**Document ID**: `{userId}` (UID từ Firebase Authentication)

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | Email người dùng |
| displayName | string | ✅ | Tên hiển thị |
| photoURL | string | ❌ | URL ảnh đại diện |
| bio | string | ❌ | Tiểu sử ngắn |
| createdAt | timestamp | ✅ | Thời gian tạo tài khoản |
| updatedAt | timestamp | ✅ | Thời gian cập nhật cuối |

**Indexes**: Không cần (query theo document ID)

---

### 2. COLLECTION: `posts`
**Mục đích**: Lưu bài đăng cộng đồng

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| authorId | string | ✅ | UID của tác giả (FK → users) |
| title | string | ✅ | Tiêu đề bài đăng |
| content | string | ✅ | Nội dung bài đăng |
| images | array | ❌ | Mảng URLs ảnh đính kèm |
| tags | array | ❌ | Mảng tags/hashtags |
| likesCount | number | ✅ | Số lượt thích (denormalized) |
| commentsCount | number | ✅ | Số bình luận (denormalized) |
| createdAt | timestamp | ✅ | Thời gian tạo |
| updatedAt | timestamp | ✅ | Thời gian cập nhật |

**Indexes cần tạo**:
- `authorId (ASC) + createdAt (DESC)` - Query bài đăng của user
- `createdAt (DESC)` - Query feed mới nhất (single-field, tự động)

**Quan hệ**:
- `authorId` → `users/{userId}`
- Có nhiều `comments` (1-n)
- Có nhiều `likes` (1-n)

---

### 3. COLLECTION: `comments`
**Mục đích**: Lưu bình luận bài đăng

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| postId | string | ✅ | ID bài đăng (FK → posts) |
| authorId | string | ✅ | UID người bình luận (FK → users) |
| content | string | ✅ | Nội dung bình luận |
| createdAt | timestamp | ✅ | Thời gian tạo |

**Indexes cần tạo**:
- `postId (ASC) + createdAt (ASC)` - Query comments của bài đăng

**Quan hệ**:
- `postId` → `posts/{postId}`
- `authorId` → `users/{userId}`

---

### 4. COLLECTION: `likes`
**Mục đích**: Lưu lượt thích bài đăng

**Document ID**: `{userId}_{postId}` (composite key)

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| postId | string | ✅ | ID bài đăng (FK → posts) |
| userId | string | ✅ | UID người thích (FK → users) |
| createdAt | timestamp | ✅ | Thời gian like |

**Indexes cần tạo**:
- `postId (ASC) + userId (ASC)` - Query likes của bài đăng

**Quan hệ**:
- `postId` → `posts/{postId}`
- `userId` → `users/{userId}`

**Lưu ý**: Document ID là composite key để đảm bảo 1 user chỉ like 1 lần

---

### 5. COLLECTION: `diagnoses`
**Mục đích**: Lưu lịch sử chẩn đoán bệnh cà phê

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người dùng (FK → users) |
| disease | string | ✅ | Tên bệnh được chẩn đoán |
| confidence | number | ✅ | Độ tin cậy (0-1) |
| description | string | ✅ | Mô tả bệnh |
| treatment | string | ✅ | Hướng dẫn điều trị |
| imageUrl | string | ✅ | URL ảnh đã chẩn đoán |
| createdAt | timestamp | ✅ | Thời gian chẩn đoán |

**Indexes cần tạo**:
- `userId (ASC) + createdAt (DESC)` - Query lịch sử của user

**Quan hệ**:
- `userId` → `users/{userId}`

---

### 6. COLLECTION: `notifications`
**Mục đích**: Lưu thông báo cho người dùng

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người nhận (FK → users) |
| type | string | ✅ | Loại thông báo (like/comment/system) |
| title | string | ✅ | Tiêu đề thông báo |
| message | string | ✅ | Nội dung thông báo |
| data | object | ❌ | Dữ liệu bổ sung (postId, etc.) |
| isRead | boolean | ✅ | Đã đọc chưa |
| createdAt | timestamp | ✅ | Thời gian tạo |

**Indexes cần tạo**:
- `userId (ASC) + isRead (ASC) + createdAt (DESC)` - Query thông báo chưa đọc

**Quan hệ**:
- `userId` → `users/{userId}`

---

### 7. COLLECTION: `weather_cache`
**Mục đích**: Cache dữ liệu thời tiết

**Document ID**: `{locationKey}` (e.g., "hanoi", "daklak")

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| locationKey | string | ✅ | Key vị trí |
| weatherData | object | ✅ | Dữ liệu thời tiết từ API |
| cachedAt | timestamp | ✅ | Thời gian cache |

**Indexes**: Không cần (query theo document ID)

**Quan hệ**: Không có (collection độc lập)

---

## 🔗 MỐI QUAN HỆ GIỮA CÁC COLLECTIONS

### Quan hệ 1-n (One-to-Many)

1. **users → posts**: 1 user có nhiều bài đăng
   - Foreign Key: `posts.authorId` → `users.{userId}`

2. **users → comments**: 1 user có nhiều bình luận
   - Foreign Key: `comments.authorId` → `users.{userId}`

3. **users → likes**: 1 user có nhiều lượt thích
   - Foreign Key: `likes.userId` → `users.{userId}`

4. **users → diagnoses**: 1 user có nhiều lịch sử chẩn đoán
   - Foreign Key: `diagnoses.userId` → `users.{userId}`

5. **users → notifications**: 1 user có nhiều thông báo
   - Foreign Key: `notifications.userId` → `users.{userId}`

6. **posts → comments**: 1 bài đăng có nhiều bình luận
   - Foreign Key: `comments.postId` → `posts.{postId}`

7. **posts → likes**: 1 bài đăng có nhiều lượt thích
   - Foreign Key: `likes.postId` → `posts.{postId}`

### Denormalization (Tối ưu hiệu suất)

Để tránh query nhiều lần, một số dữ liệu được denormalize:

- `posts.likesCount`: Số lượt thích (thay vì count collection likes)
- `posts.commentsCount`: Số bình luận (thay vì count collection comments)

**Cách cập nhật**:
```python
# Khi thêm like
firebase_like_repository.add_like(post_id, user_id)
firebase_post_repository.increment_likes_count(post_id, 1)

# Khi xóa like
firebase_like_repository.remove_like(post_id, user_id)
firebase_post_repository.increment_likes_count(post_id, -1)
```

---

## 📈 FIRESTORE INDEXES

Các composite indexes cần tạo (xem file `firestore.indexes.json`):

1. **posts**: `authorId + createdAt`
2. **comments**: `postId + createdAt`
3. **likes**: `postId + userId`
4. **diagnoses**: `userId + createdAt`
5. **notifications**: `userId + isRead + createdAt`

---

## 🔒 SECURITY RULES

Xem file `backend/firestore.rules` để biết chi tiết security rules.

**Tóm tắt**:
- `users`: Public read, owner write
- `posts`: Public read, authenticated create, owner update/delete
- `comments`: Public read, authenticated create, owner delete
- `likes`: Public read, authenticated write
- `diagnoses`: Owner read/delete only, backend create
- `notifications`: Owner read/update/delete, backend create
- `weather_cache`: Public read, backend write only
