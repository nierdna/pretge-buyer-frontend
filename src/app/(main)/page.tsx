import HomePage from '@/screens/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Exclusive Pre-Market Token Deals & Flash Sales',
  description:
    'Explore trending tokens, flash sale opportunities, and exclusive pre-market deals on PretGe Market. Find the best early-stage cryptocurrency investments from verified sellers.',
  keywords: [
    'crypto flash sales',
    'trending tokens',
    'pre-market deals',
    'token marketplace',
    'cryptocurrency offers',
    'crypto presale',
    'DeFi opportunities',
    'blockchain investments',
  ],
  openGraph: {
    title: 'PretGe Market - Exclusive Pre-Market Token Deals & Flash Sales',
    description:
      'Explore trending tokens, flash sale opportunities, and exclusive pre-market deals. Find the best early-stage cryptocurrency investments.',
    url: 'https://pretgemarket.xyz',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'PretGe Market Homepage - Flash Sales and Trending Tokens',
      },
    ],
  },
  twitter: {
    title: 'PretGe Market - Exclusive Pre-Market Token Deals & Flash Sales',
    description:
      'Explore trending tokens, flash sale opportunities, and exclusive pre-market deals.',
  },
  alternates: {
    canonical: 'https://pretgemarket.xyz',
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
