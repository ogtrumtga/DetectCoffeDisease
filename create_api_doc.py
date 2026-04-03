"""
Script tạo file Word documentation cho API endpoints
"""
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def add_table_border(table):
    """Thêm border cho bảng"""
    tbl = table._element
    tblPr = tbl.tblPr
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)
    
    tblBorders = OxmlElement('w:tblBorders')
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), '000000')
        tblBorders.append(border)
    tblPr.append(tblBorders)

def create_api_table(doc, api_data):
    """Tạo bảng cho một API endpoint"""
    table = doc.add_table(rows=len(api_data), cols=2)
    table.style = 'Light Grid Accent 1'
    add_table_border(table)
    
    for idx, (key, value) in enumerate(api_data.items()):
        row = table.rows[idx]
        row.cells[0].text = key
        row.cells[1].text = value
        
        # Format header cell
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(10)
        row.cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(0, 0, 0)
        
        # Format value cell
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(10)
    
    return table

# Tạo document
doc = Document()

# Thêm title
title = doc.add_heading('TÀI LIỆU API ENDPOINTS', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Thêm thông tin tổng quan
doc.add_paragraph('Tài liệu này mô tả chi tiết các API endpoints của hệ thống.')
doc.add_paragraph(f'Tổng số: 37 endpoints')
doc.add_paragraph()

# ============================================================================
# 1. AUTH API
# ============================================================================
doc.add_heading('1. AUTH API - Xác thực và Quản lý Phiên', 1)

# API 1.1: Đăng nhập
doc.add_heading('1.1. Đăng nhập', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/auth/login',
    'Tên hàm': 'login_user()',
    'Công dụng': 'Đăng nhập user, trả về access/refresh token',
    'Header': 'Content-Type: application/json',
    'Đầu vào': '{\n  "email": "string",\n  "password": "string"\n}',
    'Đầu ra': '{\n  "access_token": "string",\n  "refresh_token": "string",\n  "user": {...}\n}'
})
doc.add_paragraph()

# API 1.2: Đăng ký
doc.add_heading('1.2. Đăng ký tài khoản', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/auth/register',
    'Tên hàm': 'register_user()',
    'Công dụng': 'Đăng ký tài khoản mới',
    'Header': 'Content-Type: application/json',
    'Đầu vào': '{\n  "email": "string",\n  "password": "string",\n  "name": "string"\n}',
    'Đầu ra': '{\n  "message": "Registration successful",\n  "user_id": "string"\n}'
})
doc.add_paragraph()

# API 1.3: Đăng xuất
doc.add_heading('1.3. Đăng xuất', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/auth/logout',
    'Tên hàm': 'logout_user()',
    'Công dụng': 'Đăng xuất, vô hiệu hóa refresh token hiện tại',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': '{}',
    'Đầu ra': '{\n  "message": "Logout successful"\n}'
})
doc.add_paragraph()

# API 1.4: Làm mới token
doc.add_heading('1.4. Làm mới access token', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/auth/refresh',
    'Tên hàm': 'refresh_access_token()',
    'Công dụng': 'Làm mới access token từ refresh token hợp lệ',
    'Header': 'Content-Type: application/json',
    'Đầu vào': '{\n  "refresh_token": "string"\n}',
    'Đầu ra': '{\n  "access_token": "string"\n}'
})
doc.add_paragraph()

# API 1.5: Lấy thông tin user
doc.add_heading('1.5. Lấy thông tin user hiện tại', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/auth/me',
    'Tên hàm': 'get_current_user()',
    'Công dụng': 'Lấy thông tin user hiện tại từ access token',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'N/A (query params)',
    'Đầu ra': '{\n  "id": "string",\n  "email": "string",\n  "name": "string",\n  "avatar": "string"\n}'
})
doc.add_paragraph()

# ============================================================================
# 2. USER/PROFILE API
# ============================================================================
doc.add_heading('2. USER/PROFILE API - Quản lý Thông tin Cá nhân', 1)

# API 2.1: Lấy profile
doc.add_heading('2.1. Lấy thông tin profile', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/users/me',
    'Tên hàm': 'get_my_profile()',
    'Công dụng': 'Lấy thông tin profile của user hiện tại',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'N/A (query params)',
    'Đầu ra': '{\n  "id": "string",\n  "email": "string",\n  "name": "string",\n  "bio": "string",\n  "avatar": "string",\n  "created_at": "timestamp"\n}'
})
doc.add_paragraph()

