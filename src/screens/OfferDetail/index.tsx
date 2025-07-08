'use client';

import OfferCard from '@/components/OfferCard';
import { useOffer, useRelatedOffers } from '@/queries/useOfferQueries';
import OfferInfo from '@/screens/OfferDetail/components/OfferInfo';
import Link from 'next/link';
import { useState } from 'react';

interface OfferDetailScreenProps {
  offerId: string;
}

export default function OfferDetailScreen({ offerId }: OfferDetailScreenProps) {
  // Use React Query hooks
  const { data: offerData, isLoading, isError } = useOffer(offerId);
  const { data: relatedOffersData } = useRelatedOffers(offerId);

  const offer = offerData?.data;
  const relatedOffers = relatedOffersData?.data || [];

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Handle purchase offer
  const handlePurchase = () => {
    if (offer) {
      // Show confirmation message (could use a toast notification library)
      alert('Purchase functionality coming soon!');
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

  if (isError || !offer) {
    return (
      <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
        <h2 className="text-xl font-semibold mb-2">Error Loading Offer</h2>
        <p>We couldn&apos;t find the offer you&apos;re looking for. Please try again later.</p>
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
            <Link href="/offers" className="text-opensea-lightGray hover:text-white">
              Offers
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-opensea-lightGray">/</span>
            <span className="text-white">{offer.name}</span>
          </li>
        </ol>
      </nav>

      {/* Offer Detail */}
      <OfferInfo
        offer={offer}
        onPurchase={handlePurchase}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Related Offers */}
      {relatedOffers.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Related Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedOffers.map((relatedOffer) => (
              <OfferCard key={relatedOffer.id} offer={relatedOffer} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
