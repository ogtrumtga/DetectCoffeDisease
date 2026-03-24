"""
Community (Activity) API service.

Các hàm dưới đây tương ứng với:
- GET    /api/posts
- POST   /api/posts
- GET    /api/posts/{id}
- DELETE /api/posts/{id}
- POST   /api/posts/{id}/like
- DELETE /api/posts/{id}/like
- POST   /api/posts/{id}/comment
- GET    /api/posts/{id}/comments
- GET    /api/posts/search?q=...

Chỉ khai báo tên hàm, chưa viết logic.
"""


def get_posts():
    """Lấy danh sách bài đăng (feed cộng đồng, có phân trang)."""
    pass


def create_post():
    """Tạo bài đăng mới (tiêu đề, nội dung, ảnh, tag...)."""
    pass


def get_post_detail():
    """Lấy chi tiết một bài đăng theo id."""
    pass


def delete_post():
    """Xóa bài đăng của user hiện tại."""
    pass


def toggle_post_like():
    """Like hoặc bỏ like một bài đăng (toggle)."""
    pass


def add_comment_to_post():
    """Thêm comment mới vào bài đăng."""
    pass


def get_comments_of_post():
    """Lấy danh sách comment của một bài đăng."""
    pass


def search_posts():
    """Tìm kiếm bài đăng theo từ khóa (tiêu đề/nội dung)."""
    pass

