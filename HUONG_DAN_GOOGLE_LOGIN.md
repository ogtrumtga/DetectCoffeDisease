# Hướng dẫn cấu hình đăng nhập Google cho ứng dụng Expo

## Bước 1: Cấu hình Firebase Authentication

### 1.1. Truy cập Firebase Console
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn (hoặc tạo mới nếu chưa có)

### 1.2. Bật Google Sign-In
1. Vào **Authentication** → **Sign-in method**
2. Click vào **Google** trong danh sách providers
3. Bật **Enable**
4. Nhập **Project support email** (email của bạn)
5. Click **Save**

## Bước 2: Tạo OAuth 2.0 Client IDs trên Google Cloud Console

### 2.1. Truy cập Google Cloud Console
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project Firebase của bạn (cùng tên với Firebase project)
3. Vào **APIs & Services** → **Credentials**

### 2.2. Tạo Web Client ID (BẮT BUỘC cho Expo Go)
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Chọn **Application type**: **Web application**
3. Đặt tên: `Web client for Expo`
4. Thêm **Authorized redirect URIs**:
   ```
   https://auth.expo.io/@keriyu/MyNewProject
   ```
   (Thay `keriyu` bằng username Expo của bạn nếu khác)
5. Click **CREATE**
6. **LƯU LẠI** Client ID này (dạng: `xxx.apps.googleusercontent.com`)

### 2.3. Tạo iOS Client ID (Nếu build iOS native)
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Chọn **Application type**: **iOS**
3. Đặt tên: `iOS client`
4. Nhập **Bundle ID**: `com.mynewproject.MyNewProject` (từ app.json)
5. Click **CREATE**
6. **LƯU LẠI** Client ID này

### 2.4. Tạo Android Client ID (Nếu build Android native)
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Chọn **Application type**: **Android**
3. Đặt tên: `Android client`
4. Nhập **Package name**: `com.mynewproject.MyNewProject` (từ app.json)
5. Lấy **SHA-1 certificate fingerprint**:
   ```bash
   # Debug keystore (cho development)
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
6. Copy SHA-1 và paste vào form
7. Click **CREATE**
8. **LƯU LẠI** Client ID này

## Bước 3: Cấu hình file .env

Mở file `.env` trong thư mục gốc project và điền các Client ID:

```env
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com

# Expo Configuration
EXPO_PUBLIC_EXPO_USERNAME=keriyu
EXPO_PUBLIC_EXPO_SLUG=MyNewProject
```

**Lưu ý:**
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: BẮT BUỘC cho Expo Go
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`: Chỉ cần khi build iOS native
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`: Chỉ cần khi build Android native

## Bước 4: Kiểm tra tài khoản Expo

### 4.1. Đăng nhập Expo CLI
```bash
npx expo login
```

Nhập username và password Expo của bạn.

### 4.2. Kiểm tra thông tin tài khoản
```bash
npx expo whoami
```

Kết quả sẽ hiển thị username của bạn (ví dụ: `keriyu`).

### 4.3. Kiểm tra project đã link với tài khoản
Mở file `app.json` và kiểm tra:
```json
{
  "expo": {
    "owner": "keriyu",
    "slug": "MyNewProject",
    ...
  }
}
```

Đảm bảo `owner` khớp với username Expo của bạn.

## Bước 5: Cài đặt dependencies (nếu chưa có)

```bash
npm install expo-auth-session expo-web-browser
```

## Bước 6: Chạy ứng dụng và test

### 6.1. Khởi động development server
```bash
npx expo start
```

### 6.2. Test trên Expo Go
1. Quét QR code bằng Expo Go app
2. Vào màn hình đăng nhập
3. Click "Đăng nhập bằng Google"
4. Chọn tài khoản Google
5. Cho phép quyền truy cập

### 6.3. Kiểm tra lỗi thường gặp

**Lỗi: "redirect_uri_mismatch"**
- Kiểm tra lại Authorized redirect URIs trong Google Cloud Console
- Đảm bảo format chính xác: `https://auth.expo.io/@username/slug`
- Username và slug phải khớp với `app.json`

**Lỗi: "invalid_client"**
- Kiểm tra lại Web Client ID trong file `.env`
- Đảm bảo không có khoảng trắng thừa
- Kiểm tra Client ID có đúng từ Google Cloud Console

**Lỗi: "Access blocked: This app's request is invalid"**
- Kiểm tra OAuth consent screen đã được cấu hình
- Thêm email test users nếu app đang ở chế độ Testing

## Bước 7: Build production (Optional)

Khi build production với EAS Build:

### 7.1. Cấu hình EAS
```bash
npx eas build:configure
```

### 7.2. Build iOS
```bash
npx eas build --platform ios
```

### 7.3. Build Android
```bash
npx eas build --platform android
```

**Lưu ý:** Khi build production, bạn cần:
- Tạo production keystore cho Android
- Lấy SHA-1 từ production keystore
- Cập nhật Android Client ID với SHA-1 mới

## Troubleshooting

### Kiểm tra biến môi trường
```bash
npx expo config --type public
```

Tìm `extra` section để xem các biến `EXPO_PUBLIC_*` có được load không.

### Reset cache
```bash
npx expo start -c
```

### Xem logs chi tiết
```bash
npx expo start --dev-client
```

## Tài liệu tham khảo

- [Expo Authentication](https://docs.expo.dev/guides/authentication/)
- [Google Sign-In with Expo](https://docs.expo.dev/guides/google-authentication/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Google Cloud Console](https://console.cloud.google.com/)
