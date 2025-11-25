'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ITokenProjectExternal } from '@/types/tokenProject';
import { TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface TokenChartProps {
  tokenExternal?: ITokenProjectExternal | null;
}

type TimeFilter = '24h' | '7d' | '1m' | '3m' | '1y';

export default function TokenChart({ tokenExternal }: TokenChartProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('7d');
  const priceData = tokenExternal?.data?.priceData;

  // Mock data for demonstration
  const price = priceData?.price || 0.6716;
  const change = priceData?.change_24h || -3.7;
  const changeAmount = (price * change) / 100;

  const timeFilters: TimeFilter[] = ['24h', '7d', '1m', '3m', '1y'];

  return (
    <div className="border-b border-border">
      <div className="flex flex-col divide-y divide-border md:flex-row md:items-start md:divide-x md:divide-y-0">
        {/* Chart section (left side) */}
        <div className="flex-1 p-4 md:p-6">
          {/* Price header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-text">XPL Price</span>
                <div className="rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-medium text-primary-text">
                  USD
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-primary-text">${price.toFixed(4)}</span>
                <div className="flex h-[22px] items-center gap-1">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">{Math.abs(change).toFixed(1)}%</span>
                  </div>
                  <span className="text-xs text-secondary-text">
                    (-${Math.abs(changeAmount).toFixed(4)})
                  </span>
                </div>
              </div>
            </div>

            {/* Time filters */}
            <div className="flex items-center rounded-md border border-border bg-card p-1">
              {timeFilters.map((filter) => (
                <Button
                  key={filter}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'h-6 rounded px-1.5 text-xs font-medium',
                    activeFilter === filter
                      ? 'bg-foreground text-background hover:bg-foreground hover:text-background'
                      : 'text-primary-text hover:bg-transparent hover:text-primary-text'
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-transparent via-black/35 to-transparent md:h-[400px]">
            {/* Mock chart visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-sm text-secondary-text">Chart data visualization</div>
                <div className="text-xs text-secondary-text/60">
                  Integrate with TradingView or chart library
                </div>
              </div>
            </div>
            {/* Simple line chart mock */}
            <svg className="h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(239, 102, 99, 0.3)" />
                  <stop offset="100%" stopColor="rgba(239, 102, 99, 0)" />
                </linearGradient>
              </defs>
              <path
                d="M 0 300 Q 100 250 200 200 T 400 150 T 600 100 T 800 180"
                stroke="rgba(239, 102, 99, 0.8)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 0 300 Q 100 250 200 200 T 400 150 T 600 100 T 800 180 L 800 400 L 0 400 Z"
                fill="url(#gradient)"
              />
            </svg>
          </div>
        </div>

        {/* Stats section (right side) */}
        <div className="w-full p-4 md:w-[450px] md:p-6">
          <div className="mb-6 flex items-center rounded-md border border-border bg-card">
            <div className="flex-1 border-r border-border py-2 text-center">
              <div className="text-sm text-secondary-text">Market Cap</div>
              <div className="text-xl font-semibold text-amber-400">
                ${priceData?.market_cap ? (priceData.market_cap / 1e9).toFixed(1) : '1.6'}B
              </div>
            </div>
            <div className="flex-1 py-2 text-center">
              <div className="text-sm text-secondary-text">FDV</div>
              <div className="text-xl font-semibold text-orange-400">$9.3B</div>
            </div>
          </div>

          {/* Supply section */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-text">Circ. Supply</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-secondary-text">18%</span>
                <svg
                  className="h-4 w-4 text-secondary-text"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle cx="8" cy="8" r="6" opacity="0.2" />
                  <path
                    d="M8 2 A 6 6 0 0 1 14 8"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
                <span className="text-sm font-semibold text-primary-text">1.8B</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[18%] bg-emerald-400" />
            </div>
          </div>

          {/* Stats list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-secondary-text">Total Supply</span>
              <span className="text-sm font-medium text-primary-text">10B</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-secondary-text">Max Supply</span>
              <span className="text-sm font-medium text-primary-text">10B</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-secondary-text">Volume 24h</span>
              <span className="text-sm font-medium text-primary-text">
                ${priceData?.volume_24h ? (priceData.volume_24h / 1e9).toFixed(1) : '1.7'}B
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-secondary-text">Total Raised</span>
              <span className="text-sm font-medium text-primary-text">Total Raised</span>
            </div>
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm text-secondary-text">Performance vs.</span>
              <span className="text-sm font-medium text-primary-text">Total Raised</span>
            </div>

            {/* Performance grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-emerald-400">4.8%</div>
                <div className="text-xs text-secondary-text">1h</div>
              </div>
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-emerald-400">0.7%</div>
                <div className="text-xs text-secondary-text">24h</div>
              </div>
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-red-500">-36.685%</div>
                <div className="text-xs text-secondary-text">7d</div>
              </div>
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-emerald-400">$9.3B</div>
                <div className="text-xs text-secondary-text">1h</div>
              </div>
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-emerald-400">$9.3B</div>
                <div className="text-xs text-secondary-text">1h</div>
              </div>
              <div className="rounded-md bg-card p-2 text-center">
                <div className="text-lg font-semibold text-emerald-400">$9.3B</div>
                <div className="text-xs text-secondary-text">1h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
