/**
 * Seller related type definitions
 */

export interface SellerAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SellerSocial {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface SellerVerification {
  isVerified: boolean;
  verifiedAt?: string;
  documents?: string[];
}

export interface SellerReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  slug: string;
  description: string;
  email: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  address: SellerAddress;
  social: SellerSocial;
  verification: SellerVerification;
  productsCount: number;
  rating: number;
  reviews: SellerReview[];
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface SellerFilter {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  isVerified?: boolean;
  minRating?: number;
  sortBy?: 'rating' | 'products' | 'newest';
  limit?: number;
  page?: number;
}

export interface SellerCreateInput {
  name: string;
  description: string;
  email: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  address: SellerAddress;
  social?: SellerSocial;
}

export interface SellerUpdateInput {
  id: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  address?: Partial<SellerAddress>;
  social?: Partial<SellerSocial>;
  status?: 'active' | 'inactive' | 'suspended';
}
