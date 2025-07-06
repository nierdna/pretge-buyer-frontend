import { OfferService } from '@/server/service/offer.service';
import { updateOfferSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const offer = await OfferService.getOfferById(id);
    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateOfferSchema.parse(body);

    // Convert string dates to Date objects if present
    const processedData = {
      ...validatedData,
      startTime: validatedData.startTime ? new Date(validatedData.startTime) : undefined,
      endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
    };

    const offer = await OfferService.updateOffer(id, processedData);

    return NextResponse.json(offer);
  } catch (error: any) {
    console.error('Error updating offer:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await OfferService.deleteOffer(id);
    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
