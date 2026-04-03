"""
Feedback service.

Xử lý logic nghiệp vụ cho feedback.
"""
from backend.repositories import firebase_feedback_repository as feedback_repo
from typing import List, Dict, Any, Optional


def create_feedback_service(user_id: str, diagnoses_id: str, rate: int, comment: str) -> Optional[str]:
    """Service: POST /api/feedbacks"""
    clean_diagnoses_id = diagnoses_id.strip()
    clean_comment = comment.strip()

    if not clean_diagnoses_id or not clean_comment:
        return None

    if rate < 1 or rate > 5:
        return None

    return feedback_repo.insert_feedback(
        user_id=user_id,
        diagnoses_id=clean_diagnoses_id,
        rate=rate,
        comment=clean_comment,
    )


def list_feedbacks_service(page: int = 1, limit: int = 20) -> Dict[str, Any]:
    """Service: GET /api/feedbacks"""
    offset = (page - 1) * limit
    feedbacks = feedback_repo.query_feedbacks(limit=limit, offset=offset)

    result = []
    for fb in feedbacks:
        result.append({
            'feedbackId': fb.get('id'),
            'diagnoses_id': fb.get('diagnoses_id'),
            'comment': fb.get('comment'),
            'rate': fb.get('rate'),
            'userId': fb.get('userId'),
            'createdAt': fb.get('createdAt').isoformat() if fb.get('createdAt') else None,
        })

    return {
        'success': True,
        'data': result,
        'page': page,
        'limit': limit,
        'total': len(result),
    }
