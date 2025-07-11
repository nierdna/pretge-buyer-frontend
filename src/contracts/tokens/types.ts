import { TransactionSerializable } from 'lynx-reown-dapp-kit';

export interface IToken {
  getDecimals: () => Promise<number>;
  getAllowance: (owner: string, spender: string) => Promise<number>;
  buildApprove: (spender: string, amount: number) => Promise<TransactionSerializable>;
}
