import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the path to icon23.png
    const iconPath = path.join(process.cwd(), 'src', 'app', 'icon23.png');

    // Check if file exists
    if (!fs.existsSync(iconPath)) {
      return new NextResponse('Icon not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(iconPath);

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new NextResponse('Error serving favicon', { status: 500 });
  }
}
