'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenBySymbol, useTokenBySymbolExternal } from '@/queries/useTokenQueries';
import { ITokenProjectExternal } from '@/types/tokenProject';
import { useState } from 'react';
import TokenChart from './components/TokenChart';
import TokenDetailHeader from './components/TokenDetailHeader';
import TokenExchanges from './components/TokenExchanges';
import TokenInvestors from './components/TokenInvestors';
import TokenSocial from './components/TokenSocial';
import TokenTGE from './components/TokenTGE';
import TradeView from './components/TradeView';

export default function TokenDetailV2({ symbol }: { symbol: string }) {
  const { data: token, isLoading } = useTokenBySymbol(symbol);
  const { data: tokenExternal } = useTokenBySymbolExternal(symbol);

  const [activeTab, setActiveTab] = useState<'info' | 'trade'>('info');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-secondary-text">Loading...</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto flex-1 border-border 2xl:border-x">
      {/* Breadcrumb and Token Info Header */}
      <div className="p-6">
        <Breadcrumb className="mb-6 flex items-center gap-2 text-sm font-medium">
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-secondary-text transition-colors hover:text-primary-text"
              href="/"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="flex items-center" />
          <BreadcrumbItem className="text-primary-text">{symbol.toUpperCase()}</BreadcrumbItem>
        </Breadcrumb>

        {/* Token Info Header */}
        <TokenDetailHeader
          token={token}
          tokenExternal={tokenExternal as unknown as ITokenProjectExternal}
        />
      </div>

      {/* Tab Navigation - Separate section */}
      <div className="border-b border-border">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'info' | 'trade')}>
          <TabsList className="h-auto w-full justify-start rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="info"
              className={`flex w-[183px] items-center justify-center gap-2 rounded-none border-b border-transparent px-4 pb-2 pt-0 font-['SF_Pro_Display'] text-base font-medium ${
                activeTab === 'info'
                  ? 'border-b-primary-text text-primary-text'
                  : 'text-secondary-text'
              } data-[state=active]:bg-transparent`}
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM.5 8a7.5 7.5 0 1 1 15 0A7.5 7.5 0 0 1 .5 8z" />
                <path d="M7.5 6a.5.5 0 0 1 1 0v4a.5.5 0 0 1-1 0V6zM8 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
              </svg>
              Info
            </TabsTrigger>
            <TabsTrigger
              value="trade"
              className={`flex w-[183px] items-center justify-center gap-2 rounded-none border-b border-transparent px-4 pb-2 pt-0 font-['SF_Pro_Display'] text-base font-medium ${
                activeTab === 'trade'
                  ? 'border-b-primary-text text-primary-text'
                  : 'text-secondary-text'
              } data-[state=active]:bg-transparent`}
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="1.5" />
                <path d="M8 2.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5zm0 8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5zm5.5-3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm-8 0a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5z" />
              </svg>
              Trade
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'info' ? (
          <div>
            {/* Chart and Stats */}
            <TokenChart tokenExternal={tokenExternal as unknown as ITokenProjectExternal} />

            {/* Social Stats */}
            <TokenSocial tokenExternal={tokenExternal as unknown as ITokenProjectExternal} />

            {/* Investors and Exchanges in 2 columns */}
            <div className="flex flex-col border-y border-border md:flex-row">
              <div className="flex-1 md:border-r md:border-border">
                <TokenInvestors tokenExternal={tokenExternal as unknown as ITokenProjectExternal} />
              </div>
              <div className="flex-1">
                <TokenExchanges tokenExternal={tokenExternal as unknown as ITokenProjectExternal} />
              </div>
            </div>

            {/* TGE Information */}
            <TokenTGE tokenExternal={tokenExternal as unknown as ITokenProjectExternal} />
          </div>
        ) : (
          <TradeView />
        )}
      </div>
    </section>
  );
}
