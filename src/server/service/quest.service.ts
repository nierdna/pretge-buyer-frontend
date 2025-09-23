import { supabase } from '@/server/db/supabase';
import {
  LinkClickMetadata,
  LinkClickProof,
  Quest,
  QuestStatus,
  QuestType,
  QuestVerifyRequest,
  QuestVerifyResponse,
  ReferralMetadata,
  ReferralProof,
  ReferralReward,
  SocialFollowMetadata,
  SocialFollowProof,
  SocialPostMetadata,
  SocialPostProof,
  SocialRetweetMetadata,
  SocialRetweetProof,
  TelegramJoinMetadata,
  TelegramJoinProof,
  UserPoints,
  UserQuest,
  VerifyStatus,
} from '@/server/types/quest';

export class QuestService {
  /**
   * Verify quest completion and award points
   */
  async verifyQuest(
    questCode: string,
    userId: string,
    request: QuestVerifyRequest,
    idempotencyKey?: string
  ): Promise<QuestVerifyResponse> {
    // 1. Get quest by code
    const quest = await this.getQuestByCode(questCode);
    if (!quest) {
      throw new Error('QUEST_NOT_FOUND');
    }

    // 2. Check if quest is active
    if (quest.status !== QuestStatus.ACTIVE) {
      throw new Error('QUEST_NOT_ACTIVE');
    }

    // 3. Check quest timing
    if (quest.startAt && new Date() < quest.startAt) {
      throw new Error('QUEST_NOT_ACTIVE');
    }
    if (quest.endAt && new Date() > quest.endAt) {
      throw new Error('QUEST_NOT_ACTIVE');
    }

    // 4. Check if user already verified this quest
    const existingUserQuest = await this.getUserQuest(userId, quest.id);
    if (existingUserQuest && existingUserQuest.status === VerifyStatus.VERIFIED) {
      throw new Error('ALREADY_VERIFIED');
    }

    // 5. Verify proof based on quest type
    const isValid = await this.verifyProof(quest, request.proof);
    if (!isValid) {
      throw new Error('VERIFICATION_FAILED');
    }

    // 6. Create or update user_quest record
    const userQuestId = await this.createUserQuest({
      userId,
      questId: quest.id,
      status: VerifyStatus.VERIFIED,
      proofPayload: request.proof,
      idempotencyKey,
      submittedAt: new Date(),
      verifiedAt: new Date(),
    });

    // 7. The trigger will automatically:
    //    - Add points to user
    //    - Handle referral rewards if applicable

    // 8. Get updated user points
    const userPoints = await this.getUserPoints(userId);

    // 9. Check for referral reward
    const referralReward = await this.getReferralReward(userQuestId);

    return {
      quest: {
        code: quest.code,
        type: quest.type,
        points: quest.points,
      },
      user: {
        id: userId,
      },
      result: {
        status: VerifyStatus.VERIFIED,
        awardedPoints: quest.points,
        totalPoints: userPoints?.totalPoints || quest.points,
        referralReward: referralReward
          ? {
              referrerUserId: referralReward.referrerUserId,
              pointsEarned: referralReward.pointsEarned,
            }
          : undefined,
      },
    };
  }

