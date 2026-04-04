# Hướng Dẫn Chạy Backend Server

## ❌ SAI - Đừng chạy như này

```bash
cd backend
python -m uvicorn backend.main:app --reload
```

Lỗi: `ModuleNotFoundError: No module named 'backend'`

## ✅ ĐÚNG - Chạy từ thư mục gốc project

### Cách 1: Chạy từ thư mục gốc (Khuyến nghị)

```bash
# Từ thư mục DetectCoffeDisease-1/
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Cách 2: Chạy trực tiếp main.py

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Cách 3: Dùng Python path

```bash
cd backend
python main.py
```

## 🚀 Quick Start

```bash
# 1. Về thư mục gốc
cd C:\Users\ADMIN\DetectCoffeDisease-1

# 2. Chạy server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: http://localhost:8000

## 📝 Giải thích

- Khi ở trong `backend/`, Python không thấy package `backend`
- Phải chạy từ thư mục cha để Python nhận diện `backend` là một package
- Hoặc dùng `main:app` thay vì `backend.main:app` khi đã cd vào backend/

## 🔧 Troubleshooting

### Lỗi: Port 8000 đã được sử dụng

```bash
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc dùng port khác
python -m uvicorn backend.main:app --reload --port 8001
```

### Lỗi: Module not found

```bash
# Cài đặt dependencies
pip install -r backend/requirements.txt
```

### Lỗi: serviceAccountKey.json not found

Đảm bảo file `backend/serviceAccountKey.json` tồn tại.
