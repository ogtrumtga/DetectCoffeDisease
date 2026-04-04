# Fix Network Timeout - Từng Bước Chi Tiết

## Vấn Đề
```
ERROR [confirm-screenVM] startAnalysis error: [TypeError: Network request timed out]
```

## Đã Fix
1. ✅ Cài Cloudinary SDK
2. ✅ Thêm fetchWithTimeout với timeout 60s (upload) và 120s (predict)
3. ✅ Thêm logging chi tiết
4. ✅ Fix CameraView warning

## Bước Debug Từng Bước

### Bước 1: Kiểm tra Backend đang chạy

```bash
# Terminal 1 - Chạy backend
cd C:\Users\ADMIN\DetectCoffeDisease-1
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Phải thấy:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Bước 2: Test kết nối từ máy tính

Mở browser: http://192.168.36.1:8000/docs

Nếu không mở được → Backend chưa chạy hoặc IP sai

### Bước 3: Test kết nối từ code

```bash
node test_backend_connection.js
```

Nếu lỗi → Kiểm tra:
- Backend có chạy không?
- IP trong .env đúng chưa?
- Firewall có block không?

### Bước 4: Restart Expo (QUAN TRỌNG!)

Sau khi đổi code, PHẢI restart Expo:

```bash
# Ctrl+C để stop
npx expo start --clear
```

Lý do: Expo cache code cũ, không load fetchWithTimeout mới

### Bước 5: Test Upload qua Swagger UI

1. Mở http://192.168.36.1:8000/docs
2. Tìm endpoint `POST /api/diagnosis/upload-image`
3. Click "Try it out"
4. Upload một ảnh test
5. Click "Execute"

Nếu thành công → Backend hoạt động tốt
Nếu lỗi → Xem error message

### Bước 6: Test Predict qua Swagger UI

1. Copy imageID từ bước 5
2. Tìm endpoint `POST /api/diagnosis/predict`
3. Click "Try it out"
4. Body:
   ```json
   {
     "imageId": "paste_imageID_here",
     "imgSize": 640,
     "confThreshold": 0.25
   }
   ```
5. Click "Execute"
6. Đợi 5-15 giây

Nếu thành công → YOLO hoạt động tốt
Nếu lỗi → Xem error trong backend terminal

### Bước 7: Test trên App

1. Mở Expo app
2. Tab Camera
3. Chụp ảnh
4. Xác nhận
5. Xem logs:

**Frontend logs (Expo terminal):**
```
[confirm-screenVM] Starting upload to: http://192.168.36.1:8000/api/diagnosis/upload-image
[fetchWithTimeout] Requesting: http://192.168.36.1:8000/api/diagnosis/upload-image
[fetchWithTimeout] Timeout: 60000ms
[fetchWithTimeout] Response: 200 OK
[confirm-screenVM] Upload success, imageID: abc123
[confirm-screenVM] Starting prediction for imageID: abc123
[fetchWithTimeout] Requesting: http://192.168.36.1:8000/api/diagnosis/predict
[fetchWithTimeout] Timeout: 120000ms
[fetchWithTimeout] Response: 200 OK
[confirm-screenVM] Prediction success, diagnosisId: xyz789
```

**Backend logs (Backend terminal):**
```
INFO: POST /api/diagnosis/upload-image → 200 OK (3.2s)
INFO: POST /api/diagnosis/predict → 200 OK (12.5s)
```

## Các Lỗi Thường Gặp

### Lỗi 1: "Network request failed" (không phải timeout)

**Nguyên nhân**: Không kết nối được backend

**Fix**:
- Kiểm tra backend đang chạy
- Kiểm tra IP đúng: `ipconfig` → IPv4 Address
- Update .env nếu IP thay đổi
- Restart Expo: `npx expo start --clear`

### Lỗi 2: "Request timed out after 60s"

**Nguyên nhân**: Upload ảnh quá chậm

**Fix**:
- Kiểm tra kết nối internet (cần upload Cloudinary)
- Thử ảnh nhỏ hơn
- Kiểm tra Cloudinary credentials

### Lỗi 3: "Request timed out after 120s"

**Nguyên nhân**: YOLO prediction quá chậm

**Fix**:
- Máy yếu, RAM không đủ
- Lần đầu chạy chậm (load model)
- Thử lại lần 2 sẽ nhanh hơn

### Lỗi 4: Backend crash khi predict

**Nguyên nhân**: RAM không đủ hoặc model lỗi

**Fix**:
- Đóng các app khác
- Restart backend
- Kiểm tra model file: `backend/predict_models/best.pt`

### Lỗi 5: "Cloudinary upload failed"

**Nguyên nhân**: Credentials sai hoặc hết quota

**Fix**:
- Kiểm tra credentials trong `backend/services/diagnosis_service.py`
- Kiểm tra Cloudinary dashboard: https://cloudinary.com/console

## Checklist Cuối Cùng

- [ ] Backend đang chạy: http://192.168.36.1:8000
- [ ] Swagger UI mở được: http://192.168.36.1:8000/docs
- [ ] Test upload qua Swagger thành công
- [ ] Test predict qua Swagger thành công
- [ ] Dependencies đủ: `python backend/scripts/check_dependencies.py`
- [ ] Model file tồn tại: `backend/predict_models/best.pt`
- [ ] .env có IP đúng: `EXPO_PUBLIC_API_BASE_URL=http://192.168.36.1:8000`
- [ ] Đã restart Expo: `npx expo start --clear`
- [ ] Cùng WiFi
- [ ] Firewall cho phép port 8000

## Nếu Vẫn Lỗi

### Debug Level 1: Xem logs chi tiết

Frontend logs sẽ hiển thị:
- URL đang gọi
- Timeout setting
- Response status
- Error message

Backend logs sẽ hiển thị:
- Request nhận được
- Processing time
- Error traceback (nếu có)

### Debug Level 2: Test từng bước

1. Test backend health: `curl http://192.168.36.1:8000/docs`
2. Test upload: Swagger UI
3. Test predict: Swagger UI
4. Test app: Xem logs cả 2 bên

### Debug Level 3: Giảm timeout để test nhanh

Trong `confirm-screenVM.ts`, tạm thời giảm timeout:

```typescript
timeout: 10000, // 10s thay vì 60s
```

Nếu lỗi ngay → Backend không phản hồi
Nếu lỗi sau 10s → Backend đang xử lý nhưng chậm

## Thời Gian Xử Lý Bình Thường

- Upload ảnh: 2-5 giây
- YOLO lần đầu: 10-20 giây (load model)
- YOLO lần sau: 5-10 giây
- Tổng: 7-25 giây

Nếu quá 30 giây → Có vấn đề!

## Liên Hệ Debug

Nếu vẫn lỗi, cung cấp:
1. Frontend logs (toàn bộ)
2. Backend logs (toàn bộ)
3. Kết quả test Swagger UI
4. Screenshot lỗi
