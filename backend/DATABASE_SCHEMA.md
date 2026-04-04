# 📊 FIRESTORE DATABASE SCHEMA - COFFEE DISEASE DETECTION

## 🎯 TỔNG QUAN HỆ THỐNG

Hệ thống sử dụng 9 collections chính:

```
users (1) ──────┬─────── (n) posts
                │
                ├─────── (n) comments
                │
                ├─────── (n) likes
                │
                ├─────── (n) diagnoses  ← GỘP CẢ LỊCH SỬ
                │
                └─────── (n) notifications

posts (1) ──────┬─────── (n) comments
                │
                └─────── (n) likes

diagnoses (n) ──────── (1) diseases

images (độc lập, metadata ảnh từ Cloudinary)
feedbacks (độc lập, feedback chẩn đoán)
treatments (độc lập, hướng điều trị)
weather_cache (độc lập, cache thời tiết)
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

### 2. COLLECTION: `diagnoses` ⭐ (GỘP CẢ LỊCH SỬ)
**Mục đích**: Lưu kết quả chẩn đoán bệnh cà phê (bao gồm cả metadata lịch sử)

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người dùng (FK → users) |
| diseaseKey | string | ✅ | Key bệnh (rust, cercospora, healthy, ...) |
| diseaseName | string | ✅ | Tên bệnh tiếng Anh |
| diseaseNameVi | string | ✅ | Tên bệnh tiếng Việt |
| confidence | number | ✅ | Độ tin cậy (0-1) |
| severity | string | ✅ | Mức độ (none/medium/high) |
| color | string | ✅ | Màu hiển thị (#HEX) |
| description | string | ✅ | Mô tả bệnh |
| treatment | string | ✅ | Hướng dẫn điều trị |
| imageUrl | string | ❌ | URL ảnh đã chẩn đoán |
| imageId | string | ❌ | ID trong collection images |
| summary | object | ❌ | Tóm tắt phát hiện {'Rust': 15, 'Phoma': 2} |
| detections | array | ❌ | Chi tiết các vùng phát hiện |
| diseaseIDs | array | ❌ | Danh sách disease IDs phát hiện |
| modelVersion | string | ✅ | Phiên bản model (best.pt) |
| processingTime | number | ✅ | Thời gian xử lý (giây) |
| createdAt | timestamp | ✅ | Thời gian chẩn đoán |

**Indexes cần tạo**:
- `userId (ASC) + createdAt (DESC)` - Query lịch sử của user

**Quan hệ**:
- `userId` → `users/{userId}`
- `diseaseKey` → `diseases/{diseaseKey}` (optional)
- `imageId` → `images/{imageId}` (optional)

**Lưu ý**: Collection này GỘP cả lịch sử (history) — không còn collection history riêng.

---

### 3. COLLECTION: `diseases`
**Mục đích**: Danh sách bệnh cà phê được model hỗ trợ

**Document ID**: `{diseaseKey}` (rust, miner, phoma, healthy)

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Tên bệnh |
| description | string | ✅ | Mô tả bệnh |
| id | string | ✅ | ID của bệnh (trùng với document ID) |

**Indexes**: Không cần (query theo document ID)

**Lưu ý**: 
- Tất cả field names viết thường (name, description, id)
- Không còn lưu treatment, severity, color trong collection này
- Thông tin điều trị được tách ra collection treatments riêng

---

### 4. COLLECTION: `images`
**Mục đích**: Metadata ảnh từ Cloudinary

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người upload |
| publicID | string | ✅ | Public ID trên Cloudinary |
| imageURL | string | ✅ | URL ảnh |
| createdAt | timestamp | ✅ | Thời gian upload |

**Indexes**: Không cần

---

### 5. COLLECTION: `posts`
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

---

### 6. COLLECTION: `comments`
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

---

### 7. COLLECTION: `likes`
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

---

### 8. COLLECTION: `notifications`
**Mục đích**: Lưu thông báo cho người dùng

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người nhận (FK → users) |
| type | string | ✅ | Loại thông báo (like/comment/diagnosis_alert/system) |
| title | string | ✅ | Tiêu đề thông báo |
| message | string | ✅ | Nội dung thông báo |
| data | object | ❌ | Dữ liệu bổ sung (postId, diagnosisId, etc.) |
| isRead | boolean | ✅ | Đã đọc chưa |
| createdAt | timestamp | ✅ | Thời gian tạo |

**Indexes cần tạo**:
- `userId (ASC) + isRead (ASC) + createdAt (DESC)` - Query thông báo chưa đọc

---

### 9. COLLECTION: `feedbacks`
**Mục đích**: Feedback chẩn đoán

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | UID người feedback |
| diagnoses_id | string | ✅ | ID chẩn đoán |
| rate | number | ✅ | Đánh giá (1-5) |
| comment | string | ✅ | Nội dung feedback |
| createdAt | timestamp | ✅ | Thời gian tạo |

---

### 10. COLLECTION: `treatments`
**Mục đích**: Hướng điều trị theo bệnh (liên kết với diseases)

**Document ID**: Auto-generated

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| diseaseId | string | ✅ | ID bệnh (FK → diseases/{diseaseId}) |
| steps | array | ✅ | Các bước điều trị (array of strings) |
| medicine | array | ✅ | Danh sách thuốc (array of strings) |
| severity | string | ✅ | Mức độ nghiêm trọng (none/medium/high) |
| color | string | ✅ | Màu hiển thị (#HEX) |
| createdBy | string | ✅ | UID người tạo |
| createdAt | timestamp | ✅ | Thời gian tạo |
| updatedAt | timestamp | ✅ | Thời gian cập nhật |

**Indexes cần tạo**:
- `diseaseId (ASC)` - Query treatment theo bệnh

**Quan hệ**:
- `diseaseId` → `diseases/{diseaseId}`

**Lưu ý**:
- Mỗi disease có thể có nhiều treatments (1-n relationship)
- Treatment được tách riêng khỏi diseases để dễ quản lý và cập nhật
- Severity và color được lưu trong treatments thay vì diseases

---

### 11. COLLECTION: `weather_cache`
**Mục đích**: Cache dữ liệu thời tiết

**Document ID**: `{locationKey}` (e.g., "hanoi", "daklak")

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| locationKey | string | ✅ | Key vị trí |
| weatherData | object | ✅ | Dữ liệu thời tiết từ API |
| cachedAt | timestamp | ✅ | Thời gian cache |

---

## 🔗 MỐI QUAN HỆ GIỮA CÁC COLLECTIONS

### Quan hệ 1-n (One-to-Many)

1. **users → posts**: 1 user có nhiều bài đăng
2. **users → comments**: 1 user có nhiều bình luận
3. **users → likes**: 1 user có nhiều lượt thích
4. **users → diagnoses**: 1 user có nhiều chẩn đoán ⭐
5. **users → notifications**: 1 user có nhiều thông báo
6. **posts → comments**: 1 bài đăng có nhiều bình luận
7. **posts → likes**: 1 bài đăng có nhiều lượt thích
8. **diseases → diagnoses**: 1 bệnh có nhiều chẩn đoán
9. **diseases → treatments**: 1 bệnh có nhiều treatments (1-n)

---

## 📈 FIRESTORE INDEXES

Các composite indexes cần tạo (xem file `firestore.indexes.json`):

1. **posts**: `authorId + createdAt`
2. **comments**: `postId + createdAt`
3. **likes**: `postId + userId`
4. **diagnoses**: `userId + createdAt` ⭐
5. **notifications**: `userId + isRead + createdAt`

---

## 🔒 SECURITY RULES

Xem file `backend/firestore.rules` để biết chi tiết security rules.

**Tóm tắt**:
- `users`: Public read, owner write
- `posts`: Public read, authenticated create, owner update/delete
- `comments`: Public read, authenticated create, owner delete
- `likes`: Public read, authenticated write
- `diagnoses`: Owner read/delete, backend create ⭐
- `diseases`: Public read, backend write
- `images`: Owner read, backend write
- `notifications`: Owner read/update/delete, backend create
- `feedbacks`: Authenticated write, backend read
- `treatments`: Public read, backend write
- `weather_cache`: Public read, backend write

---

## ⚠️ THAY ĐỔI QUAN TRỌNG

### ❌ Collection `history` đã bị XÓA
Collection `history` đã được GỘP vào `diagnoses`. Tất cả metadata lịch sử giờ nằm trong `diagnoses`.

### ✅ Collection `diagnoses` mới
- Chứa đầy đủ kết quả chẩn đoán + metadata lịch sử
- Không còn cần query 2 collections riêng
- Đơn giản hóa API và data model

### 🔄 Migration
Chạy script `backend/scripts/reset_firestore_diagnoses.py` để reset Firestore.
