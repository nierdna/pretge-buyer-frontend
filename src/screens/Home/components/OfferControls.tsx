interface OfferControlsProps {
  sortOrder: string;
  viewMode: 'grid' | 'large-grid' | 'list';
  onSortChange: (sortOrder: string) => void;
  onViewModeChange: (viewMode: 'grid' | 'large-grid' | 'list') => void;
  onFilterClick?: () => void;
  isSticky?: boolean;
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, LayoutGrid, LayoutList, Square } from 'lucide-react';

export default function OfferControls({
  sortOrder,
  viewMode,
  onSortChange,
  onViewModeChange,
  onFilterClick,
  isSticky = false,
}: OfferControlsProps) {
  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-center mb-6 gap-4 ${
        isSticky ? 'transition-all duration-200' : ''
      }`}
    >
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-grow md:flex-grow-0 md:w-64">
          <Input type="text" placeholder="Search items" className="pl-10" />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-opensea-lightGray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter button - visible on mobile (below 1024px) */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View mode toggles */}
      <div className="hidden md:flex space-x-2">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded ${
            viewMode === 'grid'
              ? 'bg-opensea-blue text-white'
              : 'bg-opensea-darkBorder border border-opensea-darkBorder hover:bg-opensea-darkBlue text-white'
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <button
          onClick={() => onViewModeChange('large-grid')}
          className={`p-2 rounded ${
            viewMode === 'large-grid'
              ? 'bg-opensea-blue text-white'
              : 'bg-opensea-darkBorder border border-opensea-darkBorder hover:bg-opensea-darkBlue text-white'
          }`}
          aria-label="Large grid view"
        >
          <Square className="h-5 w-5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded ${
            viewMode === 'list'
              ? 'bg-opensea-blue text-white'
              : 'bg-opensea-darkBorder border border-opensea-darkBorder hover:bg-opensea-darkBlue text-white'
          }`}
          aria-label="List view"
        >
          <LayoutList className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
