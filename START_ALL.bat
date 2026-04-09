@echo off
chcp 65001 >nul
title Coffee Disease Detection - Startup
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║     COFFEE DISEASE DETECTION - KHỞI ĐỘNG HỆ THỐNG       ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM ═══════════════════════════════════════════════════════════
REM BƯỚC 1: LẤY IP WIFI (KHÔNG LẤY ADAPTER ẢO)
REM ═══════════════════════════════════════════════════════════
echo [1/5] 🔍 Đang lấy IP hiện tại...

REM Dùng PowerShell để lấy IP WiFi chính xác
for /f "tokens=*" %%a in ('powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like '*Wi-Fi*' -and $_.IPAddress -like '192.168.*'} | Select-Object -ExpandProperty IPAddress"') do (
    set CURRENT_IP=%%a
    goto :ip_found
)

REM Nếu không có WiFi, thử Ethernet
for /f "tokens=*" %%a in ('powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like '*Ethernet*' -and $_.IPAddress -like '192.168.1.*'} | Select-Object -ExpandProperty IPAddress"') do (
    set CURRENT_IP=%%a
    goto :ip_found
)

:ip_found

if "%CURRENT_IP%"=="" (
    echo ❌ Không tìm thấy IP WiFi trong dải 192.168.x.x
    echo.
    echo Chạy lệnh sau để xem IP:
    echo   ipconfig
    echo.
    pause
    exit /b 1
)

echo ✅ IP: %CURRENT_IP%
echo.

REM ═══════════════════════════════════════════════════════════
REM BƯỚC 2: CẬP NHẬT .ENV
REM ═══════════════════════════════════════════════════════════
echo [2/5] 📝 Cập nhật .env...
powershell -Command "(Get-Content .env) -replace 'EXPO_PUBLIC_API_BASE_URL=.*', 'EXPO_PUBLIC_API_BASE_URL=http://%CURRENT_IP%:8000' | Set-Content .env" >nul 2>&1
echo ✅ Backend URL: http://%CURRENT_IP%:8000
echo.

REM ═══════════════════════════════════════════════════════════
REM BƯỚC 3: XÓA CACHE
REM ═══════════════════════════════════════════════════════════
echo [3/5] 🧹 Xóa cache...
if exist .expo (
    rmdir /s /q .expo >nul 2>&1
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache >nul 2>&1
)
echo ✅ Cache đã xóa
echo.

REM ═══════════════════════════════════════════════════════════
REM BƯỚC 4: KHỞI ĐỘNG BACKEND
REM ═══════════════════════════════════════════════════════════
echo [4/5] 🚀 Khởi động Backend...

REM Kiểm tra backend đã chạy chưa
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend đã chạy
) else (
    echo 🔄 Đang khởi động backend...
    start "Backend Server" cmd /k "cd backend && python main.py"
    timeout /t 3 /nobreak >nul
    echo ✅ Backend đã khởi động
)
echo.

REM ═══════════════════════════════════════════════════════════
REM BƯỚC 5: KHỞI ĐỘNG EXPO
REM ═══════════════════════════════════════════════════════════
echo [5/5] 📱 Khởi động Expo...
echo.

echo ╔══════════════════════════════════════════════════════════╗
echo ║                    HỆ THỐNG ĐÃ SẴN SÀNG                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 🌐 Backend:  http://%CURRENT_IP%:8000/docs
echo 📱 Expo:     Đang khởi động...
echo.
echo 📋 Bước tiếp theo:
echo    1. Quét QR code trên điện thoại
echo    2. Đảm bảo điện thoại cùng WiFi với máy tính
echo    3. Test upload ảnh trong Camera tab
echo.
echo 🛑 Nhấn Ctrl+C để dừng Expo (Backend vẫn chạy ở cửa sổ khác)
echo.

npx expo start -c
