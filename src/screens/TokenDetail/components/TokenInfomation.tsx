import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DESCRIPTION_TOKEN } from '@/constants/description-token';
import { IToken } from '@/types/token';
import { ITokenProjectExternal } from '@/types/tokenProject';
import { Globe, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';

interface TokenInfoSectionProps {
  token?: IToken;
  tokenExternal: ITokenProjectExternal;
}

export default function TokenInfoSection({ token, tokenExternal }: TokenInfoSectionProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-end">
        {/* Left side: Token Image, Name, Symbol, Network */}

        <div className="flex w-full flex-1 items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="relative h-16 min-h-16 w-16 min-w-16">
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="relative min-h-16 min-w-16">
                  <Image
                    src={token?.logo || '/logo-mb.png'}
                    alt={token?.symbol || 'Token Image'}
                    width={64}
                    height={64}
                    className="rounded-full border border-content object-cover"
                  />
                  <Image
                    src={token?.networks?.logo || '/logo-mb.png'}
                    alt={token?.networks?.name || 'Token Image'}
                    width={24}
                    height={24}
                    className="absolute bottom-0 right-0 min-h-6 min-w-6 rounded-full border border-content object-cover"
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
              {DESCRIPTION_TOKEN[token?.symbol || ''] && (
                <div className="flex w-full items-center gap-2 break-words">
                  <p className="w-full break-words text-sm text-content">
                    {DESCRIPTION_TOKEN[token?.symbol || '']}
                  </p>
                  {/* <Badge variant="outline">
                  <span className="inline-block align-middle">{token?.symbol}</span>
                  </Badge> */}
                  {/* <Badge variant="outline" className="flex items-center">
                  {normalizeNetworkName(token?.networks?.name)}
                  </Badge> */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          {tokenExternal?.data?.web3Project?.website && (
            <Link
              href={tokenExternal.data.web3Project.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <Globe className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {tokenExternal?.data?.socials?.telegram && (
            <Link
              href={tokenExternal.data.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {tokenExternal?.data?.socials?.twitter && (
            <Link
              href={tokenExternal.data.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>social_x_line</title>
                  <g id="social_x_line" fill="none" fillRule="evenodd">
                    <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582 5.39-6.16ZM16.5 19 6 5h1.5L18 19z"
                    />
                  </g>
                </svg>
              </Button>
            </Link>
          )}

          {tokenExternal?.data?.socials?.discord && (
            <Link
              href={tokenExternal.data.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                <FaDiscord className="h-4 w-4" />
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
