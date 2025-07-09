import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'recent';
    const userId = searchParams.get('user_id') || '';
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
        seller_wallet: seller_wallet_id (*),
        ex_token:ex_token_id (*, network:network_id (*))
      `,
        { count: 'exact' }
      )
      .eq('status', status)
      .range(offset, offset + limit - 1);

    if (tokenIds) {
      query = query.in('token_id', tokenIds);
    }
    if (userId) {
      query = query.eq('seller_id', userId);
    }

    // Sort
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
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
