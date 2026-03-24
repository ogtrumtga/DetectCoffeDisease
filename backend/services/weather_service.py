"""
Weather & Spray-time service.

Xử lý:
- Lấy dữ liệu thời tiết từ provider ngoài
- Chuẩn hóa dữ liệu cho mobile
- Áp dụng rule gợi ý thời điểm phun thuốc
- Giải thích rule phun thuốc cho user
"""


def fetch_weather_from_provider_service():
    """Gọi provider thời tiết (OpenWeather, ...) và trả raw data."""
    pass


def get_weather_by_coords_service():
    """Lấy thời tiết theo toạ độ (lat, lon) và mapping sang format chuẩn."""
    pass


def get_weather_by_city_name_service():
    """Lấy thời tiết theo tên thành phố / địa điểm."""
    pass


def calculate_spray_time_recommendation_service():
    """Tính toán gợi ý thời điểm phun thuốc dựa trên forecast + rules."""
    pass


def explain_spray_rule_service():
    """Giải thích chi tiết lý do nên/không nên phun thuốc."""
    pass

