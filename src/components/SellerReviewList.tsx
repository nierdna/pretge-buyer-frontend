import { useSellerReviews } from '@/queries/useSellerQueries';
import { useState } from 'react';

interface SellerReviewListProps {
  sellerId: string;
}

export default function SellerReviewList({ sellerId }: SellerReviewListProps) {
  const [sortBy, setSortBy] = useState('newest');

  const { data, isLoading, isError } = useSellerReviews(sellerId);
  const reviews = data?.data || [];

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-opensea-blue"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
        <p>Error loading reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Reviews</h2>
        <div className="flex items-center">
          <label htmlFor="review-sort" className="text-sm text-opensea-lightGray mr-2">
            Sort by:
          </label>
          <select
            id="review-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-sm text-white"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {sortedReviews.length > 0 ? (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-opensea-darkBorder p-6 rounded-lg shadow-md border border-opensea-darkBorder"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{review.userName}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-opensea-lightGray">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-opensea-lightGray">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-opensea-darkBorder rounded-lg border border-opensea-darkBorder">
          <p className="text-opensea-lightGray">This seller has no reviews yet.</p>
        </div>
      )}
    </div>
  );
}
