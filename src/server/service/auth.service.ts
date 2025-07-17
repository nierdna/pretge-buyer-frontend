import { supabase } from '../db/supabase';
import { User } from '../types/user';
import { Wallet } from '../types/wallet';
import { BaseLoginRequest, validateBaseLoginRequest } from '../utils/base';
import { generateTokenPair } from '../utils/jwt';
import { SolanaLoginRequest, validateSolanaLoginRequest } from '../utils/solana';

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    wallet: Wallet;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  // Login with Base network (EVM) wallet
  static async loginWithBase(loginRequest: BaseLoginRequest): Promise<LoginResponse> {
    try {
      // Validate login request
      const validation = validateBaseLoginRequest(loginRequest);
      if (!validation.success) {
        return {
          success: false,
          message: validation.message,
        };
      }

      const { walletAddress } = loginRequest;

      // Check if wallet exists
      let wallet = await this.getWalletByAddress(walletAddress, 'evm');

      if (!wallet) {
        // Create new user and wallet
        const user = await this.createUser(walletAddress);
        wallet = await this.createWallet(user.id, walletAddress, 'evm');
      } else {
        if (wallet.roles.includes('seller')) {
          return {
            success: false,
            message:
              'This wallet is already registered as a seller. Please connect with another wallet.',
          };
        }

        // Get user for existing wallet
        const user = await this.getUserById(wallet.userId!);
        if (!user) {
          return {
            success: false,
            message: 'User not found',
          };
        }
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(wallet.userId!, walletAddress, 'evm');

      const user = await this.getUserById(wallet.userId!);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: {
          user,
          wallet,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Base login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  // Login with Solana wallet
  static async loginWithSolana(loginRequest: SolanaLoginRequest): Promise<LoginResponse> {
    try {
      // Validate login request
      const validation = validateSolanaLoginRequest(loginRequest);
      if (!validation.success) {
        return {
          success: false,
          message: validation.message,
        };
      }

      const { walletAddress } = loginRequest;

      // Check if wallet exists
      let wallet = await this.getWalletByAddress(walletAddress, 'sol');

      if (!wallet) {
        // Create new user and wallet
        const user = await this.createUser(walletAddress);
        wallet = await this.createWallet(user.id, walletAddress, 'sol');
      } else {
        if (wallet.roles.includes('seller')) {
          return {
            success: false,
            message:
              'This wallet is already registered as a seller. Please connect with another wallet.',
          };
        }
        // Get user for existing wallet
        const user = await this.getUserById(wallet.userId!);
        if (!user) {
          return {
            success: false,
            message: 'User not found',
          };
        }
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(wallet.userId!, walletAddress, 'sol');

      const user = await this.getUserById(wallet.userId!);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: {
          user,
          wallet,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  // Refresh access token
  static async refreshToken(userId: string): Promise<RefreshTokenResponse> {
    try {
      // Check if user exists
      const user = await this.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Get user's primary wallet
      const wallet = await this.getPrimaryWalletByUserId(userId);
      if (!wallet) {
        return {
          success: false,
          message: 'No wallet found for user',
        };
      }

      // Generate new tokens
      const { accessToken, refreshToken } = generateTokenPair(
        userId,
        wallet.address,
        wallet.chainType
      );

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Token refresh failed',
      };
    }
  }

  // Get wallet by address and chain type
  private static async getWalletByAddress(address: string, chainType: 'evm' | 'sol' | 'sui') {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('address', address)
      .eq('chain_type', chainType)
      .single();

    if (error) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      chainType: data.chain_type,
      address: data.address,
      isPrimary: data.is_primary,
      createdAt: data.created_at,
      roles: data.roles,
    } as Wallet;
  }

  // Get primary wallet by user ID
  private static async getPrimaryWalletByUserId(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      chainType: data.chain_type,
      address: data.address,
      isPrimary: data.is_primary,
      createdAt: data.created_at,
    } as Wallet;
  }

  // Create new user
  private static async createUser(walletAddress: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: `User_${walletAddress.slice(0, 8)}`,
        avatar: null,
        banner: null,
        description: null,
        social_media: {
          twitter: '',
          telegram: '',
          discord: '',
          instagram: '',
          facebook: '',
          youtube: '',
        },
        kyc_status: 'pending',
        status: 'active',
        roles: 'buyer',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar,
      banner: data.banner,
      description: data.description,
      socialMedia: data.social_media,
      kycStatus: data.kyc_status,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as User;
  }

  // Create new wallet
  private static async createWallet(
    userId: string,
    address: string,
    chainType: 'evm' | 'sol' | 'sui'
  ): Promise<Wallet> {
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        chain_type: chainType,
        address,
        is_primary: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create wallet: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      chainType: data.chain_type,
      address: data.address,
      isPrimary: data.is_primary,
      createdAt: data.created_at,
    } as Wallet;
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar,
      banner: data.banner,
      description: data.description,
      socialMedia: data.social_media,
      kycStatus: data.kyc_status,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as User;
  }
}
