import { Service } from '@/service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export const useGetSellerById = (id: string) => {
  return useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      try {
        const response = await Service.user.getSellerById(id);
        return response.data;
      } catch (error) {
        console.error('Error fetching seller:', error);
        toast.error('Error fetching seller');
        return undefined;
      }
    },
    enabled: !!id && id !== 'undefined',
  });
};

export const useGetReviewsBySellerId = (id: string) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
  });
  const { data, isLoading, isError, error, refetch } = useInfiniteQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return undefined;
      try {
        const response = await Service.user.getReviewsBySellerId(id, filters);
        return response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Error fetching reviews');
        return undefined;
      }
    },
    getNextPageParam: (lastPage, pages) => lastPage?.pagination?.page + 1,
    initialPageParam: 1,
    enabled: !!id && id !== 'undefined',
  });
  const refetchReviews = () => {
    if (filters.page && filters.page > 1) {
      setFilters({ ...filters, page: 1 });
    } else {
      refetch();
    }
  };
  return { data, isLoading, isError, error, setFilters, filters, refetchReviews };
};
