import { supabase } from '@/server/db/supabase';
import { div, minus, mul } from '@/utils/helpers/number';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offer_id, quantity, wallet_id, collateral_percent } = body;
    // TODO: Improve logic to ensure security
    // protect this API with oauth and compare wallet id must be the wallet of that oauth
    if (!offer_id || !quantity || !wallet_id) {
      return NextResponse.json(
        { success: false, message: 'offer_id, quantity, wallet_id are required' },
        { status: 400 }
      );
    }
    // Validate: quantity must be greater than 0
    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (!collateral_percent || Number(collateral_percent) < 25) {
      return NextResponse.json(
        { success: false, message: 'Collateral percent must be greater than or equal to 25%' },
        { status: 400 }
      );
    }
    // Get offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offer_id)
      .single();
    if (offerError || !offer) {
      return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 });
    }
    // Validate: offer must have enough available quantity (quantity >= filled + requested)
    if (offer.quantity < (offer.filled || 0) + quantity) {
      return NextResponse.json(
        { success: false, message: 'Not enough offer quantity available' },
        { status: 400 }
      );
    }
    // Validate: buyer cannot be the seller (if offer has seller_wallet_id field)
    if (offer.seller_wallet_id && offer.seller_wallet_id === wallet_id) {
      return NextResponse.json(
        { success: false, message: 'Cannot buy your own offer' },
        { status: 400 }
      );
    }

    if (Number(collateral_percent) < Number(offer?.collateral_percent)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Collateral percent must be greater than or equal to the seller's collateral percent.",
        },
        { status: 400 }
      );
    }

    // Get promotion (if any)
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
      // Get address from wallet_id
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('address')
        .eq('id', wallet_id)
        .single();
      if (!walletError && walletData && walletData.address) {
        if (collateral_percent && collateral_percent < 100) {
          eligible = false;
          realAmount = div(mul(realAmount, collateral_percent), 100);
        } else if (promotion.check_type === 'url') {
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
    // if (collateral_percent) {
    //   realAmount = div(mul(realAmount, collateral_percent), 100);
    // }
    // Get balance
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
        { success: false, message: 'Insufficient balance to purchase' },
        { status: 400 }
      );
    }

    // Create order (amount = quantity)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        offer_id,
        buyer_wallet_id: wallet_id,
        amount: quantity,
        status: 'pending',
        promotion_id: promotionId,
        discount_percent: discountPercent,
        collateral_percent: collateral_percent,
      })
      .select()
      .single();
    if (orderError) {
      return NextResponse.json({ success: false, message: orderError.message }, { status: 500 });
    }
    // Deduct balance
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
    // Deduct offer quantity, increase filled and update status if needed
    const newFilled = (offer.filled || 0) + quantity;
    const newStatus = newFilled >= offer.quantity ? 'closed' : offer.status;
    const { error: updateOfferError } = await supabase
      .from('offers')
      .update({ filled: newFilled, status: newStatus })
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, wallet_id } = body;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();
    if (orderError) {
      if (orderError.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
      console.error('Database error:', orderError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    if (Number(order?.collateral_percent) >= 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already completed the payment. Please wait for the token TGE.',
        },
        { status: 400 }
      );
    }

    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', order?.offer_id)
      .single();

    if (offerError) {
      if (offerError.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: false, message: 'Failed to fetch offer' },
        { status: 500 }
      );
    }

    const { data: walletToken, error: walletTokenError } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', offer.ex_token_id)
      .single();

    if (walletTokenError) {
      if (walletTokenError.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: false, message: walletTokenError.message },
        { status: 500 }
      );
    }

    const quantityOrder = order.amount;
    const oldCollateralPercent = order?.collateral_percent;
    const remainingPercent = minus(100, oldCollateralPercent);
    const realAmount = mul(offer.price, quantityOrder);
    const remainingValue = div(mul(realAmount, remainingPercent), 100);

    if (!walletToken || walletToken.balance < remainingValue) {
      return NextResponse.json(
        { success: false, message: 'Insufficient balance to purchase' },
        { status: 400 }
      );
    }

    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ collateral_percent: 100 })
      .eq('id', order_id);
    if (updateOrderError) {
      return NextResponse.json(
        { success: false, message: updateOrderError.message },
        { status: 500 }
      );
    }

    const { error: updateBalanceError } = await supabase
      .from('wallet_ex_tokens')
      .update({ balance: walletToken.balance - remainingValue })
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', offer.ex_token_id);
    if (updateBalanceError) {
      return NextResponse.json(
        { success: false, message: updateBalanceError.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, message: 'Payment successful!' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
