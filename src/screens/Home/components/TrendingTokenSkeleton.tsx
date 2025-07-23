import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function TrendingTokenSkeleton() {
  return (
    <section className="">
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 flex flex-col gap-2 items-center justify-center p-3 pt-6 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm min-w-[120px] h-full"
              >
                <div className="relative">
                  <div className="w-12 h-12 relative min-w-12 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
