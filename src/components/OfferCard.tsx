import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { IOffer } from '@/types/offer';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { div, formatNumberShort, minus } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { Dot, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
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
    <Link href={`/offers/${offerId}`} className="cursor-pointer">
      <Card className="backdrop-blur-md hover:scale-[1.015] hover:bg-primary-foreground transition-all p-3 duration-300 flex flex-col relative">
        {/* {offer?.promotion?.isActive && (
        <div className="absolute -top-3 -right-0">
          <Badge className="text-xs bg-orange-500 text-white">
            -{offer?.promotion?.discountPercent}%
          </Badge>
        </div>
      )} */}
        <div className="relative">
          <img
            src={offer?.imageUrl || offer.tokens?.bannerUrl || offer.tokens?.logo || '/logo-mb.png'}
            alt={`${offer.tokens?.symbol} symbol`}
            className="object-cover w-full h-48 border-line border rounded-2xl"
          />
          {!offer?.promotion?.isActive && (
            <Badge variant={'danger'} className="absolute top-2 right-2 z-10">
              Discount
            </Badge>
          )}
        </div>
        <CardHeader className="p-3">
          <div className="flex flex-col gap-2">
            {/* <div className="text-content text-sm">
            {dayjs(offer.createdAt).format('MMM DD, YYYY - HH:mm A')}
          </div> */}
            <CardTitle className="text-lg w-full truncate">
              {offer?.title || offer?.tokens?.symbol}
            </CardTitle>

            <CardDescription className="text-sm line-clamp-2 text-content truncate">
              {offer?.description || 'No description'}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator className="w-full" />
        {/* <CardHeader className="p-6 pb-4 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-grow">
            <div className="w-12 h-12 relative min-w-12 rounded-full overflow-hidden bg-secondary-foreground flex-shrink-0">
              <Image
                src={
                  offer.tokens?.logo ||
                  'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                }
                alt={`${offer.tokens?.symbol} symbol`}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid gap-1 flex-grow">
              <CardTitle className="text-lg font-bold truncate">
                {offer?.title || offer?.tokens?.symbol}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="max-w-40 w-fit">
                  <div className="w-full truncate">{offer?.tokens?.symbol}</div>
                </Badge>
                <Badge className="max-w-40 w-fit">
                  <div className="w-full truncate">
                    {normalizeNetworkName(offer.exToken?.network?.name)}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

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

                {offer?.promotion?.isActive && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-500 text-white px-1.5 hover:bg-orange-600"
                  >
                    -{offer?.promotion?.discountPercent}%
                  </Badge>
                )}
              </div>
            )}
            <div className="mt-1 text-sm font-medium text-gray-500">
              Sold:{' '}
              <span className="font-bold text-foreground">{`${formatNumberShort(offer.filled, {
                useShorterExpression: true,
              })}`}</span>
            </div>
          </div>
        </div>
      </CardHeader> */}
        <CardContent className="p-3 flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex flex-col gap-2 flex-1 relative max-w-[calc(70%)]">
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
            <span className="text-3xl leading-none">
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
          {/* <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Total Amount</span>
          <span className="text-base font-bold text-primary">
            {formatNumberShort(offer.quantity, {
              useShorterExpression: true,
            })}
          </span>
        </div>

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Payment with</span>
          <div className="flex items-end gap-1 h-6 font-bold">
            <Image
              src={
                offer.exToken?.logo ||
                'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
              }
              alt={`${offer.exToken?.symbol} symbol`}
              width={20} // Smaller icon for this context
              height={20}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Collateral</span>
          <span
            className={cn('text-base font-bold', getColorFromCollateral(offer.collateralPercent))}
          >{`${offer.collateralPercent}%`}</span>
        </div>

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md h-fit">
          <span className="text-2xs text-gray-500">Settle After TGE</span>
          <span className="text-base font-bold">
            {offer.settleDuration > 0
              ? `${
                  offer.settleDuration > 1
                    ? `${offer.settleDuration} hrs`
                    : `${offer.settleDuration} hr`
                }`
              : 'N/A'}
          </span>
        </div> */}
        </CardContent>
        <Separator className="w-full" />
        <CardFooter className="p-3 pb-2 flex flex-col items-start gap-4 pt-4">
          {/* Block 3: Seller Info */}
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={getFallbackAvatar(offer.sellerWallet.address)} />
            </Avatar>
            <div className="grid gap-0.5 min-w-0 flex-grow">
              <div className="font-bold truncate">
                {truncateAddress(offer.sellerWallet?.user?.name)}
              </div>
              {/* <div className="text-xs text-gray-500 truncate">{truncateAddress(offer.sellerWallet.address)}</div> */}
            </div>
            <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
              <span className="text-sm leading-none mt-1">
                {Number(offer.sellerWallet?.user?.rating || 0)}
              </span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          {/* <Link href={`/offers/${offerId}`} className="w-full">
          {offer.status === EOfferStatus.OPEN && <Button className="w-full">View Offer</Button>}
          {offer.status === EOfferStatus.CLOSED && (
            <Button variant={'danger'} className="w-full">
              Offer Closed
            </Button>
          )}
        </Link> */}
        </CardFooter>
      </Card>
    </Link>
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
