import { NextRequest, NextResponse } from 'next/server';
import { generateBaseLoginMessage } from '@/server/utils/base';
import { generateSolanaLoginMessage } from '@/server/utils/solana';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, chainType } = await req.json();
    if (!walletAddress || !chainType) {
      return NextResponse.json(
        { success: false, message: 'walletAddress and chainType are required' },
        { status: 400 }
      );
    }
    let message = '';
    let timestamp = Date.now();
    if (chainType === 'evm') {
      message = generateBaseLoginMessage(walletAddress);
      // Lấy timestamp từ message
      const match = message.match(/Timestamp: (\d+)/);
      if (match) timestamp = Number(match[1]);
    } else if (chainType === 'sol') {
      message = generateSolanaLoginMessage(walletAddress);
      const match = message.match(/Timestamp: (\d+)/);
      if (match) timestamp = Number(match[1]);
    } else {
      return NextResponse.json(
        { success: false, message: 'Unsupported chainType' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, message, timestamp });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
