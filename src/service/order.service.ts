import type { Order } from '@/types/order';
import axiosInstance from './axios';

interface OrderResponse {
  data: Order;
  message?: string;
}

interface OrdersResponse {
  data: Order[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

// Mock order data for pre-market trading

export class OrderService {
  async reviewOrder(orderId: string, rating: number, comment?: string) {
    const response = await axiosInstance.post(
      '/review',
      {
        order_id: orderId,
        rating: rating,
        comment: comment,
      },
      {
        headers: {
          Authorization: true,
        },
      }
    );
    return response.data;
  }
  async purchaseOrder(orderId: string, walletId: string) {
    const response = await axiosInstance.put(`/orders`, {
      order_id: orderId,
      wallet_id: walletId,
    });
    return response.data;
  }
}
