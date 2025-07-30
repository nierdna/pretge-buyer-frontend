'use client';

import SearchInput from '@/components/SearchInput';
import SearchResults from '@/components/SearchResults';
import { useGetOffers } from '@/queries/useOfferQueries';
import { searchService } from '@/service/search.service';
import { extractTokenSymbol } from '@/utils/helpers/string';
import { useCallback, useState } from 'react';

export default function SearchTestPage() {
  const {
    data,
    isLoading,
    isFetching,
    filters,
    setFilters,
    handleSearch,
    inputSearch,
    fetchNextPage,
    hasNextPage,
  } = useGetOffers();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const offers = data?.pages.flatMap((page) => page.data) || [];

  // Callback to handle load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isLoading, isFetching, hasNextPage, fetchNextPage]);

  // Enhanced search handler with suggestions
  const handleEnhancedSearch = async (search: string) => {
    handleSearch(search);

    if (search.trim() && search.length >= 2) {
      setIsLoadingSuggestions(true);
      try {
        // Use only the symbol part for API suggestions
        const symbolOnly = extractTokenSymbol(search);
        const response = await searchService.getSuggestions(symbolOnly, 10);
        if (response.success) {
          setSuggestions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Search Demo</h1>
          <p className="text-gray-600">
            Test the enhanced search functionality with autocomplete and suggestions
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Search Panel */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Search Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search Tokens
                  </label>
                  <SearchInput
                    value={inputSearch}
                    onChange={handleEnhancedSearch}
                    placeholder="Search by token symbol"
                    suggestions={suggestions}
                    isLoading={isLoadingSuggestions}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">Current Filters</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Search: {inputSearch || 'None'}</div>
                    <div>
                      Sort: {filters.sortField} ({filters.sortOrder})
                    </div>
                    <div>Network IDs: {filters.networkIds?.join(', ') || 'All'}</div>
                    <div>Collateral %: {filters.collateralPercents?.join(', ') || 'All'}</div>
                    <div>Settle Duration: {filters.settleDurations?.join(', ') || 'All'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Tips */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-blue-900">Search Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Try searching by token symbol (BTC, ETH, SOL)</li>
                <li>• Search by token name (Bitcoin, Ethereum, Solana)</li>
                <li>• Use partial matches for broader results</li>
                <li>• Suggestions appear as you type</li>
                <li>• Recent searches are saved automatically</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Search Results</h2>

            <SearchResults
              offers={offers}
              searchQuery={inputSearch}
              isLoading={isLoading}
              totalResults={offers.length}
            />

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-primary hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isFetching ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
