'use client'; // Make this a Client Component

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // New import for view type toggle
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import OfferCardSkeleton from '@/screens/SellerDetail/components/LoadingSkeletonSeller/OfferCardSkeleton';
import { IOfferFilter } from '@/service/offer.service';
import { IOffer } from '@/types/offer';
import { LayoutGrid, List, Loader2 } from 'lucide-react'; // Icons for view types
import { useCallback, useEffect, useRef, useState } from 'react'; // Import hooks
import OfferCard from './OfferCard';
import OfferListItem from './OfferListItem'; // New import for list view
import FilterSheet from './filter/FilterSheet';

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
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [viewType, setViewType] = useState<'card' | 'list'>('card'); // New state for view type
  const searchBarRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

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
    <div className="grid gap-4 h-fit">
      <div
        ref={searchBarRef}
        className={cn(
          'sticky h-fit top-[4.5rem] z-30 rounded-2xl flex flex-col justify-between sm:flex-row p-4 items-center gap-4 transition-colors duration-300',
          'bg-primary-foreground border-line border'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <FilterSheet
              filters={filters}
              setFilters={setFilters}
              hideNetworkFilter={hideNetworkFilter}
            />
            <Select
              defaultValue="newest"
              onValueChange={(value) => {
                if (value === 'newest') {
                  setFilters({ ...filters, sortField: 'created_at', sortOrder: 'desc' });
                } else if (value === 'price') {
                  setFilters({ ...filters, sortField: 'price', sortOrder: 'asc' });
                }
              }}
            >
              <SelectTrigger className={`w-32 flex-1 md:w-[180px] flex sm:hidden`}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              value={inputSearch}
              // onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search symbol or name..."
              className={`flex-1 min-w-60`}
            />
          </div>
          <Select
            defaultValue="newest"
            onValueChange={(value) => {
              if (value === 'newest') {
                setFilters({ ...filters, sortField: 'created_at', sortOrder: 'desc' });
              } else if (value === 'price') {
                setFilters({ ...filters, sortField: 'price', sortOrder: 'asc' });
              }
            }}
          >
            <SelectTrigger className={`w-32 md:w-[180px] hidden sm:flex`}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price">Lowest Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ToggleGroup
          type="single"
          value={viewType}
          variant="outline"
          onValueChange={(value: 'card' | 'list') => value && setViewType(value)}
          className="flex-shrink-0 hidden md:flex"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <div ref={lastItemRef} className="col-span-full h-10 flex items-center justify-center">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {isLoading && (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!isLoading && offers.map((offer, index) => <OfferListItem key={index} offer={offer} />)}
          {/* Separate trigger element for infinite scroll */}
          {hasNextPage && (
            <div ref={lastItemRef} className="h-10 flex items-center justify-center">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
