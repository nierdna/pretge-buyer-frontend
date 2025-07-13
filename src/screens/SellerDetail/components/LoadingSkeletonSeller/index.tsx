import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import OfferCardSkeleton from './OfferCardSkeleton';
import ReviewItemSkeleton from './ReviewItemSkeleton';

export default function SellerDetailPageSkeleton() {
  return (
    <div className="grid gap-8">
      {/* Seller Detail Hero Skeleton */}
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-3xl font-bold">
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full flex-shrink-0" />
            <div className="grid gap-2 text-center sm:text-left">
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </div>
          </div>
          <Skeleton className="h-[1px] w-full bg-gray-200" />
          <div className="grid gap-2 text-base text-gray-700">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
          <Skeleton className="h-10 w-full sm:w-auto mt-4" />
        </CardContent>
      </Card>

      {/* Offers List and Reviews Tabs Skeleton */}
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 p-6">
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </TabsList>
          <TabsContent value="offers" className="mt-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-[180px]" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <OfferCardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl">
                <Skeleton className="h-6 w-[180px]" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-0 grid gap-6">
              {[...Array(3)].map((_, i) => (
                <ReviewItemSkeleton key={i} />
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
