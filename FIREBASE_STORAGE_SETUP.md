# Firebase Storage Setup - Hướng dẫn cấu hình

## Vấn đề hiện tại
Lỗi: `Firebase Storage: An unknown error occurred (storage/unknown)`

**Nguyên nhân:** Firebase Storage chưa có rules để cho phép user upload ảnh.

---

## ✅ CÁCH 1: Deploy Storage Rules (KHUYÊN DÙNG - MIỄN PHÍ)

Firebase Storage **HOÀN TOÀN MIỄN PHÍ** với gói Spark:
- ✅ 5GB storage
- ✅ 1GB/day download  
- ✅ 20K/day uploads

### Bước 1: Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

### Bước 2: Đăng nhập Firebase

```bash
firebase login
```

### Bước 3: Khởi tạo Firebase (nếu chưa)

```bash
cd backend
firebase init
```

Chọn:
- ✅ Firestore
- ✅ Storage
- Project: `coffe-detect`

### Bước 4: Deploy Storage Rules

```bash
cd backend
firebase deploy --only storage
```

Hoặc dùng script:

```bash
python backend/scripts/deploy_storage_rules.py
```

### Bước 5: Kiểm tra trên Firebase Console

1. Mở https://console.firebase.google.com/
2. Chọn project `coffe-detect`
3. Vào **Storage** → **Rules**
4. Kiểm tra rules đã được deploy

---

## 🔧 CÁCH 2: Upload qua Backend (Nếu không muốn dùng Firebase CLI)

Nếu không muốn cài Firebase CLI, có thể upload ảnh qua backend API.

### Bước 1: Cập nhật frontend để upload qua backend

Sửa file `src/features/profile/viewmodels/profileDetailVM.ts`:

```typescript
// Thay vì upload trực tiếp lên Firebase Storage
// Upload qua backend API

const handleSaveProfile = async () => {
  // ... validation code ...

  try {
    let avatarUrl = user.avatar;

    // Upload avatar qua backend nếu là local URI
    if (user.avatar && user.avatar.startsWith("file://")) {
      console.log("[profileDetailVM] Uploading avatar via backend...");
      
      // Convert image to base64
      const response = await fetch(user.avatar);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Upload qua backend API
      const token = await authUser.getIdToken();
      const uploadResponse = await fetch(`${API_ENDPOINTS.USER_UPLOAD_AVATAR}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageData: base64.split(',')[1], // Remove data:image/jpeg;base64,
          fileExtension: 'jpg'
        })
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload avatar failed');
      }

      const result = await uploadResponse.json();
      avatarUrl = result.avatarUrl;
    }

    // ... rest of the code ...
  }
}
```

### Bước 2: Thêm API endpoint trong backend

File `backend/api/user_api.py`:

```python
@router.post("/upload-avatar")
async def upload_avatar(
    request: dict,
    authorization: str = Header(None)
):
    """Upload avatar qua backend."""
    user_id = await get_current_user_id(authorization)
    
    image_data = request.get('imageData')
    file_extension = request.get('fileExtension', 'jpg')
    
    if not image_data:
        raise HTTPException(status_code=400, detail="No image data")
    
    # Decode base64
    import base64
    image_bytes = base64.b64decode(image_data)
    
    # Upload to Firebase Storage using Admin SDK
    from backend.repositories import firebase_storage_repository
    avatar_url = firebase_storage_repository.upload_avatar(
        user_id=user_id,
        file_data=image_bytes,
        file_extension=file_extension
    )
    
    if not avatar_url:
        raise HTTPException(status_code=500, detail="Upload failed")
    
    # Update user profile
    from backend.repositories import firebase_user_repository
    firebase_user_repository.update_user_avatar_url(user_id, avatar_url)
    
    return {
        'success': True,
        'avatarUrl': avatar_url
    }
```

---

## 🎯 Khuyến nghị

**Dùng CÁCH 1** vì:
- ✅ Miễn phí hoàn toàn
- ✅ Upload nhanh hơn (trực tiếp từ client)
- ✅ Không tốn băng thông backend
- ✅ Dễ quản lý qua Firebase Console

**Chỉ dùng CÁCH 2** nếu:
- ❌ Không thể cài Firebase CLI
- ❌ Cần xử lý ảnh trước khi lưu (resize, watermark, etc.)

---

## 📝 Lưu ý

1. Firebase Storage Rules đã được tạo sẵn trong `backend/storage.rules`
2. Rules cho phép:
   - User upload avatar của chính mình
   - User upload ảnh chẩn đoán
   - Mọi người xem avatar (public)
   - Giới hạn file size: 5MB
   - Chỉ cho phép file ảnh

3. Nếu gặp lỗi khi deploy:
   ```bash
   firebase login --reauth
   firebase use coffe-detect
   firebase deploy --only storage
   ```