# API 2.2: Cập nhật profile
doc.add_heading('2.2. Cập nhật thông tin profile', 2)
create_api_table(doc, {
    'Endpoint': 'PUT /api/users/me',
    'Tên hàm': 'update_my_profile()',
    'Công dụng': 'Cập nhật thông tin cá nhân (tên, bio, ...)',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: application/json',
    'Đầu vào': '{\n  "name": "string",\n  "bio": "string"\n}',
    'Đầu ra': '{\n  "message": "Profile updated successfully",\n  "user": {...}\n}'
})
doc.add_paragraph()

# API 2.3: Cập nhật avatar
doc.add_heading('2.3. Cập nhật ảnh đại diện', 2)
create_api_table(doc, {
    'Endpoint': 'PUT /api/users/me/avatar',
    'Tên hàm': 'update_my_avatar()',
    'Công dụng': 'Cập nhật ảnh đại diện user',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: multipart/form-data',
    'Đầu vào': '{\n  "avatar": "file (image)"\n}',
    'Đầu ra': '{\n  "message": "Avatar updated successfully",\n  "avatar_url": "string"\n}'
})
doc.add_paragraph()

# API 2.4: Xóa tài khoản
doc.add_heading('2.4. Xóa tài khoản', 2)
create_api_table(doc, {
    'Endpoint': 'DELETE /api/users/me',
    'Tên hàm': 'delete_my_account()',
    'Công dụng': 'Xóa tài khoản hiện tại',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': '{}',
    'Đầu ra': '{\n  "message": "Account deleted successfully"\n}'
})
doc.add_paragraph()

# API 2.5: Đổi mật khẩu
doc.add_heading('2.5. Đổi mật khẩu', 2)
create_api_table(doc, {
    'Endpoint': 'PATCH /api/users/me/password',
    'Tên hàm': 'change_my_password()',
    'Công dụng': 'Đổi mật khẩu tài khoản hiện tại',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: application/json',
    'Đầu vào': '{\n  "old_password": "string",\n  "new_password": "string"\n}',
    'Đầu ra': '{\n  "message": "Password changed successfully"\n}'
})
doc.add_paragraph()

# ============================================================================
# 3. COMMUNITY API
# ============================================================================
doc.add_heading('3. COMMUNITY API - Quản lý Bài đăng và Hoạt động Cộng đồng', 1)

# API 3.1: Lấy danh sách bài đăng
doc.add_heading('3.1. Lấy danh sách bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/posts',
    'Tên hàm': 'get_posts()',
    'Công dụng': 'Lấy danh sách bài đăng (feed cộng đồng, có phân trang)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?page=1&limit=20',
    'Đầu ra': '{\n  "posts": [...],\n  "total": "number",\n  "page": "number"\n}'
})
doc.add_paragraph()

# API 3.2: Tạo bài đăng
doc.add_heading('3.2. Tạo bài đăng mới', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/posts',
    'Tên hàm': 'create_post()',
    'Công dụng': 'Tạo bài đăng mới (tiêu đề, nội dung, ảnh, tag...)',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: application/json',
    'Đầu vào': '{\n  "title": "string",\n  "content": "string",\n  "images": ["string"],\n  "tags": ["string"]\n}',
    'Đầu ra': '{\n  "message": "Post created successfully",\n  "post_id": "string",\n  "post": {...}\n}'
})
doc.add_paragraph()

# API 3.3: Lấy chi tiết bài đăng
doc.add_heading('3.3. Lấy chi tiết bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/posts/{id}',
    'Tên hàm': 'get_post_detail()',
    'Công dụng': 'Lấy chi tiết một bài đăng theo id',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "id": "string",\n  "title": "string",\n  "content": "string",\n  "author": {...},\n  "likes_count": "number",\n  "comments_count": "number"\n}'
})
doc.add_paragraph()

# API 3.4: Xóa bài đăng
doc.add_heading('3.4. Xóa bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'DELETE /api/posts/{id}',
    'Tên hàm': 'delete_post()',
    'Công dụng': 'Xóa bài đăng của user hiện tại',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "message": "Post deleted successfully"\n}'
})
doc.add_paragraph()

