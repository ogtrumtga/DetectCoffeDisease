# 🔥 HƯỚNG DẪN TẠO FIRESTORE DATABASE CHO DỰ ÁN

## 📋 TỔNG QUAN

Dự án Coffee Disease Detection sử dụng Firebase Firestore với 7 collections:

1. **users** - Thông tin người dùng
2. **posts** - Bài đăng cộng đồng  
3. **comments** - Bình luận bài đăng
4. **likes** - Lượt thích bài đăng
5. **diagnoses** - Lịch sử chẩn đoán bệnh
6. **notifications** - Thông báo
7. **weather_cache** - Cache dữ liệu thời tiết

---

## 🚀 CÁCH CHẠY ĐỂ TẠO CÁC BẢNG TRÊN FIREBASE

### ✅ BƯỚC 1: Chuẩn bị Firebase

1. Đảm bảo đã có file `backend/serviceAccountKey.json`
2. Kiểm tra kết nối:

```bash
cd backend
python -c "from config import db; print('✅ OK!')"
```

### ✅ BƯỚC 2: Chạy script tạo collections

```bash
cd backend
python scripts/create_firestore_structure.py
```

**Kết quả**: 7 collections sẽ được tạo tự động trên Firebase!

### ✅ BƯỚC 3: Kiểm tra trên Firebase Console

1. Mở: https://console.firebase.google.com/
2. Chọn project → Firestore Database
3. Xem 7 collections đã được tạo

### ✅ BƯỚC 4: Tạo Indexes (Bắt buộc)

**Cách 1 - Tự động** (Khuyến nghị):
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:indexes
```

**Cách 2 - Thủ công**:
Vào Firebase Console → Firestore → Indexes, tạo 5 indexes:

1. **posts**: `authorId (ASC) + createdAt (DESC)`
2. **comments**: `postId (ASC) + createdAt (ASC)`
3. **likes**: `postId (ASC) + userId (ASC)`
4. **diagnoses**: `userId (ASC) + createdAt (DESC)`
5. **notifications**: `userId (ASC) + isRead (ASC) + createdAt (DESC)`

### ✅ BƯỚC 5: Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

Hoặc copy từ `backend/firestore.rules` vào Firebase Console → Rules

---

## 📊 CẤU TRÚC CÁC BẢNG

### 1. users
```
Document ID: {userId}
Fields:
  - email: string
  - displayName: string
  - photoURL: string
  - bio: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 2. posts
```
Document ID: auto-generated
Fields:
  - authorId: string (FK → users)
  - title: string
  - content: string
  - images: array
  - tags: array
  - likesCount: number
  - commentsCount: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 3. comments
```
Document ID: auto-generated
Fields:
  - postId: string (FK → posts)
  - authorId: string (FK → users)
  - content: string
  - createdAt: timestamp
```

### 4. likes
```
Document ID: {userId}_{postId}
Fields:
  - postId: string (FK → posts)
  - userId: string (FK → users)
  - createdAt: timestamp
```

### 5. diagnoses
```
Document ID: auto-generated
Fields:
  - userId: string (FK → users)
  - disease: string
  - confidence: number (0-1)
  - description: string
  - treatment: string
  - imageUrl: string
  - createdAt: timestamp
```

### 6. notifications
```
Document ID: auto-generated
Fields:
  - userId: string (FK → users)
  - type: string (like/comment/system)
  - title: string
  - message: string
  - data: object
  - isRead: boolean
  - createdAt: timestamp
```

### 7. weather_cache
```
Document ID: {locationKey}
Fields:
  - locationKey: string
  - weatherData: object
  - cachedAt: timestamp
```

---

## 🔗 MỐI QUAN HỆ GIỮA CÁC BẢNG

```
users (1) ──┬── (n) posts
            ├── (n) comments
            ├── (n) likes
            ├── (n) diagnoses
            └── (n) notifications

posts (1) ──┬── (n) comments
            └── (n) likes
```

**Giải thích**:
- 1 user có nhiều posts, comments, likes, diagnoses, notifications
- 1 post có nhiều comments và likes
- weather_cache độc lập (không có quan hệ)

---

## 💾 CÁCH DỮ LIỆU ĐƯỢC LƯU LÊN FIREBASE

### Ví dụ 1: Đăng ký user mới

```python
# 1. User đăng ký trên app
# 2. App gọi: POST /api/auth/register
# 3. Backend xử lý:

from backend.repositories import firebase_user_repository

# Tạo user trong Firebase Auth
user = firebase_auth.create_user(email, password)

# Tự động tạo document trong collection 'users'
firebase_user_repository.create_user_profile(
    user_id=user.uid,
    email=user.email,
    display_name=display_name
)

