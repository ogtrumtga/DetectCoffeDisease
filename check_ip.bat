@echo off
echo ========================================
echo KIEM TRA IP CUA MAY TINH
echo ========================================
echo.

echo Cac dia chi IP hien tai:
echo.
ipconfig | findstr /i "IPv4"

echo.
echo ========================================
echo CHI TIET ADAPTER MANG
echo ========================================
echo.
ipconfig | findstr /i "Wireless Ethernet IPv4"

echo.
echo ========================================
echo HUONG DAN
echo ========================================
echo.
echo 1. Tim dong "Wireless LAN adapter Wi-Fi" hoac "Ethernet adapter"
echo 2. Lay IP o dong "IPv4 Address" ben duoi no
echo 3. Cap nhat vao file .env:
echo    EXPO_PUBLIC_API_BASE_URL=http://[IP_CUA_BAN]:8000
echo.
echo Vi du: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:8000
echo.
pause
