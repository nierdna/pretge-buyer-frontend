'use client';

import { useProducts } from '@/hooks/queries/useProductQueries';
import FlashSaleList from '@/screens/FlashSale/components/FlashSaleList';
import FlashSaleBanner from '@/screens/Home/components/FlashSaleBanner';
import type { Product } from '@/types/product';
import { useEffect, useState } from 'react';

export default function FlashSaleScreen() {
  const { data, isLoading, isError } = useProducts();
  const products = data?.data || [];
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);

  // Flash sale data
  const flashSale = {
    title: 'Summer Flash Sale',
    description: 'Get up to 50% off on selected items. Limited time offer!',
    endDate: '2023-12-31T23:59:59Z',
    imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070',
  };

  useEffect(() => {
    // Filter products that have a compareAtPrice (on sale)
    if (products.length > 0) {
      const onSaleProducts = products.filter(
        (product) => product.compareAtPrice && product.compareAtPrice > product.price
      );
      setFlashSaleProducts(onSaleProducts);
    }
  }, [products]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-white">Flash Sale</h1>

      {/* Flash Sale Banner */}
      {flashSaleProducts.length > 0 && (
        <div className="mb-8">
          <FlashSaleBanner products={flashSaleProducts.slice(0, 5)} />
        </div>
      )}

      {/* Flash Sale Products */}
      {isLoading && products.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-opensea-blue"></div>
        </div>
      ) : isError ? (
        <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
          <p>Error loading products. Please try again later.</p>
        </div>
      ) : flashSaleProducts.length === 0 ? (
        <div className="bg-opensea-darkBorder p-8 rounded-lg text-center border border-opensea-darkBorder">
          <h2 className="text-xl font-semibold mb-2 text-white">No Flash Sale Products</h2>
          <p className="text-opensea-lightGray">
            There are currently no products on sale. Check back later for new deals!
          </p>
        </div>
      ) : (
        <FlashSaleList endDate={flashSale.endDate} products={flashSaleProducts} />
      )}
    </>
  );
}
