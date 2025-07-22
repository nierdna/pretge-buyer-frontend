import { ChainType } from '@/server/enums/chain';

export enum ETokenStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export interface INetwork {
  chainType: ChainType;
  createdAt: string;
  explorerUrl: string;
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  txHashUrl: string;
  addressUrl: string;
  logo: string;
}

export interface IToken {
  createdAt: string;
  endTime: string;
  id: string;
  logo: string;
  name: string;
  networkId: string;
  startTime: string;
  status: ETokenStatus;
  symbol: string;
  tokenContract: string;
  updatedAt: string;
  networks: INetwork;
  isHot: boolean;
  isNew: boolean;
  websiteUrl: string;
  twitterUrl: string;
  telegramUrl: string;
  bannerUrl: string;
  price: number;
}
export interface IExToken {
  address: string;
  createdAt: string;
  id: string;
  logo: string;
  name: string;
  networkId: string;
  symbol: string;
  updatedAt: string;
  network: INetwork;
}
