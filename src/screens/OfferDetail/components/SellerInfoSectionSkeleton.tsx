import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SellerInfoSectionSkeleton = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-md h-fit border-none">
      <CardHeader className="p-6">
        <CardTitle className="text-xl">Seller Information</CardTitle>
      </CardHeader>
      <div className="flex items-center gap-4">
        {/* Avatar skeleton */}
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </Card>
  );
};

export default SellerInfoSectionSkeleton;
