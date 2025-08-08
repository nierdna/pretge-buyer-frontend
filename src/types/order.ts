/**
 * Order related type definitions
 */

import { Wallet } from 'ethers';
import { IOffer } from './offer';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  offerId: string;
  offerName: string;
  variantId?: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrderPayment {
  id: string;
  method: 'credit_card' | 'paypal' | 'crypto' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface OrderShipping {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  cost: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: OrderShipping;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  payment: OrderPayment;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface OrderCreateInput {
  items: Array<{
    offerId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress: Omit<OrderAddress, 'id'>;
  billingAddress?: Omit<OrderAddress, 'id'>;
  shippingMethod: string;
  paymentMethod: 'credit_card' | 'paypal' | 'crypto' | 'bank_transfer';
  notes?: string;
}

export interface OrderUpdateInput {
  id: string;
  status?: OrderStatus;
  shippingAddress?: Partial<OrderAddress>;
  billingAddress?: Partial<OrderAddress>;
  notes?: string;
}

//new

export enum EOrderStatus {
  PENDING = 'pending',
  SETTLING = 'settling',
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
}

export interface IReview {
  buyer_id: string;
  comment: string;
  created_at: string;
  id: string;
  order_id: string;
  rating: number;
  reply: string | null;
  status: 'pending' | 'approved' | 'rejected';
  updated_at: string;
}
export interface IOrder {
  id: string;
  amount: number;
  createdAt: string;
  buyerWalletId: string;
  cancelTxHash: string | null;
  hashId: string | null;
  buyer: Wallet;
  offer: IOffer;
  offerId: string;
  settleTxHash: string | null;
  status: EOrderStatus;
  updatedAt: string;
  discountPercent: number;
  promotionId: string | null;
  review: IReview | null;
  collateralPercent: number;
}
