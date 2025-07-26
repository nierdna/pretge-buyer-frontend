'use client';

import { chainConfigs } from '@/configs/chains';
import { ChainType } from '@/server/enums/chain';
import { Service } from '@/service';
import { useAuthStore } from '@/store/authStore';
import type { Provider as SolanaProvider } from '@reown/appkit-adapter-solana/react';
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
  type Provider,
} from '@reown/appkit/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import bs58 from 'bs58';

export const useAuth = () => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const { walletProvider: solanaWalletProvider } = useAppKitProvider<SolanaProvider>('solana');
  const { walletProvider: evmWalletProvider } = useAppKitProvider<Provider>('eip155');

  const { disconnect } = useDisconnect();
  const { setTokens, logout, user, accessToken, setWalletAddress, walletAddress } = useAuthStore();

  // Generate login message
  const generateLoginMessage = useMutation({
    mutationFn: async ({
      walletAddress,
      chainType,
    }: {
      walletAddress: string;
      chainType: ChainType;
    }) => {
      const response = await Service.auth.loginMessage(walletAddress, chainType);
      return response;
    },
  });

  // Login with wallet
  const loginWithWallet = useMutation({
    mutationFn: async ({
      walletAddress,
      signature,
      message,
      timestamp,
      chainType,
    }: {
      walletAddress: string;
      signature: string;
      message: string;
      timestamp: number;
      chainType: ChainType;
    }) => {
      const response = await Service.auth.login(
        walletAddress,
        signature,
        message,
        timestamp,
        chainType
      );
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setTokens(data.data.accessToken, data.data.refreshToken);
        setWalletAddress(data.data.wallet.address);
        toast.success('Login successful', {
          description: `Welcome ${data.data.user.name || data.data.wallet.address}!`,
        });
      }
    },
    onError: (error: any) => {
      console.log('error', error);
      throw { ...error, message: error.response?.data?.message };
    },
  });

  // Handle login process using direct wallet APIs
  const handleLogin = async () => {
    if (!address || !isConnected || !chainId) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    try {
      // 1. Generate login message
      const chainConfig = chainConfigs.find(
        (chain) => chain.chainId.toString() === chainId.toString()
      );
      const msgRes = await generateLoginMessage.mutateAsync({
        walletAddress: address,
        chainType: chainConfig?.chainType as ChainType,
      });
      if (!msgRes.success) {
        throw new Error(msgRes.message);
      }

      const { message: loginMessage, timestamp } = msgRes;

      // 2. Sign message using direct wallet APIs
      let signature = '';

      if (chainConfig?.chainType === ChainType.EVM) {
        signature = await evmWalletProvider.request({
          method: 'personal_sign',
          params: [loginMessage, address],
        });
      } else if (chainConfig?.chainType === ChainType.SOLANA) {
        // For Solana
        const encodedMessage = new TextEncoder().encode(loginMessage);
        const sig = await solanaWalletProvider.signMessage(encodedMessage);
        signature = bs58.encode(sig);
      }

      // 3. Login with signature
      await loginWithWallet.mutateAsync({
        walletAddress: address,
        signature,
        message: loginMessage,
        timestamp,
        chainType: chainConfig?.chainType as ChainType,
      });
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Something went wrong',
      });
    }
  };

  const handleLogout = async () => {
    await disconnect();
    logout();
    toast.success('Logged out', {
      description: 'You have been successfully logged out',
    });
  };

  // Check if wallet is available for the current chain type
  const isWalletAvailable = (type: ChainType) => {
    if (type === 'evm') {
      return typeof window !== 'undefined' && !!window.ethereum;
    } else if (type === 'sol') {
      return typeof window !== 'undefined' && !!(window as any).solana?.isPhantom;
    }
    return false;
  };

  // Auto-update chain type when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      // You can add logic here to detect the chain type from the connected wallet
      // For now, we'll keep the user's selection
    }
  }, [isConnected, address]);

  return {
    // State
    address,
    isConnected,
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!walletAddress,

    // Actions
    handleLogin,
    handleLogout,

    // Mutations
    loginWithWallet,
    generateLoginMessage,

    // Utilities
    isWalletAvailable,

    // Loading states
    isLoading: loginWithWallet.isPending || generateLoginMessage.isPending,
  };
};
