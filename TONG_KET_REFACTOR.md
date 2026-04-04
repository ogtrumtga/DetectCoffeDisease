# 📋 TỔNG KẾT REFACTOR - GỘP HISTORY VÀO DIAGNOSES

## ✅ ĐÃ HOÀN THÀNH

### 1. Backend - Gộp collection history vào diagnoses

#### Đã xóa các file:
- ❌ `backend/api/history_api.py`
- ❌ `backend/services/history_service.py`
- ❌ `backend/repositories/firebase_history_repository.py`

#### Đã cập nhật:
- ✅ `backend/services/diagnosis_service.py` - Thêm các hàm xử lý lịch sử:
  - `get_user_diagnoses_service()` - Lấy danh sách lịch sử (thay thế GET /api/history)
  - `get_diagnosis_detail_service()` - Lấy chi tiết (thay thế GET /api/history/{id})
  - `delete_diagnosis_service()` - Xóa một bản ghi (thay thế DELETE /api/history/{id})
  - `delete_all_diagnoses_service()` - Xóa toàn bộ (thay thế DELETE /api/history)

- ✅ `backend/api/diagnosis_api.py` - Thêm các endpoint:
  - `GET /api/diagnosis` - Danh sách lịch sử chẩn đoán
  - `GET /api/diagnosis/{id}` - Chi tiết một chẩn đoán
  - `DELETE /api/diagnosis/{id}` - Xóa một chẩn đoán
  - `DELETE /api/diagnosis` - Xóa toàn bộ lịch sử

- ✅ `backend/main.py` - Đã xóa import history_api
- ✅ `backend/repositories/__init__.py` - Đã xóa import firebase_history_repository
- ✅ `backend/api/__init__.py` - Cập nhật documentation

### 2. Frontend - Kết nối với backend thật

#### Đã xóa:
- ❌ `src/services/historyService.ts`

#### Đã cập nhật:
- ✅ `src/features/camera/viewmodels/confirm-screenVM.ts`
  - Gọi API thật: POST /api/diagnosis/upload-image
  - Gọi API thật: POST /api/diagnosis/predict
  - Nhận diagnosisId và navigate với dữ liệu thật

- ✅ `src/features/camera/viewmodels/result-screenVM.ts`
  - Nhận dữ liệu thật từ navigation params
  - Không còn dùng mock data

- ✅ `src/features/camera/viewmodels/detail-screenVM.ts`
  - Làm việc với diagnosisId thật
  - Backend đã tự động lưu, không cần save thủ công

- ✅ `src/features/profile/viewmodels/profileLoggedInVM.ts`
  - Query từ collection `diagnoses` (top-level)
  - Dùng `where("userId", "==", user.uid)`
  - Xóa từ collection `diagnoses`

- ✅ `src/config/api.ts`
  - Thêm API_ENDPOINTS.DIAGNOSIS_UPLOAD
  - Thêm API_ENDPOINTS.DIAGNOSIS_PREDICT
  - Thêm API_ENDPOINTS.DIAGNOSIS_LIST
  - Thêm API_ENDPOINTS.DIAGNOSIS_DETAIL
  - Thêm API_ENDPOINTS.DIAGNOSIS_DELETE
  - Thêm API_ENDPOINTS.DIAGNOSIS_DELETE_ALL

- ✅ `.env`
  - Thêm EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:8000

### 3. Model YOLO

- ✅ Di chuyển `backend/best.pt` → `backend/predict_models/best.pt`
- ✅ Cập nhật MODEL_PATH trong `diagnosis_service.py`

### 4. Firebase Reset Script

- ✅ Tạo `backend/scripts/reset_firestore_diagnoses.py`
  - Xóa collection `history`
  - Xóa collection `diagnoses` cũ
  - Tạo collection `diseases` (5 loại bệnh)
  - Tạo 2 sample diagnoses để test

- ✅ Tạo `backend/RESET_FIREBASE_GUIDE.md`
  - Hướng dẫn chi tiết cách chạy script
  - Hướng dẫn test sau khi reset
  - Troubleshooting

- ✅ Cập nhật `backend/DATABASE_SCHEMA.md`
  - Ghi chú collection history đã bị xóa
  - Cập nhật schema mới

---

## 🔧 CẦN LÀM TIẾP

### Bước 1: Lấy IP máy tính

```bash
ipconfig
```

Tìm dòng "IPv4 Address" (ví dụ: 192.168.1.100)

### Bước 2: Cập nhật file .env

Mở file `.env` và sửa:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
```

(Thay 192.168.1.100 bằng IP thật của bạn)

### Bước 3: Reset Firebase

```bash
python backend/scripts/reset_firestore_diagnoses.py
```

Gõ `yes` khi được hỏi xác nhận.

### Bước 4: Chạy backend

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Kiểm tra: http://localhost:8000/docs

### Bước 5: Chạy app

Mở terminal mới:

```bash
npx expo start
```

### Bước 6: Test flow hoàn chỉnh

1. Mở app trên điện thoại/emulator
2. Đăng nhập
3. Vào tab Camera
4. Chụp ảnh lá cà phê
5. Nhấn "Xác nhận"
6. Chờ upload + YOLO predict (hiển thị "Đang tải ảnh lên..." → "Đang phân tích bệnh...")
7. Xem kết quả với dữ liệu thật
8. Vào tab Profile → Lịch sử
9. Kiểm tra bản ghi vừa quét có xuất hiện
10. Thử xóa một bản ghi
11. Thử xóa toàn bộ lịch sử

---

## 📊 SCHEMA MỚI

### Collection: diagnoses (top-level)

```
diagnoses/{diagnosisId}
├── userId: string
├── imageId: string
├── imageUrl: string
├── diseaseKey: string (healthy, rust, cercospora, miner, phoma)
├── diseaseNameVi: string
├── diseaseNameEn: string
├── confidence: number (0-100)
├── severity: string (low, medium, high)
├── description: string
├── treatment: string
├── summary: object
│   ├── healthy: number
│   ├── rust: number
│   ├── cercospora: number
│   ├── miner: number
│   └── phoma: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Collection: diseases (reference data)

