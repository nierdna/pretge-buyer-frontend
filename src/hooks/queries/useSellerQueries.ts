import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SellerService } from '../../service/seller.service';
import type { SellerCreateInput, SellerFilter, SellerUpdateInput } from '../../types/seller';

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
    queryFn: () => SellerService.getSellers(filters),
  });
};

// Get seller by ID
export const useSeller = (id?: string) => {
  return useQuery({
    queryKey: sellerKeys.detail(id || ''),
    queryFn: () => SellerService.getSellerById(id || ''),
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
    queryFn: () => SellerService.getSellerProducts(sellerId || '', params),
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
    queryFn: () => SellerService.getSellerReviews(sellerId || '', params),
    enabled: !!sellerId,
  });
};

// Create seller mutation
export const useCreateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerData: SellerCreateInput) => SellerService.createSeller(sellerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.lists() });
    },
  });
};

// Update seller mutation
export const useUpdateSeller = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerData: SellerUpdateInput) => SellerService.updateSeller(id, sellerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sellerKeys.lists() });
    },
  });
};

// Delete seller mutation
export const useDeleteSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SellerService.deleteSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.lists() });
    },
  });
};
