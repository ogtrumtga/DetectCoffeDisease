"""
Test script để predict trực tiếp từ URL ảnh (không qua preprocessing phức tạp).
"""
import os
import sys
import requests
from PIL import Image
from io import BytesIO
from ultralytics import YOLO

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'predict_models', 'best.pt')

# URL ảnh từ log
IMAGE_URL = "https://res.cloudinary.com/dz89vwzco/image/upload/v1234567890/diagnosis/ubTMpDF8KZWgD2QWIiOZT2bbrFX2/xoklnxdbtxbrecsddvv6.png"

print(f"=== DIRECT PREDICTION TEST ===\n")
print(f"Loading model...")
model = YOLO(MODEL_PATH)
print(f"Model classes: {model.names}\n")

# Test với nhiều confidence thresholds
thresholds = [0.001, 0.01, 0.05, 0.1, 0.2, 0.3]

for conf in thresholds:
    print(f"\n{'='*60}")
    print(f"Testing with confidence threshold: {conf}")
    print(f"{'='*60}")
    
    try:
        # Download ảnh
        print(f"Downloading image from Cloudinary...")
        response = requests.get(IMAGE_URL, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Cannot download image (status={response.status_code})")
            continue
        
        # Load ảnh
        image = Image.open(BytesIO(response.content)).convert('RGB')
        print(f"Image size: {image.size}")
        
        # Predict với MINIMAL preprocessing (chỉ resize)
        image_resized = image.resize((640, 640), Image.Resampling.LANCZOS)
        
        # Run prediction
        results = model.predict(
            source=image_resized,
            imgsz=640,
            conf=conf,
            verbose=False,
            device='cpu',
            half=False,
            max_det=300,
            augment=True,
            iou=0.3,
        )
        
        if not results or len(results) == 0:
            print(f"❌ No results returned")
            continue
        
        result = results[0]
        boxes = getattr(result, 'boxes', None)
        
        if boxes is None or len(boxes) == 0:
            print(f"❌ No objects detected")
            continue
        
        print(f"✅ Detected {len(boxes)} objects:")
        
        # Group by disease
        disease_counts = {}
        disease_confidences = {}
        
        for idx in range(len(boxes)):
            class_id = int(boxes.cls[idx].item())
            confidence = float(boxes.conf[idx].item())
            disease_name = model.names.get(class_id, str(class_id))
            
            disease_counts[disease_name] = disease_counts.get(disease_name, 0) + 1
            if disease_name not in disease_confidences:
                disease_confidences[disease_name] = []
            disease_confidences[disease_name].append(confidence)
        
        for disease, count in disease_counts.items():
            avg_conf = sum(disease_confidences[disease]) / len(disease_confidences[disease])
            max_conf = max(disease_confidences[disease])
            print(f"  • {disease}: {count} detections (avg: {round(avg_conf*100, 1)}%, max: {round(max_conf*100, 1)}%)")
        
    except Exception as e:
        print(f"❌ Error: {e}")

print(f"\n{'='*60}")
print(f"Test completed!")
print(f"{'='*60}")
