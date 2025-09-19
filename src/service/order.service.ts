import axios from 'axios';
import axiosInstance from './axios';

// Interface for latest orders API response
interface LatestOrderUser {
  id: string;
  wallet_id: string;
  address: string;
}

interface LatestOrderOffer {
  id: string;
  price: string;
  quantity: string;
  filled: string;
  status: string;
  title: string;
  userId: string;
}

export interface LatestOrder {
  id: string;
  offer_id: string;
  buyer_wallet_id: string;
  amount: string;
  status: string;
  hash_id: string;
  created_at: string;
  offer: LatestOrderOffer;
  buyer: LatestOrderUser;
  seller: LatestOrderUser;
}

interface LatestOrdersResponse {
  success: boolean;
  data: LatestOrder[];
  count: number;
  message: string;
}

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

  async getLatestOrders(limit: number = 10): Promise<LatestOrdersResponse> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT_NOTI_URL}/market/latest-orders?limit=${limit}`,
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    console.log('response', response.data);

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
