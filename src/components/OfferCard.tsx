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
import { div, formatNumberShort, minus } from '@/utils/helpers/number';
import { normalizeNetworkName } from '@/utils/helpers/string';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';

interface OfferCardProps {
  offer: IOffer;
}
export const getColorFromCollateral = (collateral: number) => {
  if (collateral >= 100) return 'bg-card text-primary'; // 100% - green (most reliable)
  if (collateral >= 75) return 'bg-card text-primary'; // 75% - cyan (very reliable)
  if (collateral >= 50) return 'bg-card text-primary'; // 50% - orange (moderate)
  return 'bg-card text-primary'; // 25% - red (least reliable)
};

export const getSettleDurationColor = (settleDuration: number) => {
  if (settleDuration <= 2) return 'bg-card text-primary'; // 1h, 2h - green (fast)
  if (settleDuration <= 6) return 'bg-card text-primary'; // 4h, 6h - yellow (medium)
  return 'bg-card text-primary'; // 12h - red (slow)
};

export const formatSettleDuration = (settleDuration: number) => {
  if (settleDuration <= 0) return 'N/A';
  return `${settleDuration}hr${settleDuration > 1 ? 's' : ''}`;
};

export const formatCollateralPercent = (collateralPercent: number) => {
  return `${collateralPercent}%`;
};

