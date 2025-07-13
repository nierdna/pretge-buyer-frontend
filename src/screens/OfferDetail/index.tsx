'use client';

import { useGetOfferById } from '@/queries';
import { useRef } from 'react';
import OfferDetailHero from './components/OfferDetailHero';
import SellerInfoSection from './components/SellerInfoSection';
import TransactionHistory, { TransactionHistoryRef } from './components/TransactionHistory';

// Mock data for multiple offers, each with a unique ID

interface OfferDetailPageProps {
  id: string;
}

export default function OfferDetail({ id }: OfferDetailPageProps) {
  // Find the offer that matches the ID from the URL
  const { data: offer, isLoading } = useGetOfferById(id);
  const transactionHistoryRef = useRef<TransactionHistoryRef>(null);

  // if (!offer) {
  //   notFound(); // If no offer is found, return 404
  // }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Section 1: Offer Information & Buy/Sell */}
      <div className="lg:col-span-2">
        <OfferDetailHero
          offer={offer}
          onOrderPlaced={() => {
            // Reset TransactionHistory to first page and refetch
            transactionHistoryRef.current?.resetToFirstPage();
          }}
        />
      </div>

      {/* Section 2: Seller Information */}
      <div className="lg:col-span-1">
        <SellerInfoSection seller={offer?.sellerWallet} />
      </div>

      {/* Section 3: Transaction History (full width below other sections) */}
      <div className="lg:col-span-3">
        <TransactionHistory ref={transactionHistoryRef} offerId={id} />
      </div>
    </div>
  );
  // return <div>OfferDetailV2</div>;
}
