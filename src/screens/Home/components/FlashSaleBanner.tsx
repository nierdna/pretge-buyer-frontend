'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface FlashSaleBannerProps {
  products: Product[];
  endTime?: Date;
  isLoading?: boolean;
}

export default function FlashSaleBanner({
  products = [],
  endTime = new Date(Date.now() + 24 * 60 * 60 * 1000),
  isLoading = false,
}: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  // useEffect(() => {
  //   const calculateTimeLeft = () => {
  //     const difference = endTime.getTime() - Date.now();

  //     if (difference <= 0) {
  //       return {
  //         hours: '00',
  //         minutes: '00',
  //         seconds: '00',
  //       };
  //     }

  //     const hours = Math.floor(difference / (1000 * 60 * 60));
  //     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  //     return {
  //       hours: hours.toString().padStart(2, '0'),
  //       minutes: minutes.toString().padStart(2, '0'),
  //       seconds: seconds.toString().padStart(2, '0'),
  //     };
  //   };

  //   // Update the countdown every second
  //   const timer = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   // Set initial time
  //   setTimeLeft(calculateTimeLeft());

  //   // Clear interval on unmount
  //   return () => clearInterval(timer);
  // }, [endTime]);

  // Skeleton placeholders for loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-opensea-darkBlue to-opensea-blue p-3 rounded-xl w-full">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive" className="text-xs py-0">
            Flash Sale
          </Badge>
          <span className="text-xs text-opensea-lightGray">Ends in</span>
          <div className="flex gap-1">
            <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
              00
            </div>
            <span className="text-white font-bold">:</span>
            <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
              00
            </div>
            <span className="text-white font-bold">:</span>
            <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
              00
            </div>
          </div>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {[...Array(6)].map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/5 lg:basis-1/6">
                <Card className="h-auto py-0">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <Skeleton className="aspect-[4/3] rounded-lg mb-1" />
                      <Skeleton className="h-3 w-full mt-1" />
                      <div className="flex items-center mt-0.5">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-2 w-8 ml-1" />
                      </div>
                      <Skeleton className="h-5 w-full mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 h-5 w-5" />
          <CarouselNext className="right-1 h-5 w-5" />
        </Carousel>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-opensea-darkBlue to-opensea-blue p-3 rounded-xl w-full">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="destructive" className="text-xs py-0">
          Flash Sale
        </Badge>
        <span className="text-xs text-opensea-lightGray">Ends in</span>
        <div className="flex gap-1">
          <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
            {timeLeft.hours}
          </div>
          <span className="text-white font-bold">:</span>
          <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
            {timeLeft.minutes}
          </div>
          <span className="text-white font-bold">:</span>
          <div className="bg-opensea-darkBorder text-white px-1.5 py-0.5 rounded text-xs font-mono">
            {timeLeft.seconds}
          </div>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {products.map((product) => {
            // Calculate discount percentage if compareAtPrice exists
            const discountPercentage = product.compareAtPrice
              ? Math.round(
                  ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
                )
              : 0;

            return (
              <CarouselItem key={product.id} className="md:basis-1/5 lg:basis-1/6">
                <Card className="h-auto py-0">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-1">
                        <Image
                          src={product.images[0]?.url || 'https://via.placeholder.com/500'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {discountPercentage > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-1 right-1 text-[10px] px-1 py-0"
                          >
                            {discountPercentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xs font-bold line-clamp-1 text-white">{product.name}</h3>
                      <div className="flex items-center mt-0.5">
                        <p className="text-xs font-bold text-white">{formatPrice(product.price)}</p>
                        {product.compareAtPrice && (
                          <p className="ml-1 text-[10px] text-opensea-lightGray line-through">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-1 block text-center text-[10px] bg-opensea-darkBorder hover:bg-opensea-darkBlue text-white py-0.5 px-2 rounded-md font-medium transition-colors"
                      >
                        View Deal
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-1 h-5 w-5" />
        <CarouselNext className="right-1 h-5 w-5" />
      </Carousel>
    </div>
  );
}
