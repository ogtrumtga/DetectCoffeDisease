# 🏗️ KIẾN TRÚC DATABASE - TÁCH HISTORY VÀ DIAGNOSES

## 📊 Quyết định thiết kế

### ❌ Cũ: 1 collection (history)
```
history
├── userId
├── diseaseKey
├── diseaseName
├── confidence
├── description
├── treatment
├── imageUrl
└── createdAt
```

**Vấn đề:**
- Dữ liệu nặng khi list
- Không tái sử dụng được diagnosis
- Khó mở rộng (nhiều ảnh/1 diagnosis)

---

### ✅ Mới: 2 collections (history + diagnoses)

```
diagnoses (Full detail)
├── id
├── userId
├── diseaseKey
├── diseaseName
├── diseaseNameVi
├── confidence
├── description
├── treatment
├── severity
├── imageUrl
├── modelVersion
├── processingTime
└── createdAt

history (Metadata only)
├── id
├── userId
├── diagnosisId → diagnoses.id
├── imageId
├── predictions (summary)
└── createdAt
```

**Lợi ích:**
- ✅ History nhẹ → Query nhanh
- ✅ Diagnoses đầy đủ → Chi tiết khi cần
- ✅ Tái sử dụng diagnosis cho nhiều history
- ✅ Dễ mở rộng (nhiều ảnh → 1 diagnosis)
- ✅ Phân quyền rõ ràng

---

## 🔗 Mối quan hệ

```
users (1) ──────┬─────── (n) diagnoses
                │
                └─────── (n) history

diagnoses (1) ─────── (n) history
```

### Workflow: Chẩn đoán bệnh

```
1. User chụp ảnh lá cà phê
   ↓
2. Upload ảnh lên Storage
   → Nhận imageUrl
   ↓
3. Gửi ảnh đến AI model
   → Nhận kết quả chẩn đoán
   ↓
4. Lưu vào diagnoses (full detail)
   POST /api/diagnosis/predict
   → Nhận diagnosisId
   ↓
5. Lưu vào history (metadata)
   POST /api/history
   Body: {
     diagnosisId: "...",
     imageId: "...",
     predictions: { disease, confidence }
   }
   ↓
6. User xem lịch sử
   GET /api/history
   → List nhẹ, chỉ có summary
   ↓
7. User click vào 1 item
   GET /api/history/{id}
   → Trả về history + full diagnosis detail
```

---

## 📦 Collections chi tiết

### 1. diagnoses (Kết quả chẩn đoán chi tiết)

**Purpose**: Lưu kết quả đầy đủ từ AI model

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| userId | string | FK → users |
| diseaseKey | string | healthy/rust/cercospora/miner/phoma |
| diseaseName | string | Tên tiếng Anh |
| diseaseNameVi | string | Tên tiếng Việt |
| confidence | number | Độ tin cậy (0-1) |
| description | string | Mô tả bệnh |
| treatment | string | Hướng dẫn điều trị |
| severity | string | none/low/medium/high |
| imageUrl | string | URL ảnh trong Storage |
| modelVersion | string | Version của AI model |
| processingTime | number | Thời gian xử lý (giây) |
| createdAt | timestamp | Thời gian tạo |

**Indexes**:
- `userId (ASC) + createdAt (DESC)`

