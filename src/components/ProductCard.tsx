'use client';

import { Product } from '@/types/product';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { formatDate } from '@/utils/parseDate';
import { Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AspectRatio } from './ui/aspect-ratio';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'grid';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
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
  } = product;

  const isOutOfStock = inventory <= 0;
  const isActive =
    startTime && endTime
      ? new Date() >= new Date(startTime) && new Date() <= new Date(endTime)
      : true;

  const isEnded = endTime && new Date() > new Date(endTime);

  return (
    <div className="group rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 overflow-hidden bg-opensea-darkBorder border border-opensea-darkBorder">
      <Link href={`/products/${product.id}`} className="block">
        {/* Header with Token Info and Status */}
        <div className="p-3 border-b border-opensea-darkBorder">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tokenInfo?.icon && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-opensea-marina">
                  <Image
                    src={tokenInfo.icon}
                    alt={tokenInfo.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white text-sm">{tokenInfo?.symbol || name}</h3>
                <p className="text-xs text-opensea-lightGray">#{id}</p>
              </div>
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
        {/* <div className="group-hover:h-0 overflow-hidden"> */}
        <AspectRatio ratio={16 / 9}>
          <Image
            src={images?.[0]?.url || 'https://via.placeholder.com/400x225'}
            alt={name}
            fill
            className="object-cover"
          />
        </AspectRatio>
        {/* </div> */}

        {/* Product Info */}
        <div className="p-3 space-y-3">
          {/* Price and Amount */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-opensea-lightGray">Price</p>
              <p className="font-bold text-white">{formatNumberShort(price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-opensea-lightGray">Amount</p>
              <p className="font-bold text-white">{formatNumberShort(amount || 0)}</p>
            </div>
          </div>

          {/* Seller Info - Compact */}
          {sellerInfo && (
            <div className="flex items-center gap-2 py-2 bg-opensea-darkBg rounded-md border border-opensea-darkBorder">
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
                <p className="text-xs text-opensea-lightGray truncate">
                  {truncateAddress(sellerInfo.address)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-white">{sellerInfo.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Time Info - Compact */}
          <div className="space-y-1">
            {/* <div className="flex items-center gap-1 text-xs text-opensea-lightGray">
              <Clock className="w-3 h-3" />
              <span>Time Settings</span>
            </div> */}
            <div className="grid grid-cols-1 gap-2 text-xs">
              {startTime && (
                <div className="flex items-center gap-1 text-xs text-opensea-lightGray">
                  <p className="text-opensea-lightGray">Start</p>
                  <p className="text-white font-medium">
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
                <div className="flex items-center gap-1 text-xs text-opensea-lightGray">
                  <p className="text-opensea-lightGray">Ended</p>
                  <p className="text-white font-medium">
                    {formatDate(endTime, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-opensea-lightGray">End</p>
                <p className="text-white font-medium">
                  {endTime
                    ? formatDate(endTime, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'TBA'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              isOutOfStock || !isActive
                ? 'bg-opensea-lightGray text-opensea-darkGray cursor-not-allowed'
                : 'bg-opensea-blue hover:bg-opensea-darkBlue text-white group-hover:bg-opensea-darkBlue'
            }`}
            disabled={isOutOfStock || !isActive}
          >
            {isOutOfStock ? 'Out of Stock' : !isActive ? 'Ended' : 'Buy Now'}
          </button>
        </div>
      </Link>
    </div>
  );
}
