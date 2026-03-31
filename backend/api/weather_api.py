"""
Weather API endpoints.
Prefix: /api/weather
"""
from fastapi import APIRouter, HTTPException, Query
from backend.services import weather_service
from typing import Optional

router = APIRouter(prefix="/api/weather", tags=["Weather"])


# ── 1. GET /api/weather/coords ──────────────────────────────────────────────
@router.get("/coords")
async def get_weather_by_coords(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    GET /api/weather/coords
    Lấy thông tin thời tiết theo tọa độ.
    - Input:  lat, lon (query params)
    - Output: { current, forecast }
    - Auth:   None (public)
    """
    result = weather_service.get_weather_by_coords_service(lat, lon)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


# ── 2. GET /api/weather/city ────────────────────────────────────────────────
@router.get("/city")
async def get_weather_by_city(
    name: str = Query(..., description="City name")
):
    """
    GET /api/weather/city
    Lấy thông tin thời tiết theo tên thành phố.
    - Input:  name (query param)
    - Output: { current, forecast }
    - Auth:   None (public)
    """
    result = weather_service.get_weather_by_city_name_service(name)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


# ── 3. GET /api/weather/spray-time ──────────────────────────────────────────
@router.get("/spray-time")
async def get_spray_time_recommendation(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    GET /api/weather/spray-time
    Gợi ý thời điểm phun thuốc dựa trên dự báo thời tiết.
    - Input:  lat, lon (query params)
    - Output: { recommendations: [...] }
    - Auth:   None (public)
    """
    result = weather_service.calculate_spray_time_recommendation_service(lat, lon)
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


# ── 4. GET /api/weather/spray-rules ─────────────────────────────────────────
@router.get("/spray-rules")
async def get_spray_rules():
    """
    GET /api/weather/spray-rules
    Giải thích chi tiết rules phun thuốc.
    - Input:  -
    - Output: { rules: {...} }
    - Auth:   None (public)
    """
    result = weather_service.explain_spray_rule_service()
    return result
