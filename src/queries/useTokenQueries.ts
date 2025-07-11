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
