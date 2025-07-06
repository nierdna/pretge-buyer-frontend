import { ExTokenService } from '@/server/service/exToken.service';
import { updateExTokenSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exToken = await ExTokenService.getExTokenById(id);
    return NextResponse.json(exToken);
  } catch (error) {
    console.error('Error fetching external token:', error);
    return NextResponse.json({ error: 'External token not found' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateExTokenSchema.parse(body);

    const exToken = await ExTokenService.updateExToken(id, validatedData);

    return NextResponse.json(exToken);
  } catch (error: any) {
    console.error('Error updating external token:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update external token' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ExTokenService.deleteExToken(id);
    return NextResponse.json({ message: 'External token deleted successfully' });
  } catch (error) {
    console.error('Error deleting external token:', error);
    return NextResponse.json({ error: 'Failed to delete external token' }, { status: 500 });
  }
}
