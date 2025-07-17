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
const mockOrders: Order[] = [
  {
    id: 'order1',
    userId: 'user1',
    orderNumber: 'ORD-2024-001',
    items: [
      {
        id: 'item1',
        offerId: '1',
        offerName: 'Bitcoin Token',
        sku: 'BTC-001',
        price: 0.85,
        quantity: 1000,
        subtotal: 850,
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000',
      },
      {
        id: 'item2',
        offerId: '2',
        offerName: 'Ethereum Token',
        sku: 'ETH-002',
        price: 0.65,
        quantity: 500,
        subtotal: 325,
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
      },
    ],
    subtotal: 1175,
    tax: 94,
    discount: 0,
    shipping: {
      method: 'Digital Delivery',
      carrier: 'Blockchain',
      trackingNumber: '0x1234567890abcdef1234567890abcdef12345678',
      cost: 0,
    },
    total: 1269,
    status: 'delivered',
    payment: {
      id: 'pay1',
      method: 'crypto',
      status: 'completed',
      transactionId: '0xabcdef1234567890abcdef1234567890abcdef12',
      amount: 1269,
      currency: 'USD',
      createdAt: '2024-01-10T14:30:00Z',
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T09:45:00Z',
    completedAt: '2024-01-12T09:45:00Z',
  },
  {
    id: 'order2',
    userId: 'user1',
    orderNumber: 'ORD-2024-002',
    items: [
      {
        id: 'item3',
        offerId: '3',
        offerName: 'Solana Token',
        sku: 'SOL-003',
        price: 0.45,
        quantity: 2000,
        subtotal: 900,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
      },
    ],
    subtotal: 900,
    tax: 72,
    discount: 0,
    shipping: {
      method: 'Digital Delivery',
      carrier: 'Blockchain',
      trackingNumber: '0x9876543210fedcba9876543210fedcba98765432',
      cost: 0,
    },
    total: 972,
    status: 'shipped',
    payment: {
      id: 'pay2',
      method: 'crypto',
      status: 'completed',
      transactionId: '0xfedcba9876543210fedcba9876543210fedcba98',
      amount: 972,
      currency: 'USD',
      createdAt: '2024-01-15T16:20:00Z',
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    createdAt: '2024-01-15T16:20:00Z',
    updatedAt: '2024-01-16T10:30:00Z',
  },
  {
    id: 'order3',
    userId: 'user1',
    orderNumber: 'ORD-2024-003',
    items: [
      {
        id: 'item4',
        offerId: '5',
        offerName: 'Polkadot Token',
        sku: 'DOT-005',
        price: 0.55,
        quantity: 1000,
        subtotal: 550,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
      },
      {
        id: 'item5',
        offerId: '7',
        offerName: 'Uniswap Token',
        sku: 'UNI-007',
        price: 0.4,
        quantity: 500,
        subtotal: 200,
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
      },
    ],
    subtotal: 750,
    tax: 60,
    discount: 0,
    shipping: {
      method: 'Digital Delivery',
      carrier: 'Blockchain',
      trackingNumber: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      cost: 0,
    },
    total: 810,
    status: 'processing',
    payment: {
      id: 'pay3',
      method: 'crypto',
      status: 'completed',
      transactionId: '0x5e6f7890abcdef1234567890abcdef1234567890',
      amount: 810,
      currency: 'USD',
      createdAt: '2024-01-20T11:15:00Z',
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Crypto',
      address1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      address2: '',
      city: 'Crypto City',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'john.crypto@example.com',
    },
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-20T11:15:00Z',
  },
];

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
}
