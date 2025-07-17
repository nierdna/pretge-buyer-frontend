'use client';

import { Service } from '@/service';
import { IOfferFilter } from '@/service/offer.service';
import { IOffer } from '@/types/offer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useGetOffers = (queryKey: any[] = []) => {
  const [filters, setFilters] = useState<IOfferFilter>({
    limit: 6,
    page: 1,
    sortField: 'price',
    sortOrder: 'desc',
    tokenId: '',
  });
  const [inputSearch, setInputSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters({ ...filters, search });
  }, 500);

  const handleSearch = (search: string) => {
    setInputSearch(search);
    debouncedSearch(search);
  };
  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['offers', filters, ...queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.offer.getOffers({
        page: pageParam,
        limit: filters.limit,
        sortField: filters.sortField,
        sortOrder: filters.sortOrder,
        search: filters.search,
        networkIds: filters.networkIds,
        collateralPercents: filters.collateralPercents,
        settleDurations: filters.settleDurations,
        tokenId: filters.tokenId,
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages > pages.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    inputSearch,
    handleSearch,
    setFilters,
    fetchNextPage,
    hasNextPage,
  };
};

export const useGetOfferById = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      const response = await Service.offer.getOfferById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetOrdersByOffer = (offerId: string) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['orders', offerId, page],
    queryFn: async () => {
      const response = await Service.offer.getOrdersByOffer(offerId, {
        page: page,
        limit: 5,
      });
      setTotalPages(response.data.pagination.totalPages);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages === pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const resetToFirstPage = () => {
    if (page > 1) {
      setPage(1);
    } else {
      refetch();
    }
  };

  return {
    data,
    isLoading,
    isError,
    setPage,
    page,
    totalPages,
    fetchNextPage,
    hasNextPage,
    refetch,
    resetToFirstPage,
  };
};

export const useGetOffersByToken = (tokenId: string) => {
  const [filters, setFilters] = useState<IOfferFilter>({
    limit: 12,
    page: 1,
    sortField: 'price',
    sortOrder: 'desc',
  });
  const [inputSearch, setInputSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters({ ...filters, search });
  }, 500);

  const handleSearch = (search: string) => {
    setInputSearch(search);
    debouncedSearch(search);
  };
  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['offers', tokenId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.offer.getOffers({
        page: pageParam,
        limit: filters.limit,
        sortField: filters.sortField,
        sortOrder: filters.sortOrder,
        search: filters.search,
        networkIds: filters.networkIds,
        collateralPercents: filters.collateralPercents,
        settleDurations: filters.settleDurations,
        tokenId: tokenId,
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages === pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!tokenId,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    filters,
    inputSearch,
    handleSearch,
    setFilters,
  };
};

export const useGetOffersByUserId = (userId: string) => {
  const [filters, setFilters] = useState<IOfferFilter>({
    limit: 12,
    page: 1,
    sortField: 'price',
    sortOrder: 'desc',
  });
  const [inputSearch, setInputSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters({ ...filters, search });
  }, 500);

  const handleSearch = (search: string) => {
    setInputSearch(search);
    debouncedSearch(search);
  };

  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ['offers', userId, filters],
    queryFn: async () => {
      const response = await Service.offer.getOffersByUserId(userId, {
        ...filters,
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages === pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!userId && userId !== 'undefined',
  });

  return { data, isLoading, isError, filters, inputSearch, handleSearch, setFilters };
};

export const useGetFlashSaleOffers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['flash-sale-offers'],
    queryFn: async () => {
      try {
        const response = await Service.offer.getFlashSaleOffers();
        console.log('response', response);
        return response as IOffer[];
      } catch (error) {
        console.error('Error fetching flash sale offers:', error);
        return [];
      }
    },
  });
  return { data, isLoading, isError };
};
