# 🔍 KIỂM TRA IP VÀ SỬA LỖI NETWORK

## 📱 Bước 1: Kiểm tra IP máy tính (Backend)

### Windows (PowerShell hoặc CMD):
```bash
ipconfig
```

Tìm dòng **IPv4 Address** trong phần **Wireless LAN adapter Wi-Fi** hoặc **Ethernet adapter**

Ví dụ:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.10
```

### Hoặc dùng lệnh ngắn hơn:
```bash
ipconfig | findstr /i "IPv4"
```

---

## 🔧 Bước 2: Kiểm tra Backend đang chạy

### Kiểm tra backend có chạy không:
```bash
# Mở terminal mới, vào thư mục backend
cd backend

# Chạy backend
python main.py
```

Bạn sẽ thấy:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Test backend từ máy tính:
```bash
# Mở browser hoặc dùng curl
curl http://localhost:8000/health
```

Hoặc mở browser: `http://localhost:8000`

---

## 📝 Bước 3: Cập nhật IP trong .env

Sau khi có IP (ví dụ: `192.168.1.10`), sửa file `.env`:

```env
# Backend API (IP máy tính chạy backend)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000
```

**LƯU Ý**: 
- Thay `192.168.1.10` bằng IP thực tế của bạn
- Giữ nguyên port `:8000`
- Không có dấu `/` ở cuối

---

## 🔥 Bước 4: Restart App

### Dừng app hiện tại:
```bash
# Nhấn Ctrl+C trong terminal đang chạy Expo
```

### Xóa cache và restart:
```bash
# Xóa cache
npx expo start -c

# Hoặc
npm start -- --clear
```

### Reload app trên điện thoại:
- Shake điện thoại → Reload
- Hoặc nhấn `r` trong terminal Expo

---

## ✅ Bước 5: Kiểm tra kết nối

### Test từ điện thoại:

1. Mở browser trên điện thoại
2. Truy cập: `http://192.168.1.10:8000` (thay IP của bạn)
3. Nếu thấy JSON response → Backend OK

```json
{
  "message": "Coffee Disease Detection API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

## 🚨 TROUBLESHOOTING

### Lỗi 1: "Network request failed"

**Nguyên nhân**:
- IP sai
- Backend không chạy
- Firewall chặn
- Điện thoại và máy tính không cùng WiFi

**Giải pháp**:
```bash
# 1. Kiểm tra IP lại
ipconfig | findstr /i "IPv4"

# 2. Kiểm tra backend đang chạy
# Mở browser: http://localhost:8000

# 3. Kiểm tra firewall
# Windows: Settings → Firewall → Allow an app
# Cho phép Python qua firewall

# 4. Đảm bảo cùng WiFi
# Điện thoại và máy tính phải cùng mạng WiFi
```

### Lỗi 2: Backend không start

**Nguyên nhân**: Thiếu dependencies

**Giải pháp**:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Lỗi 3: Port 8000 đã được sử dụng

**Giải pháp**:
```bash
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F

# Hoặc đổi port khác
# Trong backend/main.py, dòng cuối:
# uvicorn.run(app, host="0.0.0.0", port=8001)

# Nhớ cập nhật .env:
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8001
```

---

## 📋 CHECKLIST

- [ ] Kiểm tra IP máy tính: `ipconfig`
- [ ] Backend đang chạy: `python backend/main.py`
- [ ] Test backend: `http://localhost:8000`
- [ ] Cập nhật IP trong `.env`
- [ ] Restart Expo: `npx expo start -c`
- [ ] Điện thoại và máy tính cùng WiFi
- [ ] Test từ browser điện thoại: `http://IP:8000`
- [ ] Firewall cho phép Python

---

## 🎯 QUICK FIX (Nhanh nhất)

```bash
# Terminal 1: Kiểm tra IP
ipconfig | findstr /i "IPv4"
# → Lấy IP (ví dụ: 192.168.1.10)

# Terminal 2: Start backend
cd backend
python main.py

# Terminal 3: Sửa .env
# Mở file .env, sửa dòng:
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000

# Terminal 4: Restart app
npx expo start -c
```

---

## 💡 LƯU Ý QUAN TRỌNG

1. **IP có thể thay đổi**: Mỗi lần kết nối WiFi, IP có thể khác
2. **Cùng mạng WiFi**: Điện thoại và máy tính PHẢI cùng WiFi
3. **Firewall**: Windows Firewall có thể chặn, cần allow Python
4. **Port 8000**: Đảm bảo không bị process khác chiếm

---

## 🔗 Test Connection Script

Tạo file `test_connection.js`:

```javascript
const API_URL = "http://192.168.1.10:8000"; // Thay IP của bạn

fetch(`${API_URL}/health`)
  .then(res => res.json())
  .then(data => {
    console.log("✅ Backend connected:", data);
  })
  .catch(err => {
    console.error("❌ Backend connection failed:", err.message);
  });
```

Chạy:
```bash
node test_connection.js
```
