import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const query = supabase
    .from('offers')
    .select(
      `
    *,
    tokens:token_id (*),
    seller_wallet: seller_wallet_id (*),
    ex_token:ex_token_id (*, network:network_id (*))
  `
    )
    .eq('id', id)
    .single();
  const { data: offer, error } = await query;
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: offer });
}
