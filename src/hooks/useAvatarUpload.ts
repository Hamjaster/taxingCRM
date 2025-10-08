import { uploadImageCloudinary } from '@/lib/cloudinary';
import { useState } from 'react';

interface UseAvatarUploadOptions {
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

export const useAvatarUpload = (options: UseAvatarUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File, uploadType: string = 'avatar') : Promise<string| null>  => {
    console.log('UPLOADING IMAGE !');
    if (!file) {
      options.onError?.('File is required');
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      options.onError?.('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return null;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      options.onError?.('File size must be less than 5MB');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadImageCloudinary(file, setIsUploading);
      console.log(imageUrl, "image url !");
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async () => {
    // For general uploads, we just clear the local state
    // The actual file cleanup can be handled by a cleanup job later
    options.onSuccess?.('');
  };

  return {
    uploadImage,
    removeImage,
    isUploading,
    uploadProgress,
  };
};
