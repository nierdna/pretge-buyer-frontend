import { Service } from '@/service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProductCreateInput, ProductFilter, ProductUpdateInput } from '../types/product';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilter = {}) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  related: (id: string) => [...productKeys.all, 'related', id] as const,
};

// Get all products
export const useProducts = (filters?: ProductFilter) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => Service.product.getProducts(filters),
  });
};

// Get product by ID
export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => Service.product.getProductById(id || ''),
    enabled: !!id,
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => Service.product.getFeaturedProducts(),
  });
};

// Get related products
export const useRelatedProducts = (productId?: string) => {
  return useQuery({
    queryKey: productKeys.related(productId || ''),
    queryFn: () => Service.product.getRelatedProducts(productId || ''),
    enabled: !!productId,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateInput) => Service.product.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductUpdateInput) => Service.product.updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Service.product.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
