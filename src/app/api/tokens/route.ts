import { TokenService } from '@/server/service/token.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as
      | 'draft'
      | 'active'
      | 'ended'
      | 'cancelled'
      | undefined;
    const search = searchParams.get('search');
    const active = searchParams.get('active') === 'true';

    if (active) {
      const result = await TokenService.getActiveTokens(page, limit);
      return NextResponse.json(result);
    }

    if (search) {
      const result = await TokenService.searchTokens(search, page, limit);
      return NextResponse.json(result);
    }

    const result = await TokenService.getTokens(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.symbol || !body.tokenContract || !body.networkId) {
      return NextResponse.json(
        { error: 'Name, symbol, tokenContract, and networkId are required' },
        { status: 400 }
      );
    }

    const tokenData = {
      name: body.name,
      symbol: body.symbol,
      logo: body.logo || '',
      tokenContract: body.tokenContract,
      networkId: body.networkId,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      status: body.status || 'draft',
    };

    const token = await TokenService.createToken(tokenData);
    return NextResponse.json(token, { status: 201 });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}
