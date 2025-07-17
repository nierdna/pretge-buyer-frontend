import { IOrder } from '@/types/order';
import { ISeller } from '@/types/user';
import axiosInstance from './axios';

interface SellerResponse {
  data: ISeller;
  message?: string;
  success: boolean;
}

interface FilledOrdersResponse {
  data: {
    data: IOrder[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

export class UserService {
  async getSellerById(id: string): Promise<SellerResponse> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  }

  async getReviewsBySellerId(id: string, params?: { page?: number; limit?: number }) {
    const response = await axiosInstance.get(`/users/${id}/reviews`, { params });
    return response.data;
  }

  async getFilledOrders(
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<FilledOrdersResponse> {
    const response = await axiosInstance.get(`/users/${id}/orders`, { params });
    return response.data;
  }
}
