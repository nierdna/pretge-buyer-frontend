/**
 * Offer related type definitions
 */

import { IExToken, IToken } from './token';
import { WalletWithUser } from './user';

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

// Sample data for testing the new OfferCard design

//new
export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum EOfferStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface IPromotion {
  checkEligibleUrl: string | null;
  checkType: string;
  createdAt: string;
  description: string;
  discountPercent: number;
  id: string;
  isActive: boolean;
  offerId: string;
  title: string;
  updatedAt: string;
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
  sellerWallet: WalletWithUser;
  sellerWalletId: string;
  settleDuration: number;
  status: EOfferStatus;
  title: string;
  tokenId: string;
  tokens: IToken;
  updatedAt: string;
  promotionId: string | null;
  promotion: IPromotion | null;
  imageUrl: string;
}
