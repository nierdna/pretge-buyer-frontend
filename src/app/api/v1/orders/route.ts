import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offer_id, quantity, wallet_id } = body;
    // TODO: Cải thiện lại logic để đảm bảo security
    // protect api này bẳng oauth và so sánh wallet id phải là ví của oauth đó
    if (!offer_id || !quantity || !wallet_id) {
      return NextResponse.json(
        { success: false, message: 'offer_id, quantity, wallet_id là bắt buộc' },
        { status: 400 }
      );
    }
    // Lấy offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offer_id)
      .single();
    if (offerError || !offer) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy offer' },
        { status: 404 }
      );
    }
    if (offer.quantity < quantity) {
      return NextResponse.json(
        { success: false, message: 'Số lượng còn lại không đủ' },
        { status: 400 }
      );
    }
    // Lấy số dư
    const { data: walletToken, error: walletTokenError } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', offer.ex_token_id)
      .single();
    if (walletTokenError) {
      return NextResponse.json(
        { success: false, message: walletTokenError.message },
        { status: 500 }
      );
    }
    if (!walletToken || walletToken.balance < offer.price * quantity) {
      return NextResponse.json(
        { success: false, message: 'Số dư không đủ để mua' },
        { status: 400 }
      );
    }
    // Tạo order (amount = price * quantity)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        offer_id,
        buyer_wallet_id: wallet_id,
        amount: offer.price * quantity,
        status: 'pending',
      })
      .select()
      .single();
    if (orderError) {
      return NextResponse.json({ success: false, message: orderError.message }, { status: 500 });
    }
    // Trừ số dư
    const { error: updateBalanceError } = await supabase
      .from('wallet_ex_tokens')
      .update({ balance: walletToken.balance - offer.price * quantity })
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', offer.ex_token_id);
    if (updateBalanceError) {
      return NextResponse.json(
        { success: false, message: updateBalanceError.message },
        { status: 500 }
      );
    }
    // Trừ số lượng offer, tăng filled
    const { error: updateOfferError } = await supabase
      .from('offers')
      .update({ filled: (offer.filled || 0) + quantity })
      .eq('id', offer_id);
    if (updateOfferError) {
      return NextResponse.json(
        { success: false, message: updateOfferError.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
