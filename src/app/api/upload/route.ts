import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { NextResponse } from 'next/server';

// Note: bodyParser is automatically disabled for App Router API routes
// No need for export const config in Next.js 13+

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempPath = `/tmp/${Date.now()}-${file.name}`;

    fs.writeFileSync(tempPath, buffer);

    const uploadForm = new FormData();
    uploadForm.append('file', fs.createReadStream(tempPath), file.name);

    const ziplineRes = await axios.post(`${process.env.ZIPLINE_API_URL}/api/upload`, uploadForm, {
      headers: {
        ...uploadForm.getHeaders(),
        Authorization: process.env.ZIPLINE_API_KEY,
      },
    });

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return NextResponse.json({
      success: true,
      data: ziplineRes.data.files[0],
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
