import { WalletExTokenService } from '@/server/service/exToken.service';
import { createWalletExTokenSchema } from '@/server/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');
    const chainType = searchParams.get('chainType') as 'evm' | 'sol' | 'sui' | null;

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 });
    }

    let walletExTokens;
    if (chainType) {
      walletExTokens = await WalletExTokenService.getWalletExTokensByChainType(walletId, chainType);
    } else {
      walletExTokens = await WalletExTokenService.getWalletExTokens(walletId);
    }

    return NextResponse.json(walletExTokens);
  } catch (error) {
    console.error('Error fetching wallet external tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet external tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createWalletExTokenSchema.parse(body);

    const walletExToken = await WalletExTokenService.createWalletExToken(validatedData);

    return NextResponse.json(walletExToken, { status: 201 });
  } catch (error: any) {
    console.error('Error creating wallet external token:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create wallet external token' }, { status: 500 });
  }
}
