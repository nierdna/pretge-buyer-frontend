'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTokenQueries } from '@/queries/useTokenQueries';
import { IOfferFilter } from '@/service/offer.service';
import { useChainStore } from '@/store/chainStore';
import { IToken } from '@/types/token';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// This component contains only the filter UI, without any wrapping Card or visibility/positioning classes.
export default function FilterContent({
  filters,
  setFilters,
  hideNetworkFilter = false,
  hideTokenFilter = false,
}: {
  filters: IOfferFilter;
  setFilters: (filters: IOfferFilter) => void;
  hideNetworkFilter?: boolean;
  hideTokenFilter?: boolean;
}) {
  const { chains } = useChainStore();
  const { data: tokensData, isLoading: isLoadingTokens } = useTokenQueries({
    statuses: ['active'],
    limit: 50, // Get more tokens for filter options
  });

  // State to control entire tutorial section visibility
  const [showTutorialSection, setShowTutorialSection] = useState(true);

  // Load tutorial section visibility preference from localStorage
  useEffect(() => {
    const savedSectionPreference = localStorage.getItem('showTutorialSection');
    if (savedSectionPreference !== null) {
      setShowTutorialSection(JSON.parse(savedSectionPreference));
    }
  }, []);

  // Save tutorial section visibility preference to localStorage
  const handleToggleTutorialSection = () => {
    const newValue = !showTutorialSection;
    setShowTutorialSection(newValue);
    localStorage.setItem('showTutorialSection', JSON.stringify(newValue));
  };

  const listSettleTime = [
    { id: '1', name: '1 Hr' },
    { id: '2', name: '2 Hrs' },
    { id: '4', name: '4 Hrs' },
    { id: '6', name: '6 Hrs' },
    { id: '12', name: '12 Hrs' },
  ];

  const listCollateral = [
    { id: '25', name: '25%' },
    { id: '50', name: '50%' },
    { id: '75', name: '75%' },
    { id: '100', name: '100%' },
  ];

  const handleChangeNetwork = (chainId: string) => {
    if (filters.networkIds?.includes(chainId)) {
      setFilters({ ...filters, networkIds: filters.networkIds?.filter((id) => id !== chainId) });
    } else {
      setFilters({ ...filters, networkIds: [...(filters.networkIds || []), chainId] });
    }
  };

  const handleChangeSettleTime = (settleTime: string) => {
    if (filters.settleDurations?.includes(settleTime)) {
      setFilters({
        ...filters,
        settleDurations: filters.settleDurations?.filter((id) => id !== settleTime),
      });
    } else {
      setFilters({ ...filters, settleDurations: [...(filters.settleDurations || []), settleTime] });
    }
  };

  const handleChangeCollateral = (collateral: string) => {
    if (filters.collateralPercents?.includes(collateral)) {
      setFilters({
        ...filters,
        collateralPercents: filters.collateralPercents?.filter((id) => id !== collateral),
      });
    } else {
      setFilters({
        ...filters,
        collateralPercents: [...(filters.collateralPercents || []), collateral],
      });
    }
  };

  const handleChangeToken = (tokenId: string) => {
    if (filters.tokenId === tokenId) {
      setFilters({ ...filters, tokenId: '' });
    } else {
      setFilters({ ...filters, tokenId });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      ...filters,
      networkIds: [],
      tokenId: '',
      settleDurations: [],
      collateralPercents: [],
    });
  };
  return (
    <>
      <CardHeader className="hidden pb-0 lg:block">
        <CardTitle className="text-xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Accordion type="multiple" defaultValue={['network', 'token', 'settle-time', 'collateral']}>
          {!hideNetworkFilter && (
            <AccordionItem value="network">
              <AccordionTrigger className="text-base">Network</AccordionTrigger>
              <AccordionContent className="grid gap-2 pt-2">
                {chains.map((chain) => (
                  <div className="flex items-center gap-2" key={chain.id}>
                    <Checkbox
                      id={`network-${chain.id}`}
                      checked={filters.networkIds?.includes(chain.id)}
                      onCheckedChange={() => handleChangeNetwork(chain.id)}
                    />
                    <div className="flex items-center gap-2">
                      {chain.logo && (
                        <div className="relative h-5 w-5 flex-shrink-0">
                          <Image
                            src={chain.logo}
                            alt={`${chain.name} logo`}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <Label htmlFor={`network-${chain.id}`}>{chain.name}</Label>
                    </div>
                  </div>
                ))}
                {/* <div className="flex items-center gap-2">
                <Checkbox id="network-eth" />
                <Label htmlFor="network-eth">Ethereum</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-bsc" />
                <Label htmlFor="network-bsc">BNB Smart Chain</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-poly" />
                <Label htmlFor="network-poly">Polygon</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-sol" />
                <Label htmlFor="network-sol">Solana</Label>
              </div> */}
              </AccordionContent>
            </AccordionItem>
          )}

          {!hideTokenFilter && (
            <AccordionItem value="token">
              <AccordionTrigger className="text-base">Token</AccordionTrigger>
              <AccordionContent className="flex grid-cols-2 flex-wrap gap-2 pt-2 lg:grid">
                {isLoadingTokens ? (
                  <div className="text-content text-sm">Loading tokens...</div>
                ) : tokensData?.data?.length > 0 ? (
                  tokensData.data.map((token: IToken) => (
                    <div className="flex items-center gap-2" key={token.id}>
                      <Checkbox
                        id={`token-${token.id}`}
                        checked={filters.tokenId === token.id}
                        onCheckedChange={() => handleChangeToken(token.id)}
                      />
                      <div className="flex items-center gap-2">
                        {token.logo && (
                          <div className="relative h-5 w-5 flex-shrink-0">
                            <Image
                              src={token.logo}
                              alt={`${token.symbol} logo`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <Label htmlFor={`token-${token.id}`}>{token.symbol}</Label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-content text-sm">No tokens available</div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="settle-time">
            <AccordionTrigger className="text-base">Settle Duration</AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-4 pt-2">
              {listSettleTime.map((item) => (
                <div className="flex items-center gap-2" key={item.id}>
                  <Checkbox
                    id={`settle-${item.id}`}
                    checked={filters.settleDurations?.includes(item.id)}
                    onCheckedChange={() => handleChangeSettleTime(item.id)}
                  />
                  <Label className="font-normal" htmlFor={`settle-${item.id}`}>
                    {item.name}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="collateral">
            <AccordionTrigger className="text-base">Percent Collateral</AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-2 pt-2">
              {listCollateral.map((item) => (
                <div className="flex items-center gap-2" key={item.id}>
                  <Checkbox
                    id={`collateral-${item.id}`}
                    checked={filters.collateralPercents?.includes(item.id)}
                    onCheckedChange={() => handleChangeCollateral(item.id)}
                  />
                  <Label className="font-normal" htmlFor={`collateral-${item.id}`}>
                    {item.name}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* <Separator className="bg-border" /> */}
        {/* <Button className="lg:hidden" variant="outline">
          Apply Filters
        </Button> */}
        <Button onClick={handleClearFilters}>Clear Filters</Button>

        {/* Tutorial Section Toggle Button */}
        {/* <div className="flex justify-center">
          <button
            onClick={handleToggleTutorialSection}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
          >
            {showTutorialSection ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hide Tutorial
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Show Tutorial
              </>
            )}
          </button>
        </div> */}

        {/* YouTube Tutorial Section */}
        {/* {showTutorialSection && (
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-4">
            <div className="mb-4 flex items-center gap-3 pt-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                <Play className="ml-0.5 h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">How to Buy Token</h4>
                <p className="text-sm text-gray-600">Watch our tutorial guide</p>
              </div>
            </div>

            <div className="relative w-full pb-4" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute left-0 top-0 h-full w-full rounded-lg"
                src="https://www.youtube.com/embed/hfuW_KH50_A?si=mrgCl5PiIK_ly39v"
                title="How to Buy Token Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )} */}
      </CardContent>
    </>
  );
}
