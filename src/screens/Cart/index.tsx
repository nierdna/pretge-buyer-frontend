'use client';

import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartScreen() {
  const { items, loading, removeItem, updateQuantity, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues by only rendering client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-white">Loading cart...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-white">Your Cart</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-opensea-blue"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-opensea-darkBorder rounded-lg p-8 text-center border border-opensea-darkBorder">
          <h2 className="text-2xl font-semibold mb-4 text-white">Your cart is empty</h2>
          <p className="text-opensea-lightGray mb-6">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-block bg-opensea-blue text-white px-6 py-3 rounded-md hover:bg-opensea-blue/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-opensea-darkBorder rounded-lg shadow-sm border border-opensea-darkBorder overflow-hidden">
              <div className="p-6 border-b border-opensea-darkBorder">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    Cart Items ({items.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                  <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300">
                    Clear Cart
                  </button>
                </div>
              </div>

              {items.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.variant?.id || 'no-variant'}`}
                  item={item}
                  onRemove={() => removeItem(item.product.id, item.variant?.id)}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.product.id, quantity, item.variant?.id)
                  }
                />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/products"
                className="text-opensea-blue hover:text-opensea-blue/80 font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              items={items}
              onCheckout={() => {
                // Handle checkout logic
                alert('Proceeding to checkout...');
                // In a real app, you'd redirect to a checkout page or open a checkout modal
              }}
            />

            <div className="mt-6 bg-opensea-darkBorder rounded-lg shadow-sm border border-opensea-darkBorder p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Need Help?</h3>
              <p className="text-opensea-lightGray mb-4">
                Our customer service team is available to assist you with any questions.
              </p>
              <Link
                href="/contact"
                className="text-opensea-blue hover:text-opensea-blue/80 font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
