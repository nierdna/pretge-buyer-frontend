import tokenService, { ITokenFilter } from '@/service/token.service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useTokenQueries = (
  initialFilters: ITokenFilter = {
    page: 1,
    limit: 10,
    search: '',
    network_id: '',
    statuses: ['active'],
  }
) => {
  const [filters, setFilters] = useState<ITokenFilter>(initialFilters);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tokens', filters],
    queryFn: async () => {
      try {
        const response = await tokenService.getTokens(filters);
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });
  return { data, isLoading, isError, filters, setFilters };
};

export const useTokenBySymbol = (symbol: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['token', symbol],
    queryFn: async () => {
      try {
        const response = await tokenService.getTokenBySymbol(symbol);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
  return { data, isLoading, isError };
};

export const useTokenBySymbolExternal = (symbol: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['web3-radar-project', symbol.toUpperCase()],
    queryFn: async () => {
      const response = await tokenService.getProjectBySymbol(symbol.toUpperCase());

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch project data');
      }

      return response.data;
    },
    enabled: !!symbol, // Chỉ query khi có symbol
    retry: (failureCount, error) => {
      // Không retry với 4xx errors
      if (error?.message?.includes('404') || error?.message?.includes('400')) {
        return false;
      }
      return failureCount < 2; // Retry tối đa 2 lần
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Giữ cache 10 phút
  });

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
