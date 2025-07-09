'use client';

import { Offer } from '@/types/offer';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Separator from './ui/separator';

interface OfferCardProps {
  offer: Offer;
  variant?: 'default' | 'compact' | 'grid';
}

export default function OfferCard({ offer, variant = 'default' }: OfferCardProps) {
  const isCompact = variant === 'compact';
  const isGrid = variant === 'grid';
  const {
    id,
    name,
    price,
    compareAtPrice,
    images,
    rating,
    inventory,
    tokenInfo,
    sellerInfo,
    startTime,
    endTime,
    amount,
  } = offer;

  const isOutOfStock = inventory <= 0;
  const isActive =
    startTime && endTime
      ? new Date() >= new Date(startTime) && new Date() <= new Date(endTime)
      : true;

  const isEnded = endTime && new Date() > new Date(endTime);

  return (
    <div className="group rounded-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden bg-card-gradient shadow-dark">
      <Link href={`/offers/${offer.id}`} className="block">
        {/* Header with Token Info and Status */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tokenInfo?.icon && (
                <div className="w-8 h-8 relative min-w-8 rounded-full overflow-hidden bg-opensea-marina">
                  <Image
                    // src={tokenInfo.icon}
                    src={
                      'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                    }
                    alt={tokenInfo.symbol}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-primary">{tokenInfo?.symbol || name}</h2>
                <div className="flex items-center space-x-1.5 mt-1">
                  <svg
                    className="w-4 h-4 text-priamry"
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Ethereum</title>
                    <path
                      d="M11.944 17.97L4.58 13.62l7.364 4.35zm.112 0l7.365-4.35-7.365 4.35zM12 3.052L4.58 12.33l7.42-2.835L12 3.052zm0 0l7.42 9.278-7.42-2.835L12 3.052zM4.58 13.62l7.364-1.766-7.364 1.766zm7.518-.002l7.365-1.766-7.365 1.766z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-a">Ethereum</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-cyan">${formatNumberShort(price)}</p>
              <p className="text-xs text-gray-a mt-1">
                Sold: {formatNumberShort(amount || 0, { useShorterExpression: true })}
              </p>
            </div>
            {/* <Badge
              variant={isActive ? 'default' : 'secondary'}
              className={`text-xs ${
                isActive ? 'bg-opensea-green text-white' : 'bg-opensea-lightGray text-white'
              }`}
            >
              {isActive ? 'Active' : 'Ended'}
            </Badge> */}
          </div>
        </div>
        <Separator />
        {/* <div className="group-hover:h-0 overflow-hidden"> */}
        {/* <AspectRatio ratio={16 / 9}>
          <Image
            src={images?.[0]?.url || 'https://via.placeholder.com/400x225'}
            alt={name}
            fill
            className="object-cover"
          />
        </AspectRatio> */}
        {/* </div> */}

        {/* Offer Info */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cyan-800/20 p-3 rounded-lg">
              <span className="text-2xs font-medium text-gray-400 block">Pay with</span>
              <div className="flex items-center space-x-2 mt-1">
                <img
                  src="https://assets.coingecko.com/coins/images/6319/standard/usdc.png"
                  className="w-6 h-6 rounded-full"
                  alt="USDC Logo"
                />
                <img
                  src="https://assets.coingecko.com/coins/images/4128/standard/solana.png"
                  className="w-6 h-6 rounded-full"
                  alt="SOL Logo"
                />
              </div>
            </div>
            <div className="bg-cyan-800/20 p-3 rounded-lg">
              <span className="text-2xs font-medium text-gray-400 block">Collateral</span>
              <span className="font-bold text-primary mt-1 block">25%</span>
            </div>
            <div className="bg-cyan-800/20 p-3 rounded-lg">
              <span className="text-2xs font-medium text-gray-400 block">Amount</span>
              <span className="font-bold text-primary mt-1 block">
                {formatNumberShort(amount || 0, { useShorterExpression: true })}
              </span>
            </div>
            <div className="bg-cyan-800/20 p-3 rounded-lg">
              <span className="text-2xs font-medium text-gray-400 block">Settle after TGE</span>
              <span className="font-bold text-primary mt-1 block">4h</span>
            </div>
          </div>

          {/* Time Info - Compact */}
          {/* <div className="space-y-1">
            <div className="grid grid-cols-1 gap-2 text-xs">
              {startTime && (
                <div className="flex items-center gap-1 text-xs text-gray-a">
                  <p className="">Start:</p>
                  <p className="text-primary font-medium">
                    {startTime
                      ? formatDate(startTime, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'TBA'}
                  </p>
                </div>
              )}
              {endTime && (
                <div className="flex items-center gap-1 text-xs text-gray-a">
                  <p className="">Ended:</p>
                  <p className="text-primary font-medium">
                    {formatDate(endTime, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div> */}
          {/* Seller Info - Compact */}

          {/* Action Button */}
          {/* <button
            className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              isOutOfStock || !isActive
                ? 'bg-opensea-lightGray text-opensea-darkGray cursor-not-allowed'
                : 'bg-opensea-blue hover:bg-opensea-darkBlue text-white group-hover:bg-opensea-darkBlue'
            }`}
            disabled={isOutOfStock || !isActive}
          >
            {isOutOfStock ? 'Out of Stock' : !isActive ? 'Ended' : 'Buy Now'}
          </button> */}
        </div>
        <Separator />
        {sellerInfo && (
          <div className="flex items-center gap-2 p-4 rounded-md">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-opensea-marina flex-shrink-0">
              {sellerInfo.avatar ? (
                <Image
                  src={sellerInfo.avatar}
                  alt={sellerInfo.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-xs truncate">{sellerInfo.name}</p>
              <p className="text-xs text-gray-a truncate">{truncateAddress(sellerInfo.address)}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-primary">{sellerInfo.rating.toFixed(1)}</span>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
