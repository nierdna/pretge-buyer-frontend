'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
    <section className="flex-1 sm:px-4">
      <Breadcrumb className="flex items-center gap-2 text-sm mb-6 px-4 font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" />
        {/* <BreadcrumbItem>Token Detail</BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center" /> */}
        <BreadcrumbItem>{seller?.name}</BreadcrumbItem>
      </Breadcrumb>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: Seller Information */}
          <SellerDetailHero seller={seller} />

          <SellerReviews
            reviews={reviewsData}
            pageNumber={paginationReviews.page}
            totalPages={paginationReviews.totalPages}
            paginate={paginateReviews}
            isLoading={isReviewsLoading}
          />
        </div>

        <SellerOffersList
          offers={offersData}
          pageNumber={paginationOffers.page}
          totalPages={paginationOffers.totalPages}
          paginate={paginateOffers}
          isLoading={isOffersLoading}
        />
      </div>
    </section>
  );
}
