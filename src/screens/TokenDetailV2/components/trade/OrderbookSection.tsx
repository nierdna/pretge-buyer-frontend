'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2, Tag } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectedOrder } from '../TradeView';

interface OrderbookSectionProps {
  // eslint-disable-next-line no-unused-vars
  onOrderClick?: (orderData: SelectedOrder) => void;
  selectedOrder?: SelectedOrder | null;
}

// Mock data generator
const generateMockOrders = (count: number, type: 'buy' | 'sell'): SelectedOrder[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${type}-${Date.now()}-${i}`,
    price: (Math.random() * 0.5 + 0.5).toFixed(4),
    amount: Math.floor(Math.random() * 10000 + 1000).toLocaleString(),
    totalValue: (Math.random() * 10000 + 1000).toFixed(2),
    collateral: `${[10, 25, 50, 75][Math.floor(Math.random() * 4)]}%`,
    seller: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
    type: type,
  }));
};

export default function OrderbookSection({ onOrderClick, selectedOrder }: OrderbookSectionProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [buyOrders, setBuyOrders] = useState(() => generateMockOrders(10, 'buy'));
  const [sellOrders, setSellOrders] = useState(() => generateMockOrders(10, 'sell'));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreBuy, setHasMoreBuy] = useState(true);
  const [hasMoreSell, setHasMoreSell] = useState(true);
  const lastItemRef = useRef<HTMLTableRowElement>(null);

  const currentOrders = activeTab === 'buy' ? buyOrders : sellOrders;
  const hasMore = activeTab === 'buy' ? hasMoreBuy : hasMoreSell;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newOrders = generateMockOrders(10, activeTab);
      if (activeTab === 'buy') {
        setBuyOrders((prev) => [...prev, ...newOrders]);
        // Stop loading after 50 items for demo
        if (buyOrders.length >= 50) setHasMoreBuy(false);
      } else {
        setSellOrders((prev) => [...prev, ...newOrders]);
        if (sellOrders.length >= 50) setHasMoreSell(false);
      }
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore, activeTab, buyOrders.length, sellOrders.length]);

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
    <div className="border-b border-border p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tag className="h-6 w-6 text-primary-text" />
          <h2 className="text-lg font-semibold text-primary-text">Orderbook</h2>
        </div>

        {/* Buy/Sell Tabs */}
        <div className="flex items-center rounded-md border border-border bg-card p-1">
          <button
            onClick={() => setActiveTab('buy')}
            className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
              activeTab === 'buy'
                ? 'bg-primary-text text-inverse'
                : 'text-primary-text hover:bg-border'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
              activeTab === 'sell'
                ? 'bg-primary-text text-inverse'
                : 'text-primary-text hover:bg-border'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="scrollbar-hide max-h-[500px] overflow-auto">
        <table className="w-full">
          <thead className="sticky -top-1 z-20 bg-background">
            <tr className="border-b border-border">
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Price (USD)
              </th>
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Amount (XPL)
              </th>
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Total Value (USD)
              </th>
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Collateral
              </th>
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Seller
              </th>
              <th className="px-2 py-3 text-left text-sm font-normal text-secondary-text">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
                ref={index === currentOrders.length - 1 ? lastItemRef : null}
                className="group border-b border-border transition-colors hover:bg-card lg:cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOrderClick) {
                    onOrderClick({ ...order, type: activeTab });
                  }
                }}
              >
                <td className="cursor-pointer px-2 py-3 text-sm text-primary-text">
                  ${order.price}
                </td>
                <td className="cursor-pointer px-2 py-3 text-sm text-primary-text">
                  {order.amount}
                </td>
                <td className="cursor-pointer px-2 py-3 text-sm text-primary-text">
                  ${order.totalValue}
                </td>
                <td className="cursor-pointer px-2 py-3 text-sm text-primary-text">
                  {order.collateral}
                </td>
                <td className="cursor-pointer px-2 py-3 text-sm text-primary">{order.seller}</td>
                <td className="cursor-pointer px-2 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn('relative h-6 px-4', {
                      'border-danger/15 bg-danger/15 text-danger group-hover:bg-danger':
                        activeTab === 'buy',
                      'border-success/15 bg-success/15 text-success group-hover:bg-success':
                        activeTab === 'sell',
                      'bg-success': selectedOrder?.id === order.id && activeTab === 'sell',
                      'bg-danger': selectedOrder?.id === order.id && activeTab === 'buy',
                    })}
                  >
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center opacity-0 transition-all group-hover:opacity-100',
                        {
                          'opacity-100': selectedOrder?.id === order.id,
                        }
                      )}
                    >
                      <ArrowRight className={cn('h-4 w-4 text-inverse', {})} />
                    </div>
                    <span
                      className={cn('transition-all group-hover:opacity-0', {
                        'opacity-0': selectedOrder?.id === order.id,
                      })}
                    >
                      {activeTab === 'buy' ? 'Sell' : 'Buy'}
                    </span>
                  </Button>
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
        {!hasMore && currentOrders.length > 0 && (
          <div className="py-4 text-center text-sm text-secondary-text">
            No more {activeTab} orders
          </div>
        )}
      </div>
    </div>
  );
}
