import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/db/supabase';

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

    // Lấy promotion (nếu có)
    let promotion = null;
    let eligible = false;
    let discountPercent = 0;
    let promotionId = null;
    let realAmount = offer.price * quantity;
    const { data: promotionData } = await supabase
      .from('promotions')
      .select('*')
      .eq('offer_id', offer_id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    if (promotionData) {
      promotion = promotionData;
      // Lấy address từ wallet_id
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('address')
        .eq('id', wallet_id)
        .single();
      if (!walletError && walletData && walletData.address) {
        if (promotion.check_type === 'url') {
          try {
            const res = await fetch(promotion.check_eligible_url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: walletData.address }),
            });
            const data = await res.json();
            eligible = !!data.eligible;
          } catch (e) {
            eligible = false;
          }
        } else if (promotion.check_type === 'test') {
          eligible = true;
        }
      }
      if (eligible) {
        discountPercent = promotion.discount_percent;
        promotionId = promotion.id;
        realAmount = offer.price * quantity * (1 - discountPercent / 100);
      }
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
    if (!walletToken || walletToken.balance < realAmount) {
      return NextResponse.json(
        { success: false, message: 'Số dư không đủ để mua' },
        { status: 400 }
      );
    }
    // Tạo order (amount = quantity)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        offer_id,
        buyer_wallet_id: wallet_id,
        amount: quantity,
        status: 'pending',
        promotion_id: promotionId,
        discount_percent: discountPercent,
      })
      .select()
      .single();
    if (orderError) {
      return NextResponse.json({ success: false, message: orderError.message }, { status: 500 });
    }
    // Trừ số dư
    const { error: updateBalanceError } = await supabase
      .from('wallet_ex_tokens')
      .update({ balance: walletToken.balance - realAmount })
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
      .update({ quantity: offer.quantity - quantity, filled: (offer.filled || 0) + quantity })
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
