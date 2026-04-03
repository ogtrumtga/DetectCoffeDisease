"""
Treatment service.

Xu ly logic nghiep vu cho treatment.
"""
from backend.repositories import firebase_treatment_repository as treatment_repo
from typing import Dict, Any, List, Optional


def list_treatments_service(disease_id: str) -> Optional[Dict[str, Any]]:
    """Service: GET /api/treatments"""
    item = treatment_repo.get_treatment_by_disease(disease_id=disease_id)
    if not item:
        return None

    return {
        'steps': item.get('steps', []),
        'medicine': item.get('medicine', []),
    }


def create_treatment_service(user_id: str, disease_id: str, steps: List[str], medicine: List[str]) -> Dict[str, Any]:
    """Service: POST /api/treatments"""
    clean_disease_id = disease_id.strip()
    clean_steps = [s.strip() for s in steps if isinstance(s, str) and s.strip()]
    clean_medicine = [m.strip() for m in medicine if isinstance(m, str) and m.strip()]

    if not clean_disease_id:
        return {'success': False, 'message': 'Invalid disease_id'}
    if not clean_steps:
        return {'success': False, 'message': 'Invalid steps'}
    if not clean_medicine:
        return {'success': False, 'message': 'Invalid medicine'}

    existing = treatment_repo.get_treatment_by_disease(clean_disease_id)
    if existing:
        return {'success': False, 'message': 'Treatment already exists for this disease_id'}

    treatment_id = treatment_repo.insert_treatment(
        user_id=user_id,
        disease_id=clean_disease_id,
        steps=clean_steps,
        medicine=clean_medicine,
    )

    if not treatment_id:
        return {'success': False, 'message': 'Failed to create treatment'}

    return {'success': True, 'treatmentId': treatment_id}


def update_treatment_service(treatment_id: str, user_id: str, steps: List[str], medicine: List[str]) -> Optional[Dict[str, Any]]:
    """Service: PATCH /api/treatments/{id}"""
    clean_steps = [s.strip() for s in steps if isinstance(s, str) and s.strip()]
    clean_medicine = [m.strip() for m in medicine if isinstance(m, str) and m.strip()]

    if not clean_steps:
        return None
    if not clean_medicine:
        return None

    updated_at = treatment_repo.update_treatment(
        treatment_id=treatment_id,
        user_id=user_id,
        steps=clean_steps,
        medicine=clean_medicine,
    )

    if not updated_at:
        return None

    return {
        'treatmentId': treatment_id,
        'updatedAt': updated_at.isoformat(),
    }
