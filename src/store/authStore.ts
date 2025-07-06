import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  walletAddress: string | null;

  // Actions
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
      accessToken: null,
      refreshToken: null,
      walletAddress: null,

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
