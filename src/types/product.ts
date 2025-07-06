/**
 * Product related type definitions
 */

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  options: Record<string, string>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface ProductReview {
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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  images: ProductImage[];
  categories: ProductCategory[];
  variants: ProductVariant[];
  options: ProductOption[];
  reviews: ProductReview[];
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

export interface ProductFilter {
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

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  categoryIds: string[];
  images: Omit<ProductImage, 'id'>[];
  variants?: Omit<ProductVariant, 'id'>[];
  options?: ProductOption[];
  isFeatured?: boolean;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  id: string;
}

// Sample data for testing the new ProductCard design
export const sampleProduct: Product = {
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
