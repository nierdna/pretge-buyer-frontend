import { ChainType } from '@/server/enums/chain';

export interface IChain {
  id: string;
  chainId: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: string | null;
  logo: string | null;
  isActive: boolean;
}

export interface IChainConfig {
  id: string;
  name: string;
  publicRpcUrl: string;
  privateRpcUrl: string;
  explorerUrl: string;
  chainId: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  chainType: ChainType;
  contractAddress?: string;
  escrowVaultAddress?: string;
}
