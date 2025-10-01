'use client';

import { Service } from '@/service';
import { useAuthStore } from '@/store/authStore';
import type { QuestVerifyRequest, UserStatsResponse } from '@/types/quest';
import { isQuestVerifyErrorResponse } from '@/types/quest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Get all quests
export const useGetQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      try {
        const response = await Service.quest.getQuests();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch quests', error);
        toast.error('Failed to fetch quests');
        return [];
      }
    },
  });
};

// Get user's quest completion history
export const useGetMyQuests = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['my-quests'],
    queryFn: async () => {
      try {
        const response = await Service.quest.getMyQuests();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user quests', error);
        toast.error('Failed to fetch your quest history');
        return [];
      }
    },
    enabled: !!accessToken,
  });
};

// Get user's points and stats
export const useGetMyStats = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => {
      try {
        const response = await Service.quest.getMyStats();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user stats', error);
        toast.error('Failed to fetch your stats');
        return {
          totalPoints: 0,
          completedQuests: 0,
          referralRewards: 0,
          totalReferrals: 0,
        } as UserStatsResponse;
      }
    },
    enabled: !!accessToken,
  });
};

// Quest Verification Mutation
export const useVerifyQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questCode,
      request,
      idempotencyKey,
    }: {
      questCode: string;
      request: QuestVerifyRequest;
      idempotencyKey?: string;
    }) => {
      const response = await Service.quest.verifyQuest(questCode, request, idempotencyKey);
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success && data.result) {
        toast.success(`Quest verified! You earned ${data.result.awardedPoints} points!`);

        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['my-quests'] });
        queryClient.invalidateQueries({ queryKey: ['my-stats'] });
      }
    },
    onError: (error: any) => {
      console.error('Quest verification failed:', error);

      if (error.response?.data && isQuestVerifyErrorResponse(error.response.data)) {
        const errorData = error.response.data;
        switch (errorData.error) {
          case 'ALREADY_VERIFIED':
            toast.error('You have already completed this quest');
            break;
          case 'QUEST_NOT_FOUND':
            toast.error('Quest not found');
            break;
          case 'QUEST_NOT_ACTIVE':
            toast.error('Quest is not active or has expired');
            break;
          case 'VERIFICATION_FAILED':
            toast.error('Quest verification failed. Please check your proof.');
            break;
          case 'RATE_LIMITED':
            toast.error('Too many requests. Please try again later.');
            break;
          default:
            toast.error(errorData.message || 'Quest verification failed');
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });
};
