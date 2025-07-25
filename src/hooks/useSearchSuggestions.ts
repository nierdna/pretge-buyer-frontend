'use client';

import { useCallback, useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'token' | 'symbol' | 'name';
  symbol?: string;
  name?: string;
}

export function useSearchSuggestions() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }, []);

  // Add a new search to recent searches
  const addRecentSearch = useCallback(
    (search: string) => {
      if (!search.trim()) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== search.toLowerCase());
        const newSearches = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        saveRecentSearches(newSearches);
        return newSearches;
      });
    },
    [saveRecentSearches]
  );

  // Remove a search from recent searches
  const removeRecentSearch = useCallback(
    (search: string) => {
      setRecentSearches((prev) => {
        const newSearches = prev.filter((s) => s !== search);
        saveRecentSearches(newSearches);
        return newSearches;
      });
    },
    [saveRecentSearches]
  );

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, [saveRecentSearches]);

  // Generate suggestions based on search query and available tokens
  const generateSuggestions = useCallback(
    (query: string, tokens: any[] = []) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const queryLower = query.toLowerCase();
      const newSuggestions: SearchSuggestion[] = [];

      // Add exact matches first
      tokens.forEach((token) => {
        const symbol = token.symbol?.toLowerCase();
        const name = token.name?.toLowerCase();

        if (symbol === queryLower) {
          newSuggestions.push({
            id: `symbol-${token.id}`,
            text: token.symbol,
            type: 'symbol',
            symbol: token.symbol,
            name: token.name,
          });
        } else if (name === queryLower) {
          newSuggestions.push({
            id: `name-${token.id}`,
            text: token.name,
            type: 'name',
            symbol: token.symbol,
            name: token.name,
          });
        }
      });

      // Add partial matches
      tokens.forEach((token) => {
        const symbol = token.symbol?.toLowerCase();
        const name = token.name?.toLowerCase();

        if (
          symbol?.includes(queryLower) &&
          !newSuggestions.find((s) => s.id === `symbol-${token.id}`)
        ) {
          newSuggestions.push({
            id: `symbol-${token.id}`,
            text: token.symbol,
            type: 'symbol',
            symbol: token.symbol,
            name: token.name,
          });
        }

        if (
          name?.includes(queryLower) &&
          !newSuggestions.find((s) => s.id === `name-${token.id}`)
        ) {
          newSuggestions.push({
            id: `name-${token.id}`,
            text: token.name,
            type: 'name',
            symbol: token.symbol,
            name: token.name,
          });
        }
      });

      // Add recent searches that match
      recentSearches.forEach((search) => {
        if (
          search.toLowerCase().includes(queryLower) &&
          !newSuggestions.find((s) => s.text === search)
        ) {
          newSuggestions.push({
            id: `recent-${search}`,
            text: search,
            type: 'token',
          });
        }
      });

      // Limit suggestions
      setSuggestions(newSuggestions.slice(0, 10));
    },
    [recentSearches]
  );

  return {
    recentSearches,
    suggestions,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    generateSuggestions,
  };
}
