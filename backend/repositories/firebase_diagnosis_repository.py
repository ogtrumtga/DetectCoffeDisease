"""
Firebase Diagnosis repository.

Lưu metadata của kết quả chẩn đoán bệnh cà phê.
Sử dụng collection 'diagnoses' (giống history_repository)
"""
from backend.repositories import firebase_history_repository as history_repo

# Diagnosis repository sử dụng chung collection 'diagnoses' với history
# Để tránh trùng lặp, ta alias các functions từ history_repository

get_diagnosis_by_id = history_repo.get_history_by_id
insert_diagnosis = history_repo.insert_history
query_diagnoses_by_user = history_repo.query_histories_by_user
delete_diagnosis_by_id = history_repo.delete_history_by_id

