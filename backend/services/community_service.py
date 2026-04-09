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

⚠️ QUAN TRỌNG: Firestore KHÔNG có JOIN!
Mối quan hệ được xử lý thủ công trong code này.
"""
from backend.repositories import firebase_post_repository as post_repo
from backend.repositories import firebase_user_repository as user_repo
from backend.repositories import firebase_comment_repository as comment_repo
from backend.repositories import firebase_like_repository as like_repo
from typing import List, Dict, Any, Optional


def get_posts_service(limit: int = 20, offset: int = 0, current_user_id: str = None) -> List[Dict[str, Any]]:
    """
    Lấy danh sách bài đăng KÈM thông tin tác giả.
    
    🔗 MỐI QUAN HỆ: posts → users (qua authorId)
    
    Firestore không có JOIN, phải query 2 lần:
    1. Lấy posts từ collection 'posts'
    2. Lấy users từ collection 'users' theo authorId
    3. Kết hợp trong code (manual join)
    """
    # 1. Lấy danh sách posts
    posts = post_repo.get_posts(limit=limit, offset=offset)
    
    if not posts:
        return []
    
    # 2. Lấy danh sách unique author IDs
    author_ids = list(set([post.get('authorId') for post in posts if post.get('authorId')]))
    
    # 3. Lấy thông tin tất cả authors (batch queries)
    authors = {}
    for author_id in author_ids:
        author = user_repo.get_user_by_id(author_id)
        if author:
            authors[author_id] = author
    
    # 4. Kết hợp posts + authors (MANUAL JOIN trong code)
    result = []
    for post in posts:
        author_id = post.get('authorId')
        author = authors.get(author_id)
        
        # Kiểm tra user hiện tại đã like chưa (nếu có)
        is_liked = False
        if current_user_id:
            is_liked = like_repo.check_user_liked_post(post['id'], current_user_id)
        
        result.append({
            **post,
            'author': {
                'id': author_id,
                'displayName': author.get('displayName', 'Unknown') if author else 'Unknown',
                'photoURL': author.get('photoURL', '') if author else ''
            },
            'isLiked': is_liked
        })
    
    return result


def get_post_detail_service(post_id: str, current_user_id: str = None) -> Optional[Dict[str, Any]]:
    """
    Lấy chi tiết bài đăng KÈM thông tin liên quan.
    
    🔗 MỐI QUAN HỆ:
    - post → user (qua authorId)
    - post → likes (qua postId)
    
    Phải query 3 lần!
    """
    # 1. Lấy post
    post = post_repo.get_post_by_id(post_id)
    if not post:
        return None
    
    # 2. Lấy author (MỐI QUAN HỆ: post.authorId → users)
    author = user_repo.get_user_by_id(post['authorId'])
    
    # 3. Kiểm tra user hiện tại đã like chưa
    is_liked = False
    if current_user_id:
        is_liked = like_repo.check_user_liked_post(post_id, current_user_id)
    
    # 4. Kết hợp dữ liệu
    return {
        **post,
        'author': {
            'id': post['authorId'],
            'displayName': author.get('displayName', 'Unknown') if author else 'Unknown',
            'photoURL': author.get('photoURL', '') if author else ''
        },
        'isLiked': is_liked
    }


def create_post_service(user_id: str, title: str, content: str, images: List[str] = None, tags: List[str] = None) -> Dict[str, Any]:
    """
    Tạo bài đăng mới.
    
    🔗 MỐI QUAN HỆ: Lưu authorId để liên kết với users
    """
    post_data = {
        'title': title,
        'content': content,
        'images': images or [],
        'tags': tags or []
    }
    
    # Repository tự động thêm authorId, timestamps, counts
    post_id = post_repo.create_post(user_id, post_data)
    
    if not post_id:
        return {
            'success': False,
            'message': 'Failed to create post'
        }
    
    return {
        'success': True,
        'post_id': post_id,
        'message': 'Post created successfully'
    }


def delete_post_service(post_id: str, user_id: str) -> Dict[str, Any]:
    """
    Xóa bài đăng và cleanup dữ liệu liên quan.
    
    ⚠️ QUAN TRỌNG: Firestore không có cascading delete!
    Phải tự xóa:
    - Comments của post
    - Likes của post
    """
    # 1. Kiểm tra quyền sở hữu
    post = post_repo.get_post_by_id(post_id)
    if not post or post.get('authorId') != user_id:
        return {
            'success': False,
            'message': 'Post not found or unauthorized'
        }
    
    # 2. Xóa tất cả comments (MỐI QUAN HỆ: comments.postId → posts)
    comment_repo.delete_comments_by_post(post_id)
    
    # 3. Xóa tất cả likes (MỐI QUAN HỆ: likes.postId → posts)
    like_repo.delete_likes_by_post(post_id)
    
    # 4. Xóa post
    success = post_repo.delete_post(post_id, user_id)
    
    if success:
        return {
            'success': True,
            'message': 'Post deleted successfully'
        }
    
    return {
        'success': False,
        'message': 'Failed to delete post'
    }


def toggle_post_like_service(post_id: str, user_id: str) -> Dict[str, Any]:
    """
    Like/Unlike bài đăng.
    
    🔗 MỐI QUAN HỆ:
    - Tạo/xóa document trong collection 'likes'
    - Cập nhật likesCount trong collection 'posts' (denormalized)
    - Tạo notification cho tác giả bài đăng (nếu like)
    """
    # Đảm bảo bài đăng tồn tại trước khi like/unlike.
    post = post_repo.get_post_by_id(post_id)
    if not post:
        return {
            'success': False,
            'message': 'Post not found'
        }

    # Kiểm tra đã like chưa
    is_liked = like_repo.check_user_liked_post(post_id, user_id)
    
    if is_liked:
        # Unlike
        like_repo.remove_like(post_id, user_id)
        post_repo.increment_likes_count(post_id, -1)
        return {
            'success': True,
            'action': 'unliked',
            'message': 'Post unliked'
        }
    else:
        # Like
        like_repo.add_like(post_id, user_id)
        post_repo.increment_likes_count(post_id, 1)
        
        # Tạo notification cho tác giả bài đăng (nếu không phải tự like)
        author_id = post.get('authorId')
        if author_id and author_id != user_id:
            from backend.services import notification_service
            
            # Lấy thông tin user đang like
            liker = user_repo.get_user_by_id(user_id)
            liker_name = liker.get('displayName', 'Someone') if liker else 'Someone'
            
            notification_service.create_notification_service(
                user_id=author_id,
                notif_type='like',
                title='Bài viết được thích',
                message=f'{liker_name} đã thích bài viết của bạn',
                data={
                    'postId': post_id,
                    'postTitle': post.get('title', ''),
                    'likerId': user_id,
                    'likerName': liker_name,
                    'likerAvatar': liker.get('photoURL', '') if liker else ''
                }
            )
        
        return {
            'success': True,
            'action': 'liked',
            'message': 'Post liked'
        }


def add_comment_to_post_service(post_id: str, user_id: str, content: str) -> Dict[str, Any]:
    """
    Thêm comment vào bài đăng.
    
    🔗 MỐI QUAN HỆ:
    - Tạo document trong collection 'comments'
    - Cập nhật commentsCount trong collection 'posts' (denormalized)
    - Tạo notification cho tác giả bài đăng
    """
    # Đảm bảo bài đăng tồn tại trước khi tạo comment.
    post = post_repo.get_post_by_id(post_id)
    if not post:
        return {
            'success': False,
            'message': 'Post not found'
        }

    # Tạo comment
    comment_id = comment_repo.create_comment(post_id, user_id, content)
    
    if not comment_id:
        return {
            'success': False,
            'message': 'Failed to create comment'
        }
    
    # Tăng comments count
    post_repo.increment_comments_count(post_id, 1)
    
    # Tạo notification cho tác giả bài đăng (nếu không phải tự comment)
    author_id = post.get('authorId')
    if author_id and author_id != user_id:
        from backend.services import notification_service
        
        # Lấy thông tin user đang comment
        commenter = user_repo.get_user_by_id(user_id)
        commenter_name = commenter.get('displayName', 'Someone') if commenter else 'Someone'
        
        # Truncate content cho notification
        preview = content[:50] + '...' if len(content) > 50 else content
        
        notification_service.create_notification_service(
            user_id=author_id,
            notif_type='comment',
            title='Bình luận mới',
            message=f'{commenter_name} đã bình luận: "{preview}"',
            data={
                'postId': post_id,
                'postTitle': post.get('title', ''),
                'commentId': comment_id,
                'commenterId': user_id,
                'commenterName': commenter_name,
                'commenterAvatar': commenter.get('photoURL', '') if commenter else ''
            }
        )
    
    return {
        'success': True,
        'comment_id': comment_id,
        'message': 'Comment added successfully'
    }


def get_comments_of_post_service(post_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Lấy danh sách comments KÈM thông tin tác giả.
    
    🔗 MỐI QUAN HỆ:
    - comments → users (qua authorId)
    
    Phải query 2 lần (manual join)
    """
    # 1. Lấy comments
    comments = comment_repo.get_comments_by_post(post_id, limit=limit, offset=offset)
    
    if not comments:
        return []
    
    # 2. Lấy unique author IDs
    author_ids = list(set([comment.get('authorId') for comment in comments if comment.get('authorId')]))
    
    # 3. Lấy thông tin authors
    authors = {}
    for author_id in author_ids:
        author = user_repo.get_user_by_id(author_id)
        if author:
            authors[author_id] = author
    
    # 4. Kết hợp comments + authors (MANUAL JOIN)
    result = []
    for comment in comments:
        author_id = comment.get('authorId')
        author = authors.get(author_id)
        
        result.append({
            **comment,
            'author': {
                'id': author_id,
                'displayName': author.get('displayName', 'Unknown') if author else 'Unknown',
                'photoURL': author.get('photoURL', '') if author else ''
            }
        })
    
    return result


def search_posts_service(query: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Tìm kiếm bài đăng theo từ khóa."""
    posts = post_repo.search_posts(query, limit=limit)
    
    # Có thể thêm logic lấy author info như get_posts_service
    return posts
