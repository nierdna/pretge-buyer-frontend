import { Wallet } from './wallet';

export interface User {
  id: string;
  name: string;
  avatar?: string | null;
  banner?: string | null;
  description?: string | null;
  socialMedia: {
    twitter: string;
    telegram: string;
    discord: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'banned' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string | null;
  banner?: string | null;
  description?: string | null;
  socialMedia: {
    twitter: string;
    telegram: string;
    discord: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  wallets: Wallet[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'banned' | 'pending';
}
