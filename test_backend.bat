@echo off
echo ========================================
echo TEST BACKEND CONNECTION
echo ========================================
echo.

echo Dang kiem tra backend...
echo.

curl -s http://localhost:8000/health

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Backend dang chay OK!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Backend KHONG chay!
    echo ========================================
    echo.
    echo Vui long chay backend truoc:
    echo   cd backend
    echo   python main.py
)

echo.
pause
