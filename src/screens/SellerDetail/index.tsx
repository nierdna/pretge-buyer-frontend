'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetOffersByUserId, useGetSellerById } from '@/queries';
import SellerDetailPageSkeleton from './components/LoadingSkeletonSeller';
import SellerOffersList from './components/LoadingSkeletonSeller/SellerOffersList';
import SellerDetailHero from './components/SellerDetailHero';

interface SellerDetailScreenProps {
  sellerId: string;
}

export default function SellerDetailScreen({ sellerId }: SellerDetailScreenProps) {
  const { data: seller, isLoading } = useGetSellerById(sellerId);
  const {
    data: offers,
    setFilters,
    filters,
    isLoading: isOffersLoading,
  } = useGetOffersByUserId(sellerId);
  const offersData = offers?.pages.flatMap((page) => page.data) || [];
  const pagination = offers?.pages[0]?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      setFilters({ ...filters, page: 1 });
    } else if (pageNumber > pagination.totalPages) {
      setFilters({ ...filters, page: pagination.totalPages });
    } else {
      setFilters({ ...filters, page: pageNumber });
    }
  };

  if (isLoading) {
    return <SellerDetailPageSkeleton />;
  }

  return (
    <div className="grid gap-8">
      {/* Section 1: Seller Information */}
      <SellerDetailHero seller={seller} />

      {/* Section 2 & 3: Offers List and Reviews in Tabs */}
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 p-6">
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="offers" className="mt-6">
            <SellerOffersList
              offers={offersData}
              pageNumber={pagination.page}
              totalPages={pagination.totalPages}
              paginate={paginate}
              isLoading={isOffersLoading}
            />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {/* <SellerReviews reviews={seller.reviews} /> */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
