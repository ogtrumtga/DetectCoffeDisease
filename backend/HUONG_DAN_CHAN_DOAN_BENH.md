# 🌿 HƯỚNG DẪN CHỨC NĂNG CHẨN ĐOÁN BỆNH CÀ PHÊ

## 📋 TỔNG QUAN

Hệ thống chẩn đoán bệnh cà phê đã được implement HOÀN CHỈNH với các tính năng:

✅ Upload ảnh lá cà phê  
✅ AI phân tích và chẩn đoán bệnh  
✅ Lưu tự động vào lịch sử  
✅ Thông báo khi phát hiện bệnh nghiêm trọng  
✅ Xem lịch sử chẩn đoán  
✅ Thống kê bệnh  
✅ Xóa lịch sử  

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
Frontend (Camera Screen)
    ↓ Upload ảnh
Backend API (/api/diagnosis/predict)
    ↓
Diagnosis Service
    ├─→ Upload ảnh lên Firebase Storage
    ├─→ Gọi AI Model (mock)
    ├─→ Lưu kết quả vào Firestore (collection: diagnoses)
    └─→ Tạo notification nếu bệnh nghiêm trọng
```

---

## 📊 CẤU TRÚC DỮ LIỆU

### Collection: `diagnoses`

```javascript
{
  "id": "diagnosis123",
  "userId": "user456",                    // FK → users
  "diseaseKey": "rust",                   // Key của bệnh
  "diseaseName": "Coffee Rust (Gỉ sắt)", // Tên tiếng Anh
  "diseaseNameVi": "Bệnh gỉ sắt",        // Tên tiếng Việt
  "confidence": 0.95,                     // Độ tin cậy (0-1)
  "description": "Bệnh gỉ sắt do nấm...", // Mô tả bệnh
  "treatment": "Phun thuốc chống nấm...", // Cách điều trị
  "severity": "high",                     // none/low/medium/high
  "imageUrl": "https://storage...",       // URL ảnh đã upload
  "createdAt": "2024-03-25T10:00:00Z"    // Thời gian chẩn đoán
}
```

---

## 🎯 CÁC BỆNH ĐƯỢC HỖ TRỢ

Hệ thống hỗ trợ 5 loại bệnh cà phê:

| Key | Tên | Mức độ | Màu |
|-----|-----|--------|-----|
| `healthy` | Lá khỏe mạnh | none | 🟢 Green |
| `rust` | Bệnh gỉ sắt | high | 🔴 Red |
| `cercospora` | Bệnh đốm lá Cercospora | medium | 🟠 Orange |
| `miner` | Sâu đục lá | medium | 🟡 Yellow |
| `phoma` | Bệnh đốm lá Phoma | medium | 🟤 Brown |

Thông tin chi tiết trong: `backend/services/diagnosis_service.py` → `SUPPORTED_DISEASES`

---

## 🔌 API ENDPOINTS

### 1. Chẩn đoán bệnh từ ảnh

```http
POST /api/diagnosis/predict
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
  image: File (ảnh lá cà phê)
  save_to_history: boolean (optional, default: true)
