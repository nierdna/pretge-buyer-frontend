import { ExTokenService } from '@/server/service/exToken.service';
import { createExTokenSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const networkId = searchParams.get('networkId');
    const query = searchParams.get('query');

    let result;
    if (query) {
      result = await ExTokenService.searchExTokens(query, page, limit);
    } else if (networkId) {
      result = await ExTokenService.getExTokensByNetwork(networkId, page, limit);
    } else {
      result = await ExTokenService.getExTokens(page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching external tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch external tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createExTokenSchema.parse(body);

    const exToken = await ExTokenService.createExToken(validatedData);

    return NextResponse.json(exToken, { status: 201 });
  } catch (error: any) {
    console.error('Error creating external token:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create external token' }, { status: 500 });
  }
}
