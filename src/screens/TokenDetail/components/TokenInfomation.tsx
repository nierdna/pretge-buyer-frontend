import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DESCRIPTION_TOKEN } from '@/constants/description-token';
import { IToken } from '@/types/token';
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
      <CardContent className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-end">
        {/* Left side: Token Image, Name, Symbol, Network */}

        <div className="flex w-full flex-1 items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="relative h-16 min-h-16 w-16 min-w-16">
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
                    className="absolute bottom-0 right-0 rounded-full border border-content"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                {token?.name}
                <Badge variant="outline">
                  <span className="inline-block align-middle">{token?.symbol}</span>
                </Badge>
              </CardTitle>
              <div className="flex w-full items-center gap-2 break-words">
                {DESCRIPTION_TOKEN[token?.symbol || ''] && (
                  <p className="w-full break-words text-sm text-content">
                    {DESCRIPTION_TOKEN[token?.symbol || '']}
                  </p>
                )}
                {/* <Badge variant="outline">
                  <span className="inline-block align-middle">{token?.symbol}</span>
                </Badge> */}
                {/* <Badge variant="outline" className="flex items-center">
                  {normalizeNetworkName(token?.networks?.name)}
                </Badge> */}
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
            <span className="text-xs text-content">24h Volume</span>
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-content">Total Volume</span>
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-content">Settle Time</span>
            <span className="text-lg font-bold text-primary">N/A</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
