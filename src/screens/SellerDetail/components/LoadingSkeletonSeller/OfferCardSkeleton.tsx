import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OfferCardSkeleton() {
  return (
    <Card className="flex flex-col border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="grid gap-1">
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="mt-1 h-4 w-[70px]" />
          </div>
        </div>
      </CardHeader>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardContent className="grid flex-grow grid-cols-2 gap-4 p-6 text-sm">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-md border border-gray-200 bg-neutral-800/5 p-3 shadow-md"
          >
            <Skeleton className="mb-1 h-3 w-[60px]" />
            <Skeleton className="h-5 w-[80px]" />
          </div>
        ))}
      </CardContent>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardFooter className="flex flex-col items-start gap-4 px-6">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="grid min-w-0 flex-grow gap-0.5">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
