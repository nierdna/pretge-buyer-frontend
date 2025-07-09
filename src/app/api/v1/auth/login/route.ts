import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/service/auth.service';
import { BaseLoginRequest } from '@/server/utils/base';
import { SolanaLoginRequest } from '@/server/utils/solana';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chainType } = body;
    if (!chainType) {
      return NextResponse.json(
        { success: false, message: 'chainType is required' },
        { status: 400 }
      );
    }
    let result;
    if (chainType === 'evm') {
      result = await AuthService.loginWithBase(body as BaseLoginRequest);
    } else if (chainType === 'sol') {
      result = await AuthService.loginWithSolana(body as SolanaLoginRequest);
    } else {
      return NextResponse.json(
        { success: false, message: 'Unsupported chainType' },
        { status: 400 }
      );
    }
    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
