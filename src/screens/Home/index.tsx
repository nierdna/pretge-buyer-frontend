'use client';

import { ESocketEvent, useSocket } from '@/context/SocketContext';
import { useGetOffers } from '@/queries/useOfferQueries';
import { useTokenQueries } from '@/queries/useTokenQueries';
import { Service } from '@/service';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import FilterSidebar from '../../components/filter/FilterSidebar';
import OfferList from '../../components/OfferList';
import ScrollToTop from '../../components/ScrollToTop';
import TredingTokenV2 from './components/TredingTokenV2';

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

  const { data: tokens, isLoading: isLoadingTokens } = useTokenQueries();

  const { socket, subscribe, unsubscribe } = useSocket();
  const queryClient = useQueryClient();

  const handleOfferUpdate = (data: any) => {
    queryClient.setQueryData(['offers', filters], (oldData: any) => {
      // Validate oldData structure for infinite query
      if (!oldData || !oldData.pages || oldData.pages.length === 0) {
        return oldData;
      }

      // Add new offer to the first page
      const firstPage = oldData.pages[0];
      const newOffers = [data.data, ...firstPage.data];

      // Update the infinite query structure
      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            data: newOffers,
            pagination: {
              ...firstPage.pagination,
              total: firstPage.pagination.total + 1,
            },
          },
          ...oldData.pages.slice(1),
        ],
      };
    });
  };

  useEffect(() => {
    subscribe(ESocketEvent.OfferUpdate, handleOfferUpdate);

    return () => {
      unsubscribe(ESocketEvent.OfferUpdate, handleOfferUpdate);
    };
  }, [socket]);

  const randomSeconds = Math.floor(Math.random() * 10000) + 7000; // 7s - 10s

  useEffect(() => {
    setTimeout(() => {
      Service.order.createMockOrder();
    }, randomSeconds);
  }, []);

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
    <div className="container flex-1 divide-y divide-border border-x border-border">
      {/* Applied the main page background gradient here */}
      <TredingTokenV2 trendingTokens={tokens?.data || []} isLoading={isLoadingTokens} />
      {/* <FlashSale /> */}
      <div className="w-full">
        <div className="grid w-full gap-4 divide-x divide-border lg:grid-cols-[280px_1fr]">
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
      <ScrollToTop />
    </div>
    // </div>
  );
}
