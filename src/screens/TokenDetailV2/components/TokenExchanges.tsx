'use client';

import { ITokenProjectExternal } from '@/types/tokenProject';
import { Navigation } from 'lucide-react';
import Image from 'next/image';

interface TokenExchangesProps {
  tokenExternal?: ITokenProjectExternal | null;
}

export default function TokenExchanges({ tokenExternal }: TokenExchangesProps) {
  const exchanges = tokenExternal?.data?.exchanges || [];

  // Mock data if no exchanges
  const displayExchanges =
    exchanges.length > 0
      ? exchanges.slice(0, 5)
      : [
          {
            exchangeName: 'Cobie',
            tradingPairName: 'XPL',
            price: 1.26,
            vol24h: 1615361666.09,
            logoUrl: '',
          },
          {
            exchangeName: 'Cobie',
            tradingPairName: 'XPL',
            price: 1.26,
            vol24h: 1615361666.09,
            logoUrl: '',
          },
          {
            exchangeName: 'Cobie',
            tradingPairName: 'XPL',
            price: 1.26,
            vol24h: 1615361666.09,
            logoUrl: '',
          },
          {
            exchangeName: 'Cobie',
            tradingPairName: 'XPL',
            price: 1.26,
            vol24h: 1615361666.09,
            logoUrl: '',
          },
          {
            exchangeName: 'Cobie',
            tradingPairName: 'XPL',
            price: 1.26,
            vol24h: 1615361666.09,
            logoUrl: '',
          },
        ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Navigation className="h-6 w-6 text-primary-text" />
        <h2 className="text-lg font-semibold text-primary-text">Exchanges</h2>
      </div>

      <div className="space-y-2">
        {displayExchanges.map((exchange, index) => (
          <div key={index} className="flex items-center justify-between rounded-md bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-card">
                {exchange.logoUrl ? (
                  <Image
                    src={exchange.logoUrl}
                    alt={exchange.exchangeName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-secondary-text">
                    {exchange.exchangeName[0]}
                  </div>
                )}
              </div>
              <div className="min-w-[121px]">
                <div className="text-sm text-primary-text">{exchange.exchangeName}</div>
                <div className="text-xs text-secondary-text">{exchange.tradingPairName}</div>
              </div>
            </div>
            <div className="min-w-[121px] text-right">
              <div className="text-sm text-primary-text">${exchange.price.toFixed(2)}</div>
              <div className="text-xs text-secondary-text">
                Vol: ${(exchange.vol24h / 1e9).toFixed(2)}B
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
