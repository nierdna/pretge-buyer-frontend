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
        <Badge className="bg-red-500 absolute -top-2 -right-3.5 text-2xs font-semibold px-2 py-0.5 z-10 text-white">
          HOT
        </Badge>
      );
    }
    if (token.isNew) {
      return (
        <Badge className="bg-blue-500 absolute -top-2 -right-3.5 text-2xs font-semibold px-2 py-0.5 z-10 text-white">
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
    <section className="py-4 md:py-6">
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {trendingTokens.map(
              (
                token,
                index // Use trendingTokens here
              ) => (
                <Link
                  key={index}
                  href={`/token/${token?.symbol?.toLowerCase()}`} // Link to token detail page
                  className="relative flex-shrink-0 flex flex-col gap-2 items-center justify-center p-3 pt-6 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px] h-full"
                >
                  <div className="relative">
                    {renderBadge(token)}
                    <div className="w-12 h-12 relative min-w-12 rounded-full bg-gray-300 flex-shrink-0">
                      <Image
                        src={
                          token?.logo ||
                          'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                        }
                        alt={`${token?.symbol} symbol`}
                        fill
                        className="object-cover rounded-full"
                      />
                      <Image
                        src={token?.networks?.logo}
                        alt={`${token?.symbol} symbol`}
                        width={16}
                        height={16}
                        className="object-cover z-10 absolute -bottom-0 -right-0 min-w-4 min-h-4 rounded-full"
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
