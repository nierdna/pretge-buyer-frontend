import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IOfferFilter } from '@/service/offer.service';
import { Filter } from 'lucide-react';
import FilterContent from './FilterContent'; // Import FilterContent instead of FilterSidebar

export default function FilterSheet({
  filters,
  setFilters,
  hideNetworkFilter,
  hideTokenFilter,
}: {
  filters: IOfferFilter;
  setFilters: (filterChange: IOfferFilter) => void;
  hideNetworkFilter?: boolean;
  hideTokenFilter?: boolean;
}) {
  return (
    <div className="flex justify-end lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={'icon'}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="flex max-h-[80vh] w-full flex-col gap-0 rounded-t-lg p-0"
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="grow overflow-y-auto p-0">
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              hideNetworkFilter={hideNetworkFilter}
              hideTokenFilter={hideTokenFilter}
            />{' '}
            {/* Render FilterContent directly */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
