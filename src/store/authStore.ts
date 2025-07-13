import { Service } from '@/service';
import { User, Wallet } from '@/types/user';
import { toast } from 'sonner';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | undefined;
  wallets: Wallet[] | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  walletAddress: string | undefined;

  // Actions
  setWallets: (wallets: Wallet[] | undefined) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | undefined) => void;
  updateUser: (user: Partial<User>) => void;
  setWalletAddress: (address: string) => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      wallets: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      walletAddress: undefined,

      setWallets: (wallets) =>
        set({
          wallets,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      login: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),

      logout: () =>
        set({
          accessToken: undefined,
          refreshToken: undefined,
          walletAddress: undefined,
          user: undefined,
          wallets: undefined,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : undefined,
        })),

      setWalletAddress: (address) =>
        set({
          walletAddress: address,
        }),

      fetchProfile: async () => {
        try {
          const response = await Service.auth.getProfile();
          if (response.success) {
            set({
              user: response.data.user,
              wallets: response.data.wallets,
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          toast.error('Failed to fetch profile');
        }
      },
    }),
    {
      name: 'auth', // unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
