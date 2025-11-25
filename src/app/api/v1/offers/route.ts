import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort_field') || 'price';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const tokenId = searchParams.get('token_id') || '';
    const statusToken = searchParams.get('status_token') || 'active';

    // New filter parameters
    const networkIds = searchParams.get('network_ids') || '';
    const collateralPercents = searchParams.get('collateral_percents') || '';
    const settleDurations = searchParams.get('settle_durations') || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    let tokenIds: string[] | undefined = undefined;
    if (search) {
      // Tìm token_id chỉ theo symbol bắt đầu bằng search
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
        });
      }
    }

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
      .eq('status', status);

    const { data: tokenIdsFind, error: tokensErrors } = await supabase
      .from('tokens')
      .select('id')
      .eq('status', status);

    if (tokensErrors) {
      console.error('Error fetching tokens:', tokensErrors);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch tokens' },
        { status: 500 }
      );
    }
    if (statusToken) {
      query = query.in('token_id', tokenIdsFind);
    }

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

    if (tokenId) {
      query = query.eq('token_id', tokenId);
    }

    // Sort - Support all sortable fields from the offers table
    if (sort) {
      const validSortFields = [
        'price',
        'quantity',
        'filled',
        'created_at',
        'collateral_percent',
        'settle_duration',
        'updated_at',
      ];
      if (validSortFields.includes(sort)) {
        query = query.order(sort, { ascending: sort_order === 'asc' });
      } else {
        // Default to created_at if invalid sort field
        query = query.order('updated_at', { ascending: false });
      }
    } else {
      // Default sorting
      query = query.order('updated_at', { ascending: false });
    }

    // Apply pagination at the end
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      // Handle "Requested range not satisfiable" error gracefully
      if (
        error.message?.includes('range') ||
        error.message?.includes('Requested range not satisfiable')
      ) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }
      console.error('Error fetching offers:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Get list of offer IDs
    const offerIds = data?.map((offer) => offer.id) || [];

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

    // Map promotions to offers
    const offersWithPromotions = data?.map((offer) => {
      const promotion = promotions?.find((p) => p.offer_id === offer.id);
      return {
        ...offer,
        promotion: promotion || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: offersWithPromotions,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error('Error fetching offers:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
