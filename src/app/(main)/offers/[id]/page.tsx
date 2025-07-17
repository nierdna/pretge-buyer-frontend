import OfferDetailScreen from '@/screens/OfferDetail';
import { Metadata } from 'next';
import React from 'react';

// This would normally fetch offer data for metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // In a real app, fetch offer data here
  const { id: offerId } = await params;

  // Mock data - replace with actual API call
  const offerTitle = `Premium Token Offer #${offerId}`;
  const offerDescription = `Exclusive pre-market token opportunity with verified seller. Limited quantity available at special pre-market price.`;

  return {
    title: `${offerTitle} - Exclusive Pre-Market Deal`,
    description: offerDescription,
    keywords: [
      'token offer',
      'crypto presale',
      'pre-market deal',
      'cryptocurrency investment',
      'blockchain token',
      'verified seller',
      'limited offer',
      'exclusive deal',
    ],
    openGraph: {
      title: `${offerTitle} - PretGe Market`,
      description: offerDescription,
      url: `https://pretgemarket.xyz/offers/${offerId}`,
      type: 'website',
      images: [
        {
          url: '/banner.png', // Replace with actual offer image
          width: 1200,
          height: 630,
          alt: offerTitle,
        },
      ],
    },
    twitter: {
      title: `${offerTitle} - PretGe Market`,
      description: offerDescription,
      images: ['/banner.png'],
    },
    alternates: {
      canonical: `https://pretgemarket.xyz/offers/${offerId}`,
    },
  };
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <OfferDetailScreen id={id} />
    </>
  );
}
