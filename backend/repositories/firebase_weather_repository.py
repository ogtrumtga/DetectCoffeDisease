"""
Firebase Weather Cache repository.

Làm việc với collection weather_cache để cache dữ liệu thời tiết.
"""
from backend.config import db
from typing import Optional, Dict, Any
from datetime import datetime, timedelta


def get_cached_weather(location_key: str) -> Optional[Dict[str, Any]]:
    """Lấy dữ liệu thời tiết đã cache."""
    try:
        doc = db.collection('weather_cache').document(location_key).get()
        
        if not doc.exists:
            return None
        
        data = doc.to_dict()
        
        # Kiểm tra cache có còn hợp lệ không (< 1 giờ)
        cached_at = data.get('cachedAt')
        if cached_at:
            if datetime.utcnow() - cached_at > timedelta(hours=1):
                return None
        
        return data.get('weatherData')
    except Exception as e:
        print(f"Error getting cached weather: {e}")
        return None


def cache_weather_data(location_key: str, weather_data: Dict[str, Any]) -> bool:
    """Cache dữ liệu thời tiết."""
    try:
        cache_data = {
            'locationKey': location_key,
            'weatherData': weather_data,
            'cachedAt': datetime.utcnow()
        }
        
        db.collection('weather_cache').document(location_key).set(cache_data)
        return True
    except Exception as e:
        print(f"Error caching weather: {e}")
        return False


def clear_old_weather_cache(days: int = 7) -> bool:
    """Xóa cache thời tiết cũ hơn X ngày."""
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        docs = db.collection('weather_cache')\
            .where('cachedAt', '<', cutoff_date)\
            .stream()
        
        for doc in docs:
            doc.reference.delete()
        
        return True
    except Exception as e:
        print(f"Error clearing old cache: {e}")
        return False
