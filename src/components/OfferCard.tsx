import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { EOfferStatus, IOffer } from '@/types/offer';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { formatNumberShort } from '@/utils/helpers/number';
import { normalizeNetworkName, truncateAddress } from '@/utils/helpers/string';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { Skeleton } from './ui/skeleton';

interface OfferCardProps {
  offer: IOffer;
}
export const getColorFromCollateral = (collateral: number) => {
  if (collateral >= 100) return 'text-green-500';
  if (collateral >= 75) return 'text-cyan-500';
  if (collateral >= 50) return 'text-orange-500';
  return '';
};

export default function OfferCard({ offer }: OfferCardProps) {
  // Assuming a unique ID can be derived or passed for linking to detail page
  const offerId = offer.id;

  return (
    <Card className="bg-white/85 backdrop-blur-md shadow-lg hover:bg-white border-gray-300 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col relative">
      {/* {offer?.promotion?.isActive && (
        <div className="absolute -top-3 -right-0">
          <Badge variant="secondary" className="text-xs bg-orange-500 text-white">
            -{offer?.promotion?.discountPercent}%
          </Badge>
        </div>
      )} */}
      <CardHeader className="p-6 pb-4 flex-grow">
        {/* Block 1: Token Info (Left) and Price/Sold (Right) */}
        <div className="flex items-start justify-between gap-2">
          {/* Left side: Token Image, Symbol, Network */}
          <div className="flex items-start gap-3 flex-grow">
            <div className="w-12 h-12 relative min-w-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={
                  'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                }
                // src={tokenImage || '/placeholder.svg'}
                alt={`${offer.tokens?.symbol} symbol`}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid gap-1 flex-grow">
              <CardTitle className="text-xl font-bold truncate">
                {offer?.title || offer?.tokens?.symbol}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="max-w-40 w-fit">
                  <div className="w-full truncate">{offer?.tokens?.symbol}</div>
                </Badge>
                <Badge variant="secondary" className="max-w-40 w-fit">
                  <div className="w-full truncate">
                    {normalizeNetworkName(offer.exToken?.network?.name)}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side: Price and Sold Amount */}
          <div className="flex flex-col items-end text-right flex-shrink-0">
            <div className="mt-1 text-xl font-medium">
              <span className="font-bold text-green-500">
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
            {offer?.promotion?.isActive && (
              <div className="text-sm relative text-gray-500 flex items-center gap-1">
                <span className="font-medium line-through">
                  $
                  {formatNumberShort(offer.price, {
                    useShorterExpression: true,
                  })}
                </span>
                {/* <span className="font-bold text-xl text-green-500">
                  $
                  {formatNumberShort(offer.price, {
                    useShorterExpression: true,
                  })}
                </span> */}
                {offer?.promotion?.isActive && (
                  // <div className="absolute -top-3 -right-0">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-orange-500 text-white px-1.5 hover:bg-orange-600"
                  >
                    -{offer?.promotion?.discountPercent}%
                  </Badge>
                  // </div>
                )}
              </div>
            )}
            <div className="mt-1 text-sm font-medium text-gray-500">
              Sold:{' '}
              <span className="font-semibold text-foreground">{`${formatNumberShort(offer.filled, {
                useShorterExpression: true,
              })}`}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className="w-full bg-gray-200" />
      <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm">
        {/* Block 1: Total Amount */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Total Amount</span>
          <span className="text-base font-semibold text-primary">
            {formatNumberShort(offer.quantity, {
              useShorterExpression: true,
            })}
          </span>
        </div>

        {/* Block 2: Payment with */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Payment with</span>
          <div className="flex items-end gap-1 h-6 font-semibold">
            <Image
              src={
                'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
              }
              alt={`${offer.exToken?.symbol} symbol`}
              width={20} // Smaller icon for this context
              height={20}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        {/* Block 3: Collateral */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Collateral</span>
          <span
            className={cn(
              'text-base font-semibold',
              getColorFromCollateral(offer.collateralPercent)
            )}
          >{`${offer.collateralPercent}%`}</span>
        </div>

        {/* Block 4: Settle After TGE */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Settle After TGE</span>
          <span className="text-base font-semibold">
            {offer.settleDuration > 0
              ? `${
                  offer.settleDuration > 1
                    ? `${offer.settleDuration} hrs`
                    : `${offer.settleDuration} hr`
                }`
              : 'N/A'}
          </span>
        </div>
      </CardContent>
      <Separator className="w-full bg-gray-200" />
      <CardFooter className="p-6 flex flex-col items-start gap-4 pt-4">
        {/* Block 3: Seller Info */}
        <div className="flex items-center gap-2 w-full">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={getFallbackAvatar(offer.sellerWallet.address)} />
          </Avatar>
          <div className="grid gap-0.5 min-w-0 flex-grow">
            <div className="font-semibold truncate">
              {truncateAddress(offer.sellerWallet.address)}
            </div>
            {/* <div className="text-xs text-gray-500 truncate">{truncateAddress(offer.sellerWallet.address)}</div> */}
          </div>
          <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
            <span className="font-semibold text-sm">
              {Number(offer.sellerWallet?.user?.rating || 0)}
            </span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <Link href={`/offers/${offerId}`} className="w-full">
          {offer.status === EOfferStatus.OPEN && <Button className="w-full">View Offer</Button>}
          {offer.status === EOfferStatus.CLOSED && (
            <Button variant={'destructive'} className="w-full">
              Offer Closed
            </Button>
          )}
        </Link>
      </CardFooter>
    </Card>
  );
}

function OfferCardSkeleton() {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 flex flex-col">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="grid gap-1">
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[70px] mt-1" />
          </div>
        </div>
      </CardHeader>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm flex-grow">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md"
          >
            <Skeleton className="h-3 w-[60px] mb-1" />
            <Skeleton className="h-5 w-[80px]" />
          </div>
        ))}
      </CardContent>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardFooter className="p-6 flex flex-col items-start gap-4 pt-4">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="grid gap-0.5 flex-grow min-w-0">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[40px] ml-auto" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
