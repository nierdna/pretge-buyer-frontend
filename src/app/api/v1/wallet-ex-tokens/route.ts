import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/db/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet_id = searchParams.get('wallet_id');
    if (!wallet_id) {
      return NextResponse.json(
        { success: false, message: 'wallet_id là bắt buộc' },
        { status: 400 }
      );
    }
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('*, ex_token:ex_token_id (*, network:network_id (*))')
      .eq('wallet_id', wallet_id);
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
