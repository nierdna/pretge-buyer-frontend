import axiosInstance from './axios';

export interface ITokenFilter {
  search?: string;
  network_id?: string;
  statuses?: string[];
  page?: number;
  limit?: number;
}

class TokenService {
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
}

export default new TokenService();
