import OfferCard from '@/components/OfferCard'; // Re-use the existing OfferCard component
import PaginationCustom from '@/components/pagination-custom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IOffer } from '@/types/offer';
import OfferCardSkeleton from './LoadingSkeletonSeller/OfferCardSkeleton';

interface SellerOffersListProps {
  offers: Array<IOffer>; // Use a more specific type if available, e.g., OfferCardProps[]
  pageNumber: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  isLoading: boolean;
}

export default function SellerOffersList({
  offers,
  pageNumber,
  totalPages,
  paginate,
  isLoading,
}: SellerOffersListProps) {
  return (
    <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Offers by this Seller</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <OfferCardSkeleton key={index} />
            ))}
          </div>
        )}
        {!isLoading && offers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <OfferCard key={index} offer={offer} />
            ))}
          </div>
        )}
        {!isLoading && offers.length === 0 && (
          <p className="py-4 text-center text-content">
            This seller currently has no active offers.
          </p>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="justify-center p-6 pt-0">
          <PaginationCustom pageNumber={pageNumber} totalPages={totalPages} paginate={paginate} />
        </CardFooter>
      )}
    </Card>
  );
}
