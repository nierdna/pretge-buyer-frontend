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
