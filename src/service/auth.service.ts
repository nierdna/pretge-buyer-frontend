import { ChainType } from '@/server/enums/chain';
import { IToken } from '@/types/token';
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

export interface ProfileResponse {
  data: {
    user: User;
    wallets: Wallet[];
    currentWallet: {
      address: string;
      chainType: ChainType;
    };
  };
  success: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface BalanceResponse {
  success: boolean;
  data: {
    chainType: string;
    walletAddress: string;
    walletId: string;
    balances: {
      balance: number;
      exTokenId: string;
      exTokens: IToken;
    }[];
  };
  message: string;
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

  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosInstance.get('/profile', {
      headers: {
        Authorization: true,
      },
    });
    return response.data;
  }

  async updateProfile(data: {
    name: string;
    description: string;
    avatar: string;
  }): Promise<UpdateProfileResponse> {
    const response = await axiosInstance.put('/profile', data, {
      headers: {
        Authorization: true,
      },
    });
    return response.data;
  }
  async getBalance(): Promise<BalanceResponse> {
    const response = await axiosInstance.get('/balance', {
      headers: {
        Authorization: true,
      },
    });
    return response.data;
  }
}

export default AuthService;
