import { OfferService } from '@/server/service/token.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'open' | 'closed' | undefined;
    const tokenId = searchParams.get('tokenId');
    const sellerWalletId = searchParams.get('sellerWalletId');

    if (tokenId) {
      const result = await OfferService.getOffersByToken(tokenId, page, limit);
      return NextResponse.json(result);
    }

    if (sellerWalletId) {
      const result = await OfferService.getOffersBySeller(sellerWalletId, page, limit);
      return NextResponse.json(result);
    }

    const result = await OfferService.getOffers(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.tokenId || !body.sellerWalletId || !body.price || !body.quantity) {
      return NextResponse.json(
        { error: 'tokenId, sellerWalletId, price, and quantity are required' },
        { status: 400 }
      );
    }

    const offerData = {
      tokenId: body.tokenId,
      sellerWalletId: body.sellerWalletId,
      price: body.price,
      quantity: body.quantity,
      filled: body.filled || 0,
      status: body.status || 'open',
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    };

    const offer = await OfferService.createOffer(offerData);
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
