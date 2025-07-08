import Link from 'next/link';

interface OrderItemProps {
  item: {
    offerId: string;
    offerName: string;
    quantity: number;
    price: number;
    image: string;
  };
}

export default function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-opensea-darkBorder rounded-lg border border-opensea-darkBorder">
      <div className="relative w-20 h-20 flex-shrink-0">
        <img
          src={item.image || 'https://via.placeholder.com/100'}
          alt={item.offerName}
          className="object-cover rounded-md w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/offers/${item.offerId}`}>
          <h3 className="font-medium text-white truncate hover:text-opensea-blue">
            {item.offerName}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-white mt-2">x{item.quantity}</p>
      </div>
      <div className="text-lg font-semibold text-white">{item.price}</div>
    </div>
  );
}