```
diseases/{diseaseKey}
├── nameVi: string
├── nameEn: string
├── description: string
├── symptoms: string
├── treatment: string
├── prevention: string
└── severity: string
```

---

## 🔄 API ENDPOINTS MỚI

### Thay thế History API

| Cũ (History) | Mới (Diagnosis) | Mô tả |
|--------------|-----------------|-------|
| GET /api/history | GET /api/diagnosis | Danh sách lịch sử |
| GET /api/history/{id} | GET /api/diagnosis/{id} | Chi tiết |
| POST /api/history | (Tự động lưu khi predict) | Tạo bản ghi |
| DELETE /api/history/{id} | DELETE /api/diagnosis/{id} | Xóa một |
| DELETE /api/history | DELETE /api/diagnosis | Xóa toàn bộ |

### Flow quét bệnh mới

```
1. User chụp ảnh
   ↓
2. POST /api/diagnosis/upload-image
   → Trả về imageID
   ↓
3. POST /api/diagnosis/predict
   Body: { imageId, imgSize: 640, confThreshold: 0.25 }
   → Backend chạy YOLO (best.pt)
   → Tự động lưu vào collection diagnoses
   → Trả về diagnosisId + kết quả đầy đủ
   ↓
4. Frontend navigate sang resultScreen với dữ liệu thật
   ↓
5. User xem Profile → Lịch sử
   → Query từ collection diagnoses
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Collection history đã BỊ XÓA

Không còn collection `history` nữa. Tất cả dữ liệu lịch sử giờ nằm trong `diagnoses`.

### 2. Backend tự động lưu

Khi gọi `POST /api/diagnosis/predict`, backend sẽ:
- Chạy YOLO
- Lưu kết quả vào `diagnoses`
- Trả về `diagnosisId`

Frontend KHÔNG cần gọi thêm API để lưu lịch sử.

### 3. Query lịch sử

Frontend query trực tiếp từ collection `diagnoses`:

```typescript
const q = query(
  collection(db, "diagnoses"),
  where("userId", "==", user.uid),
  orderBy("createdAt", "desc")
);
```

### 4. Xóa lịch sử

Xóa trực tiếp từ collection `diagnoses`:

```typescript
await deleteDoc(doc(db, "diagnoses", diagnosisId));
```

---

## 🐛 TROUBLESHOOTING

### Lỗi: "No module named 'backend'"

Chạy từ thư mục gốc project:

```bash
# ❌ SAI
cd backend
python -m uvicorn main:app --reload

# ✅ ĐÚNG
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Lỗi: "Cannot connect to server"

1. Kiểm tra backend đang chạy: http://localhost:8000/docs
2. Kiểm tra IP trong `.env` đúng chưa
3. Kiểm tra điện thoại và máy tính cùng mạng WiFi
4. Tắt firewall nếu cần

### Lỗi: "Upload failed"

1. Kiểm tra token xác thực (user đã đăng nhập chưa)
2. Kiểm tra Cloudinary credentials trong `backend/config.py`
3. Xem log backend để biết lỗi chi tiết

### Lỗi: "Predict failed"

1. Kiểm tra file `backend/predict_models/best.pt` có tồn tại không
2. Kiểm tra đã cài đặt `ultralytics` chưa: `pip install ultralytics`
3. Xem log backend để biết lỗi chi tiết

---

## 📚 TÀI LIỆU THAM KHẢO

- `backend/RESET_FIREBASE_GUIDE.md` - Hướng dẫn reset Firebase
- `backend/DATABASE_SCHEMA.md` - Schema Firestore mới
- `backend/API_ENDPOINTS.md` - Danh sách API endpoints
- `backend/services/diagnosis_service.py` - Logic chẩn đoán
- `backend/api/diagnosis_api.py` - API endpoints
- `src/config/api.ts` - API configuration frontend

---

## ✅ CHECKLIST

- [ ] Lấy IP máy tính (ipconfig)
- [ ] Cập nhật EXPO_PUBLIC_API_BASE_URL trong .env
- [ ] Chạy reset Firebase script
- [ ] Chạy backend (port 8000)
- [ ] Chạy Expo app
- [ ] Test flow quét bệnh
- [ ] Test xem lịch sử trong Profile
- [ ] Test xóa một bản ghi
- [ ] Test xóa toàn bộ lịch sử
- [ ] Commit và push code

---

## 🎯 KẾT LUẬN

Refactor đã hoàn thành! Collection `history` đã được gộp vào `diagnoses`. Frontend đã kết nối với backend thật, sử dụng YOLO model `best.pt` để quét bệnh.

Làm theo các bước trong phần "CẦN LÀM TIẾP" để test toàn bộ flow.
