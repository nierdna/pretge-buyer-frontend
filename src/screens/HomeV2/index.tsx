'use client';

import { useGetOffersV2 } from '@/queries/useOfferQueries';
import { useTokenQueries } from '@/queries/useTokenQueries';
import FilterSheet from './components/FilterSheet';
import FilterSidebar from './components/FilterSidebar';
import FlashSale from './components/FlashSale';
import OfferList from './components/OfferList';
import TredingToken from './components/TredingToken';

export default function HomePage() {
  const { data, isLoading, isError, filters, setFilters, handleSearch, inputSearch } =
    useGetOffersV2();
  const offers = data?.pages.flatMap((page) => page.data) || [];

  const { data: tokens } = useTokenQueries();

  return (
    // <div className="min-h-screen text-gray-900">
    //   <Header />
    <div className="flex-1">
      {/* Applied the main page background gradient here */}
      <TredingToken trendingTokens={tokens?.data || []} />
      <FlashSale />
      <section className="py-4 md:py-8 px-4 -mx-2">
        <FilterSheet filters={filters} setFilters={setFilters} /> {/* Mobile filter button */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <FilterSidebar filters={filters} setFilters={setFilters} /> {/* Desktop filter sidebar */}
          <OfferList offers={offers} isLoading={isLoading} />
        </div>
      </section>
    </div>
    // </div>
  );
}
