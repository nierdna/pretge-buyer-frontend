import type { Seller } from '@/types/seller';
import { Facebook, Globe, Instagram, Star, Twitter } from 'lucide-react';
import Image from 'next/image';

interface SellerProfileProps {
  seller: Seller;
}

export default function SellerProfile({ seller }: SellerProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={seller.coverImage || 'https://via.placeholder.com/1200x300'}
          alt={`${seller.name} cover`}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white -mt-16 mr-4">
            <Image
              src={seller.logo || 'https://via.placeholder.com/200'}
              alt={seller.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{seller.name}</h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= Math.round(seller.rating) ? (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star key={star} className="w-4 h-4 text-gray-300" />
                  )
                )}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {seller.rating.toFixed(1)} ({seller.reviews.length} reviews)
              </span>
            </div>
            {seller.verification.isVerified && (
              <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                Verified Seller
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{seller.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <span className="block text-xl font-bold text-gray-900">{seller.productsCount}</span>
            <span className="text-sm text-gray-500">Products</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <span className="block text-xl font-bold text-gray-900">
              {seller.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <span className="block text-xl font-bold text-gray-900">
              {new Date(seller.joinedAt).getFullYear()}
            </span>
            <span className="text-sm text-gray-500">Joined</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <span className="block text-xl font-bold text-gray-900">{seller.reviews.length}</span>
            <span className="text-sm text-gray-500">Reviews</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500">Email</span>
              <span className="text-gray-900">{seller.email}</span>
            </div>
            {seller.phone && (
              <div>
                <span className="block text-sm text-gray-500">Phone</span>
                <span className="text-gray-900">{seller.phone}</span>
              </div>
            )}
            <div className="sm:col-span-2">
              <span className="block text-sm text-gray-500">Address</span>
              <span className="text-gray-900">
                {seller.address.address1}
                {seller.address.address2 && `, ${seller.address.address2}`}, {seller.address.city},{' '}
                {seller.address.state} {seller.address.postalCode}, {seller.address.country}
              </span>
            </div>
          </div>
        </div>

        {(seller.social.website ||
          seller.social.twitter ||
          seller.social.instagram ||
          seller.social.facebook) && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Social Media</h2>
            <div className="flex space-x-3">
              {seller.social.website && (
                <a
                  href={seller.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Globe className="w-6 h-6" />
                </a>
              )}
              {seller.social.twitter && (
                <a
                  href={seller.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {seller.social.instagram && (
                <a
                  href={seller.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-500"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {seller.social.facebook && (
                <a
                  href={seller.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
