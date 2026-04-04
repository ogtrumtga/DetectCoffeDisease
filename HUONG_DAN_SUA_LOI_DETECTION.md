# 🔧 HƯỚNG DẪN SỬA LỖI DETECTION VÀ FIREBASE KEYS

## 📋 TÓM TẮT CÁC THAY ĐỔI

### 1. ✅ Sửa Firebase Keys (Uppercase → Lowercase)

**Vấn đề**: Collection `diseases` đang dùng keys viết hoa (`Name`, `Description`, `Id`) không theo chuẩn Firebase.

**Giải pháp**: Đã chuyển sang lowercase (`name`, `description`, `id`)

**Files đã sửa**:
- ✅ `backend/services/diagnosis_service.py` - Hỗ trợ cả 2 format (backward compatible)
- ✅ `backend/scripts/create_firestore_structure.py` - Tạo structure mới với lowercase
- ✅ `backend/DATABASE_SCHEMA.md` - Cập nhật documentation
- ✅ `backend/scripts/migrate_disease_keys.py` - Script migrate dữ liệu cũ

### 2. ✅ Cải thiện Image Preprocessing cho Detection

**Vấn đề**: Model train 3 bệnh đều >80% nhưng detection không tốt do ảnh không được xử lý đúng cách.

**Giải pháp**: Tối ưu preprocessing pipeline:

#### A. Smart Crop V2 - Tập trung vào lá cà phê
```python
# Detect 3 loại vùng:
- Green leaves (healthy): HSV [30-85]
- Yellow/Brown (diseased): HSV [12-38] ← QUAN TRỌNG
- Brown/Red (severe): HSV [0-18]

# Generous padding: 25% (giữ nhiều context)
# Minimum crop: 20% (không crop quá nhỏ)
# Fallback: Center crop 92%
```

#### B. Balanced CLAHE - Tăng contrast không mất màu
```python
# LAB color space
# Clip limit: 2.2 (cân bằng)
# Tile grid: 8x8
# Tăng nhẹ A, B channels: 3%
```

#### C. Enhance Disease Colors - Làm nổi bật vết bệnh
```python
# HSV color space
# Target hue ranges:
  - Red/Brown (0-18): Rust severe, Cercospora
  - Yellow/Orange (18-38): Rust, Miner
  
# Saturation boost: +15%
# Value boost: +7%
```

#### D. Adaptive Brightness
```python
# Tối (<100): Tăng sáng
# Sáng (>155): Giảm sáng
# OK (100-155): Giữ nguyên
```

#### E. Gentle Sharpening
```python
# Kernel nhẹ để làm rõ viền
# Không tạo nhiễu
```

**Files đã sửa**:
- ✅ `backend/services/diagnosis_service.py`:
  - `_preprocess_image_for_model()` - Pipeline mới
  - `_optimized_smart_crop()` - Crop thông minh V2
  - `_balanced_clahe()` - CLAHE cân bằng
  - `_enhance_disease_colors()` - Tăng cường màu bệnh

---

## 🚀 CÁCH TRIỂN KHAI

### Bước 1: Migrate Firebase Keys (Nếu đã có dữ liệu cũ)

```bash
# Chạy script migrate
python backend/scripts/migrate_disease_keys.py

# Script sẽ:
# 1. Scan tất cả documents trong collection diseases
# 2. Chuyển Name → name, Description → description, Id → id
# 3. Giữ nguyên các fields khác
# 4. Báo cáo kết quả
```

**Lưu ý**: Script hỗ trợ backward compatible, code sẽ đọc được cả 2 format.

### Bước 2: Restart Backend Server

```bash
# Stop server hiện tại (Ctrl+C)

# Start lại
cd backend
python main.py

# Hoặc với uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Bước 3: Test Detection

```bash
# Test với ảnh mẫu
# Upload ảnh qua app hoặc API

