# Debug: Network Request Timeout - Diagnosis

## Vấn Đề
```
ERROR [confirm-screenVM] startAnalysis error: [TypeError: Network request timed out]
```

App bị "quay mãi" ở màn hình "Đang tải ảnh lên..." và không đưa ra dự đoán.

## Nguyên Nhân Có Thể

### 1. Backend chưa chạy hoặc crash
### 2. Dependencies chưa cài đủ (YOLO, Cloudinary)
### 3. Model file best.pt thiếu hoặc lỗi
### 4. Cloudinary credentials sai
### 5. Request timeout quá ngắn

## Cách Debug

### Bước 1: Kiểm tra Backend đang chạy

```bash
# Terminal backend phải hiển thị:
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Nếu không thấy, chạy lại:
```bash
cd C:\Users\ADMIN\DetectCoffeDisease-1
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Bước 2: Kiểm tra Dependencies

```bash
cd backend
python scripts/check_dependencies.py
```

Nếu thiếu dependencies:
```bash
pip install -r backend/requirements.txt
```

### Bước 3: Test API Upload Trực Tiếp

Mở Swagger UI: http://192.168.36.1:8000/docs

1. Mở endpoint `POST /api/diagnosis/upload-image`
2. Click "Try it out"
3. Upload một ảnh test
4. Xem response:
   - Thành công: `{"imageID": "abc123"}`
   - Lỗi: Xem error message

### Bước 4: Test API Predict

Sau khi có imageID từ bước 3:

1. Mở endpoint `POST /api/diagnosis/predict`
2. Click "Try it out"
3. Body:
   ```json
   {
     "imageId": "abc123",
     "imgSize": 640,
     "confThreshold": 0.25
   }
   ```
4. Xem response và thời gian xử lý

### Bước 5: Xem Backend Logs

Khi app gọi API, terminal backend sẽ hiển thị:

```
INFO:     192.168.36.xxx:xxxxx - "POST /api/diagnosis/upload-image HTTP/1.1" 200 OK
INFO:     192.168.36.xxx:xxxxx - "POST /api/diagnosis/predict HTTP/1.1" 200 OK
```

Nếu thấy lỗi 500, 400, hoặc exception → Đọc error message

### Bước 6: Kiểm tra Model File

```bash
cd backend/predict_models
dir best.pt
# Phải thấy file best.pt (khoảng 6-50 MB)
```

Nếu thiếu file best.pt:
- Model YOLO cần được train hoặc download
- Đặt file vào `backend/predict_models/best.pt`

## Fix Đã Áp Dụng

### 1. Fix CameraView Warning
Đã chuyển overlay ra ngoài CameraView, dùng absolute positioning:

```tsx
<CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="picture" />
<View style={styles.overlay}>
  {/* Overlay content */}
</View>
```

### 2. Tăng Timeout
Đã thêm comment về timeout trong fetch (mặc định 60s cho upload, 120s cho predict)

### 3. Better Error Handling
Đã thêm console.error và error messages chi tiết hơn

## Test Flow Đúng

### 1. Chạy Backend
```bash
cd C:\Users\ADMIN\DetectCoffeDisease-1
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Kiểm tra Dependencies
```bash
python backend/scripts/check_dependencies.py
```

### 3. Test API qua Swagger
http://192.168.36.1:8000/docs

### 4. Chạy App
```bash
npx expo start
```

### 5. Test Upload + Predict
- Chụp ảnh lá cà phê
- Xác nhận
- Đợi 3s countdown
- Xem backend logs:
  ```
  POST /api/diagnosis/upload-image → 200 OK (2-5s)
  POST /api/diagnosis/predict → 200 OK (5-15s)
  ```
- App navigate sang resultScreen

## Thời Gian Xử Lý Dự Kiến

- Upload ảnh: 2-5 giây
- YOLO prediction: 5-15 giây (lần đầu chậm hơn do load model)
- Tổng: 7-20 giây

Nếu quá 30 giây → Có vấn đề!

## Troubleshooting

### Lỗi: "Module 'ultralytics' not found"
```bash
pip install ultralytics
```

### Lỗi: "Module 'cloudinary' not found"
```bash
pip install cloudinary
```

### Lỗi: "Model file not found"
Đảm bảo `backend/predict_models/best.pt` tồn tại

### Lỗi: "Cloudinary upload failed"
Kiểm tra credentials trong `backend/services/diagnosis_service.py`:
```python
cloud_name = "dz89vwzco"
api_key = "131793621143365"
api_secret = "HEJ3cGLQ-uPHkca7SfbW5KDp01M"
```

### Lỗi: "Network request timed out"
1. Kiểm tra backend đang chạy
2. Kiểm tra IP trong .env đúng
3. Kiểm tra firewall không block
4. Kiểm tra cùng WiFi

### Backend crash khi predict
Có thể do:
- RAM không đủ (YOLO cần ~2GB)
- GPU driver lỗi (nếu dùng GPU)
- Model file corrupt

Thử chạy predict trực tiếp:
```python
from ultralytics import YOLO
model = YOLO('backend/predict_models/best.pt')
results = model.predict('test_image.jpg')
print(results)
```

## Logs Cần Xem

### Frontend (Expo)
```
[confirm-screenVM] startAnalysis error: ...
```

### Backend (Terminal)
```
INFO: POST /api/diagnosis/upload-image
INFO: POST /api/diagnosis/predict
ERROR: ... (nếu có lỗi)
```

## Checklist Debug

- [ ] Backend đang chạy tại http://192.168.36.1:8000
- [ ] Swagger UI accessible: http://192.168.36.1:8000/docs
- [ ] Dependencies đã cài: `python backend/scripts/check_dependencies.py`
- [ ] Model file tồn tại: `backend/predict_models/best.pt`
- [ ] Test upload qua Swagger thành công
- [ ] Test predict qua Swagger thành công
- [ ] Backend logs không có error
- [ ] .env có IP đúng: 192.168.36.1
- [ ] Cùng WiFi
- [ ] Firewall cho phép port 8000

Nếu tất cả ✅ → App sẽ hoạt động bình thường!
