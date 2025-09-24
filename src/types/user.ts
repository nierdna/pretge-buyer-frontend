import { ChainType } from '@/server/enums/chain';

export enum KYCStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface User {
  avatar: string | null;
  banner: string | null;
  createdAt: string;
  description: string | null;
  id: string;
  kycStatus: KYCStatus;
  name: string;
  socialMedia: {
    discord: string;
    facebook: string;
    instagram: string;
    telegram: string;
    twitter: string;
    youtube: string;
  };
  status: string;
  updatedAt: string;
  rating: number;
  // Referral fields
  inviteCode?: string;
  referredByUserId?: string;
}

export interface Wallet {
  address: string;
  chainType: ChainType;
  createdAt: string;
  id: string;
  isPrimary: boolean;
  userId: string;
}
export interface WalletWithUser extends Wallet {
  user: User;
}

export interface ISeller extends User {
  wallet: Wallet[];
}
