"""
Weather & Spray-time service.

Xử lý:
- Lấy dữ liệu thời tiết từ Open-Meteo API
- Chuẩn hóa dữ liệu cho mobile
- Áp dụng rule gợi ý thời điểm phun thuốc
- Giải thích rule phun thuốc cho user
"""
from backend.repositories import firebase_weather_repository as weather_repo
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import requests


# Weather code mapping (Open-Meteo WMO codes)
WEATHER_DESCRIPTIONS = {
    0: 'Trời quang',
    1: 'Ít mây',
    2: 'Nhiều mây',
    3: 'U ám',
    45: 'Sương mù',
    48: 'Sương mù đóng băng',
    51: 'Mưa phùn nhẹ',
    53: 'Mưa phùn vừa',
    55: 'Mưa phùn dày đặc',
    61: 'Mưa nhẹ',
    63: 'Mưa vừa',
    65: 'Mưa to',
    71: 'Tuyết nhẹ',
    73: 'Tuyết vừa',
    75: 'Tuyết dày',
    80: 'Mưa rào nhẹ',
    81: 'Mưa rào vừa',
    82: 'Mưa rào to',
    95: 'Dông',
    96: 'Dông có mưa đá nhẹ',
    99: 'Dông có mưa đá to',
}


def get_weather_by_coords_service(lat: float, lon: float) -> Dict[str, Any]:
    """
    Lấy thời tiết theo toạ độ (lat, lon) từ Open-Meteo API.
    
    Open-Meteo là API miễn phí, không cần API key.
    """
    try:
        # Gọi Open-Meteo API
        base_url = 'https://api.open-meteo.com/v1/forecast'
        params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
            'hourly': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability',
            'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
            'timezone': 'Asia/Bangkok',
            'forecast_days': 7,
        }
        
        print(f"[Weather] Fetching from Open-Meteo: lat={lat}, lon={lon}")
        response = requests.get(base_url, params=params, timeout=10)
        
        if response.status_code != 200:
            print(f"[Weather] API error: {response.status_code}")
            return {
                'success': False,
                'message': f'Weather API returned status {response.status_code}'
            }
        
        data = response.json()
        
        # Parse current weather
        current = data.get('current', {})
        current_weather = {
            'temperature': round(current.get('temperature_2m', 0), 1),
            'humidity': round(current.get('relative_humidity_2m', 0)),
            'rainfall': round(current.get('precipitation', 0), 1),
            'wind_speed': round(current.get('wind_speed_10m', 0), 1),
            'weather_code': current.get('weather_code', 0),
            'description': WEATHER_DESCRIPTIONS.get(current.get('weather_code', 0), 'Không rõ'),
        }
        
        # Parse daily forecast
        daily = data.get('daily', {})
        forecast = []
        for i in range(len(daily.get('time', []))):
            forecast.append({
                'date': daily['time'][i],
                'temperature_max': round(daily['temperature_2m_max'][i], 1),
                'temperature_min': round(daily['temperature_2m_min'][i], 1),
                'rainfall_probability': round(daily.get('precipitation_probability_max', [0] * 7)[i]),
                'rainfall_sum': round(daily.get('precipitation_sum', [0] * 7)[i], 1),
                'weather_code': daily['weather_code'][i],
                'description': WEATHER_DESCRIPTIONS.get(daily['weather_code'][i], 'Không rõ'),
            })
        
        # Parse hourly data (for spray time calculation)
        hourly = data.get('hourly', {})
        hourly_data = []
        for i in range(min(24, len(hourly.get('time', [])))):  # Chỉ lấy 24h tới
            hourly_data.append({
                'time': hourly['time'][i],
                'temperature': round(hourly['temperature_2m'][i], 1),
                'humidity': round(hourly['relative_humidity_2m'][i]),
                'wind_speed': round(hourly['wind_speed_10m'][i], 1),
                'rainfall_probability': round(hourly.get('precipitation_probability', [0] * 24)[i]),
                'weather_code': hourly['weather_code'][i],
            })
        
        weather_data = {
            'location': {
                'lat': lat,
                'lon': lon,
                'name': 'Vị trí hiện tại'
            },
            'current': current_weather,
            'forecast': forecast,
            'hourly': hourly_data,
        }
        
        print(f"[Weather] Success: {current_weather['temperature']}°C, {current_weather['description']}")
        
        return {
            'success': True,
            'data': weather_data
        }
        
    except requests.Timeout:
        print(f"[Weather] Timeout")
        return {
            'success': False,
            'message': 'Weather API timeout. Please try again.'
        }
    except requests.RequestException as e:
        print(f"[Weather] Request error: {e}")
        return {
            'success': False,
            'message': f'Failed to fetch weather data: {str(e)}'
        }
    except Exception as e:
        print(f"[Weather] Error: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }


def get_weather_by_city_name_service(city_name: str) -> Dict[str, Any]:
    """
    Lấy thời tiết theo tên thành phố.
    
    Nếu thành phố không có trong danh sách, sử dụng Nominatim API để geocoding.
    """
    # Geocoding - Danh sách thành phố phổ biến VN
    city_coords = {
        # Hà Nội
        'hanoi': (21.0285, 105.8542),
        'ha noi': (21.0285, 105.8542),
        'hà nội': (21.0285, 105.8542),
        
        # Đắk Lắk
        'daklak': (12.6667, 108.0500),
        'dak lak': (12.6667, 108.0500),
        'đắk lắk': (12.6667, 108.0500),
        'buon ma thuot': (12.6667, 108.0500),
        'buôn ma thuột': (12.6667, 108.0500),
        
        # TP.HCM
        'saigon': (10.8231, 106.6297),
        'sai gon': (10.8231, 106.6297),
        'hồ chí minh': (10.8231, 106.6297),
        'ho chi minh': (10.8231, 106.6297),
        'tphcm': (10.8231, 106.6297),
        
        # Đà Nẵng
        'da nang': (16.0544, 108.2022),
        'đà nẵng': (16.0544, 108.2022),
        'danang': (16.0544, 108.2022),
        
        # Huế
        'hue': (16.4637, 107.5909),
        'huế': (16.4637, 107.5909),
        
        # Cần Thơ
        'can tho': (10.0452, 105.7469),
        'cần thơ': (10.0452, 105.7469),
        'cantho': (10.0452, 105.7469),
        
        # Hải Phòng
        'hai phong': (20.8449, 106.6881),
        'hải phòng': (20.8449, 106.6881),
        'haiphong': (20.8449, 106.6881),
        
        # Nha Trang
        'nha trang': (12.2388, 109.1967),
        'nhatrang': (12.2388, 109.1967),
        
        # Vũng Tàu
        'vung tau': (10.3460, 107.0843),
        'vũng tàu': (10.3460, 107.0843),
        'vungtau': (10.3460, 107.0843),
        
        # Đà Lạt
        'da lat': (11.9404, 108.4583),
        'đà lạt': (11.9404, 108.4583),
        'dalat': (11.9404, 108.4583),
        
        # Quy Nhơn
        'quy nhon': (13.7830, 109.2196),
        'quy nhơn': (13.7830, 109.2196),
        'quynhon': (13.7830, 109.2196),
        
        # Pleiku
        'pleiku': (13.9833, 108.0000),
        
        # Kon Tum
        'kon tum': (14.3497, 108.0005),
        'kontum': (14.3497, 108.0005),
        
        # Gia Lai
        'gia lai': (13.9833, 108.0000),
        'gialai': (13.9833, 108.0000),
    }
    
    city_lower = city_name.lower().strip()
    
    # Kiểm tra trong danh sách
    if city_lower in city_coords:
        coords = city_coords[city_lower]
        return get_weather_by_coords_service(coords[0], coords[1])
    
    # Nếu không có trong danh sách, thử geocoding với Nominatim
    try:
        print(f"[Weather] City '{city_name}' not in list, trying geocoding...")
        
        geocode_url = 'https://nominatim.openstreetmap.org/search'
        params = {
            'q': f"{city_name}, Vietnam",
            'format': 'json',
            'limit': 1,
        }
        headers = {
            'User-Agent': 'CoffeeDiseaseDetectionApp/1.0'
        }
        
        response = requests.get(geocode_url, params=params, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                lat = float(data[0]['lat'])
                lon = float(data[0]['lon'])
                print(f"[Weather] Geocoded '{city_name}' to: {lat}, {lon}")
                return get_weather_by_coords_service(lat, lon)
        
        print(f"[Weather] Geocoding failed, using default (Đắk Lắk)")
        
    except Exception as e:
        print(f"[Weather] Geocoding error: {e}")
    
    # Fallback: Đắk Lắk (vùng trồng cà phê chính)
    print(f"[Weather] Using default location: Đắk Lắk")
    return get_weather_by_coords_service(12.6667, 108.0500)


def calculate_spray_time_recommendation_service(lat: float, lon: float) -> Dict[str, Any]:
    """
    Tính toán gợi ý thời điểm phun thuốc dựa trên dữ liệu thời tiết thực.
    
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
        
        hourly = weather['data'].get('hourly', [])
        forecast = weather['data'].get('forecast', [])
        recommendations = []
        
        # Phân tích theo ngày (3 ngày tới)
        for day_idx in range(min(3, len(forecast))):
            day = forecast[day_idx]
            date = day['date']
            rainfall_prob = day.get('rainfall_probability', 0)
            
            # Lấy hourly data cho ngày này
            day_hourly = [h for h in hourly if h['time'].startswith(date)]
            
            # Tính trung bình độ ẩm và gió trong ngày
            if day_hourly:
                avg_humidity = sum(h['humidity'] for h in day_hourly) / len(day_hourly)
                avg_wind = sum(h['wind_speed'] for h in day_hourly) / len(day_hourly)
            else:
                # Fallback nếu không có hourly data
                avg_humidity = 70
                avg_wind = 5
            
            # Apply rules
            can_spray = True
            reasons = []
            best_times = []
            
            # Rule 1: Mưa
            if rainfall_prob > 70:
                can_spray = False
                reasons.append(f'Khả năng mưa cao ({rainfall_prob}%)')
            elif rainfall_prob > 40:
                reasons.append(f'Có thể mưa ({rainfall_prob}%), nên theo dõi')
            
            # Rule 2: Gió
            if avg_wind > 15:
                can_spray = False
                reasons.append(f'Gió mạnh ({round(avg_wind, 1)} km/h)')
            elif avg_wind > 10:
                reasons.append(f'Gió hơi mạnh ({round(avg_wind, 1)} km/h), cần cẩn thận')
            
            # Rule 3: Độ ẩm
            if avg_humidity < 50:
                reasons.append(f'Độ ẩm thấp ({round(avg_humidity)}%), hiệu quả kém')
            elif avg_humidity > 90:
                can_spray = False
                reasons.append(f'Độ ẩm quá cao ({round(avg_humidity)}%)')
            elif 60 <= avg_humidity <= 80:
                reasons.append(f'Độ ẩm lý tưởng ({round(avg_humidity)}%)')
            
            # Gợi ý thời gian cụ thể
            if can_spray:
                # Kiểm tra từng khung giờ
                morning_ok = True
                evening_ok = True
                
                for h in day_hourly:
                    hour = int(h['time'].split('T')[1].split(':')[0])
                    
                    # Sáng 6-9h
                    if 6 <= hour <= 9:
                        if h['rainfall_probability'] > 50 or h['wind_speed'] > 15:
                            morning_ok = False
                    
                    # Chiều 16-18h
                    if 16 <= hour <= 18:
                        if h['rainfall_probability'] > 50 or h['wind_speed'] > 15:
                            evening_ok = False
                
                if morning_ok:
                    best_times.append('6:00-9:00 sáng')
                if evening_ok:
                    best_times.append('16:00-18:00 chiều')
                
                if not best_times:
                    best_times.append('Theo dõi thời tiết trong ngày')
            
            if not reasons:
                reasons.append('Điều kiện tốt để phun thuốc')
            
            recommendations.append({
                'date': date,
                'can_spray': can_spray,
                'best_time': ', '.join(best_times) if best_times else None,
                'reasons': reasons,
                'confidence': 'high' if can_spray and best_times else 'medium' if can_spray else 'low',
                'weather': day.get('description', ''),
                'temperature_max': day.get('temperature_max'),
                'temperature_min': day.get('temperature_min'),
            })
        
        return {
            'success': True,
            'recommendations': recommendations
        }
        
    except Exception as e:
        print(f"[SprayTime] Error: {e}")
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
