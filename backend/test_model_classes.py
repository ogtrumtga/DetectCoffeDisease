"""
Test script để kiểm tra model classes và thử predict một ảnh test.
"""
import os
from ultralytics import YOLO

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'predict_models', 'best.pt')

print(f"Loading model from: {MODEL_PATH}")
model = YOLO(MODEL_PATH)

print(f"\n=== MODEL INFO ===")
print(f"Model type: {type(model)}")
print(f"Model names: {model.names}")
print(f"Number of classes: {len(model.names)}")

print(f"\n=== CLASSES ===")
for idx, name in model.names.items():
    print(f"  {idx}: {name}")

print(f"\n✅ Model loaded successfully!")
print(f"\nĐể test với ảnh thật, chạy:")
print(f"  python backend/test_model_classes.py <path_to_image>")
