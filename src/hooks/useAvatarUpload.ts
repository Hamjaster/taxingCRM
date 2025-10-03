import { useState } from 'react';

interface UseAvatarUploadOptions {
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

export const useAvatarUpload = (options: UseAvatarUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File, uploadType: string = 'avatar') => {
    if (!file) {
      options.onError?.('File is required');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      options.onError?.('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      options.onError?.('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      options.onSuccess?.(data.url);
      return data.url;
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
