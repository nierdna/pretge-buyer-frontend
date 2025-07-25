import { Card } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const OfferDetailContentSkeleton = () => {
  return (
    <Card className="h-fit rounded-3xl shadow-lg flex flex-col md:flex-row gap-8 py-6 px-4 md:px-8">
      {/* Left Column: Event Details Card (40%) */}
      <div className="w-full md:w-[40%] flex flex-col gap-4 rounded-2xl border border-gray-200 p-4">
        {/* Event details card */}
        <div className="rounded-2xl border border-gray-200">
          {/* Image section */}
          <div className="relative">
            <Skeleton className="w-full h-40 sm:h-52 rounded-2xl" />
          </div>

          {/* Content section */}
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-2/3 mt-1" /> {/* Description line 2 */}
          </div>

          <div className="px-4">
            <Separator />
          </div>

          {/* Stats section */}
          <div className="space-y-2 text-sm p-4">
            {/* Progress section */}
            <div className="flex flex-col gap-1 flex-1 relative">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-8" /> {/* Percentage */}
                <Skeleton className="h-3 w-3" /> {/* Dot */}
                <Skeleton className="h-3 w-20" /> {/* Left text */}
              </div>
              <Skeleton className="h-2 w-full" /> {/* Progress bar */}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>

            {/* Collateral */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>

            {/* Settle Duration */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="text-center mt-2">
          <Skeleton className="h-8 w-24 mx-auto" />
        </div>
      </div>

      {/* Right Column: Seller Info and Purchase Form (60%) */}
      <div className="flex-1 w-full md:w-[60%] md:flex md:justify-end mt-6 md:mt-0">
        <div className="flex flex-col gap-6 w-full md:w-[90%]">
          {/* Seller Info Section */}
          <div>
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <Separator className="bg-gray-200" />
          </div>

          {/* Purchase Form */}
          <div>
            {/* Quantity selector */}
            <div className="p-2 px-3 border border-line rounded-xl mb-4 flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>

            {/* Price breakdown */}
            <div className="space-y-4 text-sm">
              {/* Order Value */}
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-1 flex-wrap">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>

              <Separator />

              {/* Fees */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>

              <Separator />

              {/* Discount Button */}
              <Skeleton className="h-10 w-full rounded-lg" />

              {/* Discount */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            {/* Checkout button */}
            <div className="mt-6">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailContentSkeleton;
