"""
Weather & Spray-time API service.

Các hàm dưới đây có thể map tới:
- GET /api/weather/coords?lat=..&lon=..
- GET /api/weather/city?name=..
- GET /api/weather/spray-time
- GET /api/weather/spray-rule-explain

Chỉ khai báo tên hàm, chưa viết logic.
"""


def get_weather_by_coords():
    """Lấy thông tin thời tiết theo toạ độ (lat, lon)."""
    pass


def get_weather_by_city_name():
    """Lấy thông tin thời tiết theo tên thành phố / địa điểm."""
    pass


def get_spray_time_recommendation():
    """Gợi ý thời điểm phun thuốc dựa trên dự báo thời tiết và rule."""
    pass


def get_spray_rule_explanation():
    """Giải thích lý do nên/không nên phun thuốc tại thời điểm cụ thể."""
    pass

