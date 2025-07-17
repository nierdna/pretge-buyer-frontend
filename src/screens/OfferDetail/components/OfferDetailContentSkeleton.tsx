import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const OfferDetailContentSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
      {/* Left Column: Product Images and Social Share */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        {/* Main Product Image */}
        <AspectRatio
          ratio={1 / 1}
          className="rounded-xl overflow-hidden border border-gray-200 w-full h-auto"
        >
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </div>

      {/* Right Column: Offer Details */}
      <div className="sm:col-span-2">
        <Card className="bg-white/95 backdrop-blur-md shadow-lg border-gray-300">
          <CardHeader className="p-6 pb-4">
            {/* Top Section: Token Identity, Rating */}
            <div className="flex flex-col items-start gap-4 flex-shrink-0">
              <Skeleton className="h-6 w-20" /> {/* Hot Deals Badge */}
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-8 w-3/4" /> {/* Title */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-24" /> {/* Token Symbol Badge */}
                  <Skeleton className="h-6 w-24" /> {/* Network Badge */}
                </div>
              </div>
              <Skeleton className="h-4 w-full" /> {/* Description */}
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardHeader>

          <CardContent className="p-6 grid gap-6 pt-0">
            {/* Price Section */}
            <div className="bg-orange-500/20 p-4 rounded-md">
              <Skeleton className="h-8 w-1/3" />
            </div>

            {/* Key Offer Details */}
            <div className="grid gap-4 text-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Quantity Selector and Estimated Cost */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32" /> {/* Quantity Input */}
              <Skeleton className="h-4 w-40" /> {/* Estimated Cost */}
            </div>

            {/* Promotion Section */}
            <Skeleton className="h-16 w-full rounded-md" />

            <Separator className="bg-gray-200" />

            {/* Action Button */}
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferDetailContentSkeleton;
