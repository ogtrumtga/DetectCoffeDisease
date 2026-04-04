# 🔧 HƯỚNG DẪN CẤU HÌNH URL BACKEND

## 📋 TẤT CẢ URL ĐỀU ĐỌC TỪ FILE .env

Tất cả các file trong project đều đọc URL từ environment variable `EXPO_PUBLIC_API_BASE_URL` trong file `.env`.

**Bạn CHỈ CẦN sửa 1 file duy nhất: `.env`**

---

## 📝 Bước 1: Kiểm tra IP máy tính

### Windows:
```bash
ipconfig | findstr /i "IPv4"
```

### Hoặc chạy script:
```bash
# Double click file này:
check_ip.bat
```

**Kết quả ví dụ:**
```
IPv4 Address. . . . . . . . . . . : 192.168.36.1
IPv4 Address. . . . . . . . . . . : 10.0.0.1
IPv4 Address. . . . . . . . . . . : 192.168.172.1
IPv4 Address. . . . . . . . . . . : 10.10.10.252  ← Thường là IP WiFi
```

**Chọn IP nào?**
- Nếu dùng WiFi: Chọn IP `10.x.x.x` hoặc `192.168.x.x` (không phải `10.0.0.1`)
- Nếu dùng dây LAN: Chọn IP `192.168.x.x`
- Tránh IP `10.0.0.1` (thường là VirtualBox/VMware)

---

## 📝 Bước 2: Cập nhật file .env

Mở file `.env` ở thư mục gốc project:

```env
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=824481768502-aem9cefa1lvbcdjq8ae25m11m8g1erfk.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=

# Expo Configuration
EXPO_PUBLIC_EXPO_USERNAME=thanhduong1
EXPO_PUBLIC_EXPO_SLUG=MyNewProject

# Backend API (IP máy tính chạy backend)
# ⬇️ CHỈ SỬA DÒNG NÀY ⬇️
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000
```

**Thay `10.10.10.252` bằng IP của bạn từ Bước 1**

---

## 📝 Bước 3: Restart App

### Dừng Expo:
```bash
# Nhấn Ctrl+C trong terminal Expo
```

### Xóa cache và restart:
```bash
npx expo start -c
```

### Reload app trên điện thoại:
- Shake điện thoại → **Reload**
- Hoặc nhấn `r` trong terminal Expo

---

## ✅ CÁC FILE TỰ ĐỘNG ĐỌC TỪ .env

Tất cả các file sau đều đọc từ `process.env.EXPO_PUBLIC_API_BASE_URL`:

### 1. `src/config/api.ts` ✅
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://YOUR_IP:8000';

export const API_ENDPOINTS = {
  DIAGNOSIS_UPLOAD: `${API_BASE_URL}/api/diagnosis/upload-image`,
  DIAGNOSIS_PREDICT: `${API_BASE_URL}/api/diagnosis/predict`,
  // ... tất cả endpoints khác
};
```

### 2. `src/features/camera/viewmodels/confirm-screenVM.ts` ✅
```typescript
import { API_ENDPOINTS } from "../../../config/api";

// Sử dụng:
await fetchWithTimeout(API_ENDPOINTS.DIAGNOSIS_UPLOAD, { ... });
await fetchWithTimeout(API_ENDPOINTS.DIAGNOSIS_PREDICT, { ... });
```

### 3. `test_backend_connection.js` ✅
```javascript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.10.10.252:8000';
```

**Chạy test:**
```bash
node test_backend_connection.js
```

---

## 🔍 KIỂM TRA CẤU HÌNH

### Test 1: Kiểm tra backend đang chạy
```bash
# Mở browser:
http://localhost:8000

# Hoặc:
curl http://localhost:8000/health
```

### Test 2: Kiểm tra từ IP
```bash
# Thay IP của bạn:
curl http://10.10.10.252:8000/health

# Hoặc mở browser điện thoại:
http://10.10.10.252:8000
```

### Test 3: Chạy script test
```bash
node test_backend_connection.js
```

**Kết quả mong đợi:**
```
============================================================
TEST KẾT NỐI BACKEND
============================================================

