import axiosInstance from './axios';

interface ReferralResponse {
  success: boolean;
  data: any;
  message?: string;
}

export class ReferralService {
  async getMyCode(): Promise<ReferralResponse> {
    const response = await axiosInstance.get('/referral/my-code');
    return response.data;
  }

  async validateCode(code: string): Promise<ReferralResponse> {
    const response = await axiosInstance.get(`/referral/validate-code?code=${code}`);
    return response.data;
  }

  async setReferrer(inviteCode: string): Promise<ReferralResponse> {
    const response = await axiosInstance.post('/referral/set-referrer', {
      inviteCode,
    });
    return response.data;
  }
}
