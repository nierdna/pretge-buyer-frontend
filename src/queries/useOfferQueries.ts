import { Service } from '@/service';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OfferCreateInput, OfferFilter, OfferUpdateInput } from '../types/offer';

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
export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerData: OfferCreateInput) => Service.offer.createOffer(offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
  });
};

// Update offer mutation
export const useUpdateOffer = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerData: OfferUpdateInput) => Service.offer.updateOffer(id, offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
  });
};

// Delete offer mutation
export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Service.offer.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() });
    },
  });
};

//new
export const useGetOffersV2 = () => {
  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ['offers'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.offer.getOffersV2({ page: pageParam, limit: 12 });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      console.log('lastPage', lastPage);
      console.log('pages', pages);
      if (lastPage.pagination.totalPages === pages.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  return { data, isLoading, isError };
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
