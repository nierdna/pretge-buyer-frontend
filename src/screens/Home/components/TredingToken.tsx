import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IToken } from '@/types/token';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TrendingTokenSkeleton from './TrendingTokenSkeleton';

export default function TrendingTokenSection({
  trendingTokens,
  isLoading,
}: {
  trendingTokens: IToken[];
  isLoading: boolean;
}) {
  // Filter offers that have a 'status' property (e.g., "hot" or "new") to display in trending

  const renderBadge = (token: IToken) => {
    if (token.isHot) {
      return (
        <Badge className="absolute -right-3.5 -top-2 z-10 bg-red-500 px-2 py-0.5 text-2xs font-bold text-primary">
          HOT
        </Badge>
      );
    }
    if (token.isNew) {
      return (
        <Badge className="absolute -right-3.5 -top-2 z-10 bg-blue-500 px-2 py-0.5 text-2xs font-bold text-primary">
          NEW
        </Badge>
      );
    }
    return null;
  };
  if (isLoading) {
    return <TrendingTokenSkeleton />;
  }
  return (
    <section className="">
      <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {trendingTokens.map(
              (
                token,
                index // Use trendingTokens here
              ) => (
                <Link
                  key={index}
                  href={`/token/${token?.symbol?.toLowerCase()}`} // Link to token detail page
                  className="relative flex h-full min-w-[120px] flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white/80 p-3 pt-6 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-100"
                >
                  <div className="relative">
                    {renderBadge(token)}
                    <div className="relative h-12 w-12 min-w-12 flex-shrink-0 rounded-full bg-gray-300">
                      <Image
                        src={
                          token?.logo ||
                          'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                        }
                        alt={`${token?.symbol} symbol`}
                        fill
                        className="rounded-full object-cover"
                      />
                      <Image
                        src={token?.networks?.logo}
                        alt={`${token?.symbol} symbol`}
                        width={16}
                        height={16}
                        className="absolute -bottom-0 -right-0 z-10 min-h-4 min-w-4 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{token?.symbol}</span>
                </Link>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
