// Referral Reward Types
export interface ReferralReward {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  quest_id: string;
  user_quest_id: string;
  points_earned: number;
  percent_bps: number;
  created_at: string;
}

export interface ReferralRewardWithDetails {
  id: string;
  points_earned: number;
  percent_bps: number;
  created_at: string;
  referred_user: {
    id: string;
    name: string;
    avatar?: string;
  };
  quest: {
    id: string;
    code: string;
    title: string;
    type: string;
    points: number;
  };
}

// API Response Types
export interface ReferralRewardsListResponse {
  success: boolean;
  data: ReferralRewardWithDetails[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

// Query Parameters
export interface ReferralRewardsQueryParams {
  page?: number;
  limit?: number;
  sortField?: 'created_at' | 'points_earned';
  sortOrder?: 'asc' | 'desc';
}

// Referral Stats Types
export interface ReferralStats {
  totalReferrals: number;
  totalReferralPoints: number;
  totalEarned: number;
  activeReferrals: number;
}

export interface ReferralUser {
  id: string;
  name: string;
  avatar?: string;
  inviteCode: string;
  joinedAt: string;
  totalPoints: number;
}

export interface MyReferralCodeResponse {
  success: boolean;
  data: {
    myInviteCode: string;
    referredBy: {
      id: string;
      name: string;
      inviteCode: string;
    } | null;
    stats: ReferralStats;
    recentReferrals: ReferralUser[];
  };
  message: string;
}

// Validate Code Types
export interface ValidateCodeResponse {
  success: boolean;
  data: {
    referrer: {
      id: string;
      name: string;
      avatar?: string;
      inviteCode: string;
    };
    stats: {
      totalReferrals: number;
      totalReferralPoints: number;
    };
  };
  message: string;
}

// Set Referrer Types
export interface SetReferrerRequest {
  inviteCode: string;
}

export interface SetReferrerResponse {
  success: boolean;
  data: {
    referrerId: string;
    inviteCode: string;
  };
  message: string;
}
