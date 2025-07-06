import { ReviewService } from '@/server/service/review.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | undefined;
    const offerId = searchParams.get('offerId');
    const buyerId = searchParams.get('buyerId');

    if (offerId) {
      const result = await ReviewService.getReviewsByOffer(offerId, page, limit);
      return NextResponse.json(result);
    }

    if (buyerId) {
      const result = await ReviewService.getReviewsByBuyer(buyerId, page, limit);
      return NextResponse.json(result);
    }

    const result = await ReviewService.getReviews(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.sellerId || !body.buyerId || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: 'sellerId, buyerId, rating, and comment are required' },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const reviewData = {
      productId: body.productId || null,
      sellerId: body.sellerId,
      buyerId: body.buyerId,
      rating: body.rating,
      comment: body.comment,
      reply: body.reply || null,
      status: body.status || 'pending',
    };

    const review = await ReviewService.createReview(reviewData);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
