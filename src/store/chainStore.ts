import { Service } from '@/service';
import { IChain } from '@/types/chain';
import { create } from 'zustand';

interface ChainState {
  chains: IChain[];
  // Actions
  setChains: (chains: IChain[]) => void;
  fetchChains: () => Promise<void>;
}

export const useChainStore = create<ChainState>()((set) => ({
  chains: [],
  setChains: (chains: IChain[]) => set({ chains }),
  fetchChains: async () => {
    try {
      const chains = await Service.chain.getChains();
      if (chains.success) {
        set({ chains: chains.data });
      }
    } catch (error) {
      set({ chains: [] });
      console.error('Error fetching chains', error);
    }
  },
}));
