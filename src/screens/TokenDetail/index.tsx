'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useGetOffersByToken } from '@/queries';
import { useTokenBySymbol } from '@/queries/useTokenQueries';
import Link from 'next/link';
import { useCallback } from 'react';
import FilterSidebar from '../../components/filter/FilterSidebar';
import OfferList from '../../components/OfferList';
import TokenInfoSection from './components/TokenInfomation';

export default function TokenDetail({ symbol }: { symbol: string }) {
  const { data: token, isLoading } = useTokenBySymbol(symbol);
  const {
    data: offers,
    isLoading: isLoadingOffers,
    isFetching: isFetchingOffers,
    isFetching,
    fetchNextPage,
    hasNextPage,
    filters,
    inputSearch,
    handleSearch,
    setFilters,
  } = useGetOffersByToken(token?.id);
  // Callback to handle load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isLoading, isFetching, hasNextPage, fetchNextPage]);

  const offersForToken = offers?.pages.flatMap((page) => page.data) || [];
  return (
    <section className="flex-1">
      <Breadcrumb className="flex items-center gap-2 text-sm mb-6 px-4 font-medium">
        <BreadcrumbItem>
          <Link className="text-gray-500 hover:text-primary transition-colors" href="/">
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" />
        {/* <BreadcrumbItem>Token Detail</BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" /> */}
        <BreadcrumbItem>{symbol.toUpperCase()}</BreadcrumbItem>
      </Breadcrumb>
      {/* New Token Information Section */}
      <div className="mb-8">
        <TokenInfoSection token={token} />
      </div>
      {/* <FilterSheet hideNetworkFilter={true} filters={filters} setFilters={setFilters} /> */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        <FilterSidebar
          hideNetworkFilter={true}
          hideTokenFilter={true}
          filters={filters}
          setFilters={setFilters}
        />
        <OfferList
          offers={offersForToken}
          isLoading={isLoadingOffers}
          isFetching={isFetchingOffers}
          filters={filters}
          setFilters={setFilters}
          inputSearch={inputSearch}
          handleSearch={handleSearch}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          hideNetworkFilter={true}
          hideTokenFilter={true}
        />
      </div>
    </section>
  );
}
