import { User } from '@/store/authStore';
import axiosInstance from './axios';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  address: string;
}

export interface NonceResponse {
  nonce: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(address: string, nonce: string): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/base/login', {
      address,
      nonce,
    });
    return response.data;
  }
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post('/auth/base/refresh', {
      refreshToken,
    });
    return response.data;
  }

  async getNonce(address: string): Promise<NonceResponse> {
    const response = await axiosInstance.get('/auth/base/nonce', {
      params: {
        address,
      },
    });
    return response.data;
  }
}

export default AuthService;
