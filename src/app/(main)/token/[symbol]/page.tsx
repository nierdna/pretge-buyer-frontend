import TokenDetailScreen from '@/screens/TokenDetail';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();

  // Mock data - replace with actual API call
  const tokenName = `${symbol} Token`;
  const tokenDescription = `Explore ${symbol} token offers and pre-market opportunities. View current prices, seller listings, and exclusive deals for ${tokenName} on PretGe Market.`;

  return {
    title: `${symbol} Token - Pre-Market Offers & Prices`,
    description: tokenDescription,
    keywords: [
      `${symbol} token`,
      `${symbol} price`,
      `${symbol} presale`,
      `${symbol} offers`,
      'cryptocurrency',
      'token trading',
      'pre-market deals',
      'crypto investment',
      'blockchain token',
      'digital asset',
    ],
    openGraph: {
      title: `${symbol} Token - PretGe Market`,
      description: tokenDescription,
      url: `https://pretgemarket.xyz/token/${symbolParam.toLowerCase()}`,
      type: 'website',
      images: [
        {
          url: '/banner.png', // Replace with token logo
          width: 1200,
          height: 630,
          alt: `${tokenName} Information`,
        },
      ],
    },
    twitter: {
      title: `${symbol} Token - PretGe Market`,
      description: tokenDescription,
      images: ['/banner.png'],
    },
    alternates: {
      canonical: `https://pretgemarket.xyz/token/${symbolParam.toLowerCase()}`,
    },
  };
}

export default async function TokenDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  return (
    <>
      <TokenDetailScreen symbol={symbol} />
    </>
  );
}
