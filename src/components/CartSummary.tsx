import { CartItem } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
}

export default function CartSummary({ items, onCheckout }: CartSummaryProps) {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Calculate shipping (free shipping over $100, otherwise $10)
  const shippingCost = subtotal >= 100 ? 0 : 10;

  // Calculate tax (assume 8%)
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;

  // Calculate total
  const total = subtotal + shippingCost + taxAmount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {shippingCost === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>{formatPrice(shippingCost)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        {subtotal < 100 && (
          <div className="text-sm text-green-600 mt-2">
            Add {formatPrice(100 - subtotal)} more for free shipping
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-medium transition-colors"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="ml-1 text-xs text-gray-500">Secure Checkout</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="ml-1 text-xs text-gray-500">Multiple Payment Options</span>
          </div>
        </div>
      </div>
    </div>
  );
}
