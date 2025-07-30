'use client';

import { Button } from '@/components/ui/button';
import { useGetFlashSaleOffers } from '@/queries';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import FlashSaleCard from './FlashSaleCard';
import FlashSaleCardSkeleton from './FlashSaleCardSkeleton';

export default function FlashSale() {
  const {
    data: flashSaleOffers,
    isLoading: isLoadingFlashSaleOffers,
    isError: isErrorFlashSaleOffers,
  } = useGetFlashSaleOffers();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Render loading skeletons
  if (isLoadingFlashSaleOffers) {
    return (
      <section className="container rounded-lg border border-neutral-700 bg-neutral-900/90 py-4 shadow-2xl backdrop-blur-lg md:py-6">
        <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <h2 className="text-center text-xl font-bold text-primary sm:text-left md:text-2xl">
            Flash Sale: Exclusive Pre-Market Deals!
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <FlashSaleCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Render error state
  if (isErrorFlashSaleOffers) {
    return null;
  }

  if (flashSaleOffers?.length === 0) {
    return null;
  }

  return (
    <section className="container rounded-lg border border-neutral-700 bg-neutral-900/90 py-4 shadow-2xl backdrop-blur-lg md:py-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <h2 className="text-center text-xl font-bold text-primary sm:text-left md:text-2xl">
          Flash Sale: Exclusive Pre-Market Deals!
        </h2>
      </div>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-2 flex">
            {flashSaleOffers?.map((offer, index) => (
              <div
                key={index}
                className="flex flex-shrink-0 flex-grow-0 basis-[100%] justify-center pl-2 mb:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <FlashSaleCard offer={offer} />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-neutral-600 bg-neutral-700/90 text-primary shadow-lg backdrop-blur-md hover:bg-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-neutral-600 bg-neutral-700/90 text-primary shadow-lg backdrop-blur-md hover:bg-neutral-600"
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </section>
  );
}
