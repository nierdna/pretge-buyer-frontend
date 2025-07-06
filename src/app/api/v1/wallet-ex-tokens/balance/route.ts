import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/db/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet_id = searchParams.get('wallet_id');
    const ex_token_id = searchParams.get('ex_token_id');
    if (!wallet_id || !ex_token_id) {
      return NextResponse.json(
        { success: false, message: 'wallet_id và ex_token_id là bắt buộc' },
        { status: 400 }
      );
    }
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('balance, ex_token:ex_token_id(*)')
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', ex_token_id)
      .single();
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ success: true, balance: 0, ex_token: null });
    }
    return NextResponse.json({ success: true, balance: data.balance, ex_token: data.ex_token });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
