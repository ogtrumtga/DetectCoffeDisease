# 🔧 SỬA LỖI APP VẪN DÙNG URL CŨ

## ❌ Vấn đề:
```
LOG  [confirm-screenVM] Starting upload to: http://192.168.1.4:8000/...
```

App vẫn dùng URL cũ `192.168.1.4` thay vì URL mới trong `.env`

## ✅ NGUYÊN NHÂN: Cache chưa được xóa

---

## 🚀 GIẢI PHÁP (Làm theo thứ tự)

### Cách 1: Chạy script tự động (KHUYẾN NGHỊ)

```bash
# Double click file này:
CLEAR_CACHE_AND_RESTART.bat
```

Script sẽ:
1. Xóa thư mục `.expo`
2. Xóa `node_modules/.cache`
3. Xóa Metro cache
4. Tự động restart Expo với `-c`

---

### Cách 2: Xóa cache thủ công

#### Bước 1: Dừng Expo
```bash
# Nhấn Ctrl+C trong terminal Expo
```

#### Bước 2: Xóa cache
```bash
# Xóa thư mục .expo
rmdir /s /q .expo

# Xóa node_modules cache
rmdir /s /q node_modules\.cache

# Xóa Metro bundler cache
npx expo start -c
```

#### Bước 3: Restart app
```bash
npx expo start -c
```

#### Bước 4: Reload trên điện thoại
- Shake điện thoại
- Chọn **Reload**
- Hoặc nhấn `r` trong terminal

---

### Cách 3: Reset hoàn toàn (Nếu vẫn không được)

```bash
# 1. Dừng Expo (Ctrl+C)

# 2. Xóa tất cả cache
rmdir /s /q .expo
rmdir /s /q node_modules\.cache
del /q %TEMP%\metro-*
del /q %TEMP%\react-*

# 3. Xóa và cài lại node_modules (nếu cần)
rmdir /s /q node_modules
npm install

# 4. Start lại
npx expo start -c
```

---

## 🔍 KIỂM TRA URL ĐÚNG CHƯA

### Bước 1: Kiểm tra file .env
```bash
# Mở file .env, xem dòng:
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000
```

**Đảm bảo IP đúng!**

### Bước 2: Kiểm tra IP máy tính hiện tại
```bash
ipconfig | findstr /i "IPv4"
```

**So sánh với IP trong .env**

### Bước 3: Test backend
```bash
# Thay IP của bạn:
curl http://10.10.10.252:8000/health

# Hoặc mở browser:
http://10.10.10.252:8000
```

---

## 📱 RELOAD APP ĐÚNG CÁCH

### Trên điện thoại:

1. **Shake điện thoại** (lắc mạnh)
2. Menu hiện ra → Chọn **Reload**
3. Đợi app reload hoàn toàn

### Hoặc từ terminal:

1. Nhấn `r` trong terminal Expo
2. Đợi app reload

### Hoặc đóng app và mở lại:

1. Swipe up để đóng app hoàn toàn
2. Mở lại app từ Expo Go

---

## 🎯 QUICK FIX (Nhanh nhất)

```bash
# Terminal 1: Dừng Expo (Ctrl+C)

# Terminal 2: Xóa cache và restart
rmdir /s /q .expo
npx expo start -c

# Điện thoại: Shake → Reload
```

---

## ✅ KIỂM TRA SAU KHI FIX

### Xem logs trong terminal:

**Trước (SAI):**
```
LOG  [confirm-screenVM] Starting upload to: http://192.168.1.4:8000/...
```

**Sau (ĐÚNG):**
```
LOG  [confirm-screenVM] Starting upload to: http://10.10.10.252:8000/...
```

**Nếu URL đã đúng → Thành công!**

---

## 🚨 VẪN KHÔNG ĐƯỢC?

### Debug chi tiết:

#### 1. Kiểm tra environment variable có load không:

Thêm log vào `src/config/api.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://YOUR_IP:8000';

// Thêm dòng này để debug:
console.log('[API Config] Base URL:', API_BASE_URL);
console.log('[API Config] From env:', process.env.EXPO_PUBLIC_API_BASE_URL);

export const API_ENDPOINTS = {
  // ...
};
```

Restart app và xem logs.

#### 2. Kiểm tra file .env có đúng format không:

```env
# ĐÚNG:
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000

# SAI (có dấu cách):
EXPO_PUBLIC_API_BASE_URL = http://10.10.10.252:8000

# SAI (có dấu ngoặc):
EXPO_PUBLIC_API_BASE_URL="http://10.10.10.252:8000"

# SAI (có dấu / cuối):
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000/
```

#### 3. Kiểm tra file .env có ở đúng vị trí không:

```
MyProject/
├── .env          ← Phải ở đây (thư mục gốc)
├── package.json
├── app.json
├── src/
└── backend/
```

#### 4. Rebuild app hoàn toàn:

```bash
# Dừng Expo (Ctrl+C)

# Xóa tất cả
rmdir /s /q .expo
rmdir /s /q node_modules
del package-lock.json

# Cài lại
npm install

# Start
npx expo start -c
```

---

## 📋 CHECKLIST

- [ ] Dừng Expo (Ctrl+C)
- [ ] Kiểm tra IP: `ipconfig | findstr IPv4`
- [ ] Cập nhật `.env` với IP đúng
- [ ] Xóa thư mục `.expo`: `rmdir /s /q .expo`
- [ ] Xóa cache: `rmdir /s /q node_modules\.cache`
- [ ] Restart: `npx expo start -c`
- [ ] Reload app trên điện thoại (Shake → Reload)
- [ ] Kiểm tra logs xem URL đã đúng chưa

---

## 💡 LƯU Ý

### 1. Luôn restart với -c
Sau khi đổi `.env`, PHẢI chạy:
```bash
npx expo start -c
```

### 2. Luôn reload app
Sau khi restart Expo, PHẢI reload app trên điện thoại:
- Shake → Reload
- Hoặc đóng app và mở lại

### 3. Kiểm tra logs
Xem logs để đảm bảo URL đã đúng:
```
LOG  [confirm-screenVM] Starting upload to: http://[IP_MOI]:8000/...
```

### 4. Backend phải chạy
Đảm bảo backend đang chạy với IP mới:
```bash
cd backend
python main.py
```

---

## 🆘 LIÊN HỆ HỖ TRỢ

Nếu vẫn không được sau khi làm tất cả các bước trên:

1. Chụp màn hình logs
2. Chụp màn hình file `.env`
3. Chụp màn hình kết quả `ipconfig`
4. Gửi để được hỗ trợ

---

**Cập nhật**: 2024-04-04
