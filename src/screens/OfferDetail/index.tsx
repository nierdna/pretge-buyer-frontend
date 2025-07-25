'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetOfferById } from '@/queries';
import { useRef } from 'react';
import OfferDetailPageContent from './components/OfferDetailPageContent';
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
    <section className="flex-1 sm:px-4">
      <Breadcrumb className="flex items-center gap-2 text-sm mb-6 px-4 font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" />
        {/* <BreadcrumbItem>Token Detail</BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" /> */}
        <BreadcrumbItem>{offer?.tokens?.symbol.toUpperCase()}</BreadcrumbItem>
      </Breadcrumb>
      <div className="grid grid-cols-1 gap-4 w-full">
        <OfferDetailPageContent
          isLoading={isLoading}
          offer={offer}
          onOrderPlaced={() => {
            transactionHistoryRef.current?.resetToFirstPage();
          }}
        />
        <div className="flex flex-col gap-4 w-full">
          <TransactionHistory ref={transactionHistoryRef} offerId={id} />
        </div>
      </div>
      {/* <div className="grid gap-8 w-full">
        {isLoading ? (
          <OfferDetailContentSkeleton />
        ) : (
          <OfferDetailPageContent
            offer={offer}
            onOrderPlaced={() => {
              // Reset TransactionHistory to first page and refetch
              transactionHistoryRef.current?.resetToFirstPage();
            }}
          />
        )}

        <TransactionHistory ref={transactionHistoryRef} offerId={id} />
        {isLoading ? (
          <SellerInfoSectionSkeleton />
        ) : (
          <SellerInfoSection seller={offer?.sellerWallet} />
        )}
      </div> */}
    </section>
  );
  // return <div>OfferDetailV2</div>;
}
