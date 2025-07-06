import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useAuth = () => {
  const { address, isConnected } = useAppKitAccount();
  const { setTokens, setUser, logout, user, accessToken } = useAuthStore();
  const { toast } = useToast();

  // Determine chain type based on connected wallet
  // For now, we'll default to EVM (Base network) since that's what we're targeting
  const getChainType = () => {
    // You can enhance this logic based on your needs
    // For example, check the wallet type or network
    return 'evm'; // Default to EVM for Base network
  };

  // Generate login message
  const generateLoginMessage = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await axios.post('/api/auth/login-message', {
        walletAddress,
        chainType: getChainType(),
      });
      return response.data;
    },
  });

  // Login with wallet
  const loginWithWallet = useMutation({
    mutationFn: async ({
      walletAddress,
      signature,
      message,
      timestamp,
    }: {
      walletAddress: string;
      signature: string;
      message: string;
      timestamp: number;
    }) => {
      const response = await axios.post('/api/auth/login', {
        walletAddress,
        signature,
        message,
        timestamp,
        chainType: getChainType(),
      });
      console.log('response', response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('data', data);
      if (data.success && data.data) {
        setTokens(data.data.accessToken, data.data.refreshToken);
        setUser({
          id: data.data.user.id,
          address: data.data.wallet.address,
          createdAt: data.data.user.created_at,
          updatedAt: data.data.user.updated_at,
        });
        toast({
          title: 'Login successful',
          description: 'Welcome to Pre-Market XYZ!',
        });
      } else {
        toast({
          title: 'Login failed',
          description: data.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const handleLogin = async () => {
    if (!address || !isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Generate login message
      const messageResponse = await generateLoginMessage.mutateAsync(address);
      if (!messageResponse.success) {
        throw new Error(messageResponse.message);
      }

      const { message, timestamp } = messageResponse.data;

      // Sign message with wallet
      let signature: string;

      if (getChainType() === 'sol') {
        // For Solana, we need to use a different signing method
        // This would need to be implemented based on your Solana wallet setup
        throw new Error('Solana signing not implemented yet');
      } else {
        // For EVM chains (Base, Ethereum, etc.)
        const provider = (window as any).ethereum;
        if (!provider) {
          throw new Error('No Ethereum provider found');
        }

        signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });
      }

      // Login with signature
      await loginWithWallet.mutateAsync({
        walletAddress: address,
        signature,
        message,
        timestamp,
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  return {
    address,
    isConnected,
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    loginWithWallet,
    generateLoginMessage,
    handleLogin,
    handleLogout,
    isLoading: loginWithWallet.isPending || generateLoginMessage.isPending,
  };
};
