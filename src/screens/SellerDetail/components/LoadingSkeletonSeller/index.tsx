import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SellerDetailPageSkeleton() {
  return (
    <section className="flex-1 sm:px-4">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2 px-4 text-sm font-medium">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid gap-4">
        {/* 2-column grid layout matching the actual layout */}
        <div>
          {/* Column 1: Seller Detail Hero Skeleton */}
          <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <Skeleton className="h-24 w-24 flex-shrink-0 rounded-full" />
                <div className="grid gap-2 text-center sm:text-left">
                  <Skeleton className="h-8 w-[180px]" />
                  <div className="flex items-center justify-center gap-1 sm:justify-start">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="mt-2 h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-[1px] w-full bg-gray-200" />
              <div className="grid gap-2 text-base text-gray-700">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
              <Skeleton className="mt-4 h-10 w-full sm:w-auto" />
            </CardContent>
          </Card>

          {/* Column 2: Seller Reviews Skeleton */}
        </div>

        {/* Full width: Seller Offers List Skeleton */}
        <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-lg border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md"
                >
                  <div className="p-6 pb-4">
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
                  </div>
                  <Skeleton className="mx-6 h-[1px] bg-gray-200" />
                  <div className="grid flex-grow grid-cols-2 gap-4 p-6 text-sm">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col rounded-md border border-gray-200 bg-neutral-800/5 p-3 shadow-md"
                      >
                        <Skeleton className="mb-1 h-3 w-[60px]" />
                        <Skeleton className="h-5 w-[80px]" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="mx-6 h-[1px] bg-gray-200" />
                  <div className="flex flex-col items-start gap-4 px-6 py-4">
                    <div className="flex w-full items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="grid min-w-0 flex-grow gap-0.5">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review items skeleton */}
        <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 pt-0">
            {/* Review items skeleton */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid gap-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grid gap-0.5">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4" />
                      ))}
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                {index < 2 && <Skeleton className="h-[1px] w-full bg-gray-100" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
