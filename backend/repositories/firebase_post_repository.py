"""
Firebase Post repository.

Làm việc với:
- Collection posts
- Subcollection comments
- Subcollection likes
"""


def query_posts():
    """Query danh sách bài đăng (có filter, sort, phân trang)."""
    pass


def get_post_by_id():
    """Lấy một bài đăng theo id."""
    pass


def insert_post():
    """Thêm bài đăng mới vào Firestore."""
    pass


def delete_post():
    """Xóa một bài đăng khỏi Firestore."""
    pass


def toggle_like_document():
    """Thêm hoặc xóa document like cho một user trên một post."""
    pass


def count_likes_for_post():
    """Đếm tổng số like của một post."""
    pass


def add_comment_document():
    """Thêm comment mới vào subcollection comments của post."""
    pass


def query_comments_for_post():
    """Query danh sách comment cho một post."""
    pass


def search_posts_by_keyword():
    """Tìm các bài đăng match với keyword (tiêu đề/nội dung)."""
    pass

