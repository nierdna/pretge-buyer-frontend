'use client';

import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useProduct, useRelatedProducts } from '@/queries/useProductQueries';
import ProductInfo from '@/screens/ProductDetail/components/ProductInfo';
import Link from 'next/link';
import { useState } from 'react';

interface ProductDetailScreenProps {
  productId: string;
}

export default function ProductDetailScreen({ productId }: ProductDetailScreenProps) {
  // Use React Query hooks
  const { data: productData, isLoading, isError } = useProduct(productId);
  const { data: relatedProductsData } = useRelatedProducts(productId);

  const product = productData?.data;
  const relatedProducts = relatedProductsData?.data || [];

  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (product) {
      const selectedVariant = selectedVariantId
        ? product.variants.find((v) => v.id === selectedVariantId)
        : undefined;

      addItem(product, quantity, selectedVariant);

      // Show confirmation message (could use a toast notification library)
      alert('Product added to cart!');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-opensea-darkBorder rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-opensea-darkBorder rounded-lg"></div>
          <div>
            <div className="h-8 bg-opensea-darkBorder rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-opensea-darkBorder rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-opensea-darkBorder rounded w-full mb-2"></div>
            <div className="h-4 bg-opensea-darkBorder rounded w-full mb-2"></div>
            <div className="h-4 bg-opensea-darkBorder rounded w-3/4 mb-6"></div>
            <div className="h-10 bg-opensea-darkBorder rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-opensea-darkBorder rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
        <h2 className="text-xl font-semibold mb-2">Error Loading Product</h2>
        <p>We couldn&apos;t find the product you&apos;re looking for. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-opensea-lightGray hover:text-white">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-opensea-lightGray">/</span>
            <Link href="/products" className="text-opensea-lightGray hover:text-white">
              Products
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-opensea-lightGray">/</span>
            <span className="text-white">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Product Detail */}
      <ProductInfo
        product={product}
        onAddToCart={handleAddToCart}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