**Example**:
```json
{
  "id": "diag_abc123",
  "userId": "user_xyz",
  "diseaseKey": "rust",
  "diseaseName": "Coffee Rust",
  "diseaseNameVi": "Bệnh gỉ sắt",
  "confidence": 0.95,
  "description": "Bệnh gỉ sắt do nấm Hemileia vastatrix...",
  "treatment": "Phun thuốc chống nấm...",
  "severity": "high",
  "imageUrl": "https://storage.../img_001.jpg",
  "modelVersion": "v1.0",
  "processingTime": 1.5,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. history (Lịch sử chẩn đoán - metadata)

**Purpose**: Lưu danh sách các lần chẩn đoán (nhẹ, query nhanh)

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| userId | string | FK → users |
| diagnosisId | string | FK → diagnoses |
| imageId | string | ID ảnh trong Storage |
| predictions | object | Tóm tắt kết quả |
| createdAt | timestamp | Thời gian tạo |

**Indexes**:
- `userId (ASC) + createdAt (DESC)`

**Example**:
```json
{
  "id": "hist_xyz789",
  "userId": "user_xyz",
  "diagnosisId": "diag_abc123",
  "imageId": "img_001",
  "predictions": {
    "disease": "rust",
    "confidence": 0.95
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🔄 API Endpoints

### History API (`/api/history`)

```
GET    /api/history
       → List histories (metadata only)
       Response: [{ inferenceId, diagnosisId, imageId, predictions }]

GET    /api/history/{id}
       → Get history detail + full diagnosis
       Response: { history: {...}, diagnosis: {...} }

POST   /api/history
       → Create history + diagnosis
       Body: {
         imageId: "...",
         predictions: {...},
         diagnosis: {  // Optional, full detail
           diseaseKey: "...",
           diseaseName: "...",
           ...
         }
       }

DELETE /api/history/{id}
       → Delete history (diagnosis vẫn giữ lại)

DELETE /api/history
       → Delete all histories
```

### Diagnosis API (`/api/diagnosis`) - Chưa implement

```
POST   /api/diagnosis/predict
       → Upload ảnh, nhận kết quả chẩn đoán
       Response: { diagnosisId, disease, confidence, ... }

GET    /api/diagnosis/{id}
       → Get full diagnosis detail

GET    /api/diagnosis/diseases
       → List supported diseases
```

---

## 🎯 Use Cases

### UC1: User xem danh sách lịch sử
```
GET /api/history?page=1
→ Query collection history (nhẹ, nhanh)
→ Trả về list với predictions summary
```

### UC2: User xem chi tiết 1 lần chẩn đoán
```
GET /api/history/{id}
→ Query history → Lấy diagnosisId
→ Query diagnoses → Lấy full detail
→ Trả về cả 2
```

### UC3: User chẩn đoán bệnh mới
```
1. POST /api/diagnosis/predict (upload ảnh)
   → AI model xử lý
   → Lưu vào diagnoses
   → Trả về diagnosisId

2. POST /api/history (tự động hoặc manual)
   → Lưu metadata vào history
   → Link với diagnosisId
```

### UC4: User xóa lịch sử
```
DELETE /api/history/{id}
→ Xóa history
→ Diagnosis vẫn giữ lại (có thể dùng lại)
```

---

## 📈 Performance

### Query speed
- **List histories**: Nhanh (chỉ metadata, ~100 bytes/doc)
- **Get detail**: 2 queries (history + diagnosis) nhưng chỉ khi cần

### Storage
- **History**: Nhẹ (~200 bytes/doc)
- **Diagnoses**: Nặng (~2KB/doc) nhưng ít query

### Scalability
- Có thể cache diagnoses ở client
- Có thể tạo nhiều history → 1 diagnosis (reuse)
- Dễ thêm features (nhiều ảnh, video, ...)

---

## 🚀 Migration từ cũ sang mới

Nếu đã có data cũ trong collection `history`:

```python
# Script migration
from backend.config import db

old_histories = db.collection('history').stream()

for old_doc in old_histories:
    data = old_doc.to_dict()
    
    # 1. Tạo diagnosis
    diagnosis_data = {
        'userId': data['userId'],
        'diseaseKey': data.get('diseaseKey'),
        'diseaseName': data.get('diseaseName'),
        'confidence': data.get('confidence'),
        'description': data.get('description'),
        'treatment': data.get('treatment'),
        'imageUrl': data.get('imageUrl'),
        'createdAt': data.get('createdAt')
    }
    diagnosis_ref = db.collection('diagnoses').document()
    diagnosis_ref.set(diagnosis_data)
    
    # 2. Tạo history mới
    history_data = {
        'userId': data['userId'],
        'diagnosisId': diagnosis_ref.id,
        'imageId': data.get('imageId', ''),
        'predictions': {
            'disease': data.get('diseaseKey'),
            'confidence': data.get('confidence')
        },
        'createdAt': data.get('createdAt')
    }
    db.collection('history_new').document().set(history_data)
    
    # 3. Xóa doc cũ
    old_doc.reference.delete()
```

---

## ✅ Kết luận

Tách `history` và `diagnoses` là quyết định đúng vì:

1. **Performance**: Query list nhanh hơn
2. **Scalability**: Dễ mở rộng features
3. **Reusability**: Diagnosis có thể dùng lại
4. **Separation of concerns**: Metadata vs Detail
5. **Cost**: Tiết kiệm bandwidth khi list

Kiến trúc này phù hợp cho production và dễ maintain.
