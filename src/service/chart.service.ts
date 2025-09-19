import axiosInstance from './axios';

export interface ChartDataPoint {
  time: string;
  price: number;
  change?: number;
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

      const data = await response.json();

      return {
        success: true,
        data: {
          historical: data.historical || [],
          priceChange: data.priceChange,
        },
      };
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

        return {
          success: true,
          data: {
            historical: response.data.historical || [],
            priceChange: response.data.priceChange,
          },
        };
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
      .filter((point) => point.value > 0); // Filter out invalid prices
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
