import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/users/[id]/offers - Get offers by seller ID
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
    const search = searchParams.get('search') || '';
    const tokenId = searchParams.get('token_id') || '';

    // New filter parameters
    const networkIds = searchParams.get('network_ids') || '';
    const collateralPercents = searchParams.get('collateral_percents') || '';
    const settleDurations = searchParams.get('settle_durations') || '';

    const offset = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Validate status parameter only if provided
    if (status && !['open', 'closed'].includes(status)) {
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

    // Handle search filter - find token_ids by symbol only
    let tokenIds: string[] | undefined = undefined;
    if (search) {
      const { data: tokens, error: tokenError } = await supabase
        .from('tokens')
        .select('id')
        .ilike('symbol', `${search}%`);

      if (tokenError) {
        return NextResponse.json({ success: false, message: tokenError.message }, { status: 500 });
      }

      tokenIds = (tokens || []).map((t: any) => t.id);
      if (tokenIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
          message: 'No tokens found matching search criteria',
        });
      }
    }

    // Step 2: Get offers where seller_wallet_id is in the list of user's wallets
    let query = supabase
      .from('offers')
      .select(
        `
        *,
        tokens:token_id (*),
        seller_wallet: seller_wallet_id (*, user:user_id (*)),
        ex_token:ex_token_id (*, network:network_id (*))
      `,
        { count: 'exact' }
      )
      .in('seller_wallet_id', walletIds)
      .range(offset, offset + limit - 1);

    // Add status filter only if status parameter is provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add search filter
    if (tokenIds) {
      query = query.in('token_id', tokenIds);
    }

    // Filter by network_ids
    if (networkIds) {
      const networkIdArray = networkIds.split(',').filter((id) => id.trim());
      if (networkIdArray.length > 0) {
        // We need to filter by ex_token_id that belongs to the specified networks
        const { data: exTokens, error: exTokenError } = await supabase
          .from('ex_tokens')
          .select('id')
          .in('network_id', networkIdArray);

        if (exTokenError) {
          return NextResponse.json(
            { success: false, message: exTokenError.message },
            { status: 500 }
          );
        }

        const exTokenIds = (exTokens || []).map((t: any) => t.id);
        if (exTokenIds.length > 0) {
          query = query.in('ex_token_id', exTokenIds);
        } else {
          // If no ex_tokens found for the networks, return empty result
          return NextResponse.json({
            success: true,
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
            message: 'No tokens found for the specified networks',
          });
        }
      }
    }

    // Filter by collateral_percent
    if (collateralPercents) {
      const collateralPercentArray = collateralPercents
        .split(',')
        .filter((percent) => percent.trim());
      if (collateralPercentArray.length > 0) {
        query = query.in('collateral_percent', collateralPercentArray);
      }
    }

    // Filter by settle_duration
    if (settleDurations) {
      const settleDurationArray = settleDurations.split(',').filter((duration) => duration.trim());
      if (settleDurationArray.length > 0) {
        query = query.in('settle_duration', settleDurationArray);
      }
    }

    // Filter by specific token_id
    if (tokenId) {
      query = query.eq('token_id', tokenId);
    }

    // Add sorting
    if (sort === 'price') {
      query = query.order('price', { ascending: sort_order === 'asc' });
    } else if (sort === 'created_at') {
      query = query.order('created_at', { ascending: sort_order === 'asc' });
    } else {
      // Default sorting by created_at desc
      query = query.order('created_at', { ascending: false });
    }

    // Execute query
    const { data: offers, error: offersError, count } = await query;

    if (offersError) {
      console.error('Error fetching offers:', offersError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch offers' },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: offers || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages,
      },
      message: 'Offers retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
