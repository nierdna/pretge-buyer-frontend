import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface FlashSaleCardProps {
  tokenSymbol: string;
  tokenName: string;
  network: string;
  originalPriceUSD: number;
  salePriceUSD: number;
  discountPercent: number;
  tokenImage: string;
}

export default function FlashSaleCard({
  tokenSymbol,
  tokenName,
  network,
  originalPriceUSD,
  salePriceUSD,
  discountPercent,
  tokenImage,
}: FlashSaleCardProps) {
  return (
    <Card className="relative flex-shrink-0 w-full max-w-[200px] bg-white/95 backdrop-blur-md shadow-lg border-gray-300 hover:shadow-xl transition-shadow">
      {/* Discount Badge - now absolute */}
      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 z-10">
        -{discountPercent}%
      </Badge>

      <CardHeader className="flex flex-col items-start gap-2 p-3 pb-1">
        <div className="flex items-center gap-2 w-full">
          <Image
            src={tokenImage || '/placeholder.svg'}
            alt={`${tokenSymbol} symbol`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div className="grid gap-0.5 flex-grow">
            <CardTitle className="text-base font-bold truncate">{tokenSymbol}</CardTitle>
            <Badge variant="secondary" className="text-xs px-1 py-0.5 w-fit">
              {network}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 grid gap-2 text-xs">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-gray-600 line-through text-xs">
            Original: ${originalPriceUSD.toLocaleString()}
          </span>
          <span className="text-lg font-extrabold text-primary">
            Sale: ${salePriceUSD.toLocaleString()}
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
