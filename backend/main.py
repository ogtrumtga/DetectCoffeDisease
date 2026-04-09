"""
FastAPI Backend for Coffee Disease Detection App.

Main entry point for the API server.
"""
import sys
from pathlib import Path

# Add parent directory to Python path to support both:
# - Running from project root: python -m backend.main
# - Running from backend dir: python main.py
backend_dir = Path(__file__).parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from backend.api import (
    auth_api,
    user_api,
    diagnosis_api,
    community_api,
    feedbacks_api,
    treatments_api,
    notification_api,
    weather_api
)

# Initialize FastAPI app
app = FastAPI(
    title="Coffee Disease Detection API",
    description="Backend API for Coffee Disease Detection Mobile App",
    version="1.0.0"
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi

# CORS middleware - cho phép React Native app gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên chỉ định cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_api.router)
app.include_router(user_api.router)
app.include_router(diagnosis_api.router)
app.include_router(community_api.router)
app.include_router(feedbacks_api.router)
app.include_router(treatments_api.router)
app.include_router(notification_api.router)
app.include_router(weather_api.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Coffee Disease Detection API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "firebase": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    import socket
    
    # Lấy IP WiFi thật
    def get_local_ip():
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "localhost"
    
    local_ip = get_local_ip()
    
    print("=" * 60)
    print("🚀 Starting Coffee Disease Detection Backend")
    print("=" * 60)
    print(f"📍 Local:   http://localhost:8000")
    print(f"📍 Network: http://{local_ip}:8000")
    print(f"📚 Docs:    http://localhost:8000/docs")
    print("=" * 60)
    print(f"💡 Cập nhật IP trong .env của app:")
    print(f"   EXPO_PUBLIC_API_BASE_URL=http://{local_ip}:8000")
    print("=" * 60)
    print("🛑 Press CTRL+C to quit")
    print("=" * 60)
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
