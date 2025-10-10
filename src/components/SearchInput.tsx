'use client';

import { Input } from '@/components/ui/input';
import { SearchSuggestion } from '@/service/search.service';
import { extractTokenSymbol } from '@/utils/helpers/string';
import { Clock, Coins, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  isLoading?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search by token symbol',
  className = '',
  suggestions = [],
  recentSearches = [],
  isLoading = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  // Handle clear search
  const handleClear = () => {
    onChange('');
    onClear?.();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Only use the symbol part for search, but show full display text in input
    onChange(suggestion.displayText);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (value.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className} w-full`}>
      <div className="relative">
        <Search className="text-content absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 leading-none"
        />
        {value && (
          <button
            onClick={handleClear}
            className="text-content absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-full p-1 transition-all duration-200 hover:bg-gray-100 hover:text-foreground"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Status */}
      {value && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-gray-700 bg-gray-800 p-2 text-xs text-primary">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-blue-400"></div>
              Searching for token symbol:{' '}
              <span className="font-medium text-blue-300">"{extractTokenSymbol(value)}"</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Searching for token symbol:{' '}
              <span className="font-medium text-blue-300">"{extractTokenSymbol(value)}"</span>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-border bg-white shadow-lg"
        >
          {/* Token Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-600">
                <Coins className="h-3 w-3" />
                Token Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="relative h-6 w-6 flex-shrink-0">
                    <Image
                      src={suggestion.logo || '/logo-mb.png'}
                      alt={suggestion.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="truncate font-medium">{suggestion.symbol}</div>
                    <div className="text-content truncate text-xs">{suggestion.name}</div>
                  </div>
                  {suggestion.network && (
                    <div className="flex-shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {suggestion.network}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="border-t border-border p-2">
              <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-600">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Clock className="h-3 w-3 text-gray-400" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {suggestions.length === 0 && recentSearches.length === 0 && value.length > 0 && (
            <div className="text-content p-4 text-center text-sm">
              No suggestions found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
