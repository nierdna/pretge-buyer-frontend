import { IOfferFilter } from '@/service/offer.service';
import {
  clearFilterFromStorage,
  loadFilterFromStorage,
  saveFilterToStorage,
} from '@/utils/filterCache';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface UseFilterCacheOptions {
  key: string;
  defaultFilter: IOfferFilter;
  enableCache?: boolean;
  debounceMs?: number;
}

export const useFilterCache = ({
  key,
  defaultFilter,
  enableCache = true,
  debounceMs = 500,
}: UseFilterCacheOptions) => {
  const [filters, setFilters] = useState<IOfferFilter>(() => {
    if (!enableCache) return defaultFilter;

    // Try to load from cache on initialization
    const cached = loadFilterFromStorage(key);
    return cached || defaultFilter;
  });

  // Debounced save function
  const debouncedSave = useDebouncedCallback((filter: IOfferFilter) => {
    if (enableCache) {
      saveFilterToStorage(key, filter);
    }
  }, debounceMs);

  // Save to cache whenever filters change
  useEffect(() => {
    if (enableCache) {
      debouncedSave(filters);
    }
  }, [filters, enableCache, debouncedSave]);

  // Update filters function
  const updateFilters = useCallback(
    (newFilters: IOfferFilter | ((prev: IOfferFilter) => IOfferFilter)) => {
      setFilters((prev) => {
        const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
        return updated;
      });
    },
    []
  );

  // Reset to default function
  const resetToDefault = useCallback(() => {
    setFilters(defaultFilter);
    if (enableCache) {
      clearFilterFromStorage(key);
    }
  }, [defaultFilter, enableCache, key]);

  // Clear cache function
  const clearCache = useCallback(() => {
    if (enableCache) {
      clearFilterFromStorage(key);
    }
  }, [enableCache, key]);

  // Load from cache function
  const loadFromCache = useCallback(() => {
    if (enableCache) {
      const cached = loadFilterFromStorage(key);
      if (cached) {
        setFilters(cached);
        return true;
      }
    }
    return false;
  }, [enableCache, key]);

  return {
    filters,
    setFilters: updateFilters,
    resetToDefault,
    clearCache,
    loadFromCache,
    isCacheEnabled: enableCache,
  };
};
