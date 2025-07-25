import { Card } from '@/components/ui/card';
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
    <Card className="hidden lg:block h-fit sticky max-h-[calc(100vh-5.5rem)] top-[4.5rem] overflow-y-auto">
      <FilterContent
        filters={filters}
        setFilters={setFilters}
        hideNetworkFilter={hideNetworkFilter}
        hideTokenFilter={hideTokenFilter}
      />
    </Card>
  );
}
