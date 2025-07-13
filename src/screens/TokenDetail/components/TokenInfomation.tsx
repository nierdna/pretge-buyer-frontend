import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { IToken } from '@/types/token';
import Image from 'next/image';

interface TokenInfoSectionProps {
  token: IToken;
}

export default function TokenInfoSection({ token }: TokenInfoSectionProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg border-gray-300">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side: Token Image, Name, Symbol, Network */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Image
            src={token?.logo || '/placeholder.svg'}
            alt={`${token?.symbol} symbol`}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div className="grid gap-1">
            <CardTitle className="text-3xl font-bold">{token?.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{token?.symbol}</Badge>
              <Badge variant="outline">{token?.network?.name}</Badge>
            </div>
          </div>
        </div>

        {/* Right side: Stats (24h Volume, Total Volume, Settle Time) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm md:ml-auto w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">24h Volume</span>
            <span className="text-lg font-semibold text-primary">
              {/* ${volume24h.toLocaleString()} */}
              N/A
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Volume</span>
            <span className="text-lg font-semibold text-primary">
              {/* ${totalVolume.toLocaleString()} */}
              N/A
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Settle Time</span>
            <span className="text-lg font-semibold text-primary">
              {/* {settleTime} */}
              N/A
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
