import Separator from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewItemSkeleton() {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="grid gap-0.5">
          <Skeleton className="h-4" />
          <Skeleton className="h-3" />
        </div>
        <Skeleton className="ml-auto h-3" />
      </div>
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Separator className="bg-gray-100" />
    </div>
  );
}
