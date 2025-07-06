import { OrderService } from '@/server/service/order.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'pending' | 'settled' | 'cancelled' | undefined;
    const buyerWalletId = searchParams.get('buyerWalletId');
    const offerId = searchParams.get('offerId');

    if (buyerWalletId) {
      const result = await OrderService.getOrdersByBuyer(buyerWalletId, page, limit);
      return NextResponse.json(result);
    }

    if (offerId) {
      const result = await OrderService.getOrdersByOffer(offerId, page, limit);
      return NextResponse.json(result);
    }

    const result = await OrderService.getOrders(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.offerId || !body.buyerWalletId || !body.amount) {
      return NextResponse.json(
        { error: 'offerId, buyerWalletId, and amount are required' },
        { status: 400 }
      );
    }

    const orderData = {
      offerId: body.offerId,
      buyerWalletId: body.buyerWalletId,
      amount: body.amount,
      status: body.status || 'pending',
      txHash: body.txHash,
    };

    const order = await OrderService.createOrder(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
