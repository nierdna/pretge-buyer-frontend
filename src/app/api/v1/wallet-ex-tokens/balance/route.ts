import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let wallet_id = searchParams.get('wallet_id');
    let ex_token_id = searchParams.get('ex_token_id');
    const wallet_address = searchParams.get('wallet_address');
    const ex_token_address = searchParams.get('ex_token_address');
    const chain_type = searchParams.get('chain_type'); // optional, useful for wallet lookup

    // Nếu chưa có wallet_id, thử lấy từ address
    if (!wallet_id && wallet_address) {
      // Nếu có chain_type thì dùng, không thì lấy bất kỳ ví nào khớp address
      let walletQuery = supabase
        .from('wallets')
        .select('id')
        .ilike('address', `${wallet_address.toLowerCase()}`);
      if (chain_type) walletQuery = walletQuery.eq('chain_type', chain_type);
      const { data: walletData, error: walletError } = await walletQuery.single();
      if (walletError || !walletData) {
        return NextResponse.json(
          { success: false, message: 'Không tìm thấy wallet với address này' },
          { status: 404 }
        );
      }
      wallet_id = walletData.id;
    }

    // Nếu chưa có ex_token_id, thử lấy từ address
    if (!ex_token_id && ex_token_address) {
      const { data: tokenData, error: tokenError } = await supabase
        .from('ex_tokens')
        .select('id')
        .ilike('address', `${ex_token_address.toLowerCase()}`)
        .single();
      if (tokenError || !tokenData) {
        return NextResponse.json(
          { success: false, message: 'Không tìm thấy ex_token với address này' },
          { status: 404 }
        );
      }
      ex_token_id = tokenData.id;
    }

    if (!wallet_id || !ex_token_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'wallet_id và ex_token_id là bắt buộc (hoặc truyền address tương ứng)',
        },
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
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { success: false, message: 'Không tìm thấy balance' },
          { status: 404 }
        );
      }
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
