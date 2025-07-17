'use client';

import { Button } from '@/components/ui/button';
import { useGetFlashSaleOffers } from '@/queries';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import FlashSaleCard from './FlashSaleCard';

const mockFlashSaleOffers = [
  {
    tokenSymbol: 'FLS',
    tokenName: 'Flash Token Sale',
    network: 'Ethereum',
    originalPriceUSD: 20000,
    salePriceUSD: 15000,
    discountPercent: 25,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
  {
    tokenSymbol: 'DIS',
    tokenName: 'Discount Coin',
    network: 'BNB Chain',
    originalPriceUSD: 10000,
    salePriceUSD: 7000,
    discountPercent: 30,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
  {
    tokenSymbol: 'LMT',
    tokenName: 'Limited Supply Token',
    network: 'Polygon',
    originalPriceUSD: 5000,
    salePriceUSD: 4000,
    discountPercent: 20,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
  {
    tokenSymbol: 'EXC',
    tokenName: 'Exclusive Token',
    network: 'Solana',
    originalPriceUSD: 30000,
    salePriceUSD: 22500,
    discountPercent: 25,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
  {
    tokenSymbol: 'NEW',
    tokenName: 'New Token',
    network: 'Avalanche',
    originalPriceUSD: 12000,
    salePriceUSD: 9000,
    discountPercent: 25,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
  {
    tokenSymbol: 'HOT',
    tokenName: 'Hot Token',
    network: 'Fantom',
    originalPriceUSD: 8000,
    salePriceUSD: 6000,
    discountPercent: 25,
    tokenImage: '/placeholder.svg?height=48&width=48',
  },
];

export default function FlashSale() {
  const {
    data: flashSaleOffers,
    isLoading: isLoadingFlashSaleOffers,
    isError: isErrorFlashSaleOffers,
  } = useGetFlashSaleOffers();
  console.log('data', flashSaleOffers);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Mock global time remaining for the flash sale
  const globalTimeRemaining = '00h 45m 12s';

  return (
    <section className="container py-4 md:py-6 bg-neutral-900/90 backdrop-blur-lg rounded-lg shadow-2xl border border-neutral-700">
      {' '}
      {/* Changed background to bg-neutral-900/90 and border to border-neutral-700 */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">
          Flash Sale: Exclusive Pre-Market Deals!
        </h2>
        {/* <div className="flex items-center gap-2 text-lg font-bold text-red-400 flex-shrink-0">
          <span>Time Left:</span>
          <span>{globalTimeRemaining}</span>
        </div> */}
      </div>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-2">
            {flashSaleOffers?.map((offer, index) => (
              <div
                key={index}
                className="pl-2 flex-grow-0 flex-shrink-0 flex justify-center basis-[100%] mb:basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 "
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-neutral-700/90 backdrop-blur-md shadow-lg border-neutral-600 text-white h-8 w-8 hover:bg-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-neutral-700/90 backdrop-blur-md shadow-lg border-neutral-600 text-white h-8 w-8 hover:bg-neutral-600"
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </section>
  );
}
