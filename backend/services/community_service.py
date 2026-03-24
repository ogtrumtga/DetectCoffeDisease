"""
Community (Activity) service.

Chứa logic cho:
- Danh sách bài đăng (feed)
- Tạo bài đăng
- Chi tiết bài đăng
- Xóa bài đăng
- Like / Unlike (toggle)
- Comment
- Tìm kiếm bài đăng
"""


def get_posts_service():
    """Lấy danh sách bài đăng (có phân trang, sort theo thời gian)."""
    pass


def create_post_service():
    """Validate dữ liệu và tạo post mới."""
    pass


def get_post_detail_service():
    """Lấy chi tiết một bài đăng theo id."""
    pass


def delete_post_service():
    """Kiểm tra quyền và xóa bài đăng."""
    pass


def toggle_post_like_service():
    """Like hoặc bỏ like bài đăng, cập nhật tổng like."""
    pass


def add_comment_to_post_service():
    """Thêm comment mới vào bài đăng, có thể tạo notification."""
    pass


def get_comments_of_post_service():
    """Lấy danh sách comment của một bài đăng."""
    pass


def search_posts_service():
    """Tìm kiếm bài đăng theo từ khóa (tiêu đề / nội dung)."""
    pass