# Kiểm tra logs để xem preprocessing
# Bạn sẽ thấy:
# [Preprocess] Starting OPTIMAL preprocessing...
# [Crop] ✅ Smart crop: 1920x1080 → 1200x900 (58% retained)
# [Preprocess] CLAHE applied
# [Preprocess] Brightness: 112
# [Preprocess] Disease colors enhanced
# [Preprocess] Sharpening applied
# [Preprocess] ✅ Preprocessing completed successfully
```

---

## 📊 KẾT QUẢ MONG ĐỢI

### Trước khi sửa:
- ❌ Detection không ổn định
- ❌ Confidence thấp (<50%)
- ❌ Bỏ sót nhiều vết bệnh
- ❌ False negatives cao

### Sau khi sửa:
- ✅ Detection ổn định hơn
- ✅ Confidence cao hơn (>70%)
- ✅ Phát hiện nhiều vết bệnh hơn
- ✅ Giảm false negatives

---

## 🔍 TROUBLESHOOTING

### Vấn đề 1: Vẫn không detect được

**Nguyên nhân có thể**:
1. Ảnh quá tối/sáng
2. Lá không chiếm đủ khung hình
3. Ảnh bị mờ/nhòe
4. Không phải lá cà phê

**Giải pháp**:
- Chụp ảnh trong điều kiện ánh sáng tốt
- Lá chiếm 70-80% khung hình
- Giữ camera ổn định
- Đảm bảo chụp đúng lá cà phê

### Vấn đề 2: Confidence thấp

**Nguyên nhân**:
- Vết bệnh quá nhỏ
- Bệnh ở giai đoạn đầu
- Nhiều loại bệnh trên 1 lá

**Giải pháp**:
- Chụp gần hơn vào vết bệnh
- Chụp nhiều lá trong 1 ảnh
- Tăng ánh sáng

### Vấn đề 3: Firebase key error

**Lỗi**: `KeyError: 'name'` hoặc `KeyError: 'Name'`

**Giải pháp**:
```bash
# Chạy migrate script
python backend/scripts/migrate_disease_keys.py

# Hoặc xóa và tạo lại collection diseases
python backend/scripts/create_firestore_structure.py
```

---

## 📝 KIỂM TRA LOGS

### Logs tốt (Detection thành công):
```
[Preprocess] Starting OPTIMAL preprocessing...
[Preprocess] Original: (1920, 1080)
[Crop] ✅ Smart crop: 1920x1080 → 1200x900 (58% retained)
[Preprocess] CLAHE applied
[Preprocess] Brightness: 112
[Preprocess] Disease colors enhanced
[Preprocess] Sharpening applied
[Preprocess] Final size: 640x640
[Preprocess] ✅ Preprocessing completed successfully

[YOLO] Starting prediction with TTA...
[YOLO] Model loaded in 0.45s
[YOLO] Prediction completed in 1.23s
[YOLO] Detected 15 objects
[YOLO] Primary: rust (avg: 85.3%, max: 92.1%, count: 15)
[YOLO] Overall confidence: 83.7%
[YOLO] Summary: {'rust': 15}
[Validation] PASSED: 15 detections, 85.3% confidence
```

### Logs xấu (Detection thất bại):
```
[Validation] REJECTED: No detections
# Hoặc
[Validation] REJECTED: Low confidence (18.5%)
# Hoặc
[Validation] REJECTED: Few detections (1) with medium confidence (35.2%)
```

---

## 🎯 TIPS ĐỂ DETECTION TỐT HƠN

### 1. Điều kiện chụp ảnh:
- ✅ Ánh sáng tự nhiên, không quá tối/sáng
- ✅ Lá chiếm 70-80% khung hình
- ✅ Camera focus rõ nét
- ✅ Giữ camera ổn định
- ✅ Chụp nhiều lá trong 1 ảnh (nếu có thể)

### 2. Loại ảnh tốt:
- ✅ Lá cà phê thật
- ✅ Có vết bệnh rõ ràng
- ✅ Độ phân giải cao (>1MP)
- ✅ Không bị mờ/nhòe

### 3. Loại ảnh tránh:
- ❌ Ảnh từ Google/Internet
- ❌ Ảnh quá tối/sáng
- ❌ Ảnh bị mờ/nhòe
- ❌ Lá quá nhỏ trong khung hình
- ❌ Không phải lá cà phê

---

## 📚 TÀI LIỆU THAM KHẢO

- `backend/DATABASE_SCHEMA.md` - Cấu trúc database
- `backend/services/diagnosis_service.py` - Logic detection
- `backend/HUONG_DAN_CHAN_DOAN_BENH.md` - Hướng dẫn chẩn đoán
- `backend/TESTING_GUIDE.md` - Hướng dẫn test

---

## ✅ CHECKLIST

- [ ] Chạy migrate script (nếu có dữ liệu cũ)
- [ ] Restart backend server
- [ ] Test với ảnh mẫu
- [ ] Kiểm tra logs
- [ ] Verify kết quả trên Firebase Console
- [ ] Test trên app mobile

---

## 🆘 HỖ TRỢ

Nếu vẫn gặp vấn đề:

1. Kiểm tra logs chi tiết
2. Verify Firebase connection
3. Check model file (best.pt)
4. Test với ảnh mẫu đơn giản
5. Kiểm tra dependencies (opencv, PIL, ultralytics)

---

**Cập nhật**: 2024-04-04
**Version**: 2.0