API Base URL: http://10.10.10.252:8000
(Từ env variable hoặc default)

1. Testing health check...
   ✅ Backend is running!
   Status: 200 OK

2. Testing upload endpoint availability...
   ✅ Upload endpoint accessible
   Status: 200

3. Testing predict endpoint availability...
   ✅ Predict endpoint accessible
   Status: 200

============================================================
✅ KẾT NỐI BACKEND HOẠT ĐỘNG TỐT!
============================================================
```

---

## 🚨 TROUBLESHOOTING

### Vấn đề 1: App vẫn dùng URL cũ

**Nguyên nhân**: Cache chưa được xóa

**Giải pháp**:
```bash
# Xóa cache hoàn toàn
npx expo start -c

# Hoặc
rm -rf .expo
npx expo start
```

### Vấn đề 2: "Network request failed"

**Nguyên nhân**: 
- IP sai
- Backend không chạy
- Firewall chặn
- Không cùng WiFi

**Giải pháp**:
```bash
# 1. Kiểm tra IP lại
ipconfig | findstr /i "IPv4"

# 2. Kiểm tra backend
curl http://localhost:8000/health

# 3. Test từ IP
curl http://10.10.10.252:8000/health

# 4. Kiểm tra firewall
# Windows: Settings → Firewall → Allow Python

# 5. Đảm bảo cùng WiFi
# Điện thoại và máy tính phải cùng mạng
```

### Vấn đề 3: Backend không start

**Giải pháp**:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## 📋 CHECKLIST

- [ ] Kiểm tra IP: `ipconfig | findstr IPv4`
- [ ] Cập nhật `.env`: `EXPO_PUBLIC_API_BASE_URL=http://[IP]:8000`
- [ ] Backend đang chạy: `python backend/main.py`
- [ ] Test localhost: `http://localhost:8000`
- [ ] Test IP: `http://[IP]:8000`
- [ ] Firewall cho phép Python
- [ ] Cùng WiFi
- [ ] Restart app: `npx expo start -c`
- [ ] Test script: `node test_backend_connection.js`

---

## 💡 LƯU Ý QUAN TRỌNG

### 1. Chỉ sửa 1 file duy nhất
**Bạn CHỈ CẦN sửa file `.env`**, tất cả các file khác tự động đọc từ đó.

### 2. IP có thể thay đổi
Mỗi lần kết nối WiFi mới, IP có thể khác. Cần kiểm tra lại và cập nhật `.env`.

### 3. Luôn restart với cache clear
Sau khi đổi IP, luôn chạy:
```bash
npx expo start -c
```

### 4. Cùng mạng WiFi
Điện thoại và máy tính PHẢI cùng mạng WiFi.

### 5. Backend phải chạy trước
Đảm bảo backend đang chạy trước khi test app:
```bash
cd backend
python main.py
```

---

## 🎯 QUICK START (Nhanh nhất)

```bash
# 1. Kiểm tra IP
ipconfig | findstr /i "IPv4"
# → Lấy IP (ví dụ: 10.10.10.252)

# 2. Sửa .env
# Mở file .env, sửa dòng:
# EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000

# 3. Start backend
cd backend
python main.py

# 4. Test backend
curl http://10.10.10.252:8000/health

# 5. Restart app
npx expo start -c

# 6. Test từ điện thoại
# Mở browser: http://10.10.10.252:8000
```

---

## 📚 TÀI LIỆU LIÊN QUAN

- `CHECK_IP_AND_FIX.md` - Hướng dẫn chi tiết kiểm tra IP
- `FIX_NETWORK_ERROR.md` - Sửa lỗi network request failed
- `check_ip.bat` - Script kiểm tra IP tự động
- `test_backend.bat` - Script test backend
- `test_backend_connection.js` - Script test kết nối

---

**Cập nhật**: 2024-04-04
**Version**: 1.0
