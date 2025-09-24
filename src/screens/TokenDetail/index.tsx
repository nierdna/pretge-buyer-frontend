'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetOffersByToken } from '@/queries';
import { useTokenBySymbol, useTokenBySymbolExternal } from '@/queries/useTokenQueries';
import { ITokenProjectExternal } from '@/types/tokenProject';
import { useCallback, useState } from 'react';
import FilterSidebar from '../../components/filter/FilterSidebar';
import OfferList from '../../components/OfferList';
import TokenExternal from './components/TokenExternal';
import TokenInfoSection from './components/TokenInfomation';

export default function TokenDetail({ symbol }: { symbol: string }) {
  const { data: token, isLoading } = useTokenBySymbol(symbol);

  const { data: tokenExternal } = useTokenBySymbolExternal(symbol);

  const [activeTab, setActiveTab] = useState<'info' | 'trade'>('trade');

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
      <div className="mb-4 flex items-center justify-between px-4">
        <Breadcrumb className="flex items-center gap-2 text-sm font-medium">
          <BreadcrumbItem>
            <BreadcrumbLink className="text-content transition-colors hover:text-head" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="flex items-center" />
          {/* <BreadcrumbItem>Token Detail</BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" /> */}
          <BreadcrumbItem>{symbol.toUpperCase()}</BreadcrumbItem>
        </Breadcrumb>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'info' | 'trade')}
          className="flex items-center gap-2"
        >
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'info' | 'trade')}>
        <TabsContent value="info" className="mt-0">
          <div className="mb-8">
            <TokenExternal
              token={token}
              tokenExternal={tokenExternal as unknown as ITokenProjectExternal}
            />
          </div>
        </TabsContent>

        <TabsContent value="trade" className="mt-0">
          {/* New Token Information Section */}
          <div className="mb-8">
            <TokenInfoSection
              token={token}
              tokenExternal={tokenExternal as unknown as ITokenProjectExternal}
            />
          </div>
          <div className="mb-8">
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
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
          </div>
        </TabsContent>
      </Tabs>

      {/* <FilterSheet hideNetworkFilter={true} filters={filters} setFilters={setFilters} /> */}
    </section>
  );
}
