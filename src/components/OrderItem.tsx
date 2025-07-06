import type { Order, OrderStatus } from '@/types/order';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/parseDate';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItemProps {
  order: Order;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function OrderItem({ order }: OrderItemProps) {
  const { id, orderNumber, createdAt, status, items, total, shippingAddress, shipping } = order;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap justify-between items-center gap-y-2">
          <div>
            <p className="text-sm text-gray-500">Order #{orderNumber}</p>
            <p className="text-sm text-gray-500">Placed on {formatDate(createdAt)}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>

            <Link
              href={`/orders/${id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {items.slice(0, 2).map((item) => (
              <li key={item.id} className="py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                    <Image
                      src={item.image || 'https://via.placeholder.com/64'}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link
                          href={`/products/${item.productId}`}
                          className="hover:text-primary-600"
                        >
                          {item.productName}
                        </Link>
                      </h3>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                      {item.variantName && ` | ${item.variantName}`}
                    </p>
                  </div>
                </div>
              </li>
            ))}

            {items.length > 2 && (
              <li className="py-3 text-center">
                <p className="text-sm text-gray-500">
                  + {items.length - 2} more item{items.length - 2 > 1 ? 's' : ''}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            {shipping.trackingNumber && (
              <p className="text-sm text-gray-600">
                Tracking: <span className="font-medium">{shipping.trackingNumber}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              Shipping to: {shippingAddress.city}, {shippingAddress.state}
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
}
