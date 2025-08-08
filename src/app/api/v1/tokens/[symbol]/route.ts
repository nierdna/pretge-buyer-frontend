import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { data, error } = await supabase
    .from('tokens')
    .select('*,networks:network_id(*)')
    .or(`symbol.ilike.${symbol}`)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    data: data,
    success: true,
  });
}
