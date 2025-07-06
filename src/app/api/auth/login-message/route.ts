import { generateBaseLoginMessage } from '@/server/utils/base';
import { generateSolanaLoginMessage } from '@/server/utils/solana';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.walletAddress || !body.chainType) {
      return NextResponse.json(
        {
          success: false,
          message: 'walletAddress and chainType are required',
        },
        { status: 400 }
      );
    }

    // Validate chain type
    if (!['evm', 'sol', 'sui'].includes(body.chainType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid chain type. Must be evm, sol, or sui',
        },
        { status: 400 }
      );
    }

    let message: string;

    // Generate message based on chain type
    switch (body.chainType) {
      case 'evm':
        message = generateBaseLoginMessage(body.walletAddress);
        break;
      case 'sol':
        message = generateSolanaLoginMessage(body.walletAddress);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Unsupported chain type' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          message,
          timestamp: Date.now(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate message error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
