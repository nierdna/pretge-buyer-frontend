import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { IOffer } from '@/types/offer';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

interface OfferCardProps {
  offer: IOffer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  // Assuming a unique ID can be derived or passed for linking to detail page
  const offerId = offer.id;

  return (
    <Card className="bg-white/85 backdrop-blur-md shadow-lg hover:bg-white border-gray-300 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col">
      <CardHeader className="p-6 pb-4">
        {/* Block 1: Token Info (Left) and Price/Sold (Right) */}
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Token Image, Symbol, Network */}
          <div className="flex items-center gap-3 flex-grow">
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
              <CardTitle className="text-xl font-bold truncate">{offer.tokens?.symbol}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {offer.exToken?.network?.name}
              </Badge>
            </div>
          </div>

          {/* Right side: Price and Sold Amount */}
          <div className="flex flex-col items-end text-right flex-shrink-0">
            <div className="mt-1 text-xl font-medium text-gray-700">
              <span className="font-bold">
                $
                {formatNumberShort(offer.price, {
                  useShorterExpression: true,
                })}
              </span>
            </div>
            <div className="mt-1 text-sm font-medium text-gray-700">
              Sold:{' '}
              <span className="font-semibold">{`${formatNumberShort(offer.filled, {
                useShorterExpression: true,
              })}`}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className="mx-6 bg-gray-200" />
      <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm flex-grow">
        {/* Block 1: Total Amount */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md">
          <span className="text-2xs text-gray-500">Total Amount</span>
          <span className="text-lg font-semibold text-primary">
            {formatNumberShort(offer.quantity, {
              useShorterExpression: true,
            })}
          </span>
        </div>

        {/* Block 2: Payment with */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md">
          <span className="text-2xs text-gray-500">Payment with</span>
          <div className="flex items-center gap-1 h-7 font-semibold">
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
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md">
          <span className="text-2xs text-gray-500">Collateral</span>
          <span className="text-lg font-semibold">{`${offer.collateralPercent}%`}</span>
        </div>

        {/* Block 4: Settle After TGE */}
        <div className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md">
          <span className="text-2xs text-gray-500">Settle After TGE</span>
          <span className="text-lg font-semibold">
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
      <Separator className="mx-6 bg-gray-200" />
      <CardFooter className="p-6 flex flex-col items-start gap-4 pt-4">
        {/* Block 3: Seller Info */}
        <div className="flex items-center gap-2 w-full">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${
                offer.sellerWallet.address || Math.random().toString()
              }`}
            />
          </Avatar>
          <div className="grid gap-0.5 min-w-0 flex-grow">
            <div className="font-semibold truncate">
              {truncateAddress(offer.sellerWallet.address)}
            </div>
            {/* <div className="text-xs text-gray-500 truncate">{truncateAddress(offer.sellerWallet.address)}</div> */}
          </div>
          <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
            <span className="font-semibold text-sm">{offer.sellerWallet.rating}</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <Link href={`/offers/${offerId}`} className="w-full">
          <Button className="w-full">Buy Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
