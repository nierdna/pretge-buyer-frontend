import { AuthService } from '@/server/service/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.walletAddress ||
      !body.signature ||
      !body.message ||
      !body.timestamp ||
      !body.chainType
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'walletAddress, signature, message, timestamp, and chainType are required',
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

    const loginRequest = {
      walletAddress: body.walletAddress,
      signature: body.signature,
      message: body.message,
      timestamp: body.timestamp,
    };

    let result;

    // Route to appropriate login method based on chain type
    switch (body.chainType) {
      case 'evm':
        result = await AuthService.loginWithBase(loginRequest);
        break;
      case 'sol':
        result = await AuthService.loginWithSolana(loginRequest);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Unsupported chain type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
