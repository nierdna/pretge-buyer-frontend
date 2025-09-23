'use client';

import { useFilterCache } from '@/hooks/useFilterCache';
import { Service } from '@/service';
import { useAuthStore } from '@/store/authStore';
import { ReferralRewardsQueryParams } from '@/types/referral';
import { CACHE_KEYS } from '@/utils/filterCache';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Get my referral code and stats
export const useGetMyReferralCode = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['my-referral-code'],
    queryFn: async () => {
      try {
        const response = await Service.referral.getMyCode();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch my referral code:', error);
        toast.error('Failed to fetch referral data');
        return null;
      }
    },
    enabled: !!accessToken, // Only fetch when user is authenticated
    retry: 2,
  });
};

// Validate invite code
export const useValidateInviteCode = (code: string | null) => {
  return useQuery({
    queryKey: ['validate-invite-code', code],
    queryFn: async () => {
      if (!code) return null;
      try {
        const response = await Service.referral.validateCode(code);
        return response.data;
      } catch (error) {
        console.error('Failed to validate invite code:', error);
        return null;
      }
    },
    enabled: !!code && code.length > 0,
    retry: false,
  });
};

// Set referrer mutation
export const useSetReferrer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const response = await Service.referral.setReferrer(inviteCode);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Referrer set successfully!');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['my-referral-code'] });
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to set referrer';
      toast.error(message);
    },
  });
};

// Get referral stats for display
export const useGetReferralStats = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      try {
        const response = await Service.referral.getMyCode();
        console.log('response.data', response);

        if (!response.data) return null;

        // Transform data to match UI expectations
        return {
          myInviteCode: response.data.myInviteCode,
          currentTier: calculateTier(response.data.stats?.totalReferralPoints || 0),
          totalReferrals: response.data.stats?.totalReferrals || 0,
          totalReferralPoints: response.data.stats?.totalReferralPoints || 0,
          referralLink: generateReferralLink(response.data.myInviteCode),
          referredBy: response.data.referredBy,
          recentReferrals: response.data.recentReferrals || [],
        };
      } catch (error) {
        console.error('Failed to fetch referral stats:', error);
        return null;
      }
    },
    enabled: !!accessToken, // Only fetch when user is authenticated
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useGetReferralRewards = (queryKey: any[] = []) => {
  // Use filter cache to save filter state
  const { filters, setFilters, resetToDefault, clearCache } = useFilterCache({
    key: CACHE_KEYS.REFERRAL_REWARDS_FILTER,
    defaultFilter: {
      limit: 10,
      page: 1,
      sortField: 'created_at',
      sortOrder: 'desc',
    } as ReferralRewardsQueryParams,
  });

  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['referral-rewards', filters, ...queryKey],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const response = await Service.referral.getReferralRewards({
            page: pageParam,
            limit: filters.limit,
            sortField: filters.sortField as 'created_at' | 'points_earned',
            sortOrder: filters.sortOrder as 'asc' | 'desc',
          });
          return response.data
            ? response
            : { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
        } catch (error) {
          console.error('Failed to fetch referral rewards:', error);
          throw error;
        }
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pagination && lastPage.pagination.totalPages > pages.length) {
          return pages.length + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    setFilters,
    fetchNextPage,
    hasNextPage,
    resetToDefault,
    clearCache,
    refetch,
  };
};

// Helper functions
function calculateTier(totalPoints: number): number {
  // Simple tier calculation based on points
  // You can adjust these thresholds based on your requirements
  if (totalPoints >= 1000) return 4;
  if (totalPoints >= 500) return 3;
  if (totalPoints >= 100) return 2;
  return 1;
}

function generateReferralLink(inviteCode: string | null): string | null {
  if (!inviteCode) return null;

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || '';
  return `${baseUrl}?ref=${inviteCode}`;
}
