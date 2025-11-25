'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import OrderbookSection from './trade/OrderbookSection';
import RecentTradesSection from './trade/RecentTradesSection';
import TradePanel from './trade/TradePanel';

export interface SelectedOrder {
  id: string;
  price: string;
  amount: string;
  totalValue: string;
  collateral: string;
  seller: string;
  type: 'buy' | 'sell';
}

export default function TradeView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const { isMobile, isTablet } = useIsMobile();

  const handleOrderClick = (order: SelectedOrder) => {
    setSelectedOrder(order);
    if (isMobile || isTablet) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="border-b border-border">
      <div className="flex flex-col lg:flex-row">
        {/* Left side: Orderbook and Recent Trades */}
        <div className="flex-1 border-b border-border lg:border-b-0 lg:border-r">
          <OrderbookSection onOrderClick={handleOrderClick} selectedOrder={selectedOrder} />
          <RecentTradesSection />
        </div>

        {/* Right side: Trade Panel - Hidden on mobile (<1024px) */}
        <div className="hidden w-full lg:block lg:max-w-[384px]">
          <TradePanel selectedOrder={selectedOrder} />
        </div>
      </div>

      {/* Mobile Modal for Trade Panel */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-[550px] overflow-y-auto p-0"
        >
          <TradePanel selectedOrder={selectedOrder} onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
