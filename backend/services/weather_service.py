"""
Weather & Spray-time service.

Xử lý:
- Lấy dữ liệu thời tiết từ provider ngoài
- Chuẩn hóa dữ liệu cho mobile
- Áp dụng rule gợi ý thời điểm phun thuốc
- Giải thích rule phun thuốc cho user
"""
from backend.repositories import firebase_weather_repository as weather_repo
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import requests


# Mock weather data (TODO: Replace with real API)
def get_weather_by_coords_service(lat: float, lon: float) -> Dict[str, Any]:
    """
    Lấy thời tiết theo toạ độ (lat, lon).
    
    TODO: Tích hợp với Open-Meteo hoặc OpenWeatherMap API
    """
    try:
        # Mock data
        weather_data = {
            'location': {
                'lat': lat,
                'lon': lon,
                'name': 'Đắk Lắk'
            },
            'current': {
                'temperature': 28,
                'humidity': 75,
                'rainfall': 0,
                'wind_speed': 5,
                'description': 'Partly cloudy'
            },
            'forecast': [
                {
                    'date': (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'),
                    'temperature_max': 30 + i,
                    'temperature_min': 22 + i,
                    'humidity': 70 + i * 2,
                    'rainfall_probability': 20 + i * 10,
                    'description': 'Sunny'
                }
                for i in range(7)
            ]
        }
        
        return {
            'success': True,
            'data': weather_data
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def get_weather_by_city_name_service(city_name: str) -> Dict[str, Any]:
    """Lấy thời tiết theo tên thành phố."""
    # Mock: Convert city name to coords
    city_coords = {
        'hanoi': (21.0285, 105.8542),
        'daklak': (12.6667, 108.0500),
        'saigon': (10.8231, 106.6297)
    }
    
    coords = city_coords.get(city_name.lower(), (12.6667, 108.0500))
    return get_weather_by_coords_service(coords[0], coords[1])


def calculate_spray_time_recommendation_service(lat: float, lon: float) -> Dict[str, Any]:
    """
    Tính toán gợi ý thời điểm phun thuốc.
    
    Rules:
    - Không phun khi mưa hoặc sắp mưa (>70% probability)
    - Không phun khi gió mạnh (>15 km/h)
    - Thời gian tốt nhất: 6-9h sáng hoặc 16-18h chiều
    - Độ ẩm lý tưởng: 60-80%
    """
    try:
        weather = get_weather_by_coords_service(lat, lon)
        
        if not weather['success']:
            return weather
        
        forecast = weather['data']['forecast']
        recommendations = []
        
        for day in forecast[:3]:  # 3 ngày tới
            date = day['date']
            rainfall_prob = day['rainfall_probability']
            humidity = day['humidity']
            
            # Apply rules
            can_spray = True
            reasons = []
            
            if rainfall_prob > 70:
                can_spray = False
                reasons.append(f'Khả năng mưa cao ({rainfall_prob}%)')
            
            if humidity < 60:
                reasons.append('Độ ẩm thấp, hiệu quả kém')
            elif humidity > 90:
                can_spray = False
                reasons.append('Độ ẩm quá cao')
            
            recommendations.append({
                'date': date,
                'can_spray': can_spray,
                'best_time': '6:00-9:00 hoặc 16:00-18:00' if can_spray else None,
                'reasons': reasons if reasons else ['Điều kiện tốt để phun thuốc'],
                'confidence': 'high' if can_spray else 'low'
            })
        
        return {
            'success': True,
            'recommendations': recommendations
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def explain_spray_rule_service() -> Dict[str, Any]:
    """Giải thích chi tiết rules phun thuốc."""
    rules = {
        'weather_conditions': {
            'title': 'Điều kiện thời tiết',
            'rules': [
                {
                    'condition': 'Không mưa',
                    'reason': 'Mưa sẽ rửa trôi thuốc, giảm hiệu quả',
                    'threshold': 'Khả năng mưa < 30%'
                },
                {
                    'condition': 'Gió nhẹ',
                    'reason': 'Gió mạnh làm thuốc bay xa, không đúng mục tiêu',
                    'threshold': 'Tốc độ gió < 15 km/h'
                },
                {
                    'condition': 'Độ ẩm vừa phải',
                    'reason': 'Độ ẩm 60-80% giúp thuốc bám tốt và thấm đều',
                    'threshold': '60% < Độ ẩm < 80%'
                }
            ]
        },
        'best_time': {
            'title': 'Thời gian tốt nhất',
            'times': [
                {
                    'period': '6:00 - 9:00 sáng',
                    'reason': 'Nhiệt độ mát, ít gió, lá còn ẩm sương'
                },
                {
                    'period': '16:00 - 18:00 chiều',
                    'reason': 'Nhiệt độ giảm, thuốc không bị bay hơi nhanh'
                }
            ]
        },
        'avoid_time': {
            'title': 'Thời gian nên tránh',
            'times': [
                {
                    'period': '10:00 - 15:00',
                    'reason': 'Nắng gắt, thuốc bay hơi nhanh, có thể gây cháy lá'
                },
                {
                    'period': 'Ban đêm',
                    'reason': 'Độ ẩm cao, thuốc khó khô, dễ gây bệnh nấm'
                }
            ]
        }
    }
    
    return {
        'success': True,
        'rules': rules
    }
