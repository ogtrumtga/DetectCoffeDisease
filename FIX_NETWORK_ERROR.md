# 🔧 SỬA LỖI NETWORK REQUEST FAILED

## ❌ Lỗi hiện tại:
```
ERROR [fetchWithTimeout] Request failed: [TypeError: Network request failed]
```

## ✅ GIẢI PHÁP (Làm theo thứ tự)

---

## Bước 1: Kiểm tra IP máy tính

### Cách 1: Chạy script tự động
```bash
# Double click file này:
check_ip.bat
```

### Cách 2: Chạy lệnh thủ công
```bash
ipconfig | findstr /i "IPv4"
```

**Kết quả hiện tại của bạn:**
```
IPv4 Address. . . . . . . . . . . : 192.168.36.1
IPv4 Address. . . . . . . . . . . : 10.0.0.1
IPv4 Address. . . . . . . . . . . : 192.168.172.1
IPv4 Address. . . . . . . . . . . : 10.10.10.252  ← Có thể là IP WiFi
```

**Cách xác định IP đúng:**
- Nếu dùng WiFi: Thường là `10.10.10.252` hoặc `192.168.x.x`
- Nếu dùng dây LAN: Thường là `192.168.x.x`
- Tránh IP `10.0.0.1` (thường là VirtualBox/VMware)

---

## Bước 2: Kiểm tra Backend đang chạy

### Cách 1: Chạy script test
```bash
# Double click file này:
test_backend.bat
```

### Cách 2: Test thủ công
```bash
# Mở browser, truy cập:
http://localhost:8000

# Hoặc dùng curl:
curl http://localhost:8000/health
```

**Nếu backend CHƯA chạy:**
```bash
# Mở terminal mới
cd backend
python main.py
```

Bạn sẽ thấy:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Bước 3: Cập nhật IP trong .env

File `.env` hiện tại đã được cập nhật:
```env
EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000
```

**Nếu IP không đúng, sửa lại:**
1. Mở file `.env`
2. Tìm dòng `EXPO_PUBLIC_API_BASE_URL`
3. Thay IP bằng IP đúng của bạn
4. Lưu file

---

## Bước 4: Kiểm tra Firewall

Windows Firewall có thể chặn kết nối.

### Cho phép Python qua Firewall:
1. Mở **Windows Security** → **Firewall & network protection**
2. Click **Allow an app through firewall**
3. Click **Change settings**
4. Tìm **Python** hoặc **python.exe**
5. Tick cả **Private** và **Public**
6. Click **OK**

### Hoặc tắt Firewall tạm thời (để test):
```bash
# Chạy PowerShell as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Sau khi test xong, bật lại:
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

## Bước 5: Đảm bảo cùng WiFi

**QUAN TRỌNG**: Điện thoại và máy tính PHẢI cùng mạng WiFi!

### Kiểm tra:
1. **Máy tính**: Settings → Network → WiFi → Tên WiFi
2. **Điện thoại**: Settings → WiFi → Tên WiFi
3. Đảm bảo 2 tên giống nhau

---

## Bước 6: Test từ điện thoại

### Mở browser trên điện thoại:
```
http://10.10.10.252:8000
```

**Nếu thấy JSON response → Backend OK:**
```json
{
  "message": "Coffee Disease Detection API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

**Nếu không kết nối được:**
- Thử các IP khác: `192.168.36.1`, `192.168.172.1`
- Kiểm tra Firewall
- Kiểm tra cùng WiFi

---

## Bước 7: Restart App

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

## 🎯 QUICK TEST (Nhanh nhất)

```bash
# Terminal 1: Start backend
cd backend
python main.py

# Terminal 2: Test backend
curl http://localhost:8000/health

# Terminal 3: Test từ IP
curl http://10.10.10.252:8000/health

# Nếu cả 2 đều OK → Restart app
npx expo start -c
```

---

## 🚨 TROUBLESHOOTING

### Vấn đề 1: Backend không start

**Lỗi**: `ModuleNotFoundError` hoặc `ImportError`

**Giải pháp**:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Vấn đề 2: Port 8000 đã được dùng

**Lỗi**: `Address already in use`

**Giải pháp**:
```bash
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID)
taskkill /PID <PID> /F

# Hoặc restart máy
```

### Vấn đề 3: Vẫn lỗi Network request failed

**Thử các IP khác:**

1. Sửa `.env`:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.36.1:8000
```

2. Restart app:
```bash
npx expo start -c
```

3. Test lại

4. Nếu không được, thử IP tiếp theo: `192.168.172.1`

---

## 📋 CHECKLIST ĐẦY ĐỦ

- [ ] Kiểm tra IP: `ipconfig | findstr IPv4`
- [ ] Backend đang chạy: `python backend/main.py`
- [ ] Test localhost: `http://localhost:8000`
- [ ] Test IP: `http://10.10.10.252:8000`
- [ ] Cập nhật `.env` với IP đúng
- [ ] Firewall cho phép Python
- [ ] Điện thoại và máy tính cùng WiFi
- [ ] Test từ browser điện thoại
- [ ] Restart app: `npx expo start -c`
- [ ] Reload app trên điện thoại

---

## 💡 LƯU Ý

1. **IP thay đổi**: Mỗi lần kết nối WiFi mới, IP có thể khác
2. **Cùng WiFi**: Điện thoại và máy tính PHẢI cùng mạng
3. **Backend chạy**: Backend phải chạy trước khi test app
4. **Cache**: Luôn restart app với `-c` sau khi đổi IP

---

## 🆘 VẪN KHÔNG ĐƯỢC?

### Debug chi tiết:

1. **Kiểm tra backend logs**:
```bash
# Trong terminal backend, xem có request nào đến không
# Nếu không có log → App không kết nối được
# Nếu có log → Kiểm tra lỗi trong log
```

2. **Test với Postman/Insomnia**:
```
POST http://10.10.10.252:8000/api/diagnosis/upload-image
Body: form-data
  - file: [chọn ảnh]
  - token: [Firebase token]
```

3. **Kiểm tra network trên điện thoại**:
- Settings → WiFi → Advanced → IP address
- Đảm bảo IP điện thoại cùng subnet với máy tính
- Ví dụ: Máy `10.10.10.252`, điện thoại `10.10.10.xxx`

---

**Cập nhật**: 2024-04-04
