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
    <Card className="relative flex-col flex flex-shrink-0 w-full max-w-[calc(90%)] bg-white/95 backdrop-blur-md shadow-lg border-gray-300 hover:shadow-xl transition-shadow">
      {/* Discount Badge - now absolute */}
      <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 z-10 hover:bg-orange-600">
        -{offer.promotion?.discountPercent}%
      </Badge>

      <CardHeader className="flex flex-col items-start gap-2 p-3 pb-1 flex-grow">
        <div className="flex items-center gap-2 w-full ">
          <div className="w-8 h-8 relative min-w-8 min-h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={offer.tokens?.logo || '/placeholder.svg'}
              alt={`${offer.tokens?.symbol} symbol`}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="grid gap-0.5 flex-grow">
            <CardTitle className="text-base font-bold truncate w-4/5">{offer.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-1">
              <Badge className="text-xs px-1 py-0.5 w-fit bg-gray-200">
                {offer.tokens?.symbol}
              </Badge>
              <Badge className="text-xs px-1 py-0.5 w-fit bg-gray-200">
                {normalizeNetworkName(offer.exToken?.network?.name)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 grid gap-2 text-xs">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-gray-600 line-through text-sm">
            Original: ${offer.price.toLocaleString()}
          </span>
          <span className="text-2xl font-extrabold text-orange-500">
            Sale: $
            {(offer.price * (1 - Number(offer.promotion?.discountPercent || 0) / 100)).toFixed(2)}
          </span>
        </div>
        <Button className="w-full mt-1 h-8 text-sm">
          View Deal
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
