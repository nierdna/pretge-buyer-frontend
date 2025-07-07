'use client';

import type { Offer } from '@/types/offer';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

interface OfferDetailProps {
  offer: Offer;
  onPurchase?: () => void;
  selectedVariantId?: string;
  setSelectedVariantId?: Dispatch<SetStateAction<string | undefined>>;
  quantity?: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
}

export default function OfferInfo({
  offer,
  onPurchase,
  selectedVariantId,
  setSelectedVariantId,
  quantity = 1,
  setQuantity,
}: OfferDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // Use either the controlled quantity from props or local state
  const currentQuantity = setQuantity ? quantity : localQuantity;
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= offer.inventory) {
      if (setQuantity) {
        setQuantity(newQuantity);
      } else {
        setLocalQuantity(newQuantity);
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      updateQuantity(value);
    }
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>, optionName: string) => {
    const value = e.target.value;

    if (!value || !setSelectedVariantId) return;

    // Find variant that matches all currently selected options
    const matchingVariant = offer.variants.find((variant) => variant.options[optionName] === value);

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  // Get the current variant if one is selected
  const currentVariant = selectedVariantId
    ? offer.variants.find((v) => v.id === selectedVariantId)
    : undefined;

  // Get the price to display (variant price or offer price)
  const displayPrice = currentVariant ? currentVariant.price : offer.price;
  const displayComparePrice = currentVariant ? currentVariant.compareAtPrice : offer.compareAtPrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <Image
            src={offer.images[selectedImage]?.url || 'https://via.placeholder.com/600'}
            alt={offer.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {offer.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded border-2 overflow-hidden ${
                selectedImage === index ? 'border-opensea-blue' : 'border-opensea-darkBorder'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || offer.name}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">{offer.name}</h1>

        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(offer.rating) ? 'text-yellow-400' : 'text-opensea-lightGray'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-opensea-lightGray">{offer.reviews.length} reviews</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">{formatPrice(displayPrice)}</span>
            {displayComparePrice && (
              <span className="ml-3 text-lg text-opensea-lightGray line-through">
                {formatPrice(displayComparePrice)}
              </span>
            )}
          </div>
          {displayComparePrice && (
            <span className="inline-block mt-1 bg-green-900/20 text-green-400 text-sm font-medium px-2 py-0.5 rounded border border-green-500/20">
              Save {formatPrice(displayComparePrice - displayPrice)}
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-opensea-lightGray">{offer.description}</p>
        </div>

        {offer.options.length > 0 && (
          <div className="mb-6">
            {offer.options.map((option) => (
              <div key={option.name} className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">{option.name}</label>
                <select
                  className="w-full border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-white"
                  onChange={(e) => handleVariantChange(e, option.name)}
                >
                  <option value="">Select {option.name}</option>
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-1">Quantity</label>
          <div className="flex items-center">
            <button
              onClick={() => updateQuantity(currentQuantity - 1)}
              className="border border-opensea-darkBorder bg-opensea-darkBorder text-white rounded-l-md px-3 py-1 hover:bg-opensea-darkBlue"
              disabled={currentQuantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={currentQuantity}
              onChange={handleQuantityChange}
              className="w-16 border-t border-b border-opensea-darkBorder bg-opensea-darkBorder text-center py-1 text-white"
              min="1"
              max={offer.inventory}
            />
            <button
              onClick={() => updateQuantity(currentQuantity + 1)}
              className="border border-opensea-darkBorder bg-opensea-darkBorder text-white rounded-r-md px-3 py-1 hover:bg-opensea-darkBlue"
              disabled={currentQuantity >= offer.inventory}
            >
              +
            </button>
            <span className="ml-3 text-sm text-opensea-lightGray">{offer.inventory} available</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPurchase}
            className="flex-1 bg-opensea-blue hover:bg-opensea-darkBlue text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Purchase Now
          </button>
          <button className="border border-opensea-blue text-opensea-blue hover:bg-opensea-blue hover:text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
