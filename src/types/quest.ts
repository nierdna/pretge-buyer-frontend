// Quest Types for Client-side
// Separated from server types to maintain clean architecture

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

// Core Quest interfaces
export interface Quest {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: QuestType;
  status: QuestStatus;
  points: number;
  metadata: Record<string, any>;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: VerifyStatus;
  proofPayload: Record<string, any>;
  idempotencyKey?: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectReason?: string;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  updatedAt: string;
}

export interface ReferralReward {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  questId: string;
  userQuestId: string;
  pointsEarned: number;
  percentBps: number;
  createdAt: string;
}

// Quest with user completion status
export interface QuestWithStatus extends Quest {
  isCompleted: boolean;
  userQuest?: UserQuest;
}

// User quest with quest details
export interface UserQuestWithQuest extends UserQuest {
  quest: Quest;
}

// API Request/Response types
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

export interface UserStatsResponse {
  totalPoints: number;
  completedQuests: number;
  referralRewards: number;
  totalReferrals: number;
}

// Quest type specific metadata and proof schemas
export interface SocialFollowMetadata {
  handle: string;
}

export interface SocialFollowProof {
  username: string;
}

export interface SocialRetweetMetadata {
  tweetId: string;
}

export interface SocialRetweetProof {
  tweetUrl: string;
  tweetId: string;
}

export interface SocialPostMetadata {
  requiredTags: string[];
  mention?: string;
  minChars?: number;
}

export interface SocialPostProof {
  tweetUrl: string;
  tweetId: string;
}

export interface TelegramJoinMetadata {
  chatId: string;
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
  clickToken: string;
}

// API Response wrapper types
export interface QuestListResponse {
  success: boolean;
  data: QuestWithStatus[];
  message: string;
}

export interface UserQuestListResponse {
  success: boolean;
  data: UserQuestWithQuest[];
  message: string;
}

export interface UserStatsApiResponse {
  success: boolean;
  data: UserStatsResponse;
  message: string;
}

export interface QuestVerifyApiResponse {
  success: boolean;
  data?: QuestVerifyResponse;
  message: string;
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
  retryAfter?: number;
}

// Query parameters
export interface QuestQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: QuestType;
  status?: QuestStatus;
  sortField?: 'created_at' | 'points' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Utility types
export type QuestProofType =
  | SocialFollowProof
  | SocialRetweetProof
  | SocialPostProof
  | TelegramJoinProof
  | ReferralProof
  | LinkClickProof;

export type QuestMetadataType =
  | SocialFollowMetadata
  | SocialRetweetMetadata
  | SocialPostMetadata
  | TelegramJoinMetadata
  | ReferralMetadata
  | LinkClickMetadata;

// Type guards
export function isQuestVerifyErrorResponse(obj: any): obj is QuestVerifyErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === false &&
    typeof obj.error === 'string' &&
    typeof obj.message === 'string'
  );
}

export function isQuestWithStatus(obj: any): obj is QuestWithStatus {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.isCompleted === 'boolean'
  );
}
