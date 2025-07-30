'use client';

import { Button } from '@/components/ui/button';
import { UploadService } from '@/service/upload.service';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface UploadButtonProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function UploadButton({
  onUploadSuccess,
  onUploadError,
  className = '',
  variant = 'outline',
  size = 'default',
  disabled = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = UploadService.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await UploadService.uploadFile(file);

      if (result.success && result.data) {
        onUploadSuccess(result.data.url);
        toast.success('Image uploaded successfully!');
        setUploadProgress(100);
      } else {
        const errorMessage = result.error || 'Upload failed';
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Upload failed. Please try again.';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const getButtonContent = () => {
    if (isUploading) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
          <span>Uploading...</span>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Upload className="h-6 min-h-6 w-6 min-w-6" />
        <span>Upload Image</span>
      </div>
    );
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={className}
      >
        {getButtonContent()}
      </Button>

      {/* Progress bar */}
      {isUploading && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