# API 3.5: Like/Unlike bài đăng
doc.add_heading('3.5. Like/Unlike bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/posts/{id}/like\nDELETE /api/posts/{id}/like',
    'Tên hàm': 'toggle_post_like()',
    'Công dụng': 'Like hoặc bỏ like một bài đăng (toggle)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "message": "Post liked/unliked",\n  "is_liked": "boolean",\n  "likes_count": "number"\n}'
})
doc.add_paragraph()

# API 3.6: Thêm comment
doc.add_heading('3.6. Thêm comment vào bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/posts/{id}/comment',
    'Tên hàm': 'add_comment_to_post()',
    'Công dụng': 'Thêm comment mới vào bài đăng',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: application/json',
    'Đầu vào': 'Path param: {id}\nBody: {\n  "content": "string"\n}',
    'Đầu ra': '{\n  "message": "Comment added successfully",\n  "comment": {...}\n}'
})
doc.add_paragraph()

# API 3.7: Lấy danh sách comment
doc.add_heading('3.7. Lấy danh sách comment', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/posts/{id}/comments',
    'Tên hàm': 'get_comments_of_post()',
    'Công dụng': 'Lấy danh sách comment của một bài đăng',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}\nQuery params: ?page=1&limit=20',
    'Đầu ra': '{\n  "comments": [...],\n  "total": "number"\n}'
})
doc.add_paragraph()

# API 3.8: Tìm kiếm bài đăng
doc.add_heading('3.8. Tìm kiếm bài đăng', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/posts/search',
    'Tên hàm': 'search_posts()',
    'Công dụng': 'Tìm kiếm bài đăng theo từ khóa (tiêu đề/nội dung)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?q=keyword&page=1&limit=20',
    'Đầu ra': '{\n  "posts": [...],\n  "total": "number",\n  "query": "string"\n}'
})
doc.add_paragraph()

# ============================================================================
# 4. DIAGNOSIS API
# ============================================================================
doc.add_heading('4. DIAGNOSIS API - Chẩn đoán Bệnh Cà phê', 1)

# API 4.1: Chẩn đoán bệnh
doc.add_heading('4.1. Chẩn đoán bệnh từ ảnh', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/diagnosis/predict',
    'Tên hàm': 'predict_disease_from_image()',
    'Công dụng': 'Nhận ảnh lá cà phê, trả về kết quả chẩn đoán bệnh',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: multipart/form-data',
    'Đầu vào': '{\n  "image": "file (image)"\n}',
    'Đầu ra': '{\n  "diagnosis_id": "string",\n  "disease": "string",\n  "confidence": "number",\n  "description": "string",\n  "treatment": "string"\n}'
})
doc.add_paragraph()

# API 4.2: Lấy chi tiết chẩn đoán
doc.add_heading('4.2. Lấy chi tiết kết quả chẩn đoán', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/diagnosis/{id}',
    'Tên hàm': 'get_diagnosis_detail()',
    'Công dụng': 'Lấy chi tiết một kết quả chẩn đoán (theo id)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "id": "string",\n  "disease": "string",\n  "confidence": "number",\n  "description": "string",\n  "treatment": "string"\n}'
})
doc.add_paragraph()

# API 4.3: Danh sách bệnh
doc.add_heading('4.3. Danh sách bệnh được hỗ trợ', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/diagnosis/diseases',
    'Tên hàm': 'list_supported_diseases()',
    'Công dụng': 'Danh sách các loại bệnh cà phê mà model hỗ trợ',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'N/A (query params)',
    'Đầu ra': '{\n  "diseases": [\n    {\n      "name": "string",\n      "description": "string",\n      "symptoms": ["string"]\n    }\n  ]\n}'
})
doc.add_paragraph()

# API 4.4: Upload ảnh
doc.add_heading('4.4. Upload ảnh gốc', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/diagnosis/upload-image',
    'Tên hàm': 'upload_raw_image()',
    'Công dụng': 'Upload ảnh gốc, trả về thông tin file (URL/id) để chẩn đoán',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: multipart/form-data',
    'Đầu vào': '{\n  "image": "file (image)"\n}',
    'Đầu ra': '{\n  "image_id": "string",\n  "image_url": "string",\n  "uploaded_at": "timestamp"\n}'
})
doc.add_paragraph()

