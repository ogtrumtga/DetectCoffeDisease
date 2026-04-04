# ⚡ SỬA NGAY BÂY GIỜ - App vẫn dùng URL cũ

## ❌ VẤN ĐỀ:
```
LOG  Starting upload to: http://192.168.1.4:8000/...  ← URL CŨ SAI
```

## ✅ NGUYÊN NHÂN:
- File `.env` đã đúng: `http://10.10.10.252:8000` ✅
- Nhưng app vẫn dùng cache cũ ❌

---

## 🚀 GIẢI PHÁP (Làm NGAY 4 bước)

### Bước 1: Dừng Expo
```bash
# Trong terminal đang chạy Expo, nhấn:
Ctrl + C
```

### Bước 2: Xóa cache
```bash
# Chạy lệnh này:
rmdir /s /q .expo

# Nếu hỏi Y/N, nhấn Y
```

### Bước 3: Restart Expo với cache clear
```bash
npx expo start -c
```

### Bước 4: Reload app trên điện thoại
```
1. Shake điện thoại (lắc mạnh)
2. Menu hiện ra → Chọn "Reload"
3. Đợi app reload xong
```

---

## 🎯 HOẶC CHẠY SCRIPT TỰ ĐỘNG

```bash
# Double click file này:
CLEAR_CACHE_AND_RESTART.bat
```

---

## ✅ KIỂM TRA KẾT QUẢ

Sau khi reload, xem logs:

**ĐÚNG (Thành công):**
```
LOG  [confirm-screenVM] Starting upload to: http://10.10.10.252:8000/...
                                                    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                                    IP MỚI ĐÚNG
```

**SAI (Vẫn cache):**
```
LOG  [confirm-screenVM] Starting upload to: http://192.168.1.4:8000/...
                                                    ↑↑↑↑↑↑↑↑↑↑↑↑
                                                    IP CŨ SAI
```

---

## 🚨 NẾU VẪN KHÔNG ĐƯỢC

### Thử cách này (Reset hoàn toàn):

```bash
# 1. Dừng Expo (Ctrl+C)

# 2. Xóa tất cả cache
rmdir /s /q .expo
rmdir /s /q node_modules\.cache

# 3. Restart
npx expo start -c

# 4. Trên điện thoại:
#    - Đóng app hoàn toàn (swipe up)
#    - Mở lại Expo Go
#    - Scan QR code lại
```

---

## 📱 CÁCH RELOAD APP ĐÚNG

### Cách 1: Shake điện thoại
1. Lắc điện thoại mạnh
2. Menu hiện ra
3. Chọn "Reload"

### Cách 2: Từ terminal
1. Nhấn `r` trong terminal Expo
2. App tự động reload

### Cách 3: Đóng và mở lại
1. Swipe up để đóng app
2. Mở lại Expo Go
3. App sẽ reload

---

## 🔍 DEBUG (Nếu vẫn lỗi)

### Thêm log để kiểm tra:

Mở file `src/config/api.ts`, thêm log:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://YOUR_IP:8000';

// THÊM 2 DÒNG NÀY:
console.log('🔍 [DEBUG] API_BASE_URL:', API_BASE_URL);
console.log('🔍 [DEBUG] From .env:', process.env.EXPO_PUBLIC_API_BASE_URL);

export const API_ENDPOINTS = {
  // ...
};
```

Restart app và xem logs. Nếu thấy:
```
🔍 [DEBUG] API_BASE_URL: http://10.10.10.252:8000
🔍 [DEBUG] From .env: http://10.10.10.252:8000
```
→ Environment variable đã load đúng

Nếu thấy:
```
🔍 [DEBUG] API_BASE_URL: http://YOUR_IP:8000
🔍 [DEBUG] From .env: undefined
```
→ Environment variable CHƯA load → Cần rebuild

---

## 🛠️ REBUILD HOÀN TOÀN (Phương án cuối)

```bash
# 1. Dừng Expo (Ctrl+C)

# 2. Xóa tất cả
rmdir /s /q .expo
rmdir /s /q node_modules
del package-lock.json

# 3. Cài lại
npm install

# 4. Start
npx expo start -c

# 5. Trên điện thoại: Scan QR code lại
```

---

## 📋 CHECKLIST

- [ ] Dừng Expo: `Ctrl+C`
- [ ] Xóa cache: `rmdir /s /q .expo`
- [ ] Restart: `npx expo start -c`
- [ ] Reload app: Shake → Reload
- [ ] Kiểm tra logs: URL phải là `10.10.10.252`
- [ ] Test upload ảnh

---

## 💡 TẠI SAO CẦN XÓA CACHE?

Expo lưu cache của:
- JavaScript bundle
- Environment variables
- Metro bundler cache

Khi bạn đổi `.env`, cache cũ vẫn còn → App dùng URL cũ.

**Giải pháp**: Xóa cache và restart với `-c` flag.

---

## ✅ SAU KHI FIX XONG

1. URL trong logs phải là: `http://10.10.10.252:8000`
2. Backend phải chạy: `python backend/main.py`
3. Test upload ảnh → Phải thành công

---

**LƯU Ý**: Mỗi lần đổi `.env`, PHẢI:
1. Dừng Expo
2. Xóa cache: `rmdir /s /q .expo`
3. Restart: `npx expo start -c`
4. Reload app

---

**Cập nhật**: 2024-04-04
