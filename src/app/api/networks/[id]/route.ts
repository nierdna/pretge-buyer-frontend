import { NetworkService } from '@/server/service/network.service';
import { updateNetworkSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const network = await NetworkService.getNetworkById(id);
    return NextResponse.json(network);
  } catch (error) {
    console.error('Error fetching network:', error);
    return NextResponse.json({ error: 'Network not found' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateNetworkSchema.parse(body);

    const network = await NetworkService.updateNetwork(id, validatedData);

    return NextResponse.json(network);
  } catch (error: any) {
    console.error('Error updating network:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update network' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await NetworkService.deleteNetwork(id);
    return NextResponse.json({ message: 'Network deleted successfully' });
  } catch (error) {
    console.error('Error deleting network:', error);
    return NextResponse.json({ error: 'Failed to delete network' }, { status: 500 });
  }
}
