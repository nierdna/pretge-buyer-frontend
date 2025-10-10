'use client'; // Make this a Client Component

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // New import for view type toggle
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { cn } from '@/lib/utils';
import OfferCardSkeleton from '@/screens/SellerDetail/components/LoadingSkeletonSeller/OfferCardSkeleton';
import { IOfferFilter } from '@/service/offer.service';
import { searchService, SearchSuggestion } from '@/service/search.service';
import { IOffer } from '@/types/offer';
import { extractTokenSymbol } from '@/utils/helpers/string';
import { ArrowDownAZ, ArrowUpAZ, LayoutGrid, List, Loader2 } from 'lucide-react'; // Icons for view types and sorting
import { useCallback, useEffect, useRef, useState } from 'react'; // Import hooks
import FilterSheet from './filter/FilterSheet';
import OfferCard from './OfferCard';
import OfferListItem from './OfferListItem'; // New import for list view
import SearchInput from './SearchInput';

// Define sort field options with their display names
const sortFieldOptions = [
  { value: 'updated_at', label: 'Default' },
  { value: 'created_at', label: 'Newest' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'filled', label: 'Filled Amount' },
  { value: 'collateralPercent', label: 'Collateral %' },
  { value: 'settleDuration', label: 'Settle Duration' },
];

export default function OfferList({
  offers,
  isLoading,
  isFetching,
  filters,
  setFilters,
  inputSearch,
  handleSearch,
  onLoadMore,
  hasNextPage,
  hideNetworkFilter = false,
  hideTokenFilter = false,
}: {
  offers: IOffer[];
  isLoading: boolean;
  isFetching: boolean;
  filters: IOfferFilter;
  setFilters: (filters: IOfferFilter) => void;
  inputSearch: string;
  handleSearch: (search: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  hideNetworkFilter?: boolean;
  hideTokenFilter?: boolean;
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [viewType, setViewType] = useState<'card' | 'list'>('card'); // New state for view type
  const [sortField, setSortField] = useState(filters.sortField || 'updated_at');
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'desc');
  const [apiSuggestions, setApiSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  // Search suggestions hook
  const { recentSearches, addRecentSearch } = useSearchSuggestions();

  // Handle sort field change
  const handleSortFieldChange = (value: string) => {
    setSortField(value);
    setFilters({ ...filters, sortField: value, sortOrder });
  };

  // Handle sort order change
  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    setFilters({ ...filters, sortField, sortOrder: value });
  };

  // Enhanced search handler
  const handleEnhancedSearch = (search: string) => {
    handleSearch(search);
    if (search.trim()) {
      addRecentSearch(search);
    }
  };

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setApiSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Use only the symbol part for API suggestions
      const symbolOnly = extractTokenSymbol(query);
      const response = await searchService.getSuggestions(symbolOnly, 10);
      if (response.success) {
        setApiSuggestions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setApiSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(inputSearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputSearch, fetchSuggestions]);

  // Intersection Observer for infinite scroll
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isLoading && !isFetching) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, isFetching, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    // Clean up previous observer
    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observerCallback]);

  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        // Check if the element's top is at or above the sticky threshold (16px from top, matching header height)
        setIsSticky(rect.top <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case the page loads already scrolled

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { isMobile, isTablet } = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setViewType('card');
    }
  }, [isMobile]);

  return (
    <div className="grid h-fit w-full">
      <div
        ref={searchBarRef}
        className={cn(
          'sticky top-[90px] z-10 flex h-fit flex-col items-center justify-between gap-4 px-6 py-4 transition-colors duration-300 sm:flex-row',
          'border-b border-border bg-background'
        )}
      >
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center md:w-auto">
          <div className="flex items-start gap-4 lg:hidden">
            <FilterSheet
              filters={filters}
              setFilters={setFilters}
              hideNetworkFilter={hideNetworkFilter}
              hideTokenFilter={hideTokenFilter}
            />

            <Select value={sortField} onValueChange={handleSortFieldChange}>
              <SelectTrigger className={`flex w-32 flex-1 sm:hidden md:w-[180px]`}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortFieldOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger className="flex w-28 mb:flex-1 sm:hidden">
                <SelectValue placeholder="Order">
                  {sortOrder === 'asc' ? (
                    <div className="flex items-center gap-2">
                      <ArrowUpAZ className="h-4 w-4" />
                      <span>Asc</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowDownAZ className="h-4 w-4" />
                      <span>Desc</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpAZ className="h-4 w-4" />
                    <span>Ascending</span>
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Descending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="container flex-1 p-6">
            <SearchInput
              value={inputSearch}
              onChange={handleEnhancedSearch}
              placeholder="Search by token symbol"
              suggestions={apiSuggestions}
              recentSearches={recentSearches}
              isLoading={isLoadingSuggestions}
            />
          </div>

          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className={`hidden w-36 sm:flex lg:w-[160px]`}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortFieldOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="hidden w-40 sm:flex">
              <SelectValue placeholder="Order">
                {sortOrder === 'asc' ? (
                  <div className="flex items-center gap-2">
                    <ArrowUpAZ className="h-4 w-4" />
                    <span>Ascending</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Descending</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center gap-2">
                  <ArrowUpAZ className="h-4 w-4" />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-2">
                  <ArrowDownAZ className="h-4 w-4" />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ToggleGroup
          type="single"
          value={viewType}
          variant="outline"
          onValueChange={(value: 'card' | 'list') => value && setViewType(value)}
          className="hidden flex-shrink-0 md:flex"
        >
          <ToggleGroupItem value="card" aria-label="Toggle card view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Toggle list view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewType === 'card' ? (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <OfferCardSkeleton key={index} />
              ))}
            </>
          )}
          {!isLoading && offers.map((offer, index) => <OfferCard key={index} offer={offer} />)}
          {/* Separate trigger element for infinite scroll */}
          {hasNextPage && (
            <div ref={lastItemRef} className="col-span-full flex h-10 items-center justify-center">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {isLoading && (
            <div className="col-span-full flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!isLoading && offers.map((offer, index) => <OfferListItem key={index} offer={offer} />)}
          {/* Separate trigger element for infinite scroll */}
          {hasNextPage && (
            <div ref={lastItemRef} className="flex h-10 items-center justify-center">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
