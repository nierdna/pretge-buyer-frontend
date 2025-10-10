import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IOffer } from '@/types/offer';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { div, formatNumberShort, minus } from '@/utils/helpers/number';
import { Dot, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from './ui/progress';

interface OfferListItemProps {
  offer: IOffer;
}

export default function OfferListItem({ offer }: OfferListItemProps) {
  return (
    <Card className="bg-primary-foreground flex flex-col items-center gap-4 border-border p-4 transition-all duration-300 hover:scale-[1.01] sm:flex-row">
      {/* Token Info */}
      <div className="flex w-full flex-shrink-0 items-center gap-4 sm:w-40 xl:w-48">
        <div className="relative h-8 w-8 xl:h-12 xl:w-12">
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="relative">
              <Image
                src={offer?.tokens?.logo || '/logo-mb.png'}
                alt={offer?.tokens?.symbol || 'Token Image'}
                width={48}
                height={48}
                className="border-content rounded-full border"
              />
              <Image
                src={offer?.exToken?.network?.logo || '/logo-mb.png'}
                alt={offer?.exToken?.network?.name || 'Token Image'}
                width={20}
                height={20}
                className="border-content absolute bottom-0 right-0 rounded-full border"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-0.5">
          <div className="truncate text-lg font-medium">{offer.tokens?.symbol}</div>
        </div>
      </div>

      {/* Price & Sold */}
      <div className="flex w-full flex-shrink-0 flex-col items-start sm:w-32 xl:w-64">
        {/* <span className="text-sm text-gray-600">Price</span> */}

        <div className="flex w-full items-end gap-4">
          <div className="relative flex max-w-[calc(60%)] flex-1 flex-col gap-2">
            <div className="text-content inline-flex items-center text-xs">
              <span>
                {formatNumberShort(div(Number(offer.filled), Number(offer.quantity)) * 100, {
                  maxDecimalCount: 0,
                })}
                %
              </span>
              <Dot className="text-content" size={16} />
              {minus(offer.quantity, offer.filled)} {offer.tokens?.symbol} left
            </div>
            <div className="h-2 w-full">
              <Progress
                value={div(Number(offer.filled), Number(offer.quantity)) * 100}
                // value={50}
              />
            </div>
          </div>

          <span className="text-xl leading-none">
            $
            {offer?.promotion?.isActive
              ? formatNumberShort(
                  offer.price * (1 - Number(offer.promotion?.discountPercent) / 100),
                  {
                    useShorterExpression: true,
                    maxDecimalCount: 4,
                  }
                )
              : formatNumberShort(offer.price, {
                  useShorterExpression: true,
                  maxDecimalCount: 4,
                })}
          </span>
        </div>
      </div>

      {/* Payment, Collateral, Settle Time */}
      <div className="grid min-w-24 flex-1 gap-1 text-sm lg:w-auto lg:flex-1 xl:min-w-[150px]">
        <div className="flex items-center gap-1">
          <span className="text-content">Collateral:</span>
          <span className={cn('font-medium')}>{`${offer.collateralPercent}%`}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-content">Settle Duration:</span>
          <span className="font-medium">
            {offer.settleDuration} {offer.settleDuration > 1 ? 'hrs' : 'hr'}
          </span>
        </div>
      </div>

      {/* Seller Info */}
      <div className="flex w-full flex-shrink-0 flex-col items-start sm:w-32 md:flex-1 xl:w-48">
        {/* <span className="text-sm text-gray-600">Seller</span> */}
        <div className="flex items-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                offer.sellerWallet?.user?.avatar || getFallbackAvatar(offer.sellerWallet?.address)
              }
            />
            {/* <AvatarFallback className="text-xs">
              {truncateAddress(offer.sellerWallet.address)}
            </AvatarFallback> */}
          </Avatar>
          <div className="grid gap-0.5">
            <div className="truncate text-sm font-bold">{offer.sellerWallet?.user?.name}</div>
            <div className="text-content flex items-center gap-0.5 text-sm">
              <span className="font-bold">{Number(offer.sellerWallet?.user?.rating || 0)}</span>
              <Star className="fill-yellow-400 text-yellow-400 h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* View Offer Button */}
      <Link
        href={`/offers/${offer.id}`}
        className="ml-auto w-full flex-shrink-0 text-end text-base underline sm:w-auto"
      >
        View Offer
      </Link>
    </Card>
  );
}
