import { Card } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const OfferDetailContentSkeleton = () => {
  return (
    <Card className="flex h-fit flex-col gap-8 rounded-3xl px-4 py-6 shadow-lg md:flex-row md:px-8">
      {/* Left Column: Event Details Card (40%) */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 p-4 md:w-[40%]">
        {/* Event details card */}
        <div className="rounded-2xl border border-gray-200">
          {/* Image section */}
          <div className="relative">
            <Skeleton className="h-40 w-full rounded-2xl sm:h-52" />
          </div>

          {/* Content section */}
          <div className="p-4">
            <Skeleton className="mb-2 h-6 w-3/4" /> {/* Title */}
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            <Skeleton className="mt-1 h-4 w-2/3" /> {/* Description line 2 */}
          </div>

          <div className="px-4">
            <Separator />
          </div>

          {/* Stats section */}
          <div className="space-y-2 p-4 text-sm">
            {/* Progress section */}
            <div className="relative flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-8" /> {/* Percentage */}
                <Skeleton className="h-3 w-3" /> {/* Dot */}
                <Skeleton className="h-3 w-20" /> {/* Left text */}
              </div>
              <Skeleton className="h-2 w-full" /> {/* Progress bar */}
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>

            {/* Collateral */}
            <div className="flex items-center justify-between">
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
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="mt-2 text-center">
          <Skeleton className="mx-auto h-8 w-24" />
        </div>
      </div>

      {/* Right Column: Seller Info and Purchase Form (60%) */}
      <div className="mt-6 w-full flex-1 md:mt-0 md:flex md:w-[60%] md:justify-end">
        <div className="flex w-full flex-col gap-6 md:w-[90%]">
          {/* Seller Info Section */}
          <div>
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <Separator className="bg-gray-200" />
          </div>

          {/* Purchase Form */}
          <div>
            {/* Quantity selector */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-line p-2 px-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>

            {/* Price breakdown */}
            <div className="space-y-4 text-sm">
              {/* Order Value */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>

              <Separator />

              {/* Fees */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>

              <Separator />

              {/* Discount Button */}
              <Skeleton className="h-10 w-full rounded-lg" />

              {/* Discount */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
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
