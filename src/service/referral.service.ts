import { ReferralRewardsListResponse, ReferralRewardsQueryParams } from '@/types/referral';
import axiosInstance from './axios';

interface ReferralResponse {
  success: boolean;
  data: any;
  message?: string;
}

export class ReferralService {
  async getMyCode(): Promise<ReferralResponse> {
    const response = await axiosInstance.get('/referral/my-code', {
      headers: {
        Authorization: true,
      },
    });
    return response.data;
  }

  async validateCode(code: string): Promise<ReferralResponse> {
    const response = await axiosInstance.get(`/referral/validate-code?code=${code}`);
    return response.data;
  }

  async setReferrer(inviteCode: string): Promise<ReferralResponse> {
    const response = await axiosInstance.post(
      '/referral/set-referrer',
      {
        inviteCode,
      },
      {
        headers: {
          Authorization: true,
        },
      }
    );
    return response.data;
  }

  // Get referral rewards list for authenticated user
  async getReferralRewards(
    params: ReferralRewardsQueryParams = {}
  ): Promise<ReferralRewardsListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortField) queryParams.append('sortField', params.sortField);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await axiosInstance.get(`/referral/rewards?${queryParams.toString()}`);
    return response.data;
  }
}
