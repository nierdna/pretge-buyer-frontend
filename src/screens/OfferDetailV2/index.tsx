'use client';

import { useGetOfferById } from '@/queries';
import OfferDetailHero from './components/OfferDetailHero';
import SellerInfoSection from './components/SellerInfoSection';
import TransactionHistory from './components/TransactionHistory';

// Mock data for multiple offers, each with a unique ID
const mockOffers = [
  {
    id: 'xyz-protocol-token', // This should match the [id] in the URL
    tokenSymbol: 'XYZ',
    tokenName: 'XYZ Protocol Token',
    network: 'Ethereum',
    quantityAvailable: 25, // Remaining quantity
    totalQuantity: 100,
    paymentToken: 'ETH',
    paymentAmount: 0.5,
    percentCollateral: 10,
    pricePerTokenUSD: 150, // New field for price per token
    totalAmountUSD: 15000,
    settleTime: '1 Hour',
    description:
      'This is a pre-market offer for XYZ Protocol Token. Secure your allocation before TGE! Limited quantity available.',
    terms: 'Minimum purchase 10 XYZ. KYC required for purchases over $5,000.',
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
    seller: {
      name: 'CryptoDeals Pro',
      wallet: '0xAbC123DeF4567890aB...',
      rating: 4.8,
      joinDate: 'Joined January 2023',
      description:
        'Experienced pre-market trader with a focus on high-potential DeFi projects. Committed to transparent and secure transactions.',
    },
    transactions: [
      { id: 't1', buyerName: 'UserA', amount: 10, timestamp: '2024-07-01 10:00 AM' },
      { id: 't2', buyerName: 'UserB', amount: 5, timestamp: '2024-07-01 10:15 AM' },
      { id: 't3', buyerName: 'UserC', amount: 20, timestamp: '2024-07-01 10:30 AM' },
      { id: 't4', buyerName: 'UserD', amount: 15, timestamp: '2024-07-01 10:45 AM' },
      { id: 't5', buyerName: 'UserE', amount: 25, timestamp: '2024-07-01 11:00 AM' },
    ],
  },
  {
    id: 'abc-protocol-token', // Added this entry to match the user's preview URL
    tokenSymbol: 'ABC',
    tokenName: 'ABC Protocol Token',
    network: 'Polygon',
    quantityAvailable: 10,
    totalQuantity: 50,
    paymentToken: 'USDC',
    paymentAmount: 1000,
    percentCollateral: 20,
    pricePerTokenUSD: 200,
    totalAmountUSD: 10000,
    settleTime: '2 Hours',
    description:
      'A promising new token from ABC Protocol. Limited supply available for pre-market purchase.',
    terms: 'Minimum purchase 5 ABC. Standard KYC applies.',
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
    seller: {
      name: 'TokenTrader',
      wallet: '0x1234567890aB...',
      rating: 4.5,
      joinDate: 'Joined February 2023',
      description: 'Reliable trader with a focus on Polygon ecosystem projects.',
    },
    transactions: [
      { id: 't6', buyerName: 'UserF', amount: 2, timestamp: '2024-07-02 09:00 AM' },
      { id: 't7', buyerName: 'UserG', amount: 3, timestamp: '2024-07-02 09:30 AM' },
    ],
  },
  // You can add more mock offers here with their respective IDs
];

interface OfferDetailPageProps {
  id: string;
}

export default function OfferDetailV2({ id }: OfferDetailPageProps) {
  // Find the offer that matches the ID from the URL
  const { data: offer, isLoading } = useGetOfferById(id);
  // if (!offer) {
  //   notFound(); // If no offer is found, return 404
  // }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Section 1: Offer Information & Buy/Sell */}
      <div className="lg:col-span-2">
        <OfferDetailHero offer={offer} />
      </div>

      {/* Section 2: Seller Information */}
      <div className="lg:col-span-1">
        <SellerInfoSection seller={offer?.sellerWallet} />
      </div>

      {/* Section 3: Transaction History (full width below other sections) */}
      <div className="lg:col-span-3">
        <TransactionHistory offerId={id} />
      </div>
    </div>
  );
  // return <div>OfferDetailV2</div>;
}
