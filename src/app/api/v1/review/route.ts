import { supabase } from '@/server/db/supabase';
import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for review submission
const reviewSchema = z.object({
  order_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

async function handler(request: AuthenticatedRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error },
        { status: 400 }
      );
    }

    const { order_id, rating, comment = '' } = validationResult.data;
    const userId = request.user?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if order exists and belongs to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_wallet_id')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if review already exists for this order
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', order_id)
      .single();

    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this order' }, { status: 409 });
    }

    // Insert new review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        order_id: order_id,
        buyer_id: userId,
        rating,
        comment,
        status: 'approved',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting review:', insertError);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error processing review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
