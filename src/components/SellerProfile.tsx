import type { Seller } from '@/types/seller';

interface SellerProfileProps {
  seller: Seller;
}

export default function SellerProfile({ seller }: SellerProfileProps) {
  return (
    <div className="bg-opensea-darkBorder rounded-lg shadow-md p-6 border border-opensea-darkBorder">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={seller.logo}
          alt={seller.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-opensea-blue"
        />
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{seller.name}</h2>
          <p className="text-opensea-lightGray text-sm">{seller.email}</p>
        </div>
      </div>
      <p className="text-opensea-lightGray mb-4">{seller.description}</p>
      <div className="flex gap-8">
        <div>
          <span className="block text-xl font-bold text-gray-900">{seller.offersCount}</span>
          <span className="text-sm text-gray-500">Offers</span>
        </div>
        <div>
          <span className="block text-xl font-bold text-gray-900">{seller.rating}</span>
          <span className="text-sm text-gray-500">Rating</span>
        </div>
      </div>
    </div>
  );
}
