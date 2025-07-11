import { Card } from '@/components/ui/card';
import { IOfferFilter } from '@/service/offer.service';
import FilterContent from './FilterContent'; // Import the new FilterContent

export default function FilterSidebar({
  filters,
  setFilters,
  handleSearch,
}: {
  filters: IOfferFilter;
  setFilters: (filters: IOfferFilter) => void;
  handleSearch: (search: string) => void;
}) {
  return (
    <Card className="hidden lg:block h-fit sticky max-h-[calc(100vh-5.5rem)] top-[4.5rem] bg-white/95 backdrop-blur-lg shadow-xl border-gray-300 overflow-y-auto">
      <FilterContent filters={filters} setFilters={setFilters} handleSearch={handleSearch} />
    </Card>
  );
}
