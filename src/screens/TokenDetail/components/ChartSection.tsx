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

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    price: number;
    marketCap: number;
    volume: number;
    time: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    price: 0,
    marketCap: 0,
    volume: 0,
    time: '',
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
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false,
        axisDoubleClickReset: false,
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

    // Add crosshair move handler for tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time || !param.seriesPrices) {
        setTooltipData((prev) => ({ ...prev, visible: false }));
        return;
      }

      const seriesPrice = param.seriesPrices.get(areaSeries);
      if (!seriesPrice) {
        setTooltipData((prev) => ({ ...prev, visible: false }));
        return;
      }

      const price = typeof seriesPrice === 'number' ? seriesPrice : (seriesPrice as any).value || 0;
      // Mock market cap and volume based on price (in real app, these would come from API)
      const marketCap = price * 1000000000; // Mock market cap
      const volume = price * 50000000; // Mock volume

      // Format time
      const timeStr = new Date((param.time as number) * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setTooltipData({
        visible: true,
        x: param.point.x,
        y: param.point.y,
        price,
        marketCap,
        volume,
        time: timeStr,
      });
    });

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

      if (response.success && response.data.historical && response.data.historical.length > 0) {
        // Use real data from API
        const chartData = chartService.transformToTradingViewData(response.data.historical);

        if (chartData.length > 0 && seriesRef.current) {
          seriesRef.current.setData(chartData);

          // Use price change from API if available, otherwise calculate
          const current = chartData[chartData.length - 1]?.value || 0;
          let change = 0;
          let changePercent = 0;

          if (response.data.priceChange) {
            // Use API provided price change data
            change = response.data.priceChange.absolute || 0;
            changePercent = response.data.priceChange.percentage || 0;
          } else {
            // Fallback: calculate from chart data
            const firstPrice = chartData[0]?.value || 0;
            change = current - firstPrice;
            changePercent = firstPrice > 0 ? (change / firstPrice) * 100 : 0;
          }

          setPriceData({
            current,
            change,
            changePercent,
          });

          // Fit chart to data
          if (chartRef.current?.timeScale) {
            chartRef.current.timeScale().fitContent();
          }

          console.log(
            `Successfully loaded ${chartData.length} data points from API for ${timeframe}`
          );
          return; // Exit early on success
        }
      }

      // Only use mock data if API completely fails or returns no data
      console.warn('API returned no valid data, using mock data as fallback');
      const mockData = chartService.generateMockData();
      if (seriesRef.current && mockData.length > 0) {
        seriesRef.current.setData(mockData);

        // Calculate mock price data
        const latestPrice = mockData[mockData.length - 1]?.value || 0;
        const firstPrice = mockData[0]?.value || 0;
        const priceChange = latestPrice - firstPrice;
        const changePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

        setPriceData({
          current: latestPrice,
          change: priceChange,
          changePercent: changePercent,
        });
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);

      // Use mock data only as last resort
      const mockData = chartService.generateMockData();
      if (seriesRef.current && mockData.length > 0) {
        seriesRef.current.setData(mockData);

        // Calculate mock price data
        const latestPrice = mockData[mockData.length - 1]?.value || 0;
        const firstPrice = mockData[0]?.value || 0;
        const priceChange = latestPrice - firstPrice;
        const changePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

        setPriceData({
          current: latestPrice,
          change: priceChange,
          changePercent: changePercent,
        });
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

  const formatMarketCap = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
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

        {/* Custom Tooltip */}
        {tooltipData.visible && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
            style={{
              left: tooltipData.x > 200 ? tooltipData.x - 180 : tooltipData.x + 10,
              top: tooltipData.y > 100 ? tooltipData.y - 100 : tooltipData.y + 10,
            }}
          >
            <div className="space-y-2 text-xs">
              <div className="border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600">{tooltipData.time}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Price:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(tooltipData.price)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Market Cap:</span>
                <span className="font-semibold text-gray-900">
                  {formatMarketCap(tooltipData.marketCap)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Volume:</span>
                <span className="font-semibold text-gray-900">
                  {formatVolume(tooltipData.volume)}
                </span>
              </div>
            </div>
          </div>
        )}
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
