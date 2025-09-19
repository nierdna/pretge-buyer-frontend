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
  const { data: offer, isLoading, refetch } = useGetOfferById(id);
  const transactionHistoryRef = useRef<TransactionHistoryRef>(null);

  // if (!offer) {
  //   notFound(); // If no offer is found, return 404
  // }

  return (
    <section className="flex-1">
      <Breadcrumb className="mb-6 flex items-center gap-2 px-4 text-sm font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-content transition-colors hover:text-head">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" />
        {/* <BreadcrumbItem>Token Detail</BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" /> */}
        <BreadcrumbLink
          href={`/token/${offer?.tokens?.symbol?.toLowerCase()}`}
          className="text-content transition-colors hover:text-head"
        >
          {offer?.tokens?.symbol.toUpperCase()}
        </BreadcrumbLink>
        <BreadcrumbSeparator className="flex items-center" />
        <BreadcrumbItem className="truncate">{offer?.title}</BreadcrumbItem>
      </Breadcrumb>
      <div className="grid w-full grid-cols-1 gap-4">
        <OfferDetailPageContent
          isLoading={isLoading}
          offer={offer}
          onOrderPlaced={() => {
            transactionHistoryRef.current?.resetToFirstPage();
            refetch();
          }}
        />
        {/* <TokenInfoSection token={offer?.tokens} /> */}
        <div className="flex w-full flex-col gap-4">
          <TransactionHistory
            ref={transactionHistoryRef}
            offerId={id}
            token={offer?.tokens}
            offer={offer}
          />
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
