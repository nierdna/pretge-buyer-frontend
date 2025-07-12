'use client';

import { Service } from '@/service';
import { IOfferFilter } from '@/service/offer.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { OfferFilter } from '../types/offer';

// Query keys
export const offerKeys = {
  all: ['offers'] as const,
  lists: () => [...offerKeys.all, 'list'] as const,
  list: (filters: OfferFilter = {}) => [...offerKeys.lists(), { filters }] as const,
  details: () => [...offerKeys.all, 'detail'] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  featured: () => [...offerKeys.all, 'featured'] as const,
  related: (id: string) => [...offerKeys.all, 'related', id] as const,
};

// Get all offers
export const useOffers = (filters?: OfferFilter) => {
  return useQuery({
    queryKey: offerKeys.list(filters),
    queryFn: () => Service.offer.getOffers(filters),
  });
};

// Get offer by ID
export const useOffer = (id?: string) => {
  return useQuery({
    queryKey: offerKeys.detail(id || ''),
    queryFn: () => Service.offer.getOfferById(id || ''),
    enabled: !!id,
  });
};

// Get featured offers
export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: offerKeys.featured(),
    queryFn: () => Service.offer.getFeaturedOffers(),
  });
};

// Get related offers
export const useRelatedOffers = (offerId?: string) => {
  return useQuery({
    queryKey: offerKeys.related(offerId || ''),
    queryFn: () => Service.offer.getRelatedOffers(offerId || ''),
    enabled: !!offerId,
  });
};

// Create offer mutation

//new

export const useGetOffersV2 = (queryKey: any[] = []) => {
  const [filters, setFilters] = useState<IOfferFilter>({
    limit: 12,
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
  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ['offers', filters, ...queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.offer.getOffersV2({
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
      if (lastPage.pagination.totalPages === pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isLoading,
    isError,
    filters,
    inputSearch,
    handleSearch,
    setFilters,
  };
};

export const useGetOfferById = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      const response = await Service.offer.getOfferByIdV2(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetOrdersByOffer = (offerId: string) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['orders', offerId, page],
    queryFn: async () => {
      const response = await Service.offer.getOrdersByOffer(offerId, {
        page: page,
        limit: 1,
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

  return { data, isLoading, isError, setPage, page, totalPages, fetchNextPage, hasNextPage };
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
  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ['offers', tokenId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.offer.getOffersV2({
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

  return { data, isLoading, isError, filters, inputSearch, handleSearch, setFilters };
};
