import { ethers } from 'ethers';

export interface BaseLoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
  referralCode?: string; // Optional referral code
}

export interface BaseLoginResponse {
  success: boolean;
  message?: string;
}

// Verify Base network (EVM) wallet signature
export function verifyBaseSignature(
  walletAddress: string,
  signature: string,
  message: string
): boolean {
  try {
    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return false;
    }

    // Recover the address from signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check if recovered address matches the provided address
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Generate login message for Base network wallet
export function generateBaseLoginMessage(walletAddress: string): string {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2);
  const message = `Login to Pre-Market XYZ\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;

  return message;
}

// Validate Base network login request
export function validateBaseLoginRequest(request: BaseLoginRequest): BaseLoginResponse {
  try {
    // Check if wallet address is valid
    if (!ethers.isAddress(request.walletAddress)) {
      return {
        success: false,
        message: 'Invalid wallet address format',
      };
    }

    // Check if signature is provided
    if (!request.signature || request.signature.length === 0) {
      return {
        success: false,
        message: 'Signature is required',
      };
    }

    // Check if message is provided
    if (!request.message || request.message.length === 0) {
      return {
        success: false,
        message: 'Message is required',
      };
    }

    // Check if timestamp is recent (within 5 minutes)
    const now = Date.now();
    const timeDiff = Math.abs(now - request.timestamp);
    const fiveMinutes = 5 * 60 * 1000;

    if (timeDiff > fiveMinutes) {
      return {
        success: false,
        message: 'Request expired. Please try again.',
      };
    }

    // Verify signature
    const isValidSignature = verifyBaseSignature(
      request.walletAddress,
      request.signature,
      request.message
    );

    if (!isValidSignature) {
      return {
        success: false,
        message: 'Invalid signature',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Base login validation error:', error);
    return {
      success: false,
      message: 'Invalid request format',
    };
  }
}
