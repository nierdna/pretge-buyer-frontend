'use client';

import OrderItem from '@/components/OrderItem';
import { useOrders } from '@/queries/useOrderQueries';
import { Order } from '@/types/order';
import Link from 'next/link';

interface OrdersScreenProps {
  initialOrders?: Order[];
}

export default function OrdersScreen({ initialOrders = [] }: OrdersScreenProps) {
  // Use React Query to fetch orders
  const { data, isLoading, isError } = useOrders();
  const orders = data?.data || initialOrders || [];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-white">My Orders</h1>
      <div className="bg-opensea-darkBorder rounded-lg shadow-md p-6 border border-opensea-darkBorder">
        {isLoading && initialOrders.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-opensea-blue"></div>
          </div>
        ) : isError ? (
          <div className="bg-opensea-darkBorder text-red-400 p-6 rounded-lg text-center border border-red-500/20">
            <p>Error loading orders. Please try again later.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-6">
            <p className="text-opensea-lightGray">No orders found.</p>
            <Link href="/products">
              <button className="mt-4 bg-opensea-blue text-white py-2 px-4 rounded-md hover:bg-opensea-blue/90 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
