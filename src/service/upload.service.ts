import axios from 'axios';

export interface UploadResponse {
  success: boolean;
  data?: {
    name: string;
    size: number;
    url: string;
    thumbnail?: string;
  };
  error?: string;
}

export class UploadService {
  static async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error);

      if (error.response?.data?.error) {
        return {
          success: false,
          error: error.response.data.error,
        };
      }

      return {
        success: false,
        error: 'Upload failed. Please try again.',
      };
    }
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.',
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File too large. Maximum size is 5MB.',
      };
    }

    return { isValid: true };
  }
}
