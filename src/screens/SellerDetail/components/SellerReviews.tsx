import PaginationCustom from '@/components/pagination-custom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { SellerReview } from '@/types/seller';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import dayjs from 'dayjs';
import { Star } from 'lucide-react';
import ReviewItemSkeleton from './LoadingSkeletonSeller/ReviewItemSkeleton';

interface SellerReviewsProps {
  reviews: SellerReview[];
  pageNumber: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  isLoading: boolean;
}

export default function SellerReviews({
  reviews,
  pageNumber,
  totalPages,
  paginate,
  isLoading,
}: SellerReviewsProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 grid gap-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ReviewItemSkeleton key={index} />
            ))}
          </div>
        )}
        {!isLoading &&
          reviews.length > 0 &&
          reviews.map((review) => (
            <div key={review.id} className="grid gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={review.buyer?.avatar || getFallbackAvatar(review?.buyer_wallet)}
                  />
                </Avatar>
                <div className="grid gap-0.5">
                  <div className="font-semibold">{review.buyer?.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-500">
                  {dayjs(review.createdAt).fromNow()}
                </span>
              </div>
              <p className="text-gray-700 text-base">{review.comment}</p>
              {review.reply && (
                <div className="text-gray-700 text-sm">
                  <span className="font-semibold">Seller Reply:</span> {review.reply}
                </div>
              )}
              <Separator className="bg-gray-100 last:hidden" />
            </div>
          ))}
        {!isLoading && reviews.length === 0 && (
          <p className="text-center text-gray-500 py-4">No reviews yet for this seller.</p>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="p-6 pt-0 justify-center">
          <PaginationCustom pageNumber={pageNumber} totalPages={totalPages} paginate={paginate} />
        </CardFooter>
      )}
    </Card>
  );
}
