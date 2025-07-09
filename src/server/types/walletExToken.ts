import { ChainTypeString } from '../enums/chain';

export interface WalletExToken {
  id: string;
  chainType: ChainTypeString;
  address: string;
  walletId: string;
  exTokenId: string;
  balance: number;
  createdAt: Date;
}
