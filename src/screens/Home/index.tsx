'use client';

import { useGetOffers } from '@/queries/useOfferQueries';
import { useTokenQueries } from '@/queries/useTokenQueries';
import { useCallback } from 'react';
import FilterSidebar from '../../components/filter/FilterSidebar';
import OfferList from '../../components/OfferList';
import FlashSale from './components/FlashSale';
import TredingToken from './components/TredingToken';

export default function HomePage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    setFilters,
    handleSearch,
    inputSearch,
    fetchNextPage,
    hasNextPage,
  } = useGetOffers();
  const offers = data?.pages.flatMap((page) => page.data) || [];

  const { data: tokens } = useTokenQueries();

  // Callback to handle load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isLoading, isFetching, hasNextPage, fetchNextPage]);
  return (
    // <div className="min-h-screen text-gray-900">
    //   <Header />
    <div className="flex-1">
      {/* Applied the main page background gradient here */}
      <TredingToken trendingTokens={tokens?.data || []} />
      <FlashSale />
      <div className="py-4 md:py-8 sm:px-4 w-full">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <OfferList
            inputSearch={inputSearch}
            handleSearch={handleSearch}
            offers={offers}
            isLoading={isLoading}
            isFetching={isFetching}
            filters={filters}
            setFilters={setFilters}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
          />
        </div>
      </div>
    </div>
    // </div>
  );
}
