"""
FastAPI Backend for Coffee Disease Detection App.

Main entry point for the API server.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import auth_api, user_api

# Initialize FastAPI app
app = FastAPI(
    title="Coffee Disease Detection API",
    description="Backend API for Coffee Disease Detection Mobile App",
    version="1.0.0"
)

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
