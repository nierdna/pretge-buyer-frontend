import OfferCard from '@/components/OfferCard';
import { Offer } from '@/types/offer';

interface OfferGridProps {
  offers: Offer[];
  isLoading: boolean;
  isError: boolean;
  viewMode: 'grid' | 'large-grid' | 'list';
}

export default function OfferGrid({ offers, isLoading, isError, viewMode }: OfferGridProps) {
  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'large-grid':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'list':
        return 'grid-cols-1';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (isLoading) {
    return (
      <div className={`grid ${getGridClasses()} gap-4`}>
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="bg-opensea-darkBorder rounded-lg aspect-square animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-opensea-darkBorder text-red-400 p-4 rounded-lg border border-red-500/20">
        Error loading offers. Please try again later.
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClasses()} gap-4`}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={viewMode === 'grid' ? 'default' : viewMode === 'large-grid' ? 'grid' : 'compact'}
        />
      ))}
    </div>
  );
}
