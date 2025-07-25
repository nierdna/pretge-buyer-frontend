'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IOffer } from '@/types/offer';
import { Coins, Search, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultsProps {
  offers: IOffer[];
  searchQuery: string;
  isLoading: boolean;
  totalResults?: number;
}

export default function SearchResults({
  offers,
  searchQuery,
  isLoading,
  totalResults,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-content">
          <Search className="h-4 w-4" />
          Searching for "{searchQuery}"...
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-secondary h-48 rounded-2xl mb-4"></div>
              <div className="space-y-2">
                <div className="bg-secondary h-4 rounded w-3/4"></div>
                <div className="bg-secondary h-3 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return null;
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Search className="h-12 w-12 text-content" />
          <div>
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-content">
              No offers found for "{searchQuery}". Try searching with different keywords.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-content">
          <Search className="h-4 w-4" />
          Found {totalResults || offers.length} result{totalResults !== 1 ? 's' : ''} for "
          {searchQuery}"
        </div>
        <div className="flex items-center gap-2 text-xs text-content">
          <Coins className="h-3 w-3" />
          Token offers
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <Link key={offer.id || index} href={`/offers/${offer.id}`}>
            <Card className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
              <div className="relative">
                <Image
                  src={
                    offer?.imageUrl ||
                    offer.tokens?.bannerUrl ||
                    offer.tokens?.logo ||
                    '/logo-mb.png'
                  }
                  alt={`${offer.tokens?.symbol} banner`}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 left-2">{offer.exToken?.network?.name}</Badge>
                {offer?.promotion?.isActive && (
                  <Badge variant="danger" className="absolute top-2 right-2">
                    -{offer.promotion.discountPercent}%
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={offer.tokens?.logo || '/logo-mb.png'}
                    alt={offer.tokens?.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{offer.tokens?.symbol}</CardTitle>
                    <CardDescription className="text-sm">{offer.tokens?.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-content">Price</span>
                    <span className="font-bold text-lg">${offer.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-content">Available</span>
                    <span className="font-medium">
                      {offer.quantity?.toLocaleString()} {offer.tokens?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-content">Sold</span>
                    <span className="font-medium">
                      {offer.filled?.toLocaleString()} {offer.tokens?.symbol}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Search Tips */}
      <div className="mt-8 p-4 bg-secondary rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Search Tips
        </h4>
        <ul className="text-sm text-content space-y-1">
          <li>• Try searching by token symbol (e.g., "BTC", "ETH")</li>
          <li>• Search by token name (e.g., "Bitcoin", "Ethereum")</li>
          <li>• Use partial matches for broader results</li>
          <li>• Check recent searches for quick access</li>
        </ul>
      </div>
    </div>
  );
}
