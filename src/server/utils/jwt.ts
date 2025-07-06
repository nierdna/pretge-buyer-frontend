import { JWT_REFRESH_SECRET, JWT_SECRET } from '@/configs/env';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  chainType: 'evm' | 'sol' | 'sui';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

// Generate access token (short lived - 15 minutes)
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// Generate refresh token (long lived - 7 days)
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Generate token pair
export function generateTokenPair(
  userId: string,
  walletAddress: string,
  chainType: 'evm' | 'sol' | 'sui'
) {
  const tokenId = Math.random().toString(36).substring(2);

  const accessToken = generateAccessToken({
    userId,
    walletAddress,
    chainType,
  });

  const refreshToken = generateRefreshToken({
    userId,
    tokenId,
  });

  return {
    accessToken,
    refreshToken,
    tokenId,
  };
}
