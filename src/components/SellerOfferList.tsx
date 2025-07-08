import type { Offer } from '@/types/offer';
import { useState } from 'react';
import OfferCard from './OfferCard';

interface SellerOfferListProps {
  offers: Offer[];
}

export default function SellerOfferList({ offers }: SellerOfferListProps) {
  const [sortBy, setSortBy] = useState('newest');

  // Sort offers based on selected option
  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Offers</h2>
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {sortedOffers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">This seller has no offers yet.</p>
        </div>
      )}
    </div>
  );
}
