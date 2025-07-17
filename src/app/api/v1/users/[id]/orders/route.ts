import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/users/[id]/orders - Get orders by user ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    // Validate user ID parameter
    if (!id || id.trim() === '') {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const status = searchParams.get('status'); // Remove default value
    const sort = searchParams.get('sort_field') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';

    const offset = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Validate status parameter only if provided
    if (status && !['pending', 'settled', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status parameter' },
        { status: 400 }
      );
    }

    // Step 1: Get all wallets for the user
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

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        offer:offer_id (
          *,
          tokens:token_id (*),
          seller_wallet: seller_wallet_id (*, user:user_id (*)),
          ex_token:ex_token_id (*, network:network_id (*))
        ),
        buyer_wallet: buyer_wallet_id (*, user:user_id (*))
      `,
        { count: 'exact' }
      )
      .in('buyer_wallet_id', walletIds)
      .range(offset, offset + limit - 1);

    // Add status filter only if status parameter is provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add sorting
    if (sort === 'amount') {
      query = query.order('amount', { ascending: sort_order === 'asc' });
    } else if (sort === 'created_at') {
      query = query.order('created_at', { ascending: sort_order === 'asc' });
    } else {
      // Default sorting by created_at desc
      query = query.order('created_at', { ascending: false });
    }

    // Execute query
    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Get list of offer IDs from orders
    const offerIds = orders?.map((order) => order.offer_id) || [];

    // Query active promotions for these offers
    const { data: promotions, error: promotionsError } = await supabase
      .from('promotions')
      .select('*')
      .in('offer_id', offerIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (promotionsError) {
      console.error('Error fetching promotions:', promotionsError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch promotions' },
        { status: 500 }
      );
    }

    // Map promotions to orders
    const ordersWithPromotions = orders?.map((order) => {
      const promotion = promotions?.find((p) => p.offer_id === order.offer_id);
      return {
        ...order,
        offer: {
          ...order.offer,
          promotion: promotion || null,
        },
      };
    });

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: ordersWithPromotions || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages,
      },
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