# ✅ Document được lưu vào Firestore:
# Collection: users
# Document ID: user.uid
# Data: {email, displayName, photoURL, bio, createdAt, updatedAt}
```

### Ví dụ 2: Tạo bài đăng

```python
# 1. User tạo bài đăng trên app
# 2. App gọi: POST /api/posts
# 3. Backend xử lý:

from backend.repositories import firebase_post_repository

post_data = {
    'title': 'Cách phòng bệnh gỉ sắt',
    'content': 'Nội dung bài viết...',
    'images': ['url1', 'url2'],
    'tags': ['bệnh gỉ sắt']
}

# Tự động tạo document trong collection 'posts'
post_id = firebase_post_repository.create_post(user_id, post_data)

# ✅ Document được lưu vào Firestore:
# Collection: posts
# Document ID: auto-generated
# Data: {authorId, title, content, images, tags, likesCount, commentsCount, createdAt, updatedAt}
```

### Ví dụ 3: Like bài đăng

```python
# 1. User like bài đăng
# 2. App gọi: POST /api/posts/{id}/like
# 3. Backend xử lý:

from backend.repositories import firebase_like_repository, firebase_post_repository

# Tạo document trong collection 'likes'
firebase_like_repository.add_like(post_id, user_id)

# Tăng likesCount trong collection 'posts'
firebase_post_repository.increment_likes_count(post_id, 1)

# ✅ 2 operations:
# 1. Collection 'likes': Document ID = {userId}_{postId}
# 2. Collection 'posts': Update likesCount += 1
```

### Ví dụ 4: Chẩn đoán bệnh

```python
# 1. User chụp ảnh lá cà phê
# 2. App gọi: POST /api/diagnosis/predict
# 3. Backend xử lý:

from backend.repositories import firebase_history_repository

# AI model phân tích ảnh
result = ai_model.predict(image)

diagnosis_data = {
    'disease': result['disease'],
    'confidence': result['confidence'],
    'description': 'Mô tả bệnh...',
    'treatment': 'Cách điều trị...',
    'imageUrl': 'url_to_image'
}

# Tự động tạo document trong collection 'diagnoses'
diagnosis_id = firebase_history_repository.insert_history(user_id, diagnosis_data)

# ✅ Document được lưu vào Firestore:
# Collection: diagnoses
# Document ID: auto-generated
# Data: {userId, disease, confidence, description, treatment, imageUrl, createdAt}
```

---

## 🎯 LUỒNG DỮ LIỆU TỔNG QUÁT

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────┐
│  Backend API    │
│  (FastAPI)      │
└────────┬────────┘
         │ Python Function Call
         ▼
┌─────────────────┐
│  Repository     │
│  Layer          │
└────────┬────────┘
         │ Firebase Admin SDK
         ▼
┌─────────────────┐
│  Firebase       │
│  Firestore      │
└─────────────────┘
```

**Giải thích**:
1. App gửi request đến Backend API
2. Backend gọi Repository layer
3. Repository sử dụng Firebase Admin SDK
4. Dữ liệu được lưu vào Firestore

---

## 📚 TÀI LIỆU CHI TIẾT

- **SETUP_FIRESTORE.md** - Hướng dẫn setup từng bước
- **DATABASE_SCHEMA.md** - Chi tiết cấu trúc database và mối quan hệ
- **FIREBASE_COLLECTIONS.md** - Mô tả collections và ví dụ
- **firestore.rules** - Security rules
- **firestore.indexes.json** - Indexes configuration

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Chạy script tạo collections thành công
- [ ] 7 collections xuất hiện trên Firebase Console
- [ ] 5 composite indexes đã được tạo
- [ ] Security rules đã được deploy
- [ ] Test tạo user thành công
- [ ] Test tạo post thành công

---

## 🆘 GẶP VẤN ĐỀ?

### Lỗi: "Could not reach Cloud Firestore backend"
→ Firestore chưa được enable. Vào Firebase Console → Firestore → Create Database

### Lỗi: "The query requires an index"
→ Indexes chưa được tạo. Chạy: `firebase deploy --only firestore:indexes`

### Lỗi: "Missing or insufficient permissions"
→ Security rules chưa được deploy. Chạy: `firebase deploy --only firestore:rules`

---

## 🎉 HOÀN THÀNH!

Sau khi hoàn thành, bạn có:
- ✅ 7 collections hoạt động trên Firebase
- ✅ Indexes tối ưu cho queries
- ✅ Security rules bảo mật
- ✅ Hệ thống sẵn sàng cho production
