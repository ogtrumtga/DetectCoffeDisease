"""
Diagnosis (Coffee Disease Detection) API service.

Các hàm dưới đây tương ứng với:
- POST /api/diagnosis/predict
- GET  /api/diagnosis/{id}
- GET  /api/diagnosis/diseases
- POST /api/diagnosis/upload-image

Chỉ khai báo tên hàm, chưa viết logic.
"""


def predict_disease_from_image():
    """Nhận ảnh lá cà phê, trả về kết quả chẩn đoán bệnh."""
    pass


def get_diagnosis_detail():
    """Lấy chi tiết một kết quả chẩn đoán (theo id)."""
    pass


def list_supported_diseases():
    """Danh sách các loại bệnh cà phê mà model hỗ trợ."""
    pass


def upload_raw_image():
    """Upload ảnh gốc, trả về thông tin file (URL/id) để chẩn đoán sau."""
    pass

