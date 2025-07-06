'use client';

import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import ProductCard from '../../../components/ProductCard';

export interface FlashSaleListProps {
  endDate: string;
  products: Product[];
}

export default function FlashSaleList({ endDate, products }: FlashSaleListProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.flatMap((product) => product.categories.map((cat) => cat.id)))
  ).map((categoryId) => {
    // Find the first product that has this category to get the category name
    const product = products.find((p) => p.categories.some((cat) => cat.id === categoryId));
    const category = product?.categories.find((cat) => cat.id === categoryId);
    return { id: categoryId, name: category?.name || 'Unknown' };
  });

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categories.some((cat) => cat.id === selectedCategory))
    : products;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    // Update time left every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div>
      {/* Countdown timer */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">
          Flash Sale Ends In
        </h2>

        <div className="flex gap-2 md:gap-4">
          <div className="bg-opensea-darkBorder p-3 md:p-4 rounded-lg text-center min-w-[60px] md:min-w-[80px] border border-opensea-darkBorder">
            <div className="text-xl md:text-3xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-xs md:text-sm text-opensea-lightGray">Days</div>
          </div>
          <div className="bg-opensea-darkBorder p-3 md:p-4 rounded-lg text-center min-w-[60px] md:min-w-[80px] border border-opensea-darkBorder">
            <div className="text-xl md:text-3xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-xs md:text-sm text-opensea-lightGray">Hours</div>
          </div>
          <div className="bg-opensea-darkBorder p-3 md:p-4 rounded-lg text-center min-w-[60px] md:min-w-[80px] border border-opensea-darkBorder">
            <div className="text-xl md:text-3xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-xs md:text-sm text-opensea-lightGray">Mins</div>
          </div>
          <div className="bg-opensea-darkBorder p-3 md:p-4 rounded-lg text-center min-w-[60px] md:min-w-[80px] border border-opensea-darkBorder">
            <div className="text-xl md:text-3xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-xs md:text-sm text-opensea-lightGray">Secs</div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-opensea-blue text-white'
                : 'bg-opensea-darkBorder text-white hover:bg-opensea-darkBlue border border-opensea-darkBorder'
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-opensea-blue text-white'
                  : 'bg-opensea-darkBorder text-white hover:bg-opensea-darkBlue border border-opensea-darkBorder'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-opensea-lightGray">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
