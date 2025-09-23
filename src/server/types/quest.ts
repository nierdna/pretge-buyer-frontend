export enum QuestType {
  SOCIAL_FOLLOW = 'SOCIAL_FOLLOW',
  SOCIAL_RETWEET = 'SOCIAL_RETWEET',
  SOCIAL_POST = 'SOCIAL_POST',
  TELEGRAM_JOIN = 'TELEGRAM_JOIN',
  REFERRAL = 'REFERRAL',
  LINK_X = 'LINK_X',
  LINK_TELE = 'LINK_TELE',
}

export enum QuestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export enum VerifyStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface Quest {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: QuestType;
  status: QuestStatus;
  points: number;
  metadata: Record<string, any>;
  startAt?: Date;
  endAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: VerifyStatus;
  proofPayload: Record<string, any>;
  idempotencyKey?: string;
  submittedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectReason?: string;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  updatedAt: Date;
}

export interface ReferralReward {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  questId: string;
  userQuestId: string;
  pointsEarned: number;
  percentBps: number; // 1000 = 10%
  createdAt: Date;
}

// Request/Response types
export interface QuestVerifyRequest {
  proof: Record<string, any>;
  meta?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface QuestVerifyResponse {
  quest: {
    code: string;
    type: QuestType;
    points: number;
  };
  user: {
    id: string;
  };
  result: {
    status: VerifyStatus;
    awardedPoints: number;
    totalPoints: number;
    referralReward?: {
      referrerUserId: string;
      pointsEarned: number;
    };
  };
}

// Quest type specific metadata and proof schemas
export interface SocialFollowMetadata {
  handle: string; // e.g., "@pretgemarket"
}

export interface SocialFollowProof {
  username: string; // User's X handle
}

export interface SocialRetweetMetadata {
  tweetId: string;
}

export interface SocialRetweetProof {
  tweetUrl: string;
  tweetId: string;
}

export interface SocialPostMetadata {
  requiredTags: string[]; // e.g., ["#PreTGE"]
  mention?: string; // e.g., "@pretgemarket"
  minChars?: number;
}

export interface SocialPostProof {
  tweetUrl: string;
  tweetId: string;
}

export interface TelegramJoinMetadata {
  chatId: string; // e.g., "@pretgemarket_community"
}

export interface TelegramJoinProof {
  telegramUserId: string;
  telegramUsername?: string;
}

export interface ReferralMetadata {
  minAction: 'REGISTERED' | 'FIRST_QUEST' | 'FIRST_ORDER';
}

export interface ReferralProof {
  referredUserId: string;
}

export interface LinkClickMetadata {
  url: string;
}

export interface LinkClickProof {
  clickToken: string; // Opaque token to verify click
}

// Error types
export type QuestVerifyError =
  | 'QUEST_NOT_FOUND'
  | 'QUEST_NOT_ACTIVE'
  | 'ALREADY_VERIFIED'
  | 'VERIFICATION_FAILED'
  | 'RATE_LIMITED'
  | 'INVALID_PROOF'
  | 'USER_NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface QuestVerifyErrorResponse {
  success: false;
  error: QuestVerifyError;
  message: string;
  details?: any;
}
