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
      <CardHeader className="lg:block hidden pb-0">
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
                        <div className="w-5 h-5 relative flex-shrink-0">
                          <Image
                            src={chain.logo}
                            alt={`${chain.name} logo`}
                            fill
                            className="object-cover rounded-full"
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
              <AccordionContent className="grid gap-2 pt-2">
                {isLoadingTokens ? (
                  <div className="text-sm text-gray-500">Loading tokens...</div>
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
                          <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                              src={token.logo}
                              alt={`${token.symbol} logo`}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                        )}
                        <Label htmlFor={`token-${token.id}`}>{token.symbol}</Label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No tokens available</div>
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
        {/* <Separator className="bg-gray-200" /> */}
        {/* <Button className="lg:hidden" variant="outline">
          Apply Filters
        </Button> */}
        <Button onClick={handleClearFilters}>Clear Filters</Button>
      </CardContent>
    </>
  );
}
