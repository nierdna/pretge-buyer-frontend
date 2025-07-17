# Zipline Integration Guide

## Overview

This guide explains how to set up and use the Zipline image upload integration in the Pre-Market Storefront application.

## Prerequisites

1. **Zipline Instance**: You need a running Zipline instance
2. **API Key**: Generate an API key from your Zipline instance
3. **Environment Variables**: Configure the necessary environment variables

## Setup Instructions

### 1. Install Zipline (if not already installed)

Follow the official Zipline installation guide at [https://zipline.diced.sh/](https://zipline.diced.sh/)

### 2. Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
# Zipline Configuration
ZIPLINE_API_URL=https://your-zipline-instance.com
ZIPLINE_API_KEY=your_zipline_api_key_here
```

### 3. Install Dependencies

The required dependencies are already included in the project:

```bash
pnpm add form-data
```

## How It Works

### 1. API Route (`/api/upload`)

The upload process follows this flow:

1. **Client** sends file via FormData to `/api/upload`
2. **Server** validates file type and size
3. **Server** creates temporary file
4. **Server** uploads to Zipline using their API
5. **Server** returns the uploaded file URL
6. **Client** receives URL and updates the avatar input

### 2. Upload Service (`UploadService`)

The service provides:

- **File validation**: Type and size checking
- **Upload handling**: API communication with error handling
- **Response processing**: Success/error handling

### 3. Upload Button Component

Features:

- **Drag & Drop**: Click to select files
- **Progress indicator**: Visual feedback during upload
- **Error handling**: Toast notifications for errors
- **File validation**: Client-side validation before upload

## Usage Examples

### Basic Upload Button

```tsx
import UploadButton from '@/components/ui/upload-button';

function MyComponent() {
  const handleUploadSuccess = (url: string) => {
    console.log('Uploaded URL:', url);
    // Update your state with the URL
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return <UploadButton onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />;
}
```

### Customized Upload Button

```tsx
<UploadButton
  onUploadSuccess={handleUploadSuccess}
  onUploadError={handleUploadError}
  variant="secondary"
  size="sm"
  className="custom-class"
  accept="image/png,image/jpeg"
  maxSize={2 * 1024 * 1024} // 2MB
/>
```

### Integration in EditProfileModal

The `EditProfileModal` component demonstrates a complete integration:

```tsx
// In EditProfileModal.tsx
const handleAvatarUploadSuccess = (url: string) => {
  setAvatar(url); // Automatically fills the avatar input
};

<UploadButton
  onUploadSuccess={handleAvatarUploadSuccess}
  onUploadError={handleAvatarUploadError}
  variant="secondary"
  size="sm"
  className="h-8 w-8 rounded-full p-0"
  accept="image/*"
/>;
```

## File Validation

### Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Size Limits

- **Default**: 5MB maximum
- **Configurable**: Can be adjusted via `maxSize` prop

### Validation Process

1. **Client-side**: Immediate validation before upload
2. **Server-side**: Additional validation for security
3. **Error handling**: Clear error messages for users

## Error Handling

### Common Errors

1. **Invalid file type**: Only images are allowed
2. **File too large**: Exceeds maximum size limit
3. **Network error**: Connection issues
4. **Server error**: Zipline API issues

### Error Messages

- User-friendly error messages via toast notifications
- Detailed error logging for debugging
- Graceful fallback handling

## Security Considerations

1. **File validation**: Both client and server-side validation
2. **Size limits**: Prevents large file uploads
3. **Type restrictions**: Only allows image files
4. **API key protection**: Environment variable storage
5. **Temporary file cleanup**: Automatic cleanup after upload

## Troubleshooting

### Common Issues

1. **"No file uploaded" error**
   - Check if file input is properly configured
   - Verify file selection

2. **"Invalid file type" error**
   - Ensure file is an image format
   - Check file extension

3. **"File too large" error**
   - Reduce file size
   - Check maxSize configuration

4. **"Upload failed" error**
   - Verify Zipline configuration
   - Check network connection
   - Verify API key is correct

### Debug Steps

1. Check browser console for errors
2. Verify environment variables
3. Test Zipline API directly
4. Check server logs for detailed errors

## Performance Optimization

1. **Client-side validation**: Prevents unnecessary uploads
2. **Progress indicators**: User feedback during upload
3. **Error recovery**: Graceful handling of failures
4. **File cleanup**: Automatic temporary file removal

## Future Enhancements

Potential improvements:

1. **Drag & Drop**: Enhanced drag and drop interface
2. **Image compression**: Automatic image optimization
3. **Multiple file upload**: Support for multiple files
4. **Upload queue**: Queue management for multiple uploads
5. **Image preview**: Preview before upload
6. **Crop functionality**: Image cropping before upload
