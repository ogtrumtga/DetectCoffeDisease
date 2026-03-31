# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN HOÀN CHỈNH

## 📋 Tổng quan

Dự án gồm 2 phần:
- **Backend**: FastAPI + Firebase (Python)
- **Frontend**: React Native + Expo (TypeScript)

---

## 🔧 PHẦN 1: CHẠY BACKEND

### Bước 1: Mở Terminal tại thư mục gốc

```bash
cd D:\AppCF\DetectCoffeDisease
```

### Bước 2: Kiểm tra đã cài đặt dependencies chưa

```bash
pip list | findstr fastapi
```

Nếu chưa có, cài đặt:
```bash
pip install -r backend/requirements.txt
pip install "pydantic[email]"
```

### Bước 3: Chạy backend

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Bước 4: Kiểm tra backend đã chạy

Mở browser:
```
http://localhost:8000/docs
```

Thấy Swagger UI → Backend OK ✅

---

## 📱 PHẦN 2: CHẠY FRONTEND

### Bước 1: Mở Terminal mới (thứ 2)

```bash
cd D:\AppCF\DetectCoffeDisease
```

### Bước 2: Lấy IP máy tính

```bash
ipconfig
```

Tìm dòng `IPv4 Address`, ví dụ: `192.168.1.100`

### Bước 3: Cập nhật file config API

Mở file `src/config/api.ts`, sửa dòng:

```typescript
// Thay YOUR_IP bằng IP từ ipconfig
const API_BASE_URL = 'http://192.168.1.100:8000';
```

### Bước 4: Chạy Expo

```bash
npx expo start
```

### Bước 5: Chọn platform

- Nhấn `a` - Android emulator
- Nhấn `i` - iOS simulator
- Nhấn `w` - Web browser
- Quét QR code - Điện thoại thật

---

## 🗄️ PHẦN 3: SETUP FIRESTORE (Lần đầu)

### Bước 1: Tạo collections

Terminal mới (thứ 3):
```bash
cd D:\AppCF\DetectCoffeDisease
python backend/scripts/create_firestore_structure.py
```

### Bước 2: Kiểm tra trên Firebase Console

```
https://console.firebase.google.com/
→ Chọn project "coffe-detect"
→ Firestore Database
```

Phải thấy 8 collections:
1. users
2. posts
3. comments
4. likes
5. diagnoses
6. history
7. notifications
8. weather_cache

---

## ✅ KIỂM TRA KẾT NỐI

### Test 1: Backend → Firestore

Swagger UI → POST /auth/register → Tạo user mới

Kiểm tra Firebase Console → Collection `users` → Thấy user mới ✅

### Test 2: Frontend → Backend

1. Mở app trên điện thoại/emulator
2. Đăng ký tài khoản mới
3. Đăng nhập thành công ✅

### Test 3: Frontend → Backend → Firestore

1. Vào màn hình Profile
2. Tab History
3. Tạo lịch sử mới (nếu có)
4. Kiểm tra Firebase Console → Collection `history` ✅

---

## 📊 CÁC API ĐÃ SẴN SÀNG

### 1. Authentication (`/auth`)
- ✅ POST /auth/register
- ✅ POST /auth/verify-token
- ✅ POST /auth/logout

### 2. User Profile (`/user`)
- ✅ GET /user/profile
- ✅ PUT /user/profile
- ✅ PUT /user/avatar
- ✅ DELETE /user/account

### 3. History (`/api/history`)
- ✅ GET /api/history (list)
- ✅ GET /api/history/{id} (detail)
- ✅ POST /api/history (create)
- ✅ DELETE /api/history/{id}
- ✅ DELETE /api/history (clear all)

### 4. Community (`/api/community`)
- ✅ GET /api/community/posts
- ✅ POST /api/community/posts
- ✅ GET /api/community/posts/{id}
- ✅ DELETE /api/community/posts/{id}
- ✅ POST /api/community/posts/{id}/like
- ✅ GET /api/community/posts/{id}/comments
- ✅ POST /api/community/posts/{id}/comments
- ✅ GET /api/community/posts/search

