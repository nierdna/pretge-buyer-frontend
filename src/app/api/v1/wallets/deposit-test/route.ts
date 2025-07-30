import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { wallet_id, token_id, amount } = await req.json();
    if (!wallet_id || !token_id || !amount) {
      return NextResponse.json(
        { success: false, message: 'wallet_id, token_id, amount là bắt buộc' },
        { status: 400 }
      );
    }
    // Tìm wallet_ex_token
    const { data: walletExToken, error } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', token_id)
      .single();
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    if (walletExToken) {
      // Cộng thêm balance
      const { error: updateError } = await supabase
        .from('wallet_ex_tokens')
        .update({ balance: (walletExToken.balance || 0) + Number(amount) })
        .eq('id', walletExToken.id);
      if (updateError) {
        return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });
      }
    } else {
      // Tạo mới nếu chưa có
      const { error: insertError } = await supabase.from('wallet_ex_tokens').insert({
        wallet_id,
        ex_token_id: token_id,
        balance: Number(amount),
        chain_type: 'evm', // hoặc lấy từ token/network nếu cần
        address: '', // có thể lấy từ wallet nếu cần
      });
      if (insertError) {
        return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
      }
    }
    return NextResponse.json({ success: true, message: 'Nạp tiền thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
