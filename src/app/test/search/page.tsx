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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Demo</h1>
          <p className="text-gray-600">
            Test the enhanced search functionality with autocomplete and suggestions
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Search Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Search Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Filters</h3>
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
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
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
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>

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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
