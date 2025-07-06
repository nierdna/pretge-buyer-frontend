import { ChainTypeString } from '../enums/chain';

export interface Network {
  id: string;
  name: string;
  chainType: ChainTypeString;
  rpcUrl: string;
  explorerUrl: string;
  createdAt: Date;
}
