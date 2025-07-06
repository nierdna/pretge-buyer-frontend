import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { useState } from 'react';

interface MobileFilterDrawerProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileFilterDrawer({
  activeFilters,
  onFilterToggle,
  isOpen,
  onOpenChange,
}: MobileFilterDrawerProps) {
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyPriceFilter = () => {
    // Here you would implement price range filtering logic
    console.log('Apply price filter:', priceRange);
  };

  const handleClearAllFilters = () => {
    activeFilters.forEach((filter) => onFilterToggle(filter));
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-opensea-darkBorder border-opensea-darkBorder">
        <DrawerHeader className="text-white border-b border-opensea-darkBorder">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white">Filters</DrawerTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-opensea-darkBlue"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status filter */}
          <div>
            <h4 className="font-medium text-sm text-opensea-lightGray mb-3">Status</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('buy-now')}
                  onChange={() => onFilterToggle('buy-now')}
                />
                <span className="ml-3 text-sm text-white">Buy Now</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('auction')}
                  onChange={() => onFilterToggle('auction')}
                />
                <span className="ml-3 text-sm text-white">Auction</span>
              </label>
            </div>
          </div>

          {/* Price filter */}
          <div>
            <h4 className="font-medium text-sm text-opensea-lightGray mb-3">Price Range</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="flex-1 p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-sm focus:ring-1 focus:ring-opensea-blue text-white placeholder:text-opensea-lightGray"
                />
                <span className="text-opensea-lightGray">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="flex-1 p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-sm focus:ring-1 focus:ring-opensea-blue text-white placeholder:text-opensea-lightGray"
                />
              </div>
              <Button
                onClick={handleApplyPriceFilter}
                className="w-full bg-opensea-blue hover:bg-opensea-blue/90 text-white"
              >
                Apply Price Filter
              </Button>
            </div>
          </div>

          {/* Quantity filter */}
          <div>
            <h4 className="font-medium text-sm text-opensea-lightGray mb-3">Quantity</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('single')}
                  onChange={() => onFilterToggle('single')}
                />
                <span className="ml-3 text-sm text-white">Single Items</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('bundle')}
                  onChange={() => onFilterToggle('bundle')}
                />
                <span className="ml-3 text-sm text-white">Bundles</span>
              </label>
            </div>
          </div>

          {/* Traits filter */}
          <div>
            <h4 className="font-medium text-sm text-opensea-lightGray mb-3">Traits</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('rare')}
                  onChange={() => onFilterToggle('rare')}
                />
                <span className="ml-3 text-sm text-white">Rare</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                  checked={activeFilters.includes('unique')}
                  onChange={() => onFilterToggle('unique')}
                />
                <span className="ml-3 text-sm text-white">Unique</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-opensea-darkBorder">
            <Button
              onClick={handleClearAllFilters}
              variant="outline"
              className="w-full border-opensea-darkBorder text-white hover:bg-opensea-darkBlue"
            >
              Clear All Filters
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-opensea-blue hover:bg-opensea-blue/90 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
