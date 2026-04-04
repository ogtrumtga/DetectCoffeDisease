# 🔄 HƯỚNG DẪN RESET FIREBASE

## 📋 Tổng quan

Script `reset_firestore_diagnoses.py` giúp reset Firestore về trạng thái mới:
- ❌ Xóa collection `history` (đã gộp vào `diagnoses`)
- ❌ Xóa collection `diagnoses` cũ
- ✅ Tạo collection `diseases` (danh sách bệnh)
- ✅ Tạo sample `diagnoses` để test

---

## ⚠️ CẢNH BÁO

**Script này XÓA DỮ LIỆU!** Chỉ chạy trong môi trường dev/test.

Nếu đang có dữ liệu production, backup trước khi chạy.

---

## 🚀 Cách chạy

### Bước 1: Đảm bảo có `serviceAccountKey.json`

File này phải nằm ở `backend/serviceAccountKey.json`.

Nếu chưa có, tải từ Firebase Console:
1. Vào https://console.firebase.google.com
2. Chọn project "coffe-detect"
3. Settings → Service accounts → Generate new private key
4. Lưu vào `backend/serviceAccountKey.json`

### Bước 2: Chạy script

```bash
# Từ thư mục gốc project
python backend/scripts/reset_firestore_diagnoses.py
```

Hoặc:

```bash
# Từ thư mục backend
cd backend
python scripts/reset_firestore_diagnoses.py
```

### Bước 3: Xác nhận

Script sẽ hỏi xác nhận:
```
❓ Bạn có chắc chắn muốn tiếp tục? (yes/no):
```

Gõ `yes` và Enter để tiếp tục.

---

## 📊 Kết quả sau khi reset

### Collections được tạo:

1. **diseases** (5 documents)
   - healthy
   - rust
   - cercospora
   - miner
   - phoma

2. **diagnoses** (2 sample documents)
   - Sample 1: Bệnh gỉ sắt (confidence 92%)
   - Sample 2: Lá khỏe mạnh (confidence 98%)

### Collections bị xóa:

- ❌ `history` (đã gộp vào diagnoses)

---

## 🧪 Test sau khi reset

### 1. Kiểm tra backend API

```bash
# Chạy backend
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Truy cập: http://localhost:8000/docs

### 2. Test các endpoint

#### GET /api/diagnosis (danh sách lịch sử)
```bash
curl -X GET "http://localhost:8000/api/diagnosis?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### GET /api/diagnosis/supported-diseases
```bash
curl -X GET "http://localhost:8000/api/diagnosis/supported-diseases"
```

#### GET /api/diagnosis/diseases/{id}
```bash
curl -X GET "http://localhost:8000/api/diagnosis/diseases/rust"
```

---

## 🔧 Troubleshooting

### Lỗi: "No module named 'backend'"

Chạy từ thư mục gốc project, không phải từ `backend/`:

```bash
# ❌ SAI
cd backend
python scripts/reset_firestore_diagnoses.py

# ✅ ĐÚNG
python backend/scripts/reset_firestore_diagnoses.py
```

### Lỗi: "serviceAccountKey.json not found"

Đảm bảo file `backend/serviceAccountKey.json` tồn tại và có quyền đọc.

### Lỗi: "Permission denied"

Kiểm tra Firebase service account có quyền:
- Cloud Datastore User
- Firebase Admin

---

## 📝 Lưu ý

### User ID mẫu

Script tạo sample data với user ID:
```
eEFeBhhDxPesbvxzybGQh1guG7n1
```

Nếu muốn dùng UID khác, sửa trong `reset_firestore_diagnoses.py`:

```python
sample_user_id = "YOUR_USER_ID_HERE"
```

### Chạy lại nhiều lần

Script có thể chạy nhiều lần. Mỗi lần chạy sẽ:
1. Xóa toàn bộ data cũ
2. Tạo lại từ đầu

---

## 🎯 Sau khi reset

### 1. Cập nhật IP trong `.env`

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8000
```

Thay `192.168.x.x` bằng IP máy tính (chạy `ipconfig` để lấy).

### 2. Chạy backend

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Chạy app

```bash
npx expo start
```

### 4. Test flow quét bệnh

1. Mở app → Camera tab
2. Chụp ảnh lá cà phê
3. Xác nhận → Chờ upload + predict
4. Xem kết quả
5. Vào Profile → Lịch sử để xem diagnoses đã lưu

---

## 📚 Tài liệu liên quan

- `DATABASE_SCHEMA.md` — Schema Firestore mới
- `API_ENDPOINTS.md` — Danh sách API endpoints
- `backend/services/diagnosis_service.py` — Logic chẩn đoán
- `backend/api/diagnosis_api.py` — API endpoints

---

## ❓ Câu hỏi thường gặp

### Q: Collection history có còn không?
A: Không. Đã gộp vào `diagnoses`.

### Q: Làm sao query lịch sử?
A: Dùng `GET /api/diagnosis` (thay thế `GET /api/history`).

### Q: Model YOLO ở đâu?
A: `backend/predict_models/best.pt`

### Q: Làm sao test YOLO?
A: Chụp ảnh từ app → backend tự động chạy YOLO khi predict.
