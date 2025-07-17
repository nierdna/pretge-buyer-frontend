import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const SellerInfoSectionSkeleton = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 h-fit">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <Skeleton className="h-16 w-16 rounded-full" />

          <div className="grid gap-1">
            {/* Name skeleton */}
            <Skeleton className="h-7 w-32" />
            {/* Address skeleton */}
            <Skeleton className="h-4 w-24" />
            {/* Rating skeleton */}
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <Separator className="bg-gray-200" />

        <div className="grid gap-2">
          {/* Description skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          {/* Member since skeleton */}
          <Skeleton className="h-4 w-40 mt-2" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full mt-2" />
      </CardContent>
    </Card>
  );
};

export default SellerInfoSectionSkeleton;
