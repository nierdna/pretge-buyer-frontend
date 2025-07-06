'use client';

import { Product } from '@/types/product';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { formatDate } from '@/utils/parseDate';
import { Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from './ui/separator';

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
    <div className="group rounded-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden bg-card-gradient shadow-dark">
      <Link href={`/products/${product.id}`} className="block">
        {/* Header with Token Info and Status */}
        <div className="p-4">
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
                <h3 className="font-semibold text-primary text-sm">{tokenInfo?.symbol || name}</h3>
                <p className="text-xs text-gray-a">#{id}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-primary">${formatNumberShort(price)}</p>
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

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Price and Amount */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-a">Chain</p>
              <p className="font-bold text-primary">Ethereum</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-a">Amount</p>
              <p className="font-bold text-primary">{formatNumberShort(amount || 0)}</p>
            </div>
          </div>

          {/* Time Info - Compact */}
          <div className="space-y-1">
            {/* <div className="flex items-center gap-1 text-xs text-opensea-lightGray">
              <Clock className="w-3 h-3" />
              <span>Time Settings</span>
            </div> */}
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
          </div>
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
