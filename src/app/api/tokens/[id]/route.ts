import { TokenService } from '@/server/service/token.service';
import { updateTokenSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = await TokenService.getTokenById(id);
    return NextResponse.json(token);
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateTokenSchema.parse(body);

    // Convert string dates to Date objects if present
    const processedData = {
      ...validatedData,
      startTime: validatedData.startTime ? new Date(validatedData.startTime) : undefined,
      endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
    };

    const token = await TokenService.updateToken(id, processedData);

    return NextResponse.json(token);
  } catch (error: any) {
    console.error('Error updating token:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await TokenService.deleteToken(id);
    return NextResponse.json({ message: 'Token deleted successfully' });
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 });
  }
}
