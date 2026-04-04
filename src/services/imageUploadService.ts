/**
 * Image Upload Service
 * Upload ảnh trực tiếp lên Firebase Storage (không qua backend)
 * Nhanh hơn và ổn định hơn Cloudinary
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

export interface UploadImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function uploadImageToFirebase(
  imageUri: string,
  userId: string
): Promise<UploadImageResult> {
  try {
    console.log('[imageUploadService] Starting upload to Firebase Storage');
    console.log('[imageUploadService] Image URI:', imageUri);

    // Fetch ảnh từ local URI
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    console.log('[imageUploadService] Image blob size:', blob.size, 'bytes');

    // Tạo reference trong Firebase Storage
    const timestamp = Date.now();
    const filename = `diagnosis/${userId}/${timestamp}.jpg`;
    const storageRef = ref(storage, filename);

    console.log('[imageUploadService] Uploading to:', filename);

    // Upload
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('[imageUploadService] Upload complete, getting URL...');

    // Lấy download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('[imageUploadService] Upload success! URL:', downloadURL);

    return {
      success: true,
      imageUrl: downloadURL,
    };
  } catch (error: any) {
    console.error('[imageUploadService] Upload failed:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}