# ============================================================================
# 5. HISTORY API
# ============================================================================
doc.add_heading('5. HISTORY API - Quản lý Lịch sử Chẩn đoán', 1)

# API 5.1: Lấy danh sách lịch sử
doc.add_heading('5.1. Lấy danh sách lịch sử', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/history',
    'Tên hàm': 'list_user_histories()',
    'Công dụng': 'Lấy danh sách lịch sử chẩn đoán của user (có phân trang)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?page=1&limit=20',
    'Đầu ra': '{\n  "histories": [...],\n  "total": "number",\n  "page": "number"\n}'
})
doc.add_paragraph()

# API 5.2: Lấy chi tiết lịch sử
doc.add_heading('5.2. Lấy chi tiết lịch sử', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/history/{id}',
    'Tên hàm': 'get_history_detail()',
    'Công dụng': 'Lấy chi tiết một bản ghi lịch sử chẩn đoán',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "id": "string",\n  "disease": "string",\n  "confidence": "number",\n  "description": "string",\n  "treatment": "string"\n}'
})
doc.add_paragraph()

# API 5.3: Tạo bản ghi lịch sử
doc.add_heading('5.3. Tạo bản ghi lịch sử', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/history',
    'Tên hàm': 'create_history_entry()',
    'Công dụng': 'Tạo mới bản ghi lịch sử chẩn đoán sau khi model trả kết quả',
    'Header': 'Authorization: Bearer {access_token}\nContent-Type: application/json',
    'Đầu vào': '{\n  "diagnosis_id": "string",\n  "disease": "string",\n  "confidence": "number",\n  "image_url": "string"\n}',
    'Đầu ra': '{\n  "message": "History entry created",\n  "history_id": "string"\n}'
})
doc.add_paragraph()

# API 5.4: Xóa một bản ghi
doc.add_heading('5.4. Xóa một bản ghi lịch sử', 2)
create_api_table(doc, {
    'Endpoint': 'DELETE /api/history/{id}',
    'Tên hàm': 'delete_history_entry()',
    'Công dụng': 'Xóa một bản ghi lịch sử chẩn đoán theo id',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "message": "History entry deleted"\n}'
})
doc.add_paragraph()

# API 5.5: Xóa toàn bộ lịch sử
doc.add_heading('5.5. Xóa toàn bộ lịch sử', 2)
create_api_table(doc, {
    'Endpoint': 'DELETE /api/history',
    'Tên hàm': 'clear_all_histories()',
    'Công dụng': 'Xóa toàn bộ lịch sử chẩn đoán của user',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': '{}',
    'Đầu ra': '{\n  "message": "All histories cleared",\n  "deleted_count": "number"\n}'
})
doc.add_paragraph()

# ============================================================================
# 6. NOTIFICATION API
# ============================================================================
doc.add_heading('6. NOTIFICATION API - Quản lý Thông báo', 1)

# API 6.1: Lấy danh sách thông báo
doc.add_heading('6.1. Lấy danh sách thông báo', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/notifications',
    'Tên hàm': 'list_notifications()',
    'Công dụng': 'Lấy danh sách thông báo của user hiện tại',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?page=1&limit=20',
    'Đầu ra': '{\n  "notifications": [...],\n  "unread_count": "number",\n  "total": "number"\n}'
})
doc.add_paragraph()

# API 6.2: Đánh dấu đã đọc
doc.add_heading('6.2. Đánh dấu thông báo đã đọc', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/notifications/{id}/read',
    'Tên hàm': 'mark_notification_read()',
    'Công dụng': 'Đánh dấu một thông báo là đã đọc',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Path param: {id}',
    'Đầu ra': '{\n  "message": "Notification marked as read"\n}'
})
doc.add_paragraph()

# API 6.3: Đánh dấu tất cả đã đọc
doc.add_heading('6.3. Đánh dấu tất cả thông báo đã đọc', 2)
create_api_table(doc, {
    'Endpoint': 'POST /api/notifications/mark-all-read',
    'Tên hàm': 'mark_all_notifications_read()',
    'Công dụng': 'Đánh dấu tất cả thông báo là đã đọc',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': '{}',
    'Đầu ra': '{\n  "message": "All notifications marked as read",\n  "updated_count": "number"\n}'
})
doc.add_paragraph()

