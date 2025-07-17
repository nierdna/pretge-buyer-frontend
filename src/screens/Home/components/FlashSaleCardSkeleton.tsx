import { Skeleton } from '@/components/ui/skeleton';

export default function FlashSaleCardSkeleton() {
  return (
    <div className="w-full p-4 space-y-4 bg-white/95 backdrop-blur-md shadow-2xl border border-gray-300">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <Skeleton className="h-9 w-full" />
    </div>
  );
}
