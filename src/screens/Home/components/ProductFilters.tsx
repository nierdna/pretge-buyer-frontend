import { useState } from 'react';

interface ProductFiltersProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export default function ProductFilters({ activeFilters, onFilterToggle }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyPriceFilter = () => {
    // Here you would implement price range filtering logic
    console.log('Apply price filter:', priceRange);
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="text-primary p-4 rounded-lg bg-deep-green sticky top-4 shadow-dark">
        <h3 className="font-semibold text-lg mb-4">Filters</h3>

        {/* Status filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm text-opensea-lightGray mb-2">Status</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-avocado bg-opensea-darkBorder"
                checked={activeFilters.includes('buy-now')}
                onChange={() => onFilterToggle('buy-now')}
              />
              <span className="ml-2 text-sm">Buy Now</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                checked={activeFilters.includes('auction')}
                onChange={() => onFilterToggle('auction')}
              />
              <span className="ml-2 text-sm">Auction</span>
            </label>
          </div>
        </div>

        {/* Price filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm text-opensea-lightGray mb-2">Price Range</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-sm focus:ring-1 focus:ring-opensea-blue text-white placeholder:text-opensea-lightGray"
              />
              <span className="text-opensea-lightGray">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-sm focus:ring-1 focus:ring-opensea-blue text-white placeholder:text-opensea-lightGray"
              />
            </div>
            <button
              onClick={handleApplyPriceFilter}
              className="w-full bg-opensea-blue hover:bg-opensea-blue/90 text-white py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Quantity filter */}
        <div className="mb-6">
          <h4 className="font-medium text-sm text-opensea-lightGray mb-2">Quantity</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                checked={activeFilters.includes('single')}
                onChange={() => onFilterToggle('single')}
              />
              <span className="ml-2 text-sm">Single Items</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                checked={activeFilters.includes('bundle')}
                onChange={() => onFilterToggle('bundle')}
              />
              <span className="ml-2 text-sm">Bundles</span>
            </label>
          </div>
        </div>

        {/* Traits filter */}
        <div className="mb-4">
          <h4 className="font-medium text-sm text-opensea-lightGray mb-2">Traits</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                checked={activeFilters.includes('rare')}
                onChange={() => onFilterToggle('rare')}
              />
              <span className="ml-2 text-sm">Rare</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-opensea-blue border-opensea-darkBorder bg-opensea-darkBorder"
                checked={activeFilters.includes('unique')}
                onChange={() => onFilterToggle('unique')}
              />
              <span className="ml-2 text-sm">Unique</span>
            </label>
          </div>
        </div>

        <button
          className="w-full bg-opensea-darkBlue hover:bg-opensea-darkBlue/90 text-white py-2 rounded-lg text-sm font-medium"
          onClick={() => {
            // Clear all filters
            activeFilters.forEach((filter) => onFilterToggle(filter));
          }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