  /**
   * Get quest by code
   */
  private async getQuestByCode(code: string): Promise<Quest | null> {
    const { data, error } = await supabase.from('quests').select('*').eq('code', code).single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      code: data.code,
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status,
      points: data.points,
      metadata: data.metadata || {},
      startAt: data.start_at ? new Date(data.start_at) : undefined,
      endAt: data.end_at ? new Date(data.end_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Get existing user quest
   */
  private async getUserQuest(userId: string, questId: string): Promise<UserQuest | null> {
    const { data, error } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .eq('status', VerifyStatus.VERIFIED)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      questId: data.quest_id,
      status: data.status,
      proofPayload: data.proof_payload || {},
      idempotencyKey: data.idempotency_key,
      submittedAt: new Date(data.submitted_at),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      rejectedAt: data.rejected_at ? new Date(data.rejected_at) : undefined,
      rejectReason: data.reject_reason,
    };
  }

  /**
   * Create user quest record
   */
  private async createUserQuest(userQuest: Omit<UserQuest, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('user_quests')
      .insert({
        user_id: userQuest.userId,
        quest_id: userQuest.questId,
        status: userQuest.status,
        proof_payload: userQuest.proofPayload,
        idempotency_key: userQuest.idempotencyKey,
        submitted_at: userQuest.submittedAt.toISOString(),
        verified_at: userQuest.verifiedAt?.toISOString(),
        rejected_at: userQuest.rejectedAt?.toISOString(),
        reject_reason: userQuest.rejectReason,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating user quest:', error);
      throw new Error('INTERNAL_ERROR');
    }

    return data.id;
  }

  /**
   * Get user points
   */
  private async getUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      userId: data.user_id,
      totalPoints: data.total_points,
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Get referral reward for a user quest
   */
  private async getReferralReward(userQuestId: string): Promise<ReferralReward | null> {
    const { data, error } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_quest_id', userQuestId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      referrerUserId: data.referrer_user_id,
      referredUserId: data.referred_user_id,
      questId: data.quest_id,
      userQuestId: data.user_quest_id,
      pointsEarned: data.points_earned,
      percentBps: data.percent_bps,
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Verify proof based on quest type
   */
  private async verifyProof(quest: Quest, proof: Record<string, any>): Promise<boolean> {
    try {
      switch (quest.type) {
        case QuestType.SOCIAL_FOLLOW:
          return await this.verifySocialFollow(
            quest.metadata as SocialFollowMetadata,
            proof as SocialFollowProof
          );

        case QuestType.SOCIAL_RETWEET:
          return await this.verifySocialRetweet(
            quest.metadata as SocialRetweetMetadata,
            proof as SocialRetweetProof
          );

        case QuestType.SOCIAL_POST:
          return await this.verifySocialPost(
            quest.metadata as SocialPostMetadata,
            proof as SocialPostProof
          );

        case QuestType.TELEGRAM_JOIN:
          return await this.verifyTelegramJoin(
            quest.metadata as TelegramJoinMetadata,
            proof as TelegramJoinProof
          );

        case QuestType.REFERRAL:
          return await this.verifyReferral(
            quest.metadata as ReferralMetadata,
            proof as ReferralProof
          );

        case QuestType.LINK_X:
        case QuestType.LINK_TELE:
          return await this.verifyLinkClick(
            quest.metadata as LinkClickMetadata,
            proof as LinkClickProof
          );

        default:
          return false;
      }
    } catch (error) {
      console.error(`Verification error for quest ${quest.code}:`, error);
      return false;
    }
  }

  /**
   * Verify social follow
   */
  private async verifySocialFollow(
    metadata: SocialFollowMetadata,
    proof: SocialFollowProof
  ): Promise<boolean> {
    // MVP implementation - just validate structure
    if (!proof.username || typeof proof.username !== 'string') {
      return false;
    }

    // TODO: Integrate with X API to verify if user actually follows the handle
    // For MVP, we trust the user input
    return true;
  }

  /**
   * Verify social retweet
   */
  private async verifySocialRetweet(
    metadata: SocialRetweetMetadata,
    proof: SocialRetweetProof
  ): Promise<boolean> {
    // Validate structure
    if (
      !proof.tweetUrl ||
      !proof.tweetId ||
      typeof proof.tweetUrl !== 'string' ||
      typeof proof.tweetId !== 'string'
    ) {
      return false;
    }

    // Validate tweet ID matches metadata
    if (proof.tweetId !== metadata.tweetId) {
      return false;
    }

    // TODO: Integrate with X API to verify retweet
    // For MVP, we trust the user input if structure is correct
    return true;
  }

  /**
   * Verify social post
   */
  private async verifySocialPost(
    metadata: SocialPostMetadata,
    proof: SocialPostProof
  ): Promise<boolean> {
    // Validate structure
    if (
      !proof.tweetUrl ||
      !proof.tweetId ||
      typeof proof.tweetUrl !== 'string' ||
      typeof proof.tweetId !== 'string'
    ) {
      return false;
    }

    // TODO: Integrate with X API to verify:
    // - Post contains required tags
    // - Post mentions required handle
    // - Post meets minimum character requirement
    // For MVP, we trust the user input if structure is correct
    return true;
  }

  /**
   * Verify telegram join
   */
  private async verifyTelegramJoin(
    metadata: TelegramJoinMetadata,
    proof: TelegramJoinProof
  ): Promise<boolean> {
    // Validate structure
    if (!proof.telegramUserId || typeof proof.telegramUserId !== 'string') {
      return false;
    }

    // TODO: Integrate with Telegram Bot API to verify membership
    // For MVP, we trust the user input if structure is correct
    return true;
  }

  /**
   * Verify referral
   */
  private async verifyReferral(metadata: ReferralMetadata, proof: ReferralProof): Promise<boolean> {
    // Validate structure
    if (!proof.referredUserId || typeof proof.referredUserId !== 'string') {
      return false;
    }

    // Check if referred user exists
    const { data: referredUser, error } = await supabase
      .from('users')
      .select('id, created_at')
      .eq('id', proof.referredUserId)
      .single();

    if (error || !referredUser) {
      return false;
    }

    // For MVP, we check if user registered (basic validation)
    // TODO: Add more sophisticated checks based on metadata.minAction
    return true;
  }

  /**
   * Verify link click
   */
  private async verifyLinkClick(
    metadata: LinkClickMetadata,
    proof: LinkClickProof
  ): Promise<boolean> {
    // Validate structure
    if (!proof.clickToken || typeof proof.clickToken !== 'string') {
      return false;
    }

    // TODO: Verify click token against tracking system
    // For MVP, we accept any non-empty token
    return proof.clickToken.length > 0;
  }

  /**
   * Get all active quests
   */
  async getActiveQuests(): Promise<Quest[]> {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('status', QuestStatus.ACTIVE)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests:', error);
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      code: item.code,
      title: item.title,
      description: item.description,
      type: item.type,
      status: item.status,
      points: item.points,
      metadata: item.metadata || {},
      startAt: item.start_at ? new Date(item.start_at) : undefined,
      endAt: item.end_at ? new Date(item.end_at) : undefined,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  }

  /**
   * Get user's quest history
   */
  async getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]> {
    const { data, error } = await supabase
      .from('user_quests')
      .select(
        `
        *,
        quests (*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user quests:', error);
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      questId: item.quest_id,
      status: item.status,
      proofPayload: item.proof_payload || {},
      idempotencyKey: item.idempotency_key,
      submittedAt: new Date(item.submitted_at),
      verifiedAt: item.verified_at ? new Date(item.verified_at) : undefined,
      rejectedAt: item.rejected_at ? new Date(item.rejected_at) : undefined,
      rejectReason: item.reject_reason,
      quest: {
        id: item.quests.id,
        code: item.quests.code,
        title: item.quests.title,
        description: item.quests.description,
        type: item.quests.type,
        status: item.quests.status,
        points: item.quests.points,
        metadata: item.quests.metadata || {},
        startAt: item.quests.start_at ? new Date(item.quests.start_at) : undefined,
        endAt: item.quests.end_at ? new Date(item.quests.end_at) : undefined,
        createdAt: new Date(item.quests.created_at),
        updatedAt: new Date(item.quests.updated_at),
      },
    }));
  }

  /**
   * Get user points and referral stats
   */
  async getUserStats(userId: string): Promise<{
    totalPoints: number;
    completedQuests: number;
    referralRewards: number;
    totalReferrals: number;
  }> {
    // Get user points
    const userPoints = await this.getUserPoints(userId);

    // Get completed quests count
    const { count: completedQuests } = await supabase
      .from('user_quests')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', VerifyStatus.VERIFIED);

    // Get referral rewards
    const { data: referralRewards } = await supabase
      .from('referral_rewards')
      .select('points_earned')
      .eq('referrer_user_id', userId);

    // Get total referrals
    const { count: totalReferrals } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('referred_by_user_id', userId);

    const totalReferralPoints =
      referralRewards?.reduce((sum, reward) => sum + reward.points_earned, 0) || 0;

    return {
      totalPoints: userPoints?.totalPoints || 0,
      completedQuests: completedQuests || 0,
      referralRewards: totalReferralPoints,
      totalReferrals: totalReferrals || 0,
    };
  }
}
