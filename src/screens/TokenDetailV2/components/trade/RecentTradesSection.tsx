'use client';

import { Coins, ExternalLink, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Trade {
  id: string;
  time: string;
  price: string;
  type: 'Buy' | 'Sell';
  amount: string;
  totalValue: string;
}

interface RecentTradesSectionProps {
  // eslint-disable-next-line no-unused-vars
  onTradeClick?: (tradeData: Trade) => void;
}

// Mock data generator
const generateMockTrades = (count: number): Trade[] => {
  return Array.from({ length: count }, (_, i) => {
    const type = Math.random() > 0.5 ? 'Buy' : 'Sell';
    return {
      id: `trade-${Date.now()}-${i}`,
      time: new Date(Date.now() - Math.random() * 3600000).toISOString().substr(11, 8),
      price: (Math.random() * 0.5 + 0.5).toFixed(3),
      type,
      amount: Math.floor(Math.random() * 10000 + 1000).toLocaleString(),
      totalValue: (Math.random() * 10000 + 1000).toFixed(2),
    };
  });
};

export default function RecentTradesSection({ onTradeClick }: RecentTradesSectionProps = {}) {
  const [trades, setTrades] = useState(() => generateMockTrades(10));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef<HTMLTableRowElement>(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newTrades = generateMockTrades(10);
      setTrades((prev) => [...prev, ...newTrades]);
      // Stop loading after 50 items for demo
      if (trades.length >= 50) setHasMore(false);
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore, trades.length]);

  // Intersection Observer for infinite scroll
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Coins className="h-6 w-6 text-primary-text" />
        <h2 className="text-lg font-semibold text-primary-text">Recent Trades</h2>
      </div>

      {/* Table */}
      <div className="scrollbar-hide max-h-[500px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-border">
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Time (UTC)</th>
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Price</th>
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Type</th>
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Amount (XPL)</th>
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Total Value</th>
              <th className="px-2 py-3 text-left text-sm text-secondary-text">Txns</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr
                key={trade.id}
                ref={index === trades.length - 1 ? lastItemRef : null}
                className="cursor-pointer border-b border-border transition-colors hover:bg-card lg:cursor-default"
                onClick={() => {
                  // Only trigger on mobile
                  if (window.innerWidth < 1024 && onTradeClick) {
                    onTradeClick(trade);
                  }
                }}
              >
                <td className="px-2 py-3 text-sm text-primary-text">{trade.time}</td>
                <td className="px-2 py-3 text-sm text-primary-text">${trade.price}</td>
                <td className="px-2 py-3">
                  <span
                    className={`rounded-4xl border border-border bg-card px-2 py-1 text-xs font-medium ${
                      trade.type === 'Buy' ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm text-primary-text">{trade.amount}</td>
                <td className="px-2 py-3 text-sm text-primary-text">${trade.totalValue}</td>
                <td className="px-2 py-3">
                  <button
                    className="flex items-center justify-center rounded border border-border bg-card p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-primary-text" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="flex h-10 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-text" />
          </div>
        )}
        {!hasMore && trades.length > 0 && (
          <div className="py-4 text-center text-sm text-secondary-text">No more trades</div>
        )}
      </div>
    </div>
  );
}
