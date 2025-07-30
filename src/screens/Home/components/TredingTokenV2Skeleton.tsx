'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function TredingTokenV2Skeleton() {
  const [slidesPerView, setSlidesPerView] = useState(3);
  const totalItems = 6; // Total number of skeleton items

  // Update slides per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate number of dots
  const numberOfDots = Math.ceil(totalItems / slidesPerView);

  return (
    <section className="pb-4 sm:px-4 md:pb-6">
      <Card>
        {/* <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeader> */}
        <CardContent className="p-4 pt-8">
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: totalItems }).map((_, index) => (
                <CarouselItem key={index} className="basis-full pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white/80 p-3 pt-6 shadow-sm backdrop-blur-sm">
                    <div className="relative">
                      <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                    <Skeleton className="mt-2 h-6 w-16" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-4 flex items-center justify-center gap-1">
              {Array.from({ length: numberOfDots }).map((_, i) => (
                <Skeleton key={i} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </Carousel>
        </CardContent>
      </Card>
    </section>
  );
}
