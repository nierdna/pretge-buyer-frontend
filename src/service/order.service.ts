import type { Offer } from '@/types/offer';
import type { Order, OrderCreateInput, OrderStatus, OrderUpdateInput } from '@/types/order';
import { mockOffers } from './offer.service';

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
  /**
   * Get all orders for the current user
   */
  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    // Return mock data instead of API call
    let filteredOrders = [...mockOrders];

    // Apply status filter if provided
    if (params?.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === params.status);
    }

    return {
      data: filteredOrders,
      total: filteredOrders.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  }

  /**
   * Get a single order by ID
   */
  async getOrderById(id: string) {
    // Return mock data for a single order
    const order = mockOrders.find((o) => o.id === id);
    return { data: order };
  }

  /**
   * Create a new order
   */
  async createOrder(data: OrderCreateInput) {
    // Find offers for the items
    const orderItems = data.items.map((item) => {
      // Find the offer in mockOffers
      const offer = mockOffers.find((p: Offer) => p.id === item.offerId);

      return {
        id: `item${Date.now()}-${Math.random()}`,
        offerId: item.offerId,
        offerName: offer?.name || `Offer ${item.offerId}`,
        sku: offer?.sku || `SKU-${item.offerId}`,
        price: offer?.price || 0,
        quantity: item.quantity,
        subtotal: (offer?.price || 0) * item.quantity,
        image: offer?.images?.[0]?.url,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shippingCost = 10; // Default shipping cost

    const newOrder: Order = {
      id: `order${mockOrders.length + 1}`,
      userId: 'user1', // Default user
      orderNumber: `ORD-2023-00${mockOrders.length + 1}`,
      items: orderItems,
      subtotal,
      tax,
      discount: 0,
      shipping: {
        method: data.shippingMethod,
        cost: shippingCost,
      },
      total: subtotal + tax + shippingCost,
      status: 'pending' as OrderStatus,
      payment: {
        id: `pay-${Date.now()}`,
        method: data.paymentMethod,
        status: 'pending',
        amount: subtotal + tax + shippingCost,
        currency: 'USD',
        createdAt: new Date().toISOString(),
      },
      shippingAddress: data.shippingAddress as any, // Type assertion to avoid TypeScript errors
      billingAddress: (data.billingAddress || data.shippingAddress) as any, // Type assertion to avoid TypeScript errors
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.push(newOrder);
    return { data: newOrder };
  }

  /**
   * Update an existing order
   */
  async updateOrder(id: string, data: OrderUpdateInput) {
    // Mock update order
    const index = mockOrders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');

    // Create a copy of the current order
    const updatedOrder = { ...mockOrders[index] };

    // Update the fields that are provided
    if (data.status) updatedOrder.status = data.status;
    if (data.shippingAddress)
      updatedOrder.shippingAddress = {
        ...updatedOrder.shippingAddress,
        ...data.shippingAddress,
      } as any;
    if (data.billingAddress)
      updatedOrder.billingAddress = {
        ...updatedOrder.billingAddress,
        ...data.billingAddress,
      } as any;
    if (data.notes) updatedOrder.notes = data.notes;

    updatedOrder.updatedAt = new Date().toISOString();

    mockOrders[index] = updatedOrder;
    return { data: updatedOrder };
  }

  /**
   * Cancel an order
   */
  async cancelOrder(id: string) {
    // Mock cancel order
    const index = mockOrders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');

    const cancelledOrder = {
      ...mockOrders[index],
      status: 'cancelled' as OrderStatus,
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString(),
    };

    mockOrders[index] = cancelledOrder;
    return { data: cancelledOrder };
  }
}
