import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function TrendingTokenSkeleton() {
  return (
    <section className="">
      <Card className="border-border bg-white/95 shadow-2xl backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="relative flex h-full min-w-[120px] flex-shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-white/80 p-3 pt-6 shadow-sm backdrop-blur-sm"
              >
                <div className="relative">
                  <div className="relative h-12 w-12 min-w-12 animate-pulse rounded-full bg-gray-200" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
