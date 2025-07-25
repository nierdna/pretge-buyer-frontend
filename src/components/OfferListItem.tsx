import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IOffer } from '@/types/offer';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { div, formatNumberShort, minus } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { Dot, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from './ui/progress';

interface OfferListItemProps {
  offer: IOffer;
}

export default function OfferListItem({ offer }: OfferListItemProps) {
  return (
    <Card className="bg-primary-foreground border-gray-200 hover:scale-[1.01] transition-all duration-300 flex flex-col sm:flex-row items-center p-4 gap-4">
      {/* Token Info */}
      <div className="flex items-center gap-4 w-full sm:w-40 xl:w-48 flex-shrink-0">
        <div className="relative w-8 h-8 xl:w-12 xl:h-12">
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="relative">
              <Image
                src={offer?.tokens?.logo || '/logo-mb.png'}
                alt={offer?.tokens?.symbol || 'Token Image'}
                width={48}
                height={48}
                className="rounded-full border border-content"
              />
              <Image
                src={offer?.exToken?.network?.logo || '/logo-mb.png'}
                alt={offer?.exToken?.network?.name || 'Token Image'}
                width={20}
                height={20}
                className="rounded-full absolute bottom-0 right-0 border border-content"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-0.5">
          <div className="font-medium text-lg truncate">{offer.tokens?.symbol}</div>
        </div>
      </div>

      {/* Price & Sold */}
      <div className="flex flex-col items-start w-full sm:w-32 xl:w-64 flex-shrink-0">
        {/* <span className="text-sm text-gray-600">Price</span> */}

        <div className="flex items-end gap-4 w-full">
          <div className="flex flex-col gap-2 flex-1 relative max-w-[calc(60%)]">
            <div className="text-xs text-content inline-flex items-center">
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
                  }
                )
              : formatNumberShort(offer.price, {
                  useShorterExpression: true,
                })}
          </span>
        </div>
      </div>

      {/* Payment, Collateral, Settle Time */}
      <div className="grid gap-1 text-sm min-w-24 flex-1 xl:min-w-[150px] lg:w-auto lg:flex-1">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Collateral:</span>
          <span className={cn('font-medium')}>{`${offer.collateralPercent}%`}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Settle Duration:</span>
          <span className="font-medium">
            {offer.settleDuration} {offer.settleDuration > 1 ? 'hrs' : 'hr'}
          </span>
        </div>
      </div>

      {/* Seller Info */}
      <div className="flex flex-col items-start w-full sm:w-32 xl:w-48 md:flex-1 flex-shrink-0">
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
            <div className="font-bold text-sm truncate">
              {truncateAddress(offer.sellerWallet?.user?.name)}
            </div>
            <div className="flex items-center gap-0.5 text-sm text-gray-500">
              <span className="font-bold">{Number(offer.sellerWallet?.user?.rating || 0)}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* View Offer Button */}
      <Link
        href={`/offers/${offer.id}`}
        className="ml-auto flex-shrink-0 w-full sm:w-auto underline text-end text-base"
      >
        View Offer
      </Link>
    </Card>
  );
}
