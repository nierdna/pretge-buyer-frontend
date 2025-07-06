import { ChainType } from '../enums/chain';

export interface Wallet {
  id: string;
  userId: string;
  chainType: ChainType;
  address: string;
  isPrimary?: boolean;
  createdAt: Date;
}
