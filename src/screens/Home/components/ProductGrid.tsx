import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  viewMode: 'grid' | 'large-grid' | 'list';
}

export default function ProductGrid({ products, isLoading, isError, viewMode }: ProductGridProps) {
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
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClasses()} gap-4`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={viewMode === 'grid' ? 'default' : viewMode === 'large-grid' ? 'grid' : 'compact'}
        />
      ))}
    </div>
  );
}
