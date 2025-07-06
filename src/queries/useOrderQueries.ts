import { Service } from '@/service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OrderCreateInput, OrderUpdateInput } from '../types/order';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Get all orders
export const useOrders = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => Service.order.getOrders(params),
  });
};

// Get order by ID
export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id || ''),
    queryFn: () => Service.order.getOrderById(id || ''),
    enabled: !!id,
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: OrderCreateInput) => Service.order.createOrder(orderData),
    onSuccess: () => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

// Update order mutation
export const useUpdateOrder = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: OrderUpdateInput) => Service.order.updateOrder(id, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

// Cancel order mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Service.order.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
