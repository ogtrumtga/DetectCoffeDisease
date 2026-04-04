# Xác Định IP Đúng Cho App

## Máy Tính Có Nhiều IP

Máy tính của bạn có 4 IP addresses:
- `192.168.36.1` - Có thể là Ethernet hoặc WiFi hotspot
- `10.0.0.1` - Có thể là VPN hoặc virtual adapter
- `192.168.172.1` - Có thể là VMware/VirtualBox
- `192.168.1.4` - Có thể là WiFi chính

## Cách Xác Định IP Đúng

### Bước 1: Xác định điện thoại kết nối WiFi nào

Trên điện thoại:
1. Mở Settings → WiFi
2. Xem tên WiFi đang kết nối
3. Tap vào WiFi → Xem IP của điện thoại

Ví dụ:
- Nếu điện thoại có IP `192.168.1.xxx` → Dùng `192.168.1.4`
- Nếu điện thoại có IP `192.168.36.xxx` → Dùng `192.168.36.1`

### Bước 2: Test từng IP

Thử từng IP trong .env:

```env
# Test 1
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.4:8000

# Test 2
EXPO_PUBLIC_API_BASE_URL=http://192.168.36.1:8000

# Test 3
EXPO_PUBLIC_API_BASE_URL=http://10.0.0.1:8000

# Test 4
EXPO_PUBLIC_API_BASE_URL=http://192.168.172.1:8000
```

Sau mỗi lần đổi:
```bash
# Restart Expo
npx expo start --clear
```

### Bước 3: Kiểm tra kết nối

Từ điện thoại, mở browser và thử:
- http://192.168.1.4:8000/docs
- http://192.168.36.1:8000/docs

IP nào mở được Swagger UI → Đó là IP đúng!

## Giải Pháp Nhanh: Dùng Ngrok

Nếu không xác định được IP, dùng ngrok để tạo public URL:

### Cài Ngrok

1. Download: https://ngrok.com/download
2. Giải nén vào thư mục bất kỳ
3. Chạy:

```bash
ngrok http 8000
```

4. Copy URL (ví dụ: `https://abc123.ngrok.io`)
5. Update .env:

```env
EXPO_PUBLIC_API_BASE_URL=https://abc123.ngrok.io
```

6. Restart Expo:

```bash
npx expo start --clear
```

Ngrok sẽ forward request từ internet về máy tính, bỏ qua mọi vấn đề network local.

## Debug: Xem Backend Có Nhận Request Không

Khi chụp ảnh từ app, xem backend terminal:

### Nếu THẤY log này:
```
============================================================
[UPLOAD] Received upload request
[UPLOAD] File: photo.jpg
...
```
→ Request đến backend, vấn đề là xử lý

### Nếu KHÔNG THẤY gì:
→ Request không đến backend, vấn đề là network:
- IP sai
- Không cùng WiFi
- Firewall block

## Firewall Windows

Nếu IP đúng nhưng vẫn timeout, có thể firewall block:

1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Tìm "Python" hoặc "uvicorn"
4. Check cả Private và Public networks
5. Restart backend

## Checklist

- [ ] Xác định IP điện thoại (Settings → WiFi)
- [ ] Chọn IP máy tính cùng dải (192.168.1.xxx → 192.168.1.4)
- [ ] Update .env với IP đúng
- [ ] Restart Expo: `npx expo start --clear`
- [ 