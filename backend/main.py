"""
FastAPI Backend for Coffee Disease Detection App.

Main entry point for the API server.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from backend.api import (
    auth_api,
    user_api,
    history_api,
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
app.include_router(history_api.router)
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
