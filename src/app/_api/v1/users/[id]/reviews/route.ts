import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/users/[id]/reviews - Get all reviews for a user
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Validate ID parameter
    if (!id || id.trim() === '') {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Step 1: Find all wallets for the user
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', id);

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch user wallets' },
        { status: 500 }
      );
    }

    if (!wallets || wallets.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
        message: 'No wallets found for this user',
      });
    }

    // Extract wallet IDs
    const walletIds = wallets.map((wallet) => wallet.id);

    // Step 2: Find all offers from these wallets
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('id')
      .in('seller_wallet_id', walletIds);

    if (offersError) {
      console.error('Error fetching offers:', offersError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch offers' },
        { status: 500 }
      );
    }

    if (!offers || offers.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
        message: 'No offers found for this user',
      });
    }

    // Extract offer IDs
    const offerIds = offers.map((offer) => offer.id);

    // Step 3: Find all orders for these offers
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .in('offer_id', offerIds)
      .eq('status', 'settled');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    const orderIds = orders.map((order) => order.id);

    // Step 4: Find all reviews for these orders with pagination
    const {
      data: reviews,
      error: reviewsError,
      count,
    } = await supabase
      .from('reviews')
      .select(
        `
        *,
        buyer:buyer_id(*)
      `,
        { count: 'exact' }
      )
      .in('order_id', orderIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reviews || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
