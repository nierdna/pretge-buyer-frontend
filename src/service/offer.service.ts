import type { IOffer, Offer } from '@/types/offer';
import { IOrder } from '@/types/order';
import axiosInstance from './axios';

interface OfferResponse {
  data: Offer | null;
  message?: string;
}

interface OffersResponse {
  data: Offer[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}
interface OffersResponseV2 {
  data: {
    data: IOffer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

interface OfferByIdResponse {
  data: IOffer;
  message?: string;
  success: boolean;
}

interface OrdersResponse {
  data: {
    data: IOrder[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

export interface IOfferFilter {
  limit?: number;
  page?: number;
  networkIds?: string[];
  collateralPercents?: string[];
  settleDurations?: string[];
  sortField?: string;
  sortOrder?: string;
  search?: string;
  tokenId?: string;
  status?: string;
  status_token?: string;
}

export class OfferService {
  // Helper function to map frontend field names to backend field names
  private mapSortField(fieldName?: string): string | undefined {
    if (!fieldName) return undefined;

    const fieldMapping: Record<string, string> = {
      collateralPercent: 'collateral_percent',
      settleDuration: 'settle_duration',
      // Note: 'filled' and 'quantity' don't need mapping as they match database field names
    };

    return fieldMapping[fieldName] || fieldName;
  }

  async getOffers(filters?: IOfferFilter): Promise<OffersResponseV2> {
    // Map sort field to API format
    const sortField = this.mapSortField(filters?.sortField);

    const params: Record<string, any> = {};

    // Handle array parameters
    if (filters?.networkIds && filters.networkIds.length > 0) {
      params.network_ids = filters.networkIds.join(',');
    }
    if (filters?.collateralPercents && filters.collateralPercents.length > 0) {
      params.collateral_percents = filters.collateralPercents.join(',');
    }
    if (filters?.settleDurations && filters.settleDurations.length > 0) {
      params.settle_durations = filters.settleDurations.join(',');
    }

    // Handle string parameters
    if (filters?.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters?.tokenId && filters.tokenId.trim()) {
      params.token_id = filters.tokenId.trim();
    }

    // Always include page and limit with defaults
    params.page = filters?.page || 1;
    params.limit = filters?.limit || 10;
    params.status = filters?.status;
    params.status_token = filters?.status_token;

    // Handle sort parameters
    if (sortField) {
      params.sort_field = sortField;
      // Always include sort_order when sort_field is provided
      params.sort_order = filters?.sortOrder || 'desc';
    }

    const response = await axiosInstance.get('/offers', { params });
    return response.data;
  }

  async getOfferById(id: string): Promise<OfferByIdResponse> {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
  }

  async getOrdersByOffer(
    offerId: string,
    params?: { page?: number; limit?: number; address?: string }
  ): Promise<OrdersResponse> {
    const response = await axiosInstance.get(`/offers/${offerId}/orders`, { params });
    return response.data;
  }

  async getOffersByUserId(userId: string, filters?: IOfferFilter): Promise<OffersResponseV2> {
    // Map sort field to API format
    const sortField = this.mapSortField(filters?.sortField);

    const params: Record<string, any> = {};

    // Handle array parameters
    if (filters?.networkIds && filters.networkIds.length > 0) {
      params.network_ids = filters.networkIds.join(',');
    }
    if (filters?.collateralPercents && filters.collateralPercents.length > 0) {
      params.collateral_percents = filters.collateralPercents.join(',');
    }
    if (filters?.settleDurations && filters.settleDurations.length > 0) {
      params.settle_durations = filters.settleDurations.join(',');
    }

    // Handle string parameters
    if (filters?.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters?.tokenId && filters.tokenId.trim()) {
      params.token_id = filters.tokenId.trim();
    }

    // Always include page and limit with defaults
    params.page = filters?.page || 1;
    params.limit = filters?.limit || 10;

    // Handle sort parameters
    if (sortField) {
      params.sort_field = sortField;
      // Always include sort_order when sort_field is provided
      params.sort_order = filters?.sortOrder || 'desc';
    }

    const response = await axiosInstance.get(`/users/${userId}/offers`, { params });
    return response.data;
  }

  async getFlashSaleOffers(): Promise<any> {
    const response = await axiosInstance.get('/flash-sale');
    return response.data;
  }
}
