import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { IToken } from '@/types/token';
import { formatNumberShort } from '@/utils/helpers/number';
import { normalizeNetworkName } from '@/utils/helpers/string';
import { Globe, MessageCircle, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TokenInfoSectionProps {
  token: IToken;
}

export default function TokenInfoSection({ token }: TokenInfoSectionProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg border-gray-300">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side: Token Image, Name, Symbol, Network */}

        <div className="flex items-center gap-12 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 min-w-16 min-h-16 relative rounded-full overflow-hidden">
              <Image
                src={token?.logo || '/placeholder.svg'}
                alt={`${token?.symbol} symbol`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="grid gap-1">
              <CardTitle className="text-3xl font-bold">{token?.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{token?.symbol}</Badge>
                <Badge variant="secondary">{normalizeNetworkName(token?.networks?.name)}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-3xl font-bold text-green-500">
            <div className="text-xs text-gray-500"> Price</div>$
            {formatNumberShort(token?.price || 0, {
              useShorterExpression: true,
            })}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2 mt-2">
          {token?.websiteUrl && (
            <Link href={token.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <Globe className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {token?.twitterUrl && (
            <Link href={token.twitterUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <Twitter className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {token?.telegramUrl && (
            <Link href={token.telegramUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Right side: Stats (24h Volume, Total Volume, Settle Time) */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm md:ml-auto w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">24h Volume</span>
            <span className="text-lg font-semibold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Volume</span>
            <span className="text-lg font-semibold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Settle Time</span>
            <span className="text-lg font-semibold text-primary">N/A</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
