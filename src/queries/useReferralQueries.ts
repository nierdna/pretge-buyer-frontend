'use client';

import { Service } from '@/service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Get my referral code and stats
export const useGetMyReferralCode = () => {
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
          totalFilledVolume: 0, // TODO: Add this to API response
          lastEpochRewards: 0, // TODO: Add this to API response
          totalDistributedRewards: response.data.stats?.totalReferralPoints || 0,
          referralLink: generateReferralLink(response.data.myInviteCode),
          referredBy: response.data.referredBy,
          recentReferrals: response.data.recentReferrals || [],
        };
      } catch (error) {
        console.error('Failed to fetch referral stats:', error);
        return null;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
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

function generateReferralLink(inviteCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  return `${baseUrl}/register?ref=${inviteCode}`;
}
