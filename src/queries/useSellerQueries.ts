import { Service } from '@/service';
import { useQuery } from '@tanstack/react-query';
import type { SellerFilter } from '../types/seller';

// Query keys
export const sellerKeys = {
  all: ['sellers'] as const,
  lists: () => [...sellerKeys.all, 'list'] as const,
  list: (filters: SellerFilter = {}) => [...sellerKeys.lists(), { filters }] as const,
  details: () => [...sellerKeys.all, 'detail'] as const,
  detail: (id: string) => [...sellerKeys.details(), id] as const,
  products: (sellerId: string) => [...sellerKeys.detail(sellerId), 'products'] as const,
  reviews: (sellerId: string) => [...sellerKeys.detail(sellerId), 'reviews'] as const,
};

// Get all sellers
export const useSellers = (filters?: SellerFilter) => {
  return useQuery({
    queryKey: sellerKeys.list(filters),
    queryFn: () => Service.seller.getSellers(filters),
  });
};

// Get seller by ID
export const useSeller = (id?: string) => {
  return useQuery({
    queryKey: sellerKeys.detail(id || ''),
    queryFn: () => Service.seller.getSellerById(id || ''),
    enabled: !!id,
  });
};

// Get seller products
export const useSellerProducts = (
  sellerId?: string,
  params?: { page?: number; limit?: number; sortBy?: string }
) => {
  return useQuery({
    queryKey: [...sellerKeys.products(sellerId || ''), params],
    queryFn: () => Service.seller.getSellerProducts(sellerId || '', params),
    enabled: !!sellerId,
  });
};

// Get seller reviews
export const useSellerReviews = (
  sellerId?: string,
  params?: { page?: number; limit?: number; sortBy?: string }
) => {
  return useQuery({
    queryKey: [...sellerKeys.reviews(sellerId || ''), params],
    queryFn: () => Service.seller.getSellerReviews(sellerId || '', params),
    enabled: !!sellerId,
  });
};
