import type { Product } from '@/types/product';
import type { Seller } from '@/types/seller';
import { useState } from 'react';
import SellerProductList from './SellerProductList';
import SellerReviewList from './SellerReviewList';

interface SellerTabsProps {
  seller: Seller;
  products: Product[];
}

export default function SellerTabs({ seller, products }: SellerTabsProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'products'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Reviews ({seller.reviews.length})
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'products' && <SellerProductList products={products} />}
        {activeTab === 'reviews' && <SellerReviewList reviews={seller.reviews} />}
      </div>
    </div>
  );
}
