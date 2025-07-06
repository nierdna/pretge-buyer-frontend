import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    walletAddress: string;
    chainType: 'evm' | 'sol' | 'sui';
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'Authorization header required' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify access token
      const payload = verifyAccessToken(token);

      // Add user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = payload;

      return handler(authenticatedRequest);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid access token' },
        { status: 401 }
      );
    }
  };
}
