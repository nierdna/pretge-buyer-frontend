import { ReviewService } from '@/server/service/review.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const review = await ReviewService.getReviewById(id);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: any = {};
    if (body.offerId !== undefined) updates.offerId = body.offerId;
    if (body.buyerId !== undefined) updates.buyerId = body.buyerId;
    if (body.rating !== undefined) updates.rating = body.rating;
    if (body.comment !== undefined) updates.comment = body.comment;
    if (body.reply !== undefined) updates.reply = body.reply;
    if (body.status !== undefined) updates.status = body.status;

    const review = await ReviewService.updateReview(id, updates);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ReviewService.deleteReview(id);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
