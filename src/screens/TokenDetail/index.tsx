'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useGetOffersByToken } from '@/queries';
import { useTokenBySymbol } from '@/queries/useTokenQueries';
import Link from 'next/link';
import FilterSheet from '../HomeV2/components/FilterSheet';
import FilterSidebar from '../HomeV2/components/FilterSidebar';
import OfferList from '../HomeV2/components/OfferList';
import TokenInfoSection from './components/TokenInfomation';

export default function TokenDetail({ symbol }: { symbol: string }) {
  const { data: token, isLoading, isError } = useTokenBySymbol(symbol);
  const {
    data: offers,
    isLoading: isLoadingOffers,
    isError: isErrorOffers,
    filters,
    handleSearch,
    setFilters,
  } = useGetOffersByToken(token?.id);
  console.log('offers', offers);
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
      <FilterSheet hideNetworkFilter={true} filters={filters} setFilters={setFilters} />
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <FilterSidebar hideNetworkFilter={true} filters={filters} setFilters={setFilters} />
        <OfferList offers={offersForToken} isLoading={isLoadingOffers} />
      </div>
    </section>
  );
}
