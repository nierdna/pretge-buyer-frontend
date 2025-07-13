'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UploadButton from '@/components/ui/upload-button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UploadTestPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadHistory, setUploadHistory] = useState<Array<{ url: string; timestamp: Date }>>([]);

  const handleUploadSuccess = (url: string) => {
    setUploadedUrl(url);
    setUploadHistory((prev) => [...prev, { url, timestamp: new Date() }]);
    toast.success('Upload successful!');
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Test Page</h1>
          <p className="text-gray-600">Test the Zipline image upload functionality</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Click the button below to upload an image. Supported formats: JPEG, PNG, GIF, WebP
              (max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadButton
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              variant="default"
              size="lg"
            />

            {uploadedUrl && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Latest Upload:</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={uploadedUrl} alt="Uploaded image" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-green-700 break-all">{uploadedUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Previously uploaded images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadHistory.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <Avatar className="h-20 w-20 mx-auto mb-2">
                      <AvatarImage src={item.url} alt={`Upload ${index + 1}`} />
                    </Avatar>
                    <p className="text-xs text-gray-500 text-center">
                      {item.timestamp.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 text-center break-all mt-1">{item.url}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click the "Upload Image" button</li>
              <li>Select an image file from your device</li>
              <li>Wait for the upload to complete</li>
              <li>The uploaded image URL will appear below</li>
              <li>You can copy the URL and use it in your application</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