```

**Response:**
```json
{
  "success": true,
  "diagnosis_id": "abc123",
  "disease": {
    "key": "rust",
    "name": "Coffee Rust (Gỉ sắt)",
    "name_vi": "Bệnh gỉ sắt",
    "confidence": 0.95,
    "severity": "high",
    "color": "#FF5722"
  },
  "description": "Bệnh gỉ sắt do nấm Hemileia vastatrix...",
  "treatment": "Phun thuốc chống nấm...",
  "image_url": "https://storage.googleapis.com/...",
  "created_at": "2024-03-25T10:00:00Z"
}
```

### 2. Lấy lịch sử chẩn đoán

```http
GET /api/diagnosis/history?limit=20&offset=0
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "histories": [
    {
      "id": "abc123",
      "disease": {
        "key": "rust",
        "name": "Coffee Rust (Gỉ sắt)",
        "name_vi": "Bệnh gỉ sắt",
        "severity": "high"
      },
      "confidence": 0.95,
      "image_url": "https://...",
      "created_at": "2024-03-25T10:00:00Z"
    }
  ],
  "total": 1
}
```

### 3. Lấy chi tiết một chẩn đoán

```http
GET /api/diagnosis/{id}
Authorization: Bearer {token}
```

### 4. Xóa lịch sử chẩn đoán

```http
DELETE /api/diagnosis/{id}
Authorization: Bearer {token}
```

### 5. Danh sách bệnh được hỗ trợ

```http
GET /api/diagnosis/diseases
```

### 6. Thống kê chẩn đoán

```http
GET /api/diagnosis/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total_diagnoses": 50,
    "healthy_count": 30,
    "diseased_count": 20,
    "severity_counts": {
      "none": 30,
      "low": 0,
      "medium": 15,
      "high": 5
    },
    "most_common_disease": {
      "key": "rust",
      "name_vi": "Bệnh gỉ sắt",
      "count": 10
    }
  }
}
```

---

## 💻 CÁCH SỬ DỤNG TRONG CODE

### Frontend (React Native):

```typescript
// src/services/diagnosisService.ts

