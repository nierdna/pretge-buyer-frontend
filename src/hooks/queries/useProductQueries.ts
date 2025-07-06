import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../../service/product.service';
import type { ProductCreateInput, ProductFilter, ProductUpdateInput } from '../../types/product';

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
    queryFn: () => ProductService.getProducts(filters),
  });
};

// Get product by ID
export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => ProductService.getProductById(id || ''),
    enabled: !!id,
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => ProductService.getFeaturedProducts(),
  });
};

// Get related products
export const useRelatedProducts = (productId?: string) => {
  return useQuery({
    queryKey: productKeys.related(productId || ''),
    queryFn: () => ProductService.getRelatedProducts(productId || ''),
    enabled: !!productId,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateInput) => ProductService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductUpdateInput) => ProductService.updateProduct(id, productData),
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
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
