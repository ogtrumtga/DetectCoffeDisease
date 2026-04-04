# ⚡ QUICK URL FIX - Chỉ 3 bước

## ✅ TẤT CẢ URL ĐỀU ĐỌC TỪ FILE .env

**Bạn CHỈ CẦN sửa 1 file: `.env`**

---

## 🚀 3 BƯỚC ĐƠN GIẢN

### Bước 1: Kiểm tra IP
```bash
ipconfig | findstr /i "IPv4"
```

**Kết quả ví dụ:**
```
IPv4 Address. . . . . . . . . . . : 10.10.10.252  ← Lấy IP này
```

### Bước 2: Sửa file .env
```env
# Backend API (IP máy tính chạy backend)
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000
```
**Thay `10.10.10.252` bằng IP của bạn**

### Bước 3: Restart App
```bash
npx expo start -c
```

---

## ✅ CÁC FILE TỰ ĐỘNG ĐỌC TỪ .env

Tất cả các file này đều đọc từ `process.env.EXPO_PUBLIC_API_BASE_URL`:

- ✅ `src/config/api.ts` - Tất cả API endpoints
- ✅ `src/features/camera/viewmodels/confirm-screenVM.ts` - Upload & predict
- ✅ `test_backend_connection.js` - Test script

**KHÔNG CẦN sửa các file trên!**

---

## 🔍 TEST NHANH

```bash
# Test backend
curl http://10.10.10.252:8000/health

# Hoặc chạy script
node test_backend_connection.js
```

---

## 🚨 NẾU VẪN LỖI

### 1. Backend chưa chạy?
```bash
cd backend
python main.py
```

### 2. Firewall chặn?
```
Windows Settings → Firewall → Allow Python
```

### 3. Không cùng WiFi?
```
Điện thoại và máy tính phải cùng mạng WiFi
```

### 4. IP sai?
```bash
# Thử các IP khác từ ipconfig
# Cập nhật lại .env và restart app
```

---

## 📚 Chi tiết đầy đủ

Xem file: `HUONG_DAN_CAU_HINH_URL.md`
