import axios from 'axios';
import axiosInstance from './axios';

export interface ITokenFilter {
  search?: string;
  network_id?: string;
  statuses?: string[];
  page?: number;
  limit?: number;
}

// Interface cho Web3 Radar API response
export interface IWeb3RadarProject {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  logo?: string;
  categories?: string[];
  chains?: string[];
  marketCap?: number;
  price?: number;
  volume24h?: number;
  change24h?: number;
  [key: string]: any; // Allow additional properties from API
}

export interface IWeb3RadarResponse {
  success: boolean;
  data: IWeb3RadarProject | null;
  message?: string;
}

export class TokenService {
  async getTokens(filters: ITokenFilter) {
    const response = await axiosInstance.get('/tokens', {
      params: {
        search: filters.search || undefined,
        network_id: filters.network_id || undefined,
        statuses: filters.statuses?.join(',') || undefined,
        page: filters.page || 1,
        limit: filters.limit || 12,
      },
    });
    return response.data;
  }

  async getTokenBySymbol(symbol: string) {
    const response = await axiosInstance.get(`/tokens/${symbol}`);
    return response.data;
  }

  // Method để gọi Web3 Radar API
  async getProjectBySymbol(symbol: string): Promise<IWeb3RadarResponse> {
    try {
      const response = await axios.post(
        'https://web3-radar-crawler-v1-production.up.railway.app/api/projects/get-by-symbol',
        { symbol },
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.7',
            'content-type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error: any) {
      console.error('Failed to fetch project from Web3 Radar:', error);

      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to fetch project data',
      };
    }
  }
}
