import type { Offer } from '@/types/offer';
import type { Seller } from '@/types/seller';
import { useState } from 'react';
import SellerOfferList from './SellerOfferList';
import SellerReviewList from './SellerReviewList';

interface SellerTabsProps {
  seller: Seller;
  offers: Offer[];
}

export default function SellerTabs({ seller, offers }: SellerTabsProps) {
  const [activeTab, setActiveTab] = useState('offers');

  return (
    <div className="bg-opensea-darkBorder rounded-lg shadow-sm border border-opensea-darkBorder">
      {/* Tab Navigation */}
      <div className="border-b border-opensea-darkBorder">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'offers'
                ? 'border-opensea-blue text-opensea-blue'
                : 'border-transparent text-opensea-lightGray hover:text-white hover:border-opensea-lightGray'
            }`}
          >
            Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-opensea-blue text-opensea-blue'
                : 'border-transparent text-opensea-lightGray hover:text-white hover:border-opensea-lightGray'
            }`}
          >
            Reviews ({seller.reviews?.length || 0})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'offers' && <SellerOfferList offers={offers} />}
        {activeTab === 'reviews' && <SellerReviewList sellerId={seller.id} />}
      </div>
    </div>
  );
}
