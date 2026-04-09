@echo off
echo ========================================
echo KIEM TRA KET NOI BACKEND
echo ========================================
echo.

REM Doc IP tu file .env
for /f "tokens=2 delims==" %%a in ('findstr "EXPO_PUBLIC_API_BASE_URL" .env') do set API_URL=%%a

echo Backend URL: %API_URL%
echo.

REM Kiem tra backend co dang chay khong
echo [1] Kiem tra backend co dang chay...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %API_URL%/docs
if %errorlevel% neq 0 (
    echo [X] KHONG KET NOI DUOC BACKEND!
    echo.
    echo Nguyen nhan co the:
    echo   1. Backend chua chay - Chay: python backend/main.py
    echo   2. IP sai trong file .env
    echo   3. Firewall chan ket noi
    echo.
    echo Kiem tra IP WiFi that:
    echo.
    powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like '*Wi-Fi*'} | Select-Object IPAddress, InterfaceAlias"
    echo.
    pause
    exit /b 1
)

echo [OK] Backend dang chay!
echo.

REM Kiem tra API posts
echo [2] Kiem tra API community posts...
curl -s %API_URL%/api/community/posts?page=1^&limit=5
echo.
echo.

echo [3] Kiem tra API notifications...
curl -s %API_URL%/api/notifications?page=1^&limit=5
echo.
echo.

echo ========================================
echo KET QUA: Backend hoat dong binh thuong!
echo ========================================
pause
