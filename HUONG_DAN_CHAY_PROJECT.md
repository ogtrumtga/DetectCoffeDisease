# 🚀 HƯỚNG DẪN CHẠY PROJECT

## 📋 Chuẩn bị

### 1. Lấy địa chỉ IP máy tính

```bash
ipconfig
```

Tìm dòng "IPv4 Address" (ví dụ: 192.168.1.100)

### 2. Cập nhật file .env

Mở file `.env` ở thư mục gốc project và sửa:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
```

(Thay `192.168.1.100` bằng IP thật của bạn)

---

## 🔄 Reset Firebase (Chỉ chạy 1 lần đầu hoặc khi cần reset)

```bash
python backend/scripts/reset_firestore_diagnoses.py
```

Gõ `yes` khi được hỏi xác nhận.

Script sẽ:
- ❌ Xóa collection `history` (đã gộp vào diagnoses)
- ❌ Xóa collection `diagnoses` cũ
- ✅ Tạo collection `diseases` (5 loại bệnh)
- ✅ Tạo 2 sample diagnoses để test

---

## 🖥️ Chạy Backend

Mở terminal và chạy:

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Kiểm tra backend đang chạy: http://localhost:8000/docs

---

## 📱 Chạy Frontend (Expo)

Mở terminal MỚI (giữ backend chạy) và chạy:

```bash
npx expo start
```

Sau đó:
- Nhấn `a` để mở Android emulator
- Nhấn `i` để mở iOS simulator
- Quét QR code bằng Expo Go app trên điện thoại

---

## ✅ Test Flow Hoàn Chỉnh

### 1. Đăng nhập
- Mở app
- Đăng nhập bằng tài khoản Firebase

### 2. Quét bệnh
- Vào tab Camera
- Chụp ảnh lá cà phê
- Nhấn "Xác nhận"
- Chờ upload (hiển thị "Đang tải ảnh lên...")
- Chờ YOLO predict (hiển thị "Đang phân tích bệnh...")
- Xem kết quả với dữ liệu thật

### 3. Xem lịch sử
- Vào tab Profile
- Chọn tab "Lịch sử"
- Kiểm tra bản ghi vừa quét có xuất hiện

### 4. Xem chi tiết
- Click vào một bản ghi trong lịch sử
- Xem thông tin đầy đủ (bệnh, độ tin cậy, hướng điều trị)

### 5. Xóa lịch sử
- Swipe left trên một bản ghi → Xóa
- Hoặc nhấn "Xóa toàn bộ" để xóa tất cả

---

## 🐛 Troubleshooting

### Lỗi: "No module named 'backend'"

Đảm bảo chạy từ thư mục gốc project:

```bash
# ❌ SAI
cd backend
python -m uvicorn main:app --reload

# ✅ ĐÚNG (từ thư mục gốc)
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Lỗi: "Cannot connect to server"

1. Kiểm tra backend đang chạy: http://localhost:8000/docs
2. Kiểm tra IP trong `.env` đúng chưa (chạy `ipconfig` để xác nhận)
3. Kiểm tra điện thoại và máy tính cùng mạng WiFi
4. Tắt firewall nếu cần:
   ```bash
   # Windows
   netsh advfirewall set allprofiles state off
   ```

### Lỗi: "Upload failed" hoặc "Predict failed"

1. Kiểm tra user đã đăng nhập chưa
2. Kiểm tra token xác thực còn hạn không
3. Xem log backend để biết lỗi chi tiết
4. Kiểm tra file `backend/predict_models/best.pt` có tồn tại không

### Lỗi: "Model not found"

Đảm bảo file YOLO model tồn tại:

```bash
# Kiểm tra file có tồn tại không
ls backend/predict_models/best.pt
```

Nếu không có, tải model về và đặt vào `backend/predict_models/best.pt`

### Lỗi: "Firestore permission denied"

1. Kiểm tra file `backend/serviceAccountKey.json` có tồn tại không
2. Kiểm tra Firebase service account có quyền đúng không
3. Kiểm tra Firestore rules cho phép read/write

---

## 📊 Kiểm Tra API Bằng Swagger

Truy cập: http://localhost:8000/docs

Test các endpoint:
- POST /api/diagnosis/upload-image
- POST /api/diagnosis/predict
- GET /api/diagnosis (danh sách lịch sử)
- GET /api/diagnosis/{id} (chi tiết)
- DELETE /api/diagnosis/{id} (xóa một)
- DELETE /api/diagnosis (xóa toàn bộ)

---

## 📝 Lưu Ý Quan Trọng

### Collection history đã BỊ XÓA

- ❌ Không còn collection `history` riêng
- ✅ Tất cả lịch sử nằm trong collection `diagnoses`
- ✅ Backend tự động lưu khi predict, không cần POST thêm

### Flow mới

```
User chụp ảnh
  ↓
POST /api/diagnosis/upload-image → imageID
  ↓
POST /api/diagnosis/predict → Backend tự động:
  - Chạy YOLO (best.pt)
  - Lưu vào diagnoses
  - Trả về diagnosisId + kết quả
  ↓
Frontend hiển thị kết quả
  ↓
User xem lịch sử: GET /api/diagnosis
```

### Model YOLO

- File: `backend/predict_models/best.pt`
- Hỗ trợ 5 loại: healthy, rust, cercospora, miner, phoma
- Confidence threshold mặc định: 0.25
- Image size: 640x640

---

## 🎯 Checklist Trước Khi Chạy

- [ ] Đã cài đặt Python 3.8+
- [ ] Đã cài đặt Node.js 16+
- [ ] Đã chạy `pip install -r backend/requirements.txt`
- [ ] Đã chạy `npm install` hoặc `yarn install`
- [ ] Đã có file `backend/serviceAccountKey.json`
- [ ] Đã có file `backend/predict_models/best.pt`
- [ ] Đã cập nhật IP trong `.env`
- [ ] Đã chạy reset Firebase script (nếu cần)

---

## 📚 Tài Liệu Tham Khảo

- `TONG_KET_REFACTOR.md` - Tổng kết refactor
- `backend/RESET_FIREBASE_GUIDE.md` - Hướng dẫn reset Firebase
- `backend/DATABASE_SCHEMA.md` - Schema Firestore
- `backend/API_ENDPOINTS.md` - Danh sách API endpoints
- `API_Documentation.txt` - Chi tiết API documentation

---

## 🆘 Cần Trợ Giúp?

Nếu gặp lỗi không giải quyết được:

1. Kiểm tra log backend (terminal đang chạy backend)
2. Kiểm tra log frontend (terminal đang chạy Expo)
3. Kiểm tra Firebase Console: https://console.firebase.google.com
4. Kiểm tra Swagger UI: http://localhost:8000/docs
5. Đọc file `TONG_KET_REFACTOR.md` để hiểu flow mới
