"""
Community API endpoints.
Prefix: /api/community
"""
from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from backend.services import community_service
from backend.repositories import firebase_auth_repository
from typing import Optional, List

router = APIRouter(prefix="/api/community", tags=["Community"])


# ── Helper: xác thực Bearer token ──────────────────────────────────────────
def get_user_id_from_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    decoded = firebase_auth_repository.firebase_verify_id_token(token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return decoded['uid']


# ── Request models ──────────────────────────────────────────────────────────
class CreatePostRequest(BaseModel):
    title: str
    content: str
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class CreateCommentRequest(BaseModel):
    content: str


# ── 1. GET /api/community/posts ─────────────────────────────────────────────
@router.get("/posts")
async def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/community/posts
    Lấy danh sách bài đăng (feed cộng đồng).
    - Input:  page, limit (query params)
    - Output: [{ id, title, content, author, likesCount, commentsCount, isLiked }]
    - Auth:   Bearer token (optional, để check isLiked)
    """
    # Auth optional - nếu có token thì check isLiked
    current_user_id = None
    if authorization:
        try:
            current_user_id = get_user_id_from_token(authorization)
        except:
            pass  # Không bắt buộc auth
    
    offset = (page - 1) * limit
    posts = community_service.get_posts_service(limit=limit, offset=offset, current_user_id=current_user_id)
    
    return {
        'success': True,
        'data': posts,
        'page': page,
        'limit': limit
    }


# ── 2. POST /api/community/posts ────────────────────────────────────────────
@router.post("/posts")
async def create_post(
    request: CreatePostRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/community/posts
    Tạo bài đăng mới.
    - Input:  { title, content, images, tags }
    - Output: { post_id }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)
    
    result = community_service.create_post_service(
        user_id=user_id,
        title=request.title,
        content=request.content,
        images=request.images,
        tags=request.tags
    )
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


# ── 3. GET /api/community/posts/search ──────────────────────────────────────
@router.get("/posts/search")
async def search_posts(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    GET /api/community/posts/search
    Tìm kiếm bài đăng theo từ khóa.
    - Input:  q (query string), limit
    - Output: [{ id, title, content, ... }]
    - Auth:   None (public)
    """
    posts = community_service.search_posts_service(query=q, limit=limit)
    
    return {
        'success': True,
        'data': posts,
        'query': q
    }


# ── 4. GET /api/community/posts/{id} ────────────────────────────────────────
@router.get("/posts/{post_id}")
async def get_post_detail(
    post_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    GET /api/community/posts/{id}
    Lấy chi tiết một bài đăng.
    - Input:  post_id (path param)
    - Output: { id, title, content, author, likesCount, commentsCount, isLiked }
    - Auth:   Bearer token (optional)
    """
    current_user_id = None
    if authorization:
        try:
            current_user_id = get_user_id_from_token(authorization)
        except:
            pass

    post = community_service.get_post_detail_service(post_id, current_user_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return {
        'success': True,
        'data': post
    }


# ── 5. DELETE /api/community/posts/{id} ─────────────────────────────────────
@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    DELETE /api/community/posts/{id}
    Xóa bài đăng (chỉ tác giả mới xóa được).
    - Input:  post_id (path param)
    - Output: { message }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)

    result = community_service.delete_post_service(post_id, user_id)

    if not result['success']:
        status = 404 if 'not found' in result['message'].lower() else 403
        raise HTTPException(status_code=status, detail=result['message'])

    return result


# ── 6. POST /api/community/posts/{id}/like ──────────────────────────────────
@router.post("/posts/{post_id}/like")
async def toggle_like(
    post_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/community/posts/{id}/like
    Like/Unlike bài đăng (toggle).
    - Input:  post_id (path param)
    - Output: { action: 'liked' | 'unliked' }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)

    result = community_service.toggle_post_like_service(post_id, user_id)

    return result


# ── 7. POST /api/community/posts/{id}/comments ──────────────────────────────
@router.post("/posts/{post_id}/comments")
async def add_comment(
    post_id: str,
    request: CreateCommentRequest,
    authorization: Optional[str] = Header(None)
):
    """
    POST /api/community/posts/{id}/comments
    Thêm comment vào bài đăng.
    - Input:  { content }
    - Output: { comment_id }
    - Auth:   Bearer token (required)
    """
    user_id = get_user_id_from_token(authorization)

    result = community_service.add_comment_to_post_service(
        post_id=post_id,
        user_id=user_id,
        content=request.content
    )

    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])

    return result


# ── 8. GET /api/community/posts/{id}/comments ───────────────────────────────
@router.get("/posts/{post_id}/comments")
async def get_comments(
    post_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """
    GET /api/community/posts/{id}/comments
    Lấy danh sách comment của bài đăng.
    - Input:  post_id (path param), page, limit
    - Output: [{ id, content, author, createdAt }]
    - Auth:   None (public)
    """
    offset = (page - 1) * limit
    comments = community_service.get_comments_of_post_service(
        post_id=post_id,
        limit=limit,
        offset=offset
    )

    return {
        'success': True,
        'data': comments,
        'page': page,
        'limit': limit
    }
