import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const networkId = searchParams.get('network_id') || '';
  const statuses = searchParams.get('statuses') || '';

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
      return NextResponse.json({ success: true, data: [], total: 0 });
    }
  }
  let query = supabase
    .from('tokens')
    .select(
      `
    *,
    networks:network_id (*)`
    )
    .range(offset, offset + limit - 1);
  if (tokenIds) {
    query = query.in('id', tokenIds);
  }

  if (networkId) {
    query = query.eq('networks_id', networkId);
  }

  if (statuses) {
    query = query.in('status', statuses.split(','));
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = data.map((token: any) => ({
    ...token,
    is_new: new Date(token.created_at) > new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    is_hot: new Date(token.created_at) < new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), //todo: add change with vol24h
  }));

  return NextResponse.json({
    success: true,
    data: response,
    pagination: {
      page,
      limit,
      total: data?.length || 0,
      totalPages: Math.ceil(data?.length || 0 / limit),
    },
  });
}
