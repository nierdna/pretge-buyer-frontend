import { User, Wallet } from '@/types/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  wallets: Wallet[] | null;
  accessToken: string | null;
  refreshToken: string | null;
  walletAddress: string | null;

  // Actions
  setWallets: (wallets: Wallet[] | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  setWalletAddress: (address: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      wallets: null,
      accessToken: null,
      refreshToken: null,
      walletAddress: null,

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
          accessToken: null,
          refreshToken: null,
          walletAddress: null,
          user: null,
          wallets: null,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setWalletAddress: (address) =>
        set({
          walletAddress: address,
        }),
    }),
    {
      name: 'auth', // unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