### 5. Notifications (`/api/notifications`)
- ✅ GET /api/notifications
- ✅ POST /api/notifications/{id}/read
- ✅ POST /api/notifications/mark-all-read

### 6. Diagnosis (`/api/diagnosis`) **MỚI**
- ✅ POST /api/diagnosis/predict
- ✅ GET /api/diagnosis/{id}
- ✅ GET /api/diagnosis/diseases
- ✅ GET /api/diagnosis/history
- ✅ DELETE /api/diagnosis/{id}
- ✅ GET /api/diagnosis/statistics

### 7. Weather (`/api/weather`) **MỚI**
- ✅ GET /api/weather/coords
- ✅ GET /api/weather/city
- ✅ GET /api/weather/spray-time
- ✅ GET /api/weather/spray-rules

---

## 🐛 TROUBLESHOOTING

### Lỗi: `No module named 'backend'`

**Nguyên nhân**: Chạy từ thư mục sai

**Fix**:
```bash
cd D:\AppCF\DetectCoffeDisease
uvicorn backend.main:app --reload
```

### Lỗi: `Port 8000 already in use`

**Fix**:
```bash
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F

# Hoặc dùng port khác
uvicorn backend.main:app --reload --port 8001
```

### Lỗi: `Connection refused` trên app

**Nguyên nhân**: IP sai hoặc firewall block

**Fix**:
1. Kiểm tra IP đúng chưa (`ipconfig`)
2. Cập nhật `src/config/api.ts`
3. Tắt firewall tạm thời
4. Đảm bảo điện thoại và máy tính cùng WiFi

### Lỗi: `serviceAccountKey.json not found`

**Fix**:
1. Vào Firebase Console
2. Settings → Service accounts
3. Generate new private key
4. Lưu vào `backend/serviceAccountKey.json`

---

## 📝 CHECKLIST HOÀN CHỈNH

### Backend
- [ ] Đã cài Python dependencies
- [ ] File `serviceAccountKey.json` đã có
- [ ] Backend chạy tại `http://localhost:8000`
- [ ] Swagger UI mở được
- [ ] Đã tạo Firestore collections

### Frontend
- [ ] Đã lấy IP máy tính
- [ ] Đã cập nhật `src/config/api.ts`
- [ ] Expo chạy được
- [ ] App mở được trên điện thoại/emulator

### Kết nối
- [ ] Backend kết nối được Firestore
- [ ] Frontend kết nối được Backend
- [ ] Đăng ký/đăng nhập thành công
- [ ] Tạo data và thấy trên Firebase Console

---

## 🎯 LỆNH CHẠY NHANH

### Terminal 1 - Backend:
```bash
cd D:\AppCF\DetectCoffeDisease
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend:
```bash
cd D:\AppCF\DetectCoffeDisease
npx expo start
```

### Terminal 3 - Tạo Firestore (lần đầu):
```bash
cd D:\AppCF\DetectCoffeDisease
python backend/scripts/create_firestore_structure.py
```

---

## 📚 TÀI LIỆU THAM KHẢO

- `backend/README.md` - Hướng dẫn backend
- `backend/API_ENDPOINTS.md` - Chi tiết API
- `backend/TESTING_GUIDE.md` - Hướng dẫn test
- `backend/DATABASE_SCHEMA.md` - Schema database
- `backend/DATABASE_ARCHITECTURE.md` - Kiến trúc database
- `backend/SYNC_CHECK.md` - Kiểm tra đồng bộ

---

## 🎉 HOÀN THÀNH

Sau khi làm theo hướng dẫn, bạn sẽ có:

✅ Backend chạy với 7 modules API đầy đủ
✅ Frontend kết nối được backend
✅ Firestore với 8 collections
✅ Tất cả mối quan hệ database đã đúng
✅ Sẵn sàng phát triển tiếp

**Chúc bạn code vui vẻ! 🚀**
