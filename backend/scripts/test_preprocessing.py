"""
Script test preprocessing pipeline mới.

Test các bước:
1. Load ảnh
2. Smart crop
3. CLAHE
4. Enhance colors
5. Sharpening
6. Resize

Chạy: python backend/scripts/test_preprocessing.py <image_path>
"""
import sys
import os
from PIL import Image
import numpy as np
import cv2

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_smart_crop(image: Image.Image) -> Image.Image:
    """Test smart crop."""
    print("\n" + "="*60)
    print("TEST 1: SMART CROP")
    print("="*60)
    
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    print(f"Original size: {width}x{height}")
    
    # Convert to HSV
    hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
    
    # Detect leaves
    lower_green = np.array([30, 25, 25])
    upper_green = np.array([85, 255, 255])
    mask_green = cv2.inRange(hsv, lower_green, upper_green)
    
    lower_yellow = np.array([12, 25, 25])
    upper_yellow = np.array([38, 255, 255])
    mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
    
    lower_brown = np.array([0, 25, 25])
    upper_brown = np.array([18, 255, 255])
    mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
    
    mask = cv2.bitwise_or(mask_green, mask_yellow)
    mask = cv2.bitwise_or(mask, mask_brown)
    
    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        largest = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest)
        
        margin_x = int(w * 0.25)
        margin_y = int(h * 0.25)
        
        x = max(0, x - margin_x)
        y = max(0, y - margin_y)
        w = min(width - x, w + 2 * margin_x)
        h = min(height - y, h + 2 * margin_y)
        
        crop_ratio = (w * h) / (width * height)
        
        if crop_ratio >= 0.20:
            cropped = image.crop((x, y, x + w, y + h))
            print(f"✅ Smart crop: {width}x{height} → {w}x{h} ({round(crop_ratio*100)}%)")
            return cropped
    
    # Fallback
    margin = 0.04
    x = int(width * margin)
    y = int(height * margin)
    w = int(width * (1 - 2 * margin))
    h = int(height * (1 - 2 * margin))
    
    print(f"⚠️  Center crop 92%: {width}x{height} → {w}x{h}")
    return image.crop((x, y, x + w, y + h))


def test_clahe(img_array: np.ndarray) -> np.ndarray:
    """Test CLAHE."""
    print("\n" + "="*60)
    print("TEST 2: BALANCED CLAHE")
    print("="*60)
    
    lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    
    print(f"Before CLAHE - L channel mean: {np.mean(l):.1f}")
    
    clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    print(f"After CLAHE - L channel mean: {np.mean(l):.1f}")
    
    a = np.clip(a * 1.03, 0, 255).astype(np.uint8)
    b = np.clip(b * 1.03, 0, 255).astype(np.uint8)
    
    lab = cv2.merge([l, a, b])
    rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    print("✅ CLAHE applied (clip=2.2, grid=8x8)")
    return rgb


def test_enhance_colors(img_array: np.ndarray) -> np.ndarray:
    """Test color enhancement."""
    print("\n" + "="*60)
    print("TEST 3: ENHANCE DISEASE COLORS")
    print("="*60)
    
    hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
    h, s, v = cv2.split(hsv)
    
    disease_mask = ((h >= 0) & (h <= 38)) | ((h >= 170) & (h <= 180))
    disease_pixels = np.sum(disease_mask)
    total_pixels = h.size
    disease_ratio = disease_pixels / total_pixels
    
    print(f"Disease color pixels: {disease_pixels}/{total_pixels} ({disease_ratio*100:.1f}%)")
    
    s_before = np.mean(s[disease_mask]) if disease_pixels > 0 else 0
    
    s = np.where(disease_mask, np.minimum(s * 1.15, 255), s).astype(np.uint8)
    v = np.where(disease_mask, np.minimum(v * 1.07, 255), v).astype(np.uint8)
    
    s_after = np.mean(s[disease_mask]) if disease_pixels > 0 else 0
    
    print(f"Saturation boost: {s_before:.1f} → {s_after:.1f} (+{((s_after/s_before-1)*100 if s_before > 0 else 0):.1f}%)")
    
    hsv = cv2.merge([h, s, v])
    rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    
    print("✅ Disease colors enhanced")
    return rgb


def test_brightness(img_array: np.ndarray) -> np.ndarray:
    """Test adaptive brightness."""
    print("\n" + "="*60)
    print("TEST 4: ADAPTIVE BRIGHTNESS")
    print("="*60)
    
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    brightness = np.mean(gray)
    
    print(f"Current brightness: {brightness:.1f}")
    
    if brightness < 100:
        factor = 1.0 + (100 - brightness) / 250
        img_array = np.clip(img_array * factor, 0, 255).astype(np.uint8)
        print(f"✅ Brightness boost: +{round((factor-1)*100)}%")
    elif brightness > 155:
        factor = 1.0 - (brightness - 155) / 350
        img_array = np.clip(img_array * factor, 0, 255).astype(np.uint8)
        print(f"✅ Brightness reduce: -{round((1-factor)*100)}%")
    else:
        print("✅ Brightness OK, no adjustment needed")
    
    return img_array


def test_sharpening(img_array: np.ndarray) -> np.ndarray:
    """Test sharpening."""
    print("\n" + "="*60)
    print("TEST 5: GENTLE SHARPENING")
    print("="*60)
    
    kernel = np.array([[-0.3, -0.8, -0.3],
                      [-0.8, 5.0, -0.8],
                      [-0.3, -0.8, -0.3]]) / 2.0
    
    img_array = cv2.filter2D(img_array, -1, kernel)
    
    print("✅ Sharpening applied")
    return img_array


def main():
    if len(sys.argv) < 2:
        print("Usage: python test_preprocessing.py <image_path>")
        print("\nExample:")
        print("  python backend/scripts/test_preprocessing.py test_image.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("🔬 TEST PREPROCESSING PIPELINE")
    print("="*60)
    print(f"\nImage: {image_path}")
    
    try:
        # Load image
        image = Image.open(image_path).convert('RGB')
        print(f"✅ Image loaded: {image.size}")
        
        # Test 1: Smart Crop
        image = test_smart_crop(image)
        
        # Convert to numpy
        img_array = np.array(image)
        
        # Test 2: CLAHE
        img_array = test_clahe(img_array)
        
        # Test 3: Enhance colors
        img_array = test_enhance_colors(img_array)
        
        # Test 4: Brightness
        img_array = test_brightness(img_array)
        
        # Test 5: Sharpening
        img_array = test_sharpening(img_array)
        
        # Final
        print("\n" + "="*60)
        print("TEST 6: FINAL ADJUSTMENTS")
        print("="*60)
        
        image = Image.fromarray(img_array)
        
        from PIL import ImageEnhance
        
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.15)
        print("✅ Color enhancement: +15%")
        
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.08)
        print("✅ Contrast enhancement: +8%")
        
        # Resize
        print("\n" + "="*60)
        print("TEST 7: RESIZE TO MODEL SIZE")
        print("="*60)
        
        image = image.resize((640, 640), Image.Resampling.LANCZOS)
        print(f"✅ Resized to: 640x640")
        
        # Save result
        output_path = image_path.replace('.', '_preprocessed.')
        image.save(output_path)
        
        print("\n" + "="*60)
        print("✅ PREPROCESSING COMPLETED")
        print("="*60)
        print(f"\nOutput saved to: {output_path}")
        print("\n💡 Compare original vs preprocessed image to see the difference")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