export default function OfferCard({ offer }: OfferCardProps) {
  // Assuming a unique ID can be derived or passed for linking to detail page
  const offerId = offer.id;

  return (
    <Link href={`/offers/${offerId}`} className="cursor-pointer">
      <Card className="relative flex flex-col p-3 backdrop-blur-md transition-all duration-300 hover:scale-[1.015] hover:bg-card">
        {/* {offer?.promotion?.isActive && (
        <div className="absolute -top-3 -right-0">
          <Badge className="text-xs bg-orange-500 text-primary">
            -{offer?.promotion?.discountPercent}%
          </Badge>
        </div>
      )} */}
        <div className="relative">
          <img
            src={offer?.imageUrl || offer.tokens?.bannerUrl || offer.tokens?.logo || '/logo-mb.png'}
            alt={`${offer.tokens?.symbol} symbol`}
            className="h-48 w-full rounded-2xl border border-border object-cover"
          />
          <Badge className="absolute left-2 top-2 z-10 bg-card text-primary">
            {normalizeNetworkName(offer.exToken?.network?.name)}
          </Badge>
          {!!offer?.promotion?.isActive && (
            <Badge variant={'danger'} className="absolute right-2 top-2 z-10 bg-card text-primary">
              Discount
            </Badge>
          )}
          <div className="absolute bottom-2 left-2 flex w-full items-center gap-1">
            <Badge className={`${getSettleDurationColor(offer.settleDuration)}`}>
              {formatSettleDuration(offer.settleDuration)}
            </Badge>
            <Badge className={`${getColorFromCollateral(offer.collateralPercent)}`}>
              {formatCollateralPercent(offer.collateralPercent)}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-3">
          <div className="flex flex-col gap-2">
            {/* <div className="text-content text-sm">
            {dayjs(offer.createdAt).format('MMM DD, YYYY - HH:mm A')}
          </div> */}
            <CardTitle className="w-full truncate text-lg">
              {offer?.title || offer?.tokens?.symbol}
            </CardTitle>

            <CardDescription className="text-content line-clamp-2 truncate text-sm">
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
                        maxDecimalCount: 4,
                      }
                    )
                  : formatNumberShort(offer.price, {
                      useShorterExpression: true,
                      maxDecimalCount: 4,
                    })}
              </span>
            </div>
            {offer?.promotion?.isActive && (
              <div className="text-sm relative text-content flex items-center gap-1">
                <span className="font-medium line-through">
                  $
                  {formatNumberShort(offer.price, {
                    useShorterExpression: true,
                    maxDecimalCount: 4,
                  })}
                </span>

                {offer?.promotion?.isActive && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-500 text-primary px-1.5 hover:bg-orange-600"
                  >
                    -{offer?.promotion?.discountPercent}%
                  </Badge>
                )}
              </div>
            )}
            <div className="mt-1 text-sm font-medium text-content">
              Sold:{' '}
              <span className="font-bold text-foreground">{`${formatNumberShort(offer.filled, {
                useShorterExpression: true,
              })}`}</span>
            </div>
          </div>
        </div>
      </CardHeader> */}
        <CardContent className="flex flex-col gap-4 p-3 text-sm">
          <div className="flex items-end justify-between gap-4">
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
            <span className="flex flex-col items-end gap-1 text-2xl leading-none">
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
              <div className="flex items-end gap-1">
                <Image
                  src={offer?.tokens?.logo || '/logo-mb.png'}
                  alt={offer?.tokens?.symbol || 'Token Image'}
                  width={16}
                  height={16}
                  className="min-h-4 min-w-4 rounded-full border border-border"
                />
                <span className="text-content text-xs leading-none">{offer.tokens?.symbol}</span>
              </div>
            </span>
          </div>
          {/* <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-border shadow-md h-fit">
          <span className="text-2xs text-content">Total Amount</span>
          <span className="text-base font-bold text-primary">
            {formatNumberShort(offer.quantity, {
              useShorterExpression: true,
            })}
          </span>
        </div>

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-border shadow-md h-fit">
          <span className="text-2xs text-content">Payment with</span>
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

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-border shadow-md h-fit">
          <span className="text-2xs text-content">Collateral</span>
          <span
            className={cn('text-base font-bold', getColorFromCollateral(offer.collateralPercent))}
          >{`${offer.collateralPercent}%`}</span>
        </div>

        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-border shadow-md h-fit">
          <span className="text-2xs text-content">Settle After TGE</span>
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
        {/* <Separator className="w-full" /> */}
        {/* <CardFooter className="flex flex-col items-center p-0"> */}
        {/* Block 3: Seller Info */}
        {/* <div className="flex w-full items-center gap-2 pt-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={
                  getFallbackAvatar(offer.sellerWallet.address)
                }
              />
            </Avatar>
            <div className="grid min-w-0 flex-grow gap-0.5">
              <div className="truncate text-sm text-content">{offer.sellerWallet?.user?.name}</div>
            </div>
            <div className="ml-auto flex flex-shrink-0 items-center gap-0.5">
              <span className="mt-1 text-sm leading-none text-content">
                {Number(offer.sellerWallet?.user?.rating || 0)}
              </span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div> */}
        {/* <Link href={`/offers/${offerId}`} className="w-full">
          {offer.status === EOfferStatus.OPEN && <Button className="w-full">View Offer</Button>}
          {offer.status === EOfferStatus.CLOSED && (
            <Button variant={'danger'} className="w-full">
              Offer Closed
            </Button>
          )}
        </Link> */}
        {/* </CardFooter> */}
      </Card>
    </Link>
  );
}

function OfferCardSkeleton() {
  return (
    <Card className="flex flex-col border-border bg-foreground/50 shadow-2xl backdrop-blur-md">
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
            <Skeleton className="mt-1 h-4 w-[70px]" />
          </div>
        </div>
      </CardHeader>
      <div className="mx-6 h-[1px] bg-border" /> {/* Separator skeleton */}
      <CardContent className="grid flex-grow grid-cols-2 gap-4 p-6 text-sm">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-md border border-border bg-neutral-800/5 p-3 shadow-md"
          >
            <Skeleton className="mb-1 h-3 w-[60px]" />
            <Skeleton className="h-5 w-[80px]" />
          </div>
        ))}
      </CardContent>
      <div className="mx-6 h-[1px] bg-border" /> {/* Separator skeleton */}
      <CardFooter className="flex flex-col items-start gap-4 p-6 pt-4">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="grid min-w-0 flex-grow gap-0.5">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <Skeleton className="ml-auto h-4 w-[40px]" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
