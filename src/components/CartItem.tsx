import { CartItem as CartItemType } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';

export interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity, variant } = item;
  const price = variant ? variant.price : product.price;
  const maxQuantity = variant ? variant.inventory : product.inventory;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0]?.url || 'https://via.placeholder.com/100'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 100px"
            className="object-cover"
          />
        </Link>
      </div>

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <Link
            href={`/products/${product.id}`}
            className="text-lg font-medium hover:text-primary-600"
          >
            {product.name}
          </Link>
          <div className="font-semibold">{formatPrice(price * quantity)}</div>
        </div>

        {variant && (
          <div className="text-sm text-gray-600 mb-2">
            Variant:{' '}
            {Object.entries(variant.options)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <label
              htmlFor={`quantity-${product.id}-${variant?.id || ''}`}
              className="mr-2 text-sm text-gray-600"
            >
              Qty:
            </label>
            <select
              id={`quantity-${product.id}-${variant?.id || ''}`}
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              {[...Array(Math.min(maxQuantity, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onRemove}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
