'use client';

import { Service } from '@/service';
import { IOfferFilter } from '@/service/offer.service';
import { useAuthStore } from '@/store/authStore';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export const useMyBalance = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['my-balance'],
    queryFn: async () => {
      try {
        const response = await Service.auth.getBalance();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch balance', error);
        toast.error('Failed to fetch balance');
        return null;
      }
    },
    enabled: !!accessToken,
  });
};
export const useMyFilledOrders = () => {
  const { user } = useAuthStore();
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<IOfferFilter>({
    limit: 5,
    page: 1,
    sortField: 'created_at',
    sortOrder: 'desc',
  });

  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ['order', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return { data: [], pagination: { totalPages: 0 } };
      const response = await Service.user.getFilledOrders(user?.id, {
        ...filters,
      });
      setTotalPages(Number(response.data.pagination.totalPages));
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages <= pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!user?.id && user?.id !== 'undefined',
  });

  return { data, isLoading, isError, filters, setFilters, totalPages };
};
