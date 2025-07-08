import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatNumberShort } from '@/utils/helpers/number';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OfferListItemProps {
  tokenSymbol: string;
  tokenName: string;
  network: string;
  quantitySold: number;
  totalQuantity: number;
  paymentToken: string;
  paymentAmount: number;
  percentCollateral: number;
  price: number;
  settleTime: string;
  sellerName: string;
  sellerWallet: string;
  sellerRating: number;
  tokenImage: string;
  paymentTokenImage: string;
}

export default function OfferListItem({
  tokenSymbol,
  network,
  quantitySold,
  totalQuantity,
  paymentToken,
  paymentAmount,
  percentCollateral,
  price,
  settleTime,
  sellerName,
  sellerWallet,
  sellerRating,
  tokenImage,
  paymentTokenImage,
}: OfferListItemProps) {
  const displayWallet = `${sellerWallet.substring(0, 6)}...${sellerWallet.substring(
    sellerWallet.length - 4
  )}`;
  const offerId = tokenSymbol.toLowerCase().replace(/\s+/g, '-') + '-protocol-token';

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg border-gray-300 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center p-4 gap-4">
      {/* Token Info */}
      <div className="flex items-center gap-3 w-full sm:w-40 xl:w-48 flex-shrink-0">
        <div className="w-8 h-8 xl:w-12 xl:h-12 relative min-w-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
          <Image
            src={
              'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
            }
            // src={tokenImage || '/placeholder.svg'}
            alt={`${tokenSymbol} symbol`}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid gap-0.5">
          <div className="font-bold text-lg truncate">{tokenSymbol}</div>
          <Badge variant="secondary" className="w-fit text-xs">
            {network}
          </Badge>
        </div>
      </div>

      {/* Price & Sold */}
      <div className="flex flex-col items-start w-full sm:w-24 xl:w-32 flex-shrink-0">
        <span className="text-sm text-gray-600">Price</span>
        <span className="font-bold text-primary text-xl">
          $
          {formatNumberShort(price, {
            useShorterExpression: true,
          })}
        </span>
        <span className="text-xs text-gray-500">
          Sold: {formatNumberShort(quantitySold, { useShorterExpression: true })}
        </span>
      </div>

      {/* Payment, Collateral, Settle Time */}
      <div className="grid gap-1 text-sm min-w-24 flex-1 xl:min-w-[150px] lg:w-auto lg:flex-1">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Payment:</span>
          <div className="flex items-center gap-1 font-medium">
            <Image
              src={
                'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
              }
              alt={`${paymentToken} symbol`}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Collateral:</span>
          <span className="font-medium">{`${percentCollateral}%`}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Settle:</span>
          <span className="font-medium">{settleTime}</span>
        </div>
      </div>

      {/* Seller Info */}
      <div className="flex flex-col items-start w-full sm:w-32 xl:w-48 md:flex-1 flex-shrink-0">
        {/* <span className="text-sm text-gray-600">Seller</span> */}
        <div className="flex items-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`/placeholder.svg?height=24&width=24&query=seller+avatar+${sellerName}`}
            />
            <AvatarFallback className="text-xs">{sellerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-semibold text-sm truncate">{sellerName}</div>
            <div className="flex items-center gap-0.5 text-xs text-gray-500">
              <span className="font-semibold">{sellerRating.toFixed(1)}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* View Offer Button */}
      <Link href={`/offers/${offerId}`} className="ml-auto flex-shrink-0 w-full sm:w-auto">
        <Button className="h-9 px-4 text-sm w-full">
          Buy
          <span className="hidden xl:inline"> Now</span>
        </Button>
      </Link>
    </Card>
  );
}
