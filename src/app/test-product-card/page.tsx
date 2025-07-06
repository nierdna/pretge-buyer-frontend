import ProductCard from '@/components/ProductCard';
import { sampleProduct } from '@/types/product';

export default function TestProductCardPage() {
  return (
    <div className="min-h-screen bg-opensea-darkBg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Product Card Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default variant */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Default Variant</h2>
            <ProductCard product={sampleProduct} />
          </div>

          {/* Compact variant */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Compact Variant</h2>
            <ProductCard product={sampleProduct} variant="compact" />
          </div>

          {/* Grid variant */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Grid Variant</h2>
            <ProductCard product={sampleProduct} variant="grid" />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-white text-lg font-semibold mb-4">Multiple Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCard
                key={i}
                product={{
                  ...sampleProduct,
                  id: (i + 1).toString(),
                  tokenInfo: {
                    ...sampleProduct.tokenInfo!,
                    symbol: `TOKEN${i + 1}`,
                  },
                  sellerInfo: {
                    ...sampleProduct.sellerInfo!,
                    name: `Seller ${i + 1}`,
                    rating: 4 + (i % 10) / 10,
                  },
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
