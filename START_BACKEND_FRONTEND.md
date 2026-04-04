# Hướng Dẫn Chạy Backend + Frontend

## ✅ Dependencies Đã Sẵn Sàng

Tất cả dependencies đã được cài đặt:
- FastAPI, Uvicorn
- Firebase Admin SDK
- Cloudinary SDK (upload ảnh)
- Ultralytics YOLO (AI detection)
- Pillow (xử lý ảnh)
- Model file: best.pt (116.1 MB)

## 🚀 Chạy Ứng Dụng

### Terminal 1: Backend

```bash
cd C:\Users\ADMIN\DetectCoffeDisease-1
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Đợi đến khi thấy:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Kiểm tra: http://192.168.36.1:8000/docs

### Terminal 2: Frontend

```bash
cd C:\Users\ADMIN\DetectCoffeDisease-1
npx expo start
```

Scan QR code bằng Expo Go app

## 🧪 Test Chức Năng Chẩn Đoán

### 1. Mở app → Tab Camera
### 2. Chụp ảnh lá cà phê
### 3. Xác nhận ảnh
### 4. Đợi phân tích (3s countdown + 10-20s processing)

Xem backend logs:
```
INFO: POST /api/diagnosis/upload-image → 200 OK (2-5s)
INFO: POST /api/diagnosis/predict → 200 OK (5-15s)
```

### 5. Xem kết quả chẩn đoán

Kết quả sẽ hiển thị:
- Tên bệnh (tiếng Việt)
- Độ tin cậy (confidence)
- Mức độ nghiêm trọng (severity)
- Mô tả bệnh
- Cách điều trị

## ⏱️ Thời Gian Xử Lý

- Upload ảnh: 2-5 giây
- YOLO prediction (lần đầu): 10-20 giây (load model)
- YOLO prediction (lần sau): 5-10 giây
- Tổng: 7-25 giây

## 🐛 Nếu Vẫn Timeout

### 1. Kiểm tra backend logs
Xem terminal backend có error không

### 2. Test API trực tiếp
Mở Swagger UI: http://192.168.36.1:8000/docs

Test từng endpoint:
1. POST /api/diagnosis/upload-image
2. POST /api/diagnosis/predict

### 3. Kiểm tra RAM
YOLO model cần ~2GB RAM. Nếu máy yếu, có thể chậm hoặc crash.

### 4. Kiểm tra Cloudinary
Nếu upload lỗi, có thể credentials Cloudinary hết hạn.

## 📝 Lưu Ý

- Lần đầu chạy predict sẽ chậm hơn (load model)
- Ảnh càng lớn càng lâu xử lý
- Cần kết nối internet để upload Cloudinary
- Backend và app phải cùng WiFi

## 🎯 Các Bệnh Được Hỗ Trợ

1. Healthy (Lá khỏe mạnh)
2. Coffee Rust (Bệnh gỉ sắt) - Nghiêm trọng
3. Cercospora Leaf Spot (Bệnh đốm lá)
4. Leaf Miner (Sâu đục lá)
5. Phoma Leaf Spot (Bệnh đốm lá Phoma)

## ✅ Checklist

- [x] Dependencies đã cài đủ
- [x] Model file best.pt tồn tại (116 MB)
- [x] Cloudinary SDK đã cài
- [ ] Backend đang chạy tại http://192.168.36.1:8000
- [ ] Swagger UI accessible
- [ ] Frontend đang chạy
- [ ] Cùng WiFi
- [ ] Test upload + predict thành công

Nếu tất cả ✅ → App sẽ hoạt động hoàn hảo!
