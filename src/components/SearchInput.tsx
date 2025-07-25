'use client';

import { Input } from '@/components/ui/input';
import { SearchSuggestion } from '@/service/search.service';
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
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-content" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-content hover:text-foreground hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Status */}
      {value && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-white bg-gray-800 p-2 rounded-md border border-gray-700 z-10">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
              Searching for: <span className="font-medium text-blue-300">"{value}"</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Searching for: <span className="font-medium text-blue-300">"{value}"</span>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto"
        >
          {/* Token Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                <Coins className="h-3 w-3" />
                Token Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200 flex items-center gap-3"
                >
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={suggestion.logo || '/logo-mb.png'}
                      alt={suggestion.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="font-medium truncate">{suggestion.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{suggestion.name}</div>
                  </div>
                  {suggestion.network && (
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                      {suggestion.network}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <Clock className="h-3 w-3 text-gray-400" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {suggestions.length === 0 && recentSearches.length === 0 && value.length > 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No suggestions found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
