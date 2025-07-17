'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetOffersByUserId, useGetReviewsBySellerId, useGetSellerById } from '@/queries';
import SellerDetailPageSkeleton from './components/LoadingSkeletonSeller';
import SellerDetailHero from './components/SellerDetailHero';
import SellerOffersList from './components/SellerOffersList';
import SellerReviews from './components/SellerReviews';

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
    refetchOffers,
  } = useGetOffersByUserId(sellerId);

  const offersData = offers?.pages.flatMap((page) => page.data) || [];
  const paginationOffers = offers?.pages[0]?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  };

  const paginateOffers = (pageNumber: number) => {
    if (pageNumber < 1) {
      setFilters({ ...filters, page: 1 });
    } else if (pageNumber > paginationOffers.totalPages) {
      setFilters({ ...filters, page: paginationOffers.totalPages });
    } else {
      setFilters({ ...filters, page: pageNumber });
    }
  };

  const {
    data: reviews,
    setFilters: setReviewsFilters,
    filters: reviewsFilters,
    isLoading: isReviewsLoading,
    refetchReviews,
  } = useGetReviewsBySellerId(sellerId);

  const reviewsData = reviews?.pages.flatMap((page) => page?.data) || [];
  const paginationReviews = reviews?.pages[0]?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const paginateReviews = (pageNumber: number) => {
    if (pageNumber < 1) {
      setReviewsFilters({ ...reviewsFilters, page: 1 });
    } else if (pageNumber > paginationReviews.totalPages) {
      setReviewsFilters({ ...reviewsFilters, page: paginationReviews.totalPages });
    } else {
      setReviewsFilters({ ...reviewsFilters, page: pageNumber });
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
            <TabsTrigger value="offers" onClick={() => refetchOffers()}>
              Offers
            </TabsTrigger>
            <TabsTrigger value="reviews" onClick={() => refetchReviews()}>
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="offers" className="mt-6">
            <SellerOffersList
              offers={offersData}
              pageNumber={paginationOffers.page}
              totalPages={paginationOffers.totalPages}
              paginate={paginateOffers}
              isLoading={isOffersLoading}
            />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <SellerReviews
              reviews={reviewsData}
              pageNumber={paginationReviews.page}
              totalPages={paginationReviews.totalPages}
              paginate={paginateReviews}
              isLoading={isReviewsLoading}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
