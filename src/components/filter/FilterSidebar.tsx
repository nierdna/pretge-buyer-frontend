import { IOfferFilter } from '@/service/offer.service';
import FilterContent from './FilterContent'; // Import the new FilterContent

export default function FilterSidebar({
  filters,
  setFilters,
  hideNetworkFilter = false,
  hideTokenFilter = false,
}: {
  filters: IOfferFilter;
  setFilters: (filters: IOfferFilter) => void;
  hideNetworkFilter?: boolean;
  hideTokenFilter?: boolean;
}) {
  return (
    <div className="sticky top-[6.5rem] hidden h-fit overflow-y-auto lg:block">
      <FilterContent
        filters={filters}
        setFilters={setFilters}
        hideNetworkFilter={hideNetworkFilter}
        hideTokenFilter={hideTokenFilter}
      />
    </div>
  );
}