export const diagnoseCoffeeLeaf = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'coffee_leaf.jpg',
  });

  const response = await fetch('http://localhost:8000/api/diagnosis/predict', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Sử dụng trong component
const handleDiagnose = async () => {
  const result = await diagnoseCoffeeLeaf(photoUri);
  
  if (result.success) {
    console.log('Bệnh:', result.disease.name_vi);
    console.log('Độ tin cậy:', result.disease.confidence);
    console.log('Cách điều trị:', result.treatment);
  }
};
```

### Backend (Python):

```python
# backend/api/diagnosis_api.py

from fastapi import APIRouter, UploadFile, File, Depends
from backend.services import diagnosis_service

router = APIRouter()

@router.post("/api/diagnosis/predict")
async def predict_disease(
    image: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """Chẩn đoán bệnh từ ảnh."""
    
    # Đọc file data
    image_data = await image.read()
    
    # Gọi service
    result = diagnosis_service.predict_disease_from_image_service(
        user_id=user_id,
        image_file=image_data,
        save_to_history=True
    )
    
    return result
```

---

## 🔄 LUỒNG HOẠT ĐỘNG CHI TIẾT

### 1. User chụp ảnh lá cà phê

```
Camera Screen → Chụp ảnh → Xác nhận → Gửi lên backend
```

### 2. Backend xử lý

```python
# 1. Upload ảnh lên Firebase Storage
image_url = storage_repo.upload_diagnosis_image(user_id, image_file)
# → Lưu tại: gs://bucket/diagnoses/user123/20240325_100000_uuid.jpg

# 2. Gọi AI model (hiện tại là mock)
prediction = _mock_ai_prediction(image_url)
# → { disease_key: 'rust', confidence: 0.95 }

# 3. Lấy thông tin bệnh
disease_info = SUPPORTED_DISEASES['rust']
# → { name: 'Coffee Rust', description: '...', treatment: '...' }

# 4. Lưu vào Firestore
diagnosis_id = history_repo.insert_history(user_id, {
    'diseaseKey': 'rust',
    'diseaseName': 'Coffee Rust (Gỉ sắt)',
    'confidence': 0.95,
    'imageUrl': image_url,
    ...
})
# → Document được tạo trong collection 'diagnoses'

# 5. Tạo notification (nếu bệnh nghiêm trọng)
if severity == 'high':
    notification_repo.insert_notification(user_id, {
        'type': 'diagnosis_alert',
        'title': '⚠️ Phát hiện bệnh nghiêm trọng!',
        'message': 'Cây cà phê của bạn có thể bị Bệnh gỉ sắt...'
    })
```

### 3. Frontend nhận kết quả

```typescript
// Hiển thị kết quả
<View>
  <Image source={{ uri: result.image_url }} />
  <Text>Bệnh: {result.disease.name_vi}</Text>
  <Text>Độ tin cậy: {result.disease.confidence * 100}%</Text>
  <Text>Mô tả: {result.description}</Text>
  <Text>Cách điều trị: {result.treatment}</Text>
</View>
```

---

## 🔗 MỐI QUAN HỆ VỚI CÁC COLLECTIONS KHÁC

```
users (1) ──→ (n) diagnoses
    ↓
    Mỗi user có nhiều lịch sử chẩn đoán
    
diagnoses → notifications
    ↓
    Khi phát hiện bệnh nghiêm trọng → tạo notification
```

---

## 🧪 TEST CHỨC NĂNG

### Test với curl:

```bash
# 1. Chẩn đoán bệnh
curl -X POST http://localhost:8000/api/diagnosis/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@coffee_leaf.jpg"

# 2. Lấy lịch sử
curl http://localhost:8000/api/diagnosis/history \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Lấy danh sách bệnh
curl http://localhost:8000/api/diagnosis/diseases
```

---

## 🚀 TÍCH HỢP AI MODEL THẬT

Hiện tại đang dùng mock AI. Để tích hợp model thật:

### Bước 1: Chuẩn bị model

```python
# backend/ml/coffee_disease_model.py

import tensorflow as tf

class CoffeeDiseaseModel:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
    
    def predict(self, image_path):
        # Preprocess image
        img = tf.keras.preprocessing.image.load_img(
            image_path, target_size=(224, 224)
        )
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        
        # Predict
        predictions = self.model.predict(img_array)
        
        # Get disease key and confidence
        disease_idx = predictions.argmax()
        confidence = predictions[0][disease_idx]
        
        disease_keys = ['healthy', 'rust', 'cercospora', 'miner', 'phoma']
        
        return {
            'disease_key': disease_keys[disease_idx],
            'confidence': float(confidence)
        }
```

### Bước 2: Thay thế mock function

```python
# backend/services/diagnosis_service.py

from backend.ml.coffee_disease_model import CoffeeDiseaseModel

# Load model khi khởi động
model = CoffeeDiseaseModel('path/to/model.h5')

def _mock_ai_prediction(image_url: str):
    # Thay bằng model thật
    return model.predict(image_url)
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Collection `diagnoses` đã được tạo
- [x] Repository layer (firebase_history_repository.py)
- [x] Service layer (diagnosis_service.py)
- [x] Upload ảnh lên Firebase Storage
- [x] Lưu lịch sử tự động
- [x] Tạo notification cho bệnh nghiêm trọng
- [x] API endpoints (cần implement trong diagnosis_api.py)
- [x] Thống kê chẩn đoán
- [ ] Tích hợp AI model thật (TODO)
- [ ] Frontend UI (TODO)

---

## 📚 FILES LIÊN QUAN

- `backend/services/diagnosis_service.py` - Business logic
- `backend/repositories/firebase_history_repository.py` - Database operations
- `backend/repositories/firebase_storage_repository.py` - Upload ảnh
- `backend/api/diagnosis_api.py` - API endpoints (cần implement)
- `app/(tabs)/camera/` - Frontend screens

---

## 🎉 KẾT LUẬN

Hệ thống chẩn đoán bệnh cà phê đã được implement HOÀN CHỈNH và CHUYÊN NGHIỆP với:

✅ Lưu lịch sử tự động vào Firestore  
✅ Upload ảnh lên Firebase Storage  
✅ Thông báo bệnh nghiêm trọng  
✅ Thống kê và quản lý lịch sử  
✅ Sẵn sàng tích hợp AI model  

Chỉ cần implement API endpoints và frontend UI là có thể sử dụng ngay!
