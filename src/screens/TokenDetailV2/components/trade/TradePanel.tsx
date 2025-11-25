'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { formatNumberShort } from '@/utils/helpers/number';
import { transformToNumber } from '@/utils/helpers/string';
import { ArrowDown, Info, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SelectedOrder {
  price: string;
  amount: string;
  totalValue: string;
  collateral: string;
  seller: string;
  type: 'buy' | 'sell';
}

interface TradePanelProps {
  selectedOrder?: SelectedOrder | null;
  onClose?: () => void;
}

export default function TradePanel({ selectedOrder, onClose }: TradePanelProps) {
  const [amount, setAmount] = useState('');
  const [buyToken, setBuyToken] = useState({ symbol: 'XPL', logo: '' });
  const [sellToken, setSellToken] = useState({ symbol: 'ETH', logo: '' });
  const [collateral, setCollateral] = useState(25);
  const [activePercentage, setActivePercentage] = useState(25);
  const [maxAmount, setMaxAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(100);
  const handleAmountChange = (value: string) => {
    const _value = transformToNumber(value);
    setAmount(_value);
    const numValue = parseFloat(_value) || 0;
    const percentage = maxAmount > 0 ? numValue / maxAmount : 0;
    setSliderValue(Math.round(percentage * 4));
  };

  // Auto-fill data when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      // Parse amount and remove commas
      const amount = selectedOrder.amount.replace(/,/g, '');
      setAmount(amount);
      // Parse collateral percentage
      const collateralValue = parseInt(selectedOrder.collateral.replace('%', ''));
      setCollateral(collateralValue);
      setActivePercentage(collateralValue);
    }
  }, [selectedOrder]);

  const isBuy = selectedOrder?.type === 'buy';

  return (
    <div className="flex w-full flex-col border-b border-border">
      {/* Header */}
      <div className="p-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <RefreshCw className="h-5 w-5 text-primary-text sm:h-6 sm:w-6" />
            <h2 className="text-base font-semibold text-primary-text sm:text-lg">Trade</h2>
          </div>
          {/* Close button for mobile modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-md p-1 hover:bg-card lg:hidden"
            >
              <X className="h-5 w-5 text-primary-text" />
            </button>
          )}
        </div>
      </div>

      {/* Swap Fields */}
      <div className="px-4">
        <Card className="bg-card">
          <CardContent className="relative flex flex-col divide-y divide-border p-0">
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-secondary-text">{isBuy ? 'Sell' : 'Buy'}</Label>
                <span className="flex items-center gap-2 text-sm text-secondary-text">
                  Available:{' '}
                  <span className="flex items-center gap-1 font-medium">
                    {formatNumberShort(selectedOrder?.amount) || 0}
                    {/* <div className="mb-0.5 rounded-full border border-border">
                      <img
                        src="https://lighter.pretgemarket.xyz/lighter.jpg"
                        alt="Lighter"
                        className="h-4 w-4 rounded-full"
                      />
                    </div> */}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 !text-3xl !font-bold shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0"
                  // disabled={isSubmitting}
                />
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-border px-3 py-2 sm:gap-4 sm:px-4">
                  <div className="flex items-center gap-1.5">
                    {buyToken.logo && (
                      <div className="relative h-5 w-5 overflow-hidden rounded-full">
                        <Image
                          src={buyToken.logo}
                          alt={buyToken.symbol}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm text-primary-text">{buyToken.symbol}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center border-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
                <ArrowDown
                  className={cn('size-5 transition-transform', {
                    'rotate-180': !isBuy,
                  })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-secondary-text">{isBuy ? 'Receiving' : 'Paying'}</Label>
                <span className="flex items-center gap-2 text-sm text-secondary-text">
                  Balance:{' '}
                  <span className="flex items-center gap-1 font-medium">
                    {formatNumberShort(selectedOrder?.amount) || 0}
                    {/* <div className="mb-0.5 rounded-full border border-border">
                      <img
                        src="https://lighter.pretgemarket.xyz/lighter.jpg"
                        alt="Lighter"
                        className="h-4 w-4 rounded-full"
                      />
                    </div> */}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 !text-3xl !font-bold shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0"
                  readOnly
                />
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-border px-3 py-2 sm:gap-4 sm:px-4">
                  <div className="flex items-center gap-1.5">
                    {sellToken.logo && (
                      <div className="relative h-5 w-5 overflow-hidden rounded-full">
                        <Image
                          src={sellToken.logo}
                          alt={sellToken.symbol}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm text-primary-text">{sellToken.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collateral Slider */}
      <div className="flex flex-col gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary-text sm:text-sm">Collateral</span>
          <Info className="h-3 w-3 text-primary-text" />
        </div>

        <div className="relative">
          {/* Slider with dots */}
          <div className="relative py-2">
            <Slider
              value={[sliderValue]}
              onValueChange={(value) => setSliderValue(value[0])}
              min={0}
              max={100}
              step={25}
              className="w-full"
            />

            {/* Dots at 0%, 25%, 50%, 75%, 100% */}
            <div className="pointer-events-none absolute left-0 top-1/2 flex w-full -translate-y-1/2 justify-between">
              <div
                className={cn('h-3 w-3 rounded-full border-2 border-border bg-background', {
                  'border-primary-text': sliderValue >= 0,
                })}
              />
              <div
                className={cn('h-3 w-3 rounded-full border-2 border-border bg-background', {
                  '!border-primary-text': sliderValue >= 25,
                })}
              />
              <div
                className={cn('h-3 w-3 rounded-full border-2 border-border bg-background', {
                  'border-primary-text': sliderValue >= 50,
                })}
              />
              <div
                className={cn('h-3 w-3 rounded-full border-2 border-border bg-background', {
                  'border-primary-text': sliderValue >= 75,
                })}
              />
              <div
                className={cn('h-3 w-3 rounded-full border-2 border-border bg-background', {
                  'border-primary-text': sliderValue >= 100,
                })}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="flex items-start justify-between text-xs text-primary-text sm:text-sm">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <div className="px-4 py-4 sm:px-6">
        <Button className="h-10 w-full rounded-full bg-warning text-sm font-medium text-black hover:bg-warning/90 sm:h-12 sm:text-base">
          Connect Wallet
        </Button>
      </div>

      {/* Order Summary */}
      <div className="flex flex-col gap-2.5 px-4 py-4 sm:px-6">
        <p className="text-xs font-medium text-primary-text sm:text-sm">
          You are creating an order for:
        </p>

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-icon-tertiary">Amount</span>
          <span className="break-all text-right font-medium text-primary-text">
            {selectedOrder ? `${selectedOrder.amount} XPL` : '--'}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-icon-tertiary">At a rate of</span>
          <span className="break-all text-right font-medium text-primary-text">
            {selectedOrder ? `$${selectedOrder.price}` : '--'}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-icon-tertiary">You will receive</span>
          <span className="break-all text-right font-medium text-primary-text">
            {selectedOrder ? `$${selectedOrder.totalValue}` : '--'}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="shrink-0 text-icon-tertiary">Your locked collateral</span>
          <span className="break-all text-right font-medium text-primary-text">
            {selectedOrder ? selectedOrder.collateral : '--'}
          </span>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-icon-tertiary">Platform Fee</span>
          <span className="font-medium text-primary-text">--</span>
        </div>
      </div>
    </div>
  );
}
