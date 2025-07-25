import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { IToken } from '@/types/token';
import { normalizeNetworkName } from '@/utils/helpers/string';
import { Globe, MessageCircle, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TokenInfoSectionProps {
  token: IToken;
}

export default function TokenInfoSection({ token }: TokenInfoSectionProps) {
  console.log(token);
  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        {/* Left side: Token Image, Name, Symbol, Network */}

        <div className="flex items-center gap-12 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 min-w-16 min-h-16 relative">
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="relative">
                  <Image
                    src={token?.logo || '/logo-mb.png'}
                    alt={token?.symbol || 'Token Image'}
                    width={64}
                    height={64}
                    className="rounded-full border border-content"
                  />
                  <Image
                    src={token?.networks?.logo || '/logo-mb.png'}
                    alt={token?.networks?.name || 'Token Image'}
                    width={24}
                    height={24}
                    className="rounded-full absolute bottom-0 right-0 border border-content"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <CardTitle className="text-3xl font-bold">{token?.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <span className="inline-block align-middle">{token?.symbol}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  {normalizeNetworkName(token?.networks?.name)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
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
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Volume</span>
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Settle Time</span>
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
