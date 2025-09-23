import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

export interface SolanaLoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
  referralCode?: string; // Optional referral code
}

export interface SolanaLoginResponse {
  success: boolean;
  message?: string;
}

// Verify Solana wallet signature
export function verifySolanaSignature(
  walletAddress: string,
  signature: string,
  message: string
): boolean {
  try {
    const pubKey = new PublicKey(walletAddress);
    // Decode signature from base58 (Solana standard)
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    // Verify signature using tweetnacl
    return nacl.sign.detached.verify(messageBytes, signatureBytes, pubKey.toBytes());
  } catch (error) {
    return false;
  }
}

// Generate login message for Solana wallet
export function generateSolanaLoginMessage(walletAddress: string): string {
  const timestamp = Date.now();
  const message = `Login to Pre-Market XYZ\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${Math.random()
    .toString(36)
    .substring(2)}`;

  return message;
}

// Validate Solana login request
export function validateSolanaLoginRequest(request: SolanaLoginRequest): SolanaLoginResponse {
  try {
    // Check if wallet address is valid
    new PublicKey(request.walletAddress);

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
    const isValidSignature = verifySolanaSignature(
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
    return {
      success: false,
      message: 'Invalid wallet address',
    };
  }
}
