'use client'; // Make this a Client Component

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // New import for view type toggle
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useGetOffersV2 } from '@/queries';
import { LayoutGrid, List } from 'lucide-react'; // Icons for view types
import { useEffect, useRef, useState } from 'react'; // Import hooks
import OfferCard from './OfferCard';
import OfferListItem from './OfferListItem'; // New import for list view

const mockOffers = [
  {
    tokenSymbol: 'XYZ',
    tokenName: 'XYZ Protocol Token',
    network: 'Ethereum',
    quantitySold: 75,
    totalQuantity: 100,
    paymentToken: 'ETH',
    paymentAmount: 0.5,
    percentCollateral: 10,
    price: 0.5,
    settleTime: '1 Hour',
    sellerName: 'CryptoDeals',
    sellerWallet: '0xAbC123DeF456...',
    sellerRating: 4.8,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'ABC',
    tokenName: 'Alpha Beta Coin',
    network: 'Polygon',
    quantitySold: 200,
    totalQuantity: 500,
    paymentToken: 'USDC',
    paymentAmount: 1000,
    percentCollateral: 25,
    price: 1,
    settleTime: '2 Hours',
    sellerName: 'TokenTrader',
    sellerWallet: '0x1234567890aB...',
    sellerRating: 4.5,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'DEF',
    tokenName: 'Decentralized Finance',
    network: 'BNB Chain',
    quantitySold: 10,
    totalQuantity: 20,
    paymentToken: 'BNB',
    paymentAmount: 0.1,
    percentCollateral: 50,
    price: 5,
    settleTime: '4 Hours',
    sellerName: 'SmartContracts',
    sellerWallet: '0xFeDcbA987654...',
    sellerRating: 4.9,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'GHI',
    tokenName: 'Global Hub Index',
    network: 'Solana',
    quantitySold: 150,
    totalQuantity: 300,
    paymentToken: 'SOL',
    paymentAmount: 0.05,
    percentCollateral: 0,
    price: 10,
    settleTime: '1 Hour',
    sellerName: 'SolanaMarket',
    sellerWallet: '0x9876543210Fe...',
    sellerRating: 4.2,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'JKL',
    tokenName: 'Jupiter Key Lock',
    network: 'Ethereum',
    quantitySold: 50,
    totalQuantity: 120,
    paymentToken: 'ETH',
    paymentAmount: 0.8,
    percentCollateral: 15,
    price: 18,
    settleTime: '2 Hours',
    sellerName: 'EthVault',
    sellerWallet: '0xCcDdEeFf0011...',
    sellerRating: 4.7,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'MNO',
    tokenName: 'Moonshot Network',
    network: 'Polygon',
    quantitySold: 300,
    totalQuantity: 400,
    paymentToken: 'MATIC',
    paymentAmount: 50,
    percentCollateral: 20,
    price: 8,
    settleTime: '4 Hours',
    sellerName: 'PolyPioneer',
    sellerWallet: '0x1a2b3c4d5e6f...',
    sellerRating: 4.6,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'PQR',
    tokenName: 'Phoenix Quantum',
    network: 'Arbitrum',
    quantitySold: 80,
    totalQuantity: 150,
    paymentToken: 'ARB',
    paymentAmount: 1.2,
    percentCollateral: 10,
    price: 12,
    settleTime: '1 Hour',
    sellerName: 'ArbiTrader',
    sellerWallet: '0x7b8c9d0e1f2a...',
    sellerRating: 4.3,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'STU',
    tokenName: 'Starlight Universe',
    network: 'Optimism',
    quantitySold: 120,
    totalQuantity: 200,
    paymentToken: 'OP',
    paymentAmount: 0.7,
    percentCollateral: 15,
    price: 14,
    settleTime: '3 Hours',
    sellerName: 'OptiDeals',
    sellerWallet: '0x3d4e5f6a7b8c...',
    sellerRating: 4.6,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'VWX',
    tokenName: 'Vortex Xchange',
    network: 'Avalanche',
    quantitySold: 40,
    totalQuantity: 60,
    paymentToken: 'AVAX',
    paymentAmount: 0.3,
    percentCollateral: 25,
    price: 9,
    settleTime: '2 Hours',
    sellerName: 'AvaTrader',
    sellerWallet: '0x9e8f7d6c5b4a...',
    sellerRating: 4.9,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'YZA',
    tokenName: 'Yield Zone Alpha',
    network: 'Fantom',
    quantitySold: 90,
    totalQuantity: 110,
    paymentToken: 'FTM',
    paymentAmount: 0.1,
    percentCollateral: 5,
    price: 7,
    settleTime: '1 Hour',
    sellerName: 'FantomFlow',
    sellerWallet: '0x1c2d3e4f5a6b...',
    sellerRating: 4.4,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'BCD',
    tokenName: 'Blockchain Dynamics',
    network: 'Ethereum',
    quantitySold: 180,
    totalQuantity: 250,
    paymentToken: 'ETH',
    paymentAmount: 0.2,
    percentCollateral: 10,
    price: 20,
    settleTime: '4 Hours',
    sellerName: 'ChainLinker',
    sellerWallet: '0x5f6e7d8c9b0a...',
    sellerRating: 4.7,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
  {
    tokenSymbol: 'EFG',
    tokenName: 'Ecosystem Frontier',
    network: 'Polygon',
    quantitySold: 60,
    totalQuantity: 80,
    paymentToken: 'MATIC',
    paymentAmount: 20,
    percentCollateral: 30,
    price: 6,
    settleTime: '2 Hours',
    sellerName: 'PolyMaster',
    sellerWallet: '0x2a3b4c5d6e7f...',
    sellerRating: 4.5,
    tokenImage: '/placeholder.svg?height=48&width=48',
    paymentTokenImage: '/placeholder.svg?height=20&width=20',
  },
];

export default function OfferList() {
  const [isSticky, setIsSticky] = useState(false);
  const [viewType, setViewType] = useState<'card' | 'list'>('card'); // New state for view type
  const searchBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        // Check if the element's top is at or above the sticky threshold (16px from top, matching header height)
        setIsSticky(rect.top <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case the page loads already scrolled

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    console.log('viewType', viewType);
  }, [viewType]);

  const { isMobile, isTablet } = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setViewType('card');
    }
  }, [isMobile]);

  const { data, isLoading, isError } = useGetOffersV2();

  const offers = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="grid gap-6">
      <div
        ref={searchBarRef}
        className={cn(
          'sticky top-[4.5rem] z-30 rounded-xl flex flex-col justify-between sm:flex-row p-4 items-center gap-4 transition-colors duration-300',
          // isSticky ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-300' : '',
          'bg-white/95 backdrop-blur-lg shadow-md border border-gray-300'
        )}
      >
        {/* Left side: Search Input and Sort Select */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search offers..."
            className={`flex-1 shadow-sm border-gray-200 ${
              isSticky ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
            }`}
          />
          <Select defaultValue="newest">
            <SelectTrigger
              className={`w-[180px] shadow-sm border-gray-200 ${
                isSticky ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
              }`}
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: View Type Toggle */}
        <ToggleGroup
          type="single"
          value={viewType}
          onValueChange={(value: 'card' | 'list') => value && setViewType(value)}
          className="flex-shrink-0 hidden md:flex"
        >
          <ToggleGroupItem value="card" aria-label="Toggle card view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Toggle list view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Conditional rendering for Offer Cards or Offer List Items */}
      {viewType === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <OfferCard key={index} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {' '}
          {/* Using grid for consistent gap, but items will be full width */}
          {offers.map((offer, index) => (
            <OfferListItem key={index} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
