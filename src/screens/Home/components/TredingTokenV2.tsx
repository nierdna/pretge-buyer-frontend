'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
      }, 3000); // Scroll every 3 seconds
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
        <Badge className="bg-red-500 absolute -top-2 -right-3.5 text-2xs font-bold px-2 py-0.5 z-10 text-white">
          HOT
        </Badge>
      );
    }
    if (token.isNew) {
      return (
        <Badge className="bg-blue-500 absolute -top-2 -right-3.5 text-2xs font-bold px-2 py-0.5 z-10 text-white">
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
    <section className="pb-4 md:pb-6 pt-0 sm:px-4">
      <Card>
        {/* <CardHeadper className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Trending Tokens</CardTitle>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </CardHeadper> */}
        <CardContent className="p-4 pt-8">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            setApi={setApi}
            className="w-full px-4"
          >
            <CarouselContent>
              {trendingTokens.map((token, index) => (
                <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                  <Link
                    href={`/token/${token?.symbol?.toLowerCase()}`}
                    className="relative flex flex-col gap-2 items-center justify-center p-3 pt-6 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-gray-100 transition-colors h-full"
                  >
                    <Image
                      src={
                        token?.bannerUrl ||
                        // 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Polygon_POS_logo.svg/1200px-Polygon_POS_logo.svg.png'
                      }
                      alt={`${token?.symbol} banner`}
                      fill
                      className="object-cover rounded-lg absolute top-0 left-0 z-0"
                    />
                    <div className="relative">
                      {renderBadge(token)}
                      <div className="w-12 h-12 relative min-w-12 rounded-full bg-gray-300 flex-shrink-0">
                        <Image
                          src={
                            token?.logo ||
                            'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Solana_logo.png/252px-Solana_logo.png'
                          }
                          alt={`${token?.symbol} symbol`}
                          fill
                          className="object-cover rounded-full border border-gray-500"
                        />
                        {token?.networks?.logo && (
                          <Image
                            src={token.networks.logo}
                            alt={`${token?.symbol} network`}
                            width={20}
                            height={20}
                            className="object-cover z-10 absolute -bottom-0 -right-0 min-w-5 min-h-5 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{token?.symbol}</span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: numberOfDots }).map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeDotIndex ? 'bg-secondary w-4' : 'bg-secondary-foreground/50'
                  }`}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Go to slide group ${i + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </CardContent>
      </Card>
    </section>
  );
}
