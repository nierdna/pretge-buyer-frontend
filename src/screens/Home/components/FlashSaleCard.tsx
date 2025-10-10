import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IOffer } from '@/types/offer';
import { normalizeNetworkName } from '@/utils/helpers/string';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface FlashSaleCardProps {
  offer: IOffer;
}

export default function FlashSaleCard({ offer }: FlashSaleCardProps) {
  return (
    <Card className="relative flex w-full max-w-[calc(90%)] flex-shrink-0 flex-col border-border bg-white/95 shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl">
      {/* Discount Badge - now absolute */}
      <Badge className="absolute right-2 top-2 z-10 bg-orange-500 px-2 py-0.5 text-xs font-bold text-primary hover:bg-orange-600">
        -{offer.promotion?.discountPercent}%
      </Badge>

      <CardHeader className="flex flex-grow flex-col items-start gap-2 p-3 pb-1">
        <div className="flex w-full items-center gap-2">
          <div className="relative h-8 min-h-8 w-8 min-w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
            <Image
              src={offer.tokens?.logo || '/placeholder.svg'}
              alt={`${offer.tokens?.symbol} symbol`}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="grid flex-grow gap-0.5">
            <CardTitle className="w-4/5 truncate text-base font-bold">{offer.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-1">
              <Badge className="w-fit bg-gray-200 px-1 py-0.5 text-xs">
                {offer.tokens?.symbol}
              </Badge>
              <Badge className="w-fit bg-gray-200 px-1 py-0.5 text-xs">
                {normalizeNetworkName(offer.exToken?.network?.name)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-3 text-xs">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm text-gray-600 line-through">
            Original: ${offer.price.toLocaleString()}
          </span>
          <span className="text-2xl font-extrabold text-orange-500">
            Sale: $
            {(offer.price * (1 - Number(offer.promotion?.discountPercent || 0) / 100)).toFixed(2)}
          </span>
        </div>
        <Button className="mt-1 h-8 w-full text-sm">
          View Deal
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
