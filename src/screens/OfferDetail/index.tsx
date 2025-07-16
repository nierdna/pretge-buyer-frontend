'use client';

import { useGetOfferById } from '@/queries';
import { useParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
import OfferDetailPageContent from './components/OfferDetailPageContent';
import TransactionHistory, { TransactionHistoryRef } from './components/TransactionHistory';

// Mock data for multiple offers, each with a unique ID

interface OfferDetailPageProps {
  id: string;
}

export default function OfferDetail({ id }: OfferDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const { id: offerId } = params;
  console.log('offerId', offerId);
  // Find the offer that matches the ID from the URL
  const { data: offer, isLoading } = useGetOfferById(id);
  const transactionHistoryRef = useRef<TransactionHistoryRef>(null);

  // if (!offer) {
  //   notFound(); // If no offer is found, return 404
  // }

  return (
    <div className="grid gap-8 w-full">
      {/* <div className="lg:col-span-2">
        <OfferDetailHero
          offer={offer}
          onOrderPlaced={() => {
            // Reset TransactionHistory to first page and refetch
            transactionHistoryRef.current?.resetToFirstPage();
          }}
        />
      </div>

      <div className="lg:col-span-1">
        <SellerInfoSection seller={offer?.sellerWallet} />
      </div> */}

      <OfferDetailPageContent
        offer={offer}
        onOrderPlaced={() => {
          // Reset TransactionHistory to first page and refetch
          transactionHistoryRef.current?.resetToFirstPage();
        }}
      />

      {/* Section 3: Transaction History (full width below other sections) */}
      <TransactionHistory ref={transactionHistoryRef} offerId={id} />
    </div>
  );
  // return <div>OfferDetailV2</div>;
}
