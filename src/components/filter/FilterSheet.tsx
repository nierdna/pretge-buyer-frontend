import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IOfferFilter } from '@/service/offer.service';
import { Filter } from 'lucide-react';
import FilterContent from './FilterContent'; // Import FilterContent instead of FilterSidebar

export default function FilterSheet({
  filters,
  setFilters,
  hideNetworkFilter,
}: {
  filters: IOfferFilter;
  setFilters: (filterChange: IOfferFilter) => void;
  hideNetworkFilter?: boolean;
}) {
  return (
    <div className="lg:hidden flex justify-end mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="w-full max-h-[80vh] p-0 rounded-t-lg flex flex-col gap-0"
        >
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="p-0 overflow-y-auto grow">
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              hideNetworkFilter={hideNetworkFilter}
            />{' '}
            {/* Render FilterContent directly */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
