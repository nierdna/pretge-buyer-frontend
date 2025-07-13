/**
 * Seller related type definitions
 */

import { User } from './user';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface SellerReview {
  id: string;
  offerId: string;
  buyer_wallet: string;
  buyerId: string;
  buyer: User;
  rating: number; // 1-5
  comment: string;
  reply?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}
