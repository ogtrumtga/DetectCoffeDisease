# 🚀 CÁCH CHẠY BACKEND

## ✅ CÁCH 1: Dùng Script (Khuyến nghị)

### Từ thư mục gốc:

```bash
# Chạy tất cả (Backend + Expo)
START_ALL.bat

# Chỉ chạy Backend
CHECK_BACKEND.bat
```

### Từ thư mục backend:

```bash
cd backend
python main.py
```

## ✅ CÁCH 2: Chạy thủ công

### Từ thư mục gốc (Khuyến nghị):

```bash
# Cách 1: Dùng Python module
python -m backend.main

# Cách 2: Dùng uvicorn
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Từ thư mục backend:

```bash
cd backend

# Cách 1: Chạy trực tiếp (đã fix sys.path)
python main.py

# Cách 2: Dùng uvicorn (không khuyến nghị từ thư mục backend)
# python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## ❌ LỖI THƯỜNG GẶP

### Lỗi: ModuleNotFoundError: No module named 'backend'

**Nguyên nhân**: Chạy uvicorn từ thư mục `backend` với import `from backend.api`

**Giải pháp**:

1. **Dùng `python main.py`** thay vì `python -m uvicorn main:app`
2. Hoặc chạy từ thư mục gốc: `python -m uvicorn backend.main:app`

### Lỗi: Port 8000 already in use

**Giải pháp**:

```bash
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### Lỗi: No module named 'fastapi'

**Giải pháp**:

```bash
cd backend
pip install -r requirements.txt
```

## 🎯 KIỂM TRA BACKEND

Sau khi chạy backend, mở browser:

```
http://localhost:8000/docs
```

Bạn sẽ thấy trang Swagger UI với tất cả API endpoints.

## 📋 THÔNG TIN

- **Port**: 8000
- **Host**: 0.0.0.0 (accessible từ mọi thiết bị trong mạng)
- **Reload**: Tự động reload khi code thay đổi
- **Docs**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/health

## 🔧 CẤU TRÚC IMPORT

File `backend/main.py` đã được fix để hỗ trợ cả 2 cách chạy:

```python
import sys
from pathlib import Path

# Add parent directory to Python path
backend_dir = Path(__file__).parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Giờ có thể import backend.api từ mọi nơi
from backend.api import auth_api, user_api, ...
```

## 🎓 TẠI SAO CẦN FIX?

**Trước khi fix**:
- Chạy từ `backend/`: ❌ ModuleNotFoundError
- Chạy từ gốc: ✅ OK

**Sau khi fix**:
- Chạy từ `backend/`: ✅ OK (tự động thêm parent vào sys.path)
- Chạy từ gốc: ✅ OK (không ảnh hưởng)
