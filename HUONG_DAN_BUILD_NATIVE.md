# Hướng dẫn Build Native App để sử dụng Google Sign-In

## Yêu cầu

- Node.js đã cài đặt
- Xcode (cho iOS) hoặc Android Studio (cho Android)
- Tài khoản Expo đã đăng nhập

## Bước 1: Cài đặt expo-dev-client

```bash
npx expo install expo-dev-client
```

## Bước 2: Build iOS (nếu có Mac)

### 2.1. Cài đặt dependencies
```bash
npm install
```

### 2.2. Prebuild iOS
```bash
npx expo prebuild --platform ios
```

### 2.3. Chạy trên iOS Simulator
```bash
npx expo run:ios
```

### 2.4. Chạy trên thiết bị iOS thật
```bash
npx expo run:ios --device
```

## Bước 3: Build Android

### 3.1. Prebuild Android
```bash
npx expo prebuild --platform android
```

### 3.2. Chạy trên Android Emulator
```bash
npx expo run:android
```

### 3.3. Chạy trên thiết bị Android thật
```bash
npx expo run:android --device
```

## Bước 4: Tải file GoogleService-Info.plist (cho iOS)

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project "Coffee-Detect"
3. Vào **Project Settings** (icon bánh răng)
4. Scroll xuống phần **Your apps**
5. Click vào iOS app (nếu chưa có, tạo mới với Bundle ID: `com.mynewproject.MyNewProject`)
6. Tải file **GoogleService-Info.plist**
7. Copy file vào thư mục gốc project (cùng cấp với app.json)

## Bước 5: Tải file google-services.json (cho Android)

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project "Coffee-Detect"
3. Vào **Project Settings**
4. Scroll xuống phần **Your apps**
5. Click vào Android app (nếu chưa có, tạo mới với Package name: `com.mynewproject.MyNewProject`)
6. Tải file **google-services.json**
7. Copy file vào thư mục gốc project

## Bước 6: Cập nhật app.json

File đã được cập nhật tự động với:
- `googleServicesFile` cho iOS
- `googleServicesFile` cho Android

## Bước 7: Test Google Sign-In

1. Build và chạy app:
   ```bash
   npx expo run:ios
   # hoặc
   npx expo run:android
   ```

2. Vào màn hình đăng nhập
3. Click "Đăng nhập bằng Google"
4. Chọn tài khoản Google
5. Đăng nhập thành công!

## Troubleshooting

### Lỗi: "No bundle URL present"
```bash
npx expo start --dev-client
```

### Lỗi: "GoogleService-Info.plist not found"
- Đảm bảo file GoogleService-Info.plist nằm ở thư mục gốc
- Chạy lại: `npx expo prebuild --clean`

### Lỗi: "google-services.json not found"
- Đảm bảo file google-services.json nằm ở thư mục gốc
- Chạy lại: `npx expo prebuild --clean`

### Lỗi build iOS
```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### Lỗi build Android
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Build Production với EAS (Optional)

### Cài đặt EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Build iOS
```bash
eas build --platform ios
```

### Build Android
```bash
eas build --platform android
```

## Lưu ý quan trọng

1. **iOS Client ID và Android Client ID** đã được cấu hình trong file `.env`
2. **Redirect URI** đã được thêm vào Google Cloud Console
3. **Test users** đã được thêm vào OAuth consent screen
4. **Bundle ID (iOS)** và **Package name (Android)** phải khớp với Google Cloud Console

## Kiểm tra cấu hình

### File .env
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=824481768502-857r8ot7cg0i1vsvdn376jgc08f73hlb.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=<your-ios-client-id>
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=<your-android-client-id>
EXPO_PUBLIC_EXPO_USERNAME=thanhduong1
EXPO_PUBLIC_EXPO_SLUG=MyNewProject
```

### Google Cloud Console
- Web Client ID: Có redirect URI `https://auth.expo.io/@thanhduong1/MyNewProject`
- iOS Client ID: Bundle ID `com.mynewproject.MyNewProject`
- Android Client ID: Package name `com.mynewproject.MyNewProject` + SHA-1

## Kết luận

Sau khi build native app, Google Sign-In sẽ hoạt động hoàn hảo. Expo Go không hỗ trợ tốt Google OAuth, nên cần build native app với expo-dev-client.
