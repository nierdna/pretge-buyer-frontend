import OrderHistoryScreen from '@/screens/OrderHistory';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'My Orders - Order History & Transaction Status',
  description:
    'View your token purchase history, track order status, and manage your cryptocurrency transactions on PretGe Market. Access all your pre-market token orders in one place.',
  keywords: [
    'order history',
    'token orders',
    'transaction history',
    'purchase history',
    'crypto orders',
    'order status',
    'token transactions',
    'order tracking',
  ],
  openGraph: {
    title: 'My Orders - PretGe Market',
    description:
      'View your token purchase history, track order status, and manage your cryptocurrency transactions.',
    url: 'https://pretgemarket.xyz/my-orders',
    type: 'website',
  },
  twitter: {
    title: 'My Orders - PretGe Market',
    description:
      'View your token purchase history, track order status, and manage your cryptocurrency transactions.',
  },
  alternates: {
    canonical: 'https://pretgemarket.xyz/my-orders',
  },
  robots: {
    index: false, // Private user data should not be indexed
    follow: true,
  },
};

export default function MyOrdersPage() {
  return <OrderHistoryScreen />;
}
