import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort_field') || 'price';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const tokenId = searchParams.get('token_id') || '';

    // New filter parameters
    const networkIds = searchParams.get('network_ids') || '';
    const collateralPercents = searchParams.get('collateral_percents') || '';
    const settleDurations = searchParams.get('settle_durations') || '';

    const offset = (page - 1) * limit;

    let tokenIds: string[] | undefined = undefined;
    if (search) {
      // Tìm token_id theo name hoặc symbol bắt đầu bằng search
      const { data: tokens, error: tokenError } = await supabase
        .from('tokens')
        .select('id')
        .or(`name.ilike.${search}%,symbol.ilike.${search}%`);
      if (tokenError) {
        return NextResponse.json({ success: false, message: tokenError.message }, { status: 500 });
      }
      tokenIds = (tokens || []).map((t: any) => t.id);
      if (tokenIds.length === 0) {
        return NextResponse.json({ success: true, data: [], total: 0, page, limit, totalPages: 0 });
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
      .eq('status', status)
      .range(offset, offset + limit - 1);

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
            total: 0,
            page,
            limit,
            totalPages: 0,
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

    // Sort
    if (sort === 'price') {
      query = query.order('price', { ascending: sort_order === 'asc' ? true : false });
    } else if (sort === 'created_at') {
      query = query.order('created_at', { ascending: sort_order === 'asc' ? true : false });
    }

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
