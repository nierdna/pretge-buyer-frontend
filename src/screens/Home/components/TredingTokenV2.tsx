'use client';

import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { IToken } from '@/types/token';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import TredingTokenV2Skeleton from './TredingTokenV2Skeleton';

export default function TredingTokenV2({
  trendingTokens,
  isLoading,
}: {
  trendingTokens: IToken[];
  isLoading: boolean;
}) {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Set up auto-scroll
  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 9000); // Scroll every 9 seconds
    };

    // Start auto-scroll
    startAutoScroll();

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  // Update current slide index on change
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const renderBadge = (token: IToken) => {
    if (token.isHot) {
      return (
        <Badge className="absolute -right-3.5 -top-2 z-10 bg-red-500 px-2 py-0.5 text-2xs font-bold text-primary">
          HOT
        </Badge>
      );
    }
    if (token.isNew) {
      return (
        <Badge className="absolute -right-3.5 -top-2 z-10 bg-blue-500 px-2 py-0.5 text-2xs font-bold text-primary">
          NEW
        </Badge>
      );
    }
    return null;
  };

  // Calculate number of dots based on slidesPerView
  const calculateDots = () => {
    if (!trendingTokens || trendingTokens.length === 0) return 0;
    return Math.ceil(trendingTokens.length / slidesPerView);
  };

  // Calculate which dot should be active
  const getActiveDotIndex = () => {
    if (!api) return 0;
    const currentIndex = api.selectedScrollSnap();
    return Math.floor(currentIndex / slidesPerView);
  };

  // Handle dot click to navigate to the correct slide
  const handleDotClick = (dotIndex: number) => {
    if (!api) return;
    api.scrollTo(dotIndex * slidesPerView);
  };

  if (isLoading) {
    return <TredingTokenV2Skeleton />;
  }

  const numberOfDots = calculateDots();
  const activeDotIndex = getActiveDotIndex();

  return (
    <div className="p-4">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {trendingTokens.map((token, index) => (
            <CarouselItem key={index} className="basis-full pl-4 md:basis-1/2 lg:basis-1/3">
              <Link
                href={`/token/${token?.symbol?.toLowerCase()}`}
                className="group relative flex h-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-foreground/50 p-3 pt-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gray-100"
              >
                <Image
                  src={
                    token?.bannerUrl ||
                    // 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Polygon_POS_logo.svg/1200px-Polygon_POS_logo.svg.png'
                  }
                  alt={`${token?.symbol} banner`}
                  fill
                  className="absolute left-0 top-0 z-0 rounded-lg object-cover transition-all duration-300 group-hover:blur-sm"
                />
                <div className="relative z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {renderBadge(token)}
                  <div className="relative h-12 w-12 min-w-12 flex-shrink-0 rounded-full bg-gray-300">
                    <Image
                      src={
                        token?.logo ||
                        'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                      }
                      alt={`${token?.symbol} symbol`}
                      fill
                      className="rounded-full border border-border object-cover"
                    />
                    {token?.networks?.logo && (
                      <Image
                        src={token.networks.logo}
                        alt={`${token?.symbol} network`}
                        width={20}
                        height={20}
                        className="absolute -bottom-0 -right-0 z-10 min-h-5 min-w-5 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <span className="z-10 text-lg font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {token?.symbol}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: numberOfDots }).map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeDotIndex ? 'w-4 bg-secondary-text' : 'bg-secondary-foreground/50'
              }`}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide group ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
