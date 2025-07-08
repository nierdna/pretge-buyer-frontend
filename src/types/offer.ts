/**
 * Offer related type definitions
 */

import { IExToken, IToken } from './token';
import { Wallet } from './user';

export interface OfferImage {
  id: string;
  url: string;
  alt?: string;
  isDefault?: boolean;
}

export interface OfferVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  options: Record<string, string>;
}

export interface OfferOption {
  name: string;
  values: string[];
}

export interface OfferCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface OfferReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface TokenInfo {
  icon: string;
  symbol: string;
  address?: string;
}

export interface SellerInfo {
  name: string;
  address: string;
  rating: number;
  avatar?: string;
}

export interface Offer {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  images: OfferImage[];
  categories: OfferCategory[];
  variants: OfferVariant[];
  options: OfferOption[];
  reviews: OfferReview[];
  rating: number;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  isPublished: boolean;
  tokenInfo?: TokenInfo;
  sellerInfo?: SellerInfo;
  startTime?: string;
  endTime?: string;
  amount?: number;
}

export interface OfferFilter {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

export interface OfferCreateInput {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  categoryIds: string[];
  images: Omit<OfferImage, 'id'>[];
  variants?: Omit<OfferVariant, 'id'>[];
  options?: OfferOption[];
  isFeatured?: boolean;
}

export interface OfferUpdateInput extends Partial<OfferCreateInput> {
  id: string;
}

// Sample data for testing the new OfferCard design
export const sampleOffer: Offer = {
  id: '1',
  name: 'Sample Token',
  slug: 'sample-token',
  description: 'A sample token for testing',
  price: 0.5,
  compareAtPrice: 0.6,
  sku: 'TOKEN001',
  inventory: 1000,
  images: [{ id: '1', url: 'https://via.placeholder.com/500', alt: 'Sample Token' }],
  categories: [],
  variants: [],
  options: [],
  reviews: [],
  rating: 4.5,
  sellerId: 'seller1',
  sellerName: 'Sample Seller',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  isFeatured: true,
  isPublished: true,
  tokenInfo: {
    icon: 'https://via.placeholder.com/40',
    symbol: 'SMPL',
    address: '0x1234567890abcdef',
  },
  sellerInfo: {
    name: 'Crypto Seller',
    address: '0xabcdef1234567890',
    rating: 4.8,
    avatar: 'https://via.placeholder.com/32',
  },
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-20T18:00:00Z',
  amount: 50000,
};

//new

export enum EOfferStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}
export interface IOffer {
  collateralPercent: number;
  createdAt: string;
  description: string | null;
  exToken: IExToken;
  exTokenId: string;
  filled: number;
  id: string;
  price: number;
  quantity: number;
  sellerWallet: Wallet;
  sellerWalletId: string;
  settleDuration: number;
  status: EOfferStatus;
  title: string;
  tokenId: string;
  tokens: IToken;
  updatedAt: string;
}
