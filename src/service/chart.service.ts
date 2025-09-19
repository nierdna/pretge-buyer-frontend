import axiosInstance from './axios';

export interface ChartDataPoint {
  time: string;
  price: number;
  change?: number;
}

// Updated interface to match actual API response
export interface APIPrice {
  USD: number;
  BTC: number;
  ETH: number;
  BNB: number;
  SOL: number;
}

export interface APIResponse {
  timestamps: number[];
  data: {
    [currencyId: string]: {
      prices: APIPrice[];
      fdv: number[];
      volumes24h: number[];
      marketCaps: number[];
      // ... other fields
    };
  };
}

export interface ChartHistoricalResponse {
  success: boolean;
  data: {
    historical: ChartDataPoint[];
    priceChange?: {
      absolute: number;
      percentage: number;
    };
  };
}

export type ChartTimeframe = '1D' | '1W' | '1M' | '3M' | '1Y';

export const chartService = {
  /**
   * Get historical price data for chart
   */
  async getHistoricalData(
    currencyId: string | number,
    timeframe: ChartTimeframe = '1W'
  ): Promise<ChartHistoricalResponse> {
    try {
      // Try direct fetch first to handle CORS better
      const url = `https://api2.icodrops.com/portfolio/api/currencyHistorical?timeframe=${timeframe}&currencyIds=${currencyId}&withPriceChange=true`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Origin: 'https://dropstab.com',
          Referer: 'https://dropstab.com/',
          authorization: 'undefined',
          'content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: APIResponse = await response.json();

      // Transform API data to our expected format
      const currencyData = apiData.data[currencyId.toString()];

      if (
        apiData.timestamps &&
        currencyData &&
        currencyData.prices &&
        apiData.timestamps.length > 0 &&
        currencyData.prices.length > 0
      ) {
        // Combine timestamps with prices to create historical data
        const historical: ChartDataPoint[] = apiData.timestamps
          .map((timestamp, index) => ({
            time: new Date(timestamp).toISOString(),
            price: currencyData.prices[index]?.USD || 0,
          }))
          .filter((point) => point.price > 0);

        // Calculate price change
        const firstPrice = historical[0]?.price || 0;
        const lastPrice = historical[historical.length - 1]?.price || 0;
        const absoluteChange = lastPrice - firstPrice;
        const percentageChange = firstPrice > 0 ? (absoluteChange / firstPrice) * 100 : 0;

        return {
          success: true,
          data: {
            historical,
            priceChange: {
              absolute: absoluteChange,
              percentage: percentageChange,
            },
          },
        };
      } else {
        throw new Error('Invalid or empty historical data from API');
      }
    } catch (error) {
      console.error('Direct fetch failed, trying axios:', error);

      // Fallback to axios
      try {
        const response = await axiosInstance.get(
          `https://api2.icodrops.com/portfolio/api/currencyHistorical`,
          {
            params: {
              timeframe,
              currencyIds: currencyId,
              withPriceChange: true,
            },
            headers: {
              Accept: '*/*',
              Origin: 'https://dropstab.com',
              Referer: 'https://dropstab.com/',
              authorization: 'undefined',
              'content-type': 'application/json',
            },
          }
        );

        const apiData: APIResponse = response.data;
        const currencyData = apiData.data[currencyId.toString()];

        if (
          apiData.timestamps &&
          currencyData &&
          currencyData.prices &&
          apiData.timestamps.length > 0 &&
          currencyData.prices.length > 0
        ) {
          // Combine timestamps with prices to create historical data
          const historical: ChartDataPoint[] = apiData.timestamps
            .map((timestamp, index) => ({
              time: new Date(timestamp).toISOString(),
              price: currencyData.prices[index]?.USD || 0,
            }))
            .filter((point) => point.price > 0);

          // Calculate price change
          const firstPrice = historical[0]?.price || 0;
          const lastPrice = historical[historical.length - 1]?.price || 0;
          const absoluteChange = lastPrice - firstPrice;
          const percentageChange = firstPrice > 0 ? (absoluteChange / firstPrice) * 100 : 0;

          return {
            success: true,
            data: {
              historical,
              priceChange: {
                absolute: absoluteChange,
                percentage: percentageChange,
              },
            },
          };
        } else {
          throw new Error('Invalid or empty historical data from axios');
        }
      } catch (axiosError) {
        console.error('Both fetch methods failed:', axiosError);
        return {
          success: false,
          data: {
            historical: [],
          },
        };
      }
    }
  },

  /**
   * Transform API data to TradingView format
   */
  transformToTradingViewData(data: ChartDataPoint[]) {
    return data
      .map((point) => ({
        time: (new Date(point.time).getTime() / 1000) as any,
        value: parseFloat(String(point.price)) || 0,
      }))
      .filter((point) => point.value > 0) // Filter out invalid prices
      .sort((a, b) => a.time - b.time); // Ensure chronological order
  },

  /**
   * Generate mock data for development/fallback
   */
  generateMockData(days: number = 30): any[] {
    const data = [];
    const basePrice = 0.6379;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice + variation;

      data.push({
        time: Math.floor(time.getTime() / 1000),
        value: Math.max(0.5, Math.min(0.8, price)),
      });
    }

    return data;
  },
};
