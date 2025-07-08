import { ChainType } from '@/server/enums/chain';
import { User, Wallet } from '@/types/user';
import axiosInstance from './axios';

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
    wallet: Wallet;
  };
  success: boolean;
}

export interface NonceResponse {
  nonce: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginMessageResponse {
  message: string;
  success: boolean;
  timestamp: number;
}

class AuthService {
  async loginMessage(walletAddress: string, chainType: ChainType): Promise<LoginMessageResponse> {
    const response = await axiosInstance.post('/auth/login-message', {
      walletAddress,
      chainType,
    });
    return response.data;
  }

  async login(
    walletAddress: string,
    signature: string,
    message: string,
    timestamp: number,
    chainType: ChainType
  ): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', {
      walletAddress,
      signature,
      message,
      timestamp,
      chainType,
    });
    console.log('response', response);

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
