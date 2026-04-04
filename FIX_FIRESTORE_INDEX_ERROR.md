# Hướng Dẫn Fix Lỗi Firestore Index

## Vấn Đề
```
ERROR [profileLoggedInVM] loadHistories failed: 
[FirebaseError: The query requires an index. That index is currently building and cannot be used yet.]
```

## Nguyên Nhân
Query trong `profileLoggedInVM.ts` cần composite index cho collection `diagnoses`:
- Field: `userId` (ASCENDING)
- Field: `createdAt` (DESCENDING)

Index đã được định nghĩa trong `backend/firestore.indexes.json` nhưng chưa được deploy lên Firebase.

## Giải Pháp

### Cách 1: Deploy Indexes Bằng Script (Khuyến Nghị)

```bash
cd backend
python scripts/deploy_firestore_indexes.py
```

### Cách 2: Deploy Indexes Bằng Firebase CLI

```bash
cd backend
firebase deploy --only firestore:indexes
```

### Cách 3: Tạo Index Thủ Công Qua Console

1. Mở link trong error message hoặc truy cập:
   https://console.firebase.google.com/project/coffe-detect/firestore/indexes

2. Click "Create Index" với cấu hình:
   - Collection ID: `diagnoses`
   - Fields:
     - `userId`: Ascending
     - `createdAt`: Descending
   - Query scope: Collection

3. Đợi index build xong (thường 2-5 phút)

## Kiểm Tra Index Status

Sau khi deploy, kiểm tra status tại:
https://console.firebase.google.com/project/coffe-detect/firestore/indexes

Status sẽ chuyển từ "Building" → "Enabled" khi hoàn tất.

## Lưu Ý

- Index có thể mất vài phút để build xong
- Trong lúc build, query sẽ báo lỗi
- Sau khi enabled, app sẽ hoạt động bình thường
- Nếu thêm query mới cần index khác, lặp lại quy trình trên

## Các Index Hiện Có

File `backend/firestore.indexes.json` đã định nghĩa các indexes:

1. **posts**: `authorId` + `createdAt`
2. **comments**: `postId` + `createdAt`
3. **likes**: `postId` + `userId`
4. **history**: `userId` + `createdAt`
5. **notifications**: `userId` + `isRead` + `createdAt`
6. **diagnoses**: `userId` + `createdAt` ← Index bị thiếu

## Troubleshooting

### Lỗi: Firebase CLI chưa cài đặt
```bash
npm install -g firebase-tools
firebase login
```

### Lỗi: Chưa init Firebase project
```bash
cd backend
firebase init firestore
# Chọn project: coffe-detect
# Chọn file: firestore.rules và firestore.indexes.json
```

### Lỗi: Permission denied
Đảm bảo account Firebase có quyền Editor hoặc Owner cho project.
