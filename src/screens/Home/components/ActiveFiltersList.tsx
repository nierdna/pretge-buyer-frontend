interface ActiveFiltersListProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export default function ActiveFiltersList({
  activeFilters,
  onFilterToggle,
}: ActiveFiltersListProps) {
  if (activeFilters.length === 0) return null;

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'buy-now':
        return 'Status: Buy Now';
      case 'auction':
        return 'Status: Auction';
      case 'single':
        return 'Single Items';
      case 'bundle':
        return 'Bundles';
      case 'rare':
        return 'Trait: Rare';
      case 'unique':
        return 'Trait: Unique';
      default:
        return filter;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((filter) => (
        <button
          key={filter}
          className="bg-opensea-blue/10 text-opensea-blue px-3 py-1 rounded-full text-sm font-medium flex items-center hover:bg-opensea-blue/20 transition-colors"
          onClick={() => onFilterToggle(filter)}
        >
          {getFilterLabel(filter)}
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
