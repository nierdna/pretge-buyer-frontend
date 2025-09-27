import type {
  QuestListResponse,
  QuestQueryParams,
  QuestVerifyApiResponse,
  QuestVerifyRequest,
  UserQuestListResponse,
  UserStatsApiResponse,
} from '@/types/quest';
import axiosInstance from './axios';

export class QuestService {
  /**
   * Get all active quests with user completion status
   */
  async getQuests(params?: QuestQueryParams): Promise<QuestListResponse> {
    try {
      const response = await axiosInstance.get('/quests', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      throw error;
    }
  }

  /**
   * Get user's quest completion history
   */
  async getMyQuests(): Promise<UserQuestListResponse> {
    try {
      const response = await axiosInstance.get('/quests/my-quests', {
        headers: {
          Authorization: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user quests:', error);
      throw error;
    }
  }

  /**
   * Get user's points and stats
   */
  async getMyStats(): Promise<UserStatsApiResponse> {
    try {
      const response = await axiosInstance.get('/quests/my-stats', {
        headers: {
          Authorization: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  }

  /**
   * Verify quest completion
   */
  async verifyQuest(
    questCode: string,
    request: QuestVerifyRequest,
    idempotencyKey?: string
  ): Promise<QuestVerifyApiResponse> {
    try {
      const headers: Record<string, string> = {};
      if (idempotencyKey) {
        headers['Idempotency-Key'] = idempotencyKey;
      }

      const response = await axiosInstance.post(`/quests/${questCode}/verify`, request, {
        headers: {
          Authorization: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to verify quest ${questCode}:`, error);
      throw error;
    }
  }

  /**
   * Generate idempotency key for quest verification
   */
  generateIdempotencyKey(questCode: string, userId?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const base = userId ? `${userId}-${questCode}` : questCode;
    return `${base}-${timestamp}-${random}`;
  }
}
