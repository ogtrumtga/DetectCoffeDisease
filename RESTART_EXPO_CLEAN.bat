@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════╗
echo ║   XÓA CACHE VÀ RESTART EXPO            ║
echo ╚════════════════════════════════════════╝
echo.

echo [1/4] 🧹 Xóa cache Expo...
if exist .expo (
    rmdir /s /q .expo
    echo ✅ Đã xóa .expo
) else (
    echo ⚠️  Thư mục .expo không tồn tại
)
echo.

echo [2/4] 🧹 Xóa cache Metro...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ Đã xóa node_modules\.cache
)
echo.

echo [3/4] 🧹 Xóa cache Babel...
if exist .expo\cache (
    rmdir /s /q .expo\cache
    echo ✅ Đã xóa .expo\cache
)
echo.

echo [4/4] 🔄 Khởi động Expo với cache sạch...
echo.
echo ╔════════════════════════════════════════╗
echo ║   EXPO ĐANG KHỞI ĐỘNG...               ║
echo ╚════════════════════════════════════════╝
echo.

npx expo start -c
