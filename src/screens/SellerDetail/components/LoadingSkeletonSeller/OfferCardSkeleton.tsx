import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OfferCardSkeleton() {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 flex flex-col">
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
            <Skeleton className="h-4 w-[70px] mt-1" />
          </div>
        </div>
      </CardHeader>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm flex-grow">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-neutral-800/5 p-3 rounded-md border border-gray-200 shadow-md"
          >
            <Skeleton className="h-3 w-[60px] mb-1" />
            <Skeleton className="h-5 w-[80px]" />
          </div>
        ))}
      </CardContent>
      <div className="mx-6 h-[1px] bg-gray-200" /> {/* Separator skeleton */}
      <CardFooter className="p-6 flex flex-col items-start gap-4 pt-4">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="grid gap-0.5 flex-grow min-w-0">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[40px] ml-auto" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
