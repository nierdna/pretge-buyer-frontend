'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chartService, ChartTimeframe } from '@/service/chart.service';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChartSectionProps {
  currencyId?: string | number;
  tokenSymbol?: string;
  className?: string;
}

const ChartSection = ({
  currencyId = '86980',
  tokenSymbol = 'XPL',
  className,
}: ChartSectionProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  const [activeTimeframe, setActiveTimeframe] = useState<ChartTimeframe>('1W');
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState<{
    current: number;
    change: number;
    changePercent: number;
  }>({
    current: 0.6379,
    change: 0.0,
    changePercent: 0.0,
  });

  const timeframes: { label: string; value: ChartTimeframe }[] = [
    { label: '24h', value: '1D' },
    { label: '7d', value: '1W' },
    { label: '1m', value: '1M' },
    { label: '3m', value: '3M' },
    { label: '1y', value: '1Y' },
  ];

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        fontSize: 12,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      },
      grid: {
        vertLines: {
          color: '#f0f0f0',
        },
        horzLines: {
          color: '#f0f0f0',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#999999',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: '#999999',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create area series with v3.8.0 API
    const areaSeries = chart.addAreaSeries({
      lineColor: '#2962FF',
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.04)',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Fetch chart data
  const fetchChartData = async (timeframe: ChartTimeframe) => {
    setIsLoading(true);
    try {
      // Try to fetch real data first
      const response = await chartService.getHistoricalData(currencyId, timeframe);

      let chartData;
      if (response.success && response.data.historical && response.data.historical.length > 0) {
        chartData = chartService.transformToTradingViewData(response.data.historical);
      } else {
        // Fallback to mock data
        console.log('Using mock data as fallback');
        chartData = chartService.generateMockData();
      }

      if (seriesRef.current && chartData.length > 0) {
        seriesRef.current.setData(chartData);

        // Update price data
        const latestPrice = chartData[chartData.length - 1]?.value || 0;
        const firstPrice = chartData[0]?.value || 0;
        const priceChange = latestPrice - firstPrice;
        const changePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

        setPriceData({
          current: latestPrice,
          change: priceChange,
          changePercent: changePercent,
        });

        // Fit chart to data
        if (chartRef.current?.timeScale) {
          chartRef.current.timeScale().fitContent();
        }
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      // Use mock data on error
      const mockData = chartService.generateMockData();
      if (seriesRef.current) {
        seriesRef.current.setData(mockData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when timeframe changes
  useEffect(() => {
    fetchChartData(activeTimeframe);
  }, [activeTimeframe, currencyId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const isPositive = priceData.changePercent >= 0;

  return (
    <div className={cn('w-full p-6', className)}>
      {/* Header with price info */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{tokenSymbol} Price</h3>
            <Badge variant="outline" className="text-xs">
              USD
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPrice(priceData.current)}</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                {priceData.changePercent.toFixed(2)}%
              </span>
              <span className="text-sm text-gray-400">
                ({isPositive ? '+' : ''}
                {formatPrice(priceData.change)})
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe controls */}
        <div className="flex items-center gap-1 rounded-lg bg-white p-1">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-3 text-xs font-medium',
                activeTimeframe === timeframe.value
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-black'
              )}
              onClick={() => setActiveTimeframe(timeframe.value)}
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-900/50">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              Loading chart data...
            </div>
          </div>
        )}
        <div
          ref={chartContainerRef}
          className="h-[400px] w-full rounded-lg border border-gray-200 bg-white"
        />
      </div>

      {/* Chart info footer */}
      {/* <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>TradingView Lightweight Charts™ v3.8.0</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div> */}
    </div>
  );
};

export default ChartSection;
