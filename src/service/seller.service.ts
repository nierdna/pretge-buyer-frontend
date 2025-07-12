import { ISeller } from '@/types/user';
import axiosInstance from './axios';

interface SellerResponse {
  data: ISeller;
  message?: string;
  success: boolean;
}

export class SellerService {
  async getSellerById(id: string): Promise<SellerResponse> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  }

  async getSellerReviews(
    sellerId: string,
    params?: { page?: number; limit?: number; sortBy?: string }
  ) {
    // Mock reviews for the seller
    const reviews = [
      {
        id: 'rev1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent service and fast shipping!',
        createdAt: '2023-10-15T14:30:00Z',
      },
      {
        id: 'rev2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Good products but shipping was a bit slow.',
        createdAt: '2023-09-22T11:15:00Z',
      },
      {
        id: 'rev3',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Great customer service and high-quality items!',
        createdAt: '2023-11-05T09:45:00Z',
      },
    ];

    return { data: reviews };
  }
}
