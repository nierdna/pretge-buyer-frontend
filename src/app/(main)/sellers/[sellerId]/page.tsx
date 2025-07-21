import SellerDetailScreen from '@/screens/SellerDetail';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}): Promise<Metadata> {
  const { sellerId } = await params;

  // Mock data - replace with actual API call
  const sellerName = `Verified Seller #${sellerId}`;
  const sellerDescription = `Trusted cryptocurrency seller with verified track record. Browse exclusive token offers and pre-market deals from ${sellerName}.`;

  return {
    title: `${sellerName} - Verified Token Seller Profile`,
    description: sellerDescription,
    keywords: [
      'verified seller',
      'crypto seller',
      'token seller',
      'trusted seller',
      'seller profile',
      'cryptocurrency merchant',
      'pre-market seller',
      'blockchain dealer',
    ],
    openGraph: {
      title: `${sellerName} - PretGe Market`,
      description: sellerDescription,
      url: `https://pretgemarket.xyz/sellers/${sellerId}`,
      type: 'profile',
      images: [
        {
          url: '/banner.png', // Replace with seller avatar
          width: 1200,
          height: 630,
          alt: `${sellerName} Profile`,
        },
      ],
    },
    twitter: {
      title: `${sellerName} - PretGe Market`,
      description: sellerDescription,
      images: ['/banner.png'],
    },
    alternates: {
      canonical: `https://pretgemarket.xyz/sellers/${sellerId}`,
    },
  };
}

export default async function SellerDetailPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;

  return (
    <>
      <SellerDetailScreen sellerId={sellerId} />
    </>
  );
}
