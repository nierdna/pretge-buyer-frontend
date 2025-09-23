import { IOfferFilter } from '@/service/offer.service';

// Cache key constants
export const CACHE_KEYS = {
  OFFERS_FILTER: 'offers_filter',
  OFFERS_BY_TOKEN_FILTER: 'offers_by_token_filter',
  OFFERS_BY_USER_FILTER: 'offers_by_user_filter',
  ORDERS_FILTER: 'orders_filter',
  REFERRAL_REWARDS_FILTER: 'referral_rewards_filter',
} as const;

// Cache TTL in milliseconds (24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CachedFilter {
  filter: IOfferFilter;
  timestamp: number;
}

/**
 * Save filter to localStorage with timestamp
 */
export const saveFilterToStorage = (key: string, filter: IOfferFilter): void => {
  try {
    const cachedData: CachedFilter = {
      filter,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cachedData));
  } catch (error) {
    console.warn('Failed to save filter to localStorage:', error);
  }
};

/**
 * Load filter from localStorage with TTL check
 */
export const loadFilterFromStorage = (key: string): IOfferFilter | null => {
  try {
    if (typeof window === 'undefined') return null;

    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cachedData: CachedFilter = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return cachedData.filter;
  } catch (error) {
    console.warn('Failed to load filter from localStorage:', error);
    return null;
  }
};

/**
 * Clear specific filter from localStorage
 */
export const clearFilterFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear filter from localStorage:', error);
  }
};

/**
 * Clear all filter cache
 */
export const clearAllFilterCache = (): void => {
  try {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear all filter cache:', error);
  }
};

/**
 * Get cache info for debugging
 */
export const getCacheInfo = (): Record<string, any> => {
  const info: Record<string, any> = {};

  try {
    Object.entries(CACHE_KEYS).forEach(([name, key]) => {
      const cached = localStorage.getItem(key);
      if (cached) {
        const cachedData: CachedFilter = JSON.parse(cached);
        info[name] = {
          exists: true,
          age: Date.now() - cachedData.timestamp,
          filter: cachedData.filter,
        };
      } else {
        info[name] = { exists: false };
      }
    });
  } catch (error) {
    console.warn('Failed to get cache info:', error);
  }

  return info;
};
