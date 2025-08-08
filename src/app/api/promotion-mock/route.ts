import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const randomDataTrueFalse = Math.random() > 0.3;

  return NextResponse.json({ message: 'Hello, world!', success: true, data: randomDataTrueFalse });
}
