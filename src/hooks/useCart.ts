import type { Product, ProductVariant } from '@/types/product';
import { useCallback, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variant?: ProductVariant;
}

export interface UseCartReturn {
  items: CartItem[];
  loading: boolean;
  error: Error | null;
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load cart'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

  // Add item to cart
  const addItem = useCallback((product: Product, quantity: number, variant?: ProductVariant) => {
    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.productId === product.id &&
          ((!variant && !item.variantId) || (variant && item.variantId === variant.id))
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [
          ...currentItems,
          {
            productId: product.id,
            product,
            quantity,
            variantId: variant?.id,
            variant,
          },
        ];
      }
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId || (variantId && item.variantId !== variantId)
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId === productId &&
          ((!variantId && !item.variantId) || (variantId && item.variantId === variantId))
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate total number of items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return total + price * item.quantity;
  }, 0);

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  };
}
