import {
  LinkClickProof,
  QuestType,
  ReferralProof,
  SocialFollowProof,
  SocialPostProof,
  SocialRetweetProof,
  TelegramJoinProof,
} from '@/server/types/quest';

/**
 * Validate proof structure based on quest type
 */
export function validateProofStructure(questType: QuestType, proof: Record<string, any>): boolean {
  try {
    switch (questType) {
      case QuestType.SOCIAL_FOLLOW:
        return validateSocialFollowProof(proof);

      case QuestType.SOCIAL_RETWEET:
        return validateSocialRetweetProof(proof);

      case QuestType.SOCIAL_POST:
        return validateSocialPostProof(proof);

      case QuestType.TELEGRAM_JOIN:
        return validateTelegramJoinProof(proof);

      case QuestType.REFERRAL:
        return validateReferralProof(proof);

      case QuestType.LINK_X:
      case QuestType.LINK_TELE:
        return validateLinkClickProof(proof);

      default:
        return false;
    }
  } catch {
    return false;
  }
}

function validateSocialFollowProof(proof: any): proof is SocialFollowProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.username === 'string' &&
    proof.username.length > 0
  );
}

function validateSocialRetweetProof(proof: any): proof is SocialRetweetProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.tweetUrl === 'string' &&
    typeof proof.tweetId === 'string' &&
    proof.tweetUrl.length > 0 &&
    proof.tweetId.length > 0 &&
    isValidTweetUrl(proof.tweetUrl)
  );
}

function validateSocialPostProof(proof: any): proof is SocialPostProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.tweetUrl === 'string' &&
    typeof proof.tweetId === 'string' &&
    proof.tweetUrl.length > 0 &&
    proof.tweetId.length > 0 &&
    isValidTweetUrl(proof.tweetUrl)
  );
}

function validateTelegramJoinProof(proof: any): proof is TelegramJoinProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.telegramUserId === 'string' &&
    proof.telegramUserId.length > 0 &&
    (proof.telegramUsername === undefined || typeof proof.telegramUsername === 'string')
  );
}

function validateReferralProof(proof: any): proof is ReferralProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.referredUserId === 'string' &&
    proof.referredUserId.length > 0 &&
    isValidUUID(proof.referredUserId)
  );
}

function validateLinkClickProof(proof: any): proof is LinkClickProof {
  return (
    typeof proof === 'object' &&
    proof !== null &&
    typeof proof.clickToken === 'string' &&
    proof.clickToken.length > 0
  );
}

/**
 * Validate tweet URL format
 */
function isValidTweetUrl(url: string): boolean {
  const tweetUrlPattern = /^https:\/\/(twitter|x)\.com\/\w+\/status\/\d+/;
  return tweetUrlPattern.test(url);
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

/**
 * Extract tweet ID from tweet URL
 */
export function extractTweetId(tweetUrl: string): string | null {
  const match = tweetUrl.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Sanitize user input
 */
export function sanitizeString(input: string, maxLength: number = 500): string {
  return input.trim().substring(0, maxLength);
}

/**
 * Rate limiting key generator
 */
export function generateRateLimitKey(userId: string, action: string): string {
  return `rate_limit:${action}:${userId}`;
}

/**
 * Generate invite code for users
 */
export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