# ============================================================================
# 7. WEATHER API
# ============================================================================
doc.add_heading('7. WEATHER API - Thông tin Thời tiết và Gợi ý Phun thuốc', 1)

# API 7.1: Lấy thời tiết theo tọa độ
doc.add_heading('7.1. Lấy thời tiết theo tọa độ', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/weather/coords',
    'Tên hàm': 'get_weather_by_coords()',
    'Công dụng': 'Lấy thông tin thời tiết theo toạ độ (lat, lon)',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?lat=10.762622&lon=106.660172',
    'Đầu ra': '{\n  "location": {...},\n  "current": {...},\n  "forecast": [...]\n}'
})
doc.add_paragraph()

# API 7.2: Lấy thời tiết theo tên thành phố
doc.add_heading('7.2. Lấy thời tiết theo tên thành phố', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/weather/city',
    'Tên hàm': 'get_weather_by_city_name()',
    'Công dụng': 'Lấy thông tin thời tiết theo tên thành phố / địa điểm',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?name=Ho Chi Minh City',
    'Đầu ra': '{\n  "location": {...},\n  "current": {...},\n  "forecast": [...]\n}'
})
doc.add_paragraph()

# API 7.3: Gợi ý thời điểm phun thuốc
doc.add_heading('7.3. Gợi ý thời điểm phun thuốc', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/weather/spray-time',
    'Tên hàm': 'get_spray_time_recommendation()',
    'Công dụng': 'Gợi ý thời điểm phun thuốc dựa trên dự báo thời tiết',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?lat=10.762622&lon=106.660172',
    'Đầu ra': '{\n  "recommended_times": [...],\n  "best_time": {...}\n}'
})
doc.add_paragraph()

# API 7.4: Giải thích quy tắc phun thuốc
doc.add_heading('7.4. Giải thích quy tắc phun thuốc', 2)
create_api_table(doc, {
    'Endpoint': 'GET /api/weather/spray-rule-explain',
    'Tên hàm': 'get_spray_rule_explanation()',
    'Công dụng': 'Giải thích lý do nên/không nên phun thuốc tại thời điểm',
    'Header': 'Authorization: Bearer {access_token}',
    'Đầu vào': 'Query params: ?date=2026-03-17&time=06:00',
    'Đầu ra': '{\n  "date": "string",\n  "time": "string",\n  "weather_conditions": {...},\n  "recommendation": "string",\n  "explanation": "string"\n}'
})
doc.add_paragraph()

# ============================================================================
# Thêm phần tổng kết
# ============================================================================
doc.add_page_break()
doc.add_heading('Tổng kết', 1)

summary_table = doc.add_table(rows=8, cols=2)
summary_table.style = 'Light Grid Accent 1'
add_table_border(summary_table)

summary_data = [
    ('Tổng số API', '37 endpoints'),
    ('Auth API', '5 endpoints'),
    ('User/Profile API', '5 endpoints'),
    ('Community API', '8 endpoints'),
    ('Diagnosis API', '4 endpoints'),
    ('History API', '5 endpoints'),
    ('Notification API', '3 endpoints'),
    ('Weather API', '4 endpoints')
]

for idx, (key, value) in enumerate(summary_data):
    row = summary_table.rows[idx]
    row.cells[0].text = key
    row.cells[1].text = value
    row.cells[0].paragraphs[0].runs[0].font.bold = True
    row.cells[0].paragraphs[0].runs[0].font.size = Pt(11)

doc.add_paragraph()
doc.add_heading('Ghi chú quan trọng', 2)
notes = [
    'Tất cả các API yêu cầu xác thực (trừ login/register) đều cần header: Authorization: Bearer {access_token}',
    'Các API upload file cần header: Content-Type: multipart/form-data',
    'Các API gửi JSON cần header: Content-Type: application/json',
    'Phân trang mặc định: page=1, limit=20',
    'Timestamp format: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)'
]

for note in notes:
    p = doc.add_paragraph(note, style='List Bullet')
    p.paragraph_format.left_indent = Inches(0.25)

# Lưu file
doc.save('API_Documentation.docx')
print('✓ Đã tạo file API_Documentation.docx thành công!')
