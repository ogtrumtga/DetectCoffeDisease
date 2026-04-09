@echo off
echo ========================================
echo    KHOI DONG BACKEND SERVER
echo ========================================
echo.

echo [1/3] Kiem tra Python...
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python chua duoc cai dat!
    echo Tai Python tai: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python da cai dat
echo.

echo [2/3] Kiem tra dependencies...
cd backend
if not exist venv (
    echo Tao virtual environment...
    python -m venv venv
)

echo Kich hoat virtual environment...
call venv\Scripts\activate.bat

echo Cai dat dependencies...
pip install -r requirements.txt --quiet
echo.

echo [3/3] Khoi dong server...
echo.
echo ========================================
echo    SERVER DANG CHAY
echo ========================================
echo.
echo Truy cap: http://localhost:8000/docs
echo Nhan Ctrl+C de dung server
echo.

python main.py
