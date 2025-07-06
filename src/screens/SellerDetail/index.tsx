'use client';

import SellerProductList from '@/components/SellerProductList';
import SellerProfile from '@/components/SellerProfile';
import { useSeller, useSellerProducts } from '@/hooks/queries/useSellerQueries';

interface SellerDetailScreenProps {
  sellerId: string;
}

export default function SellerDetailScreen({ sellerId }: SellerDetailScreenProps) {
  // Use React Query hooks
  const {
    data: sellerData,
    isLoading: isLoadingSeller,
    isError: isSellerError,
  } = useSeller(sellerId);
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useSellerProducts(sellerId);

  const seller = sellerData?.data;
  const products = productsData?.data || [];

  if (isLoadingSeller) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-opensea-darkBorder rounded w-1/3 mb-6"></div>
        <div className="bg-opensea-darkBorder rounded-lg shadow-md p-6 mb-6 border border-opensea-darkBorder">
          <div className="h-6 bg-opensea-darkBorder rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-opensea-darkBorder rounded w-full mb-2"></div>
          <div className="h-4 bg-opensea-darkBorder rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }

  if (isSellerError || !seller) {
    return (
      <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
        <h2 className="text-xl font-semibold mb-2">Error Loading Seller</h2>
        <p>We couldn&apos;t find the seller you&apos;re looking for. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-white">Seller Profile</h1>

      {/* Seller Profile */}
      <SellerProfile seller={seller} />

      {/* Seller Products */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Seller Products</h2>
        {isLoadingProducts ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-opensea-blue"></div>
          </div>
        ) : isProductsError ? (
          <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
            <p>Error loading products. Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-opensea-darkBorder p-8 rounded-lg text-center border border-opensea-darkBorder">
            <p className="text-opensea-lightGray">This seller has no products yet.</p>
          </div>
        ) : (
          <SellerProductList products={products} />
        )}
      </div>
    </>
  );
}
