import { Connection, PublicKey } from '@solana/web3.js';
import { TransactionSerializable } from 'lynx-reown-dapp-kit/types';
import { IToken } from './types';

export class TokenSolana implements IToken {
  private connection: Connection;
  private mint: PublicKey;

  constructor(address: string, rpc: string) {
    this.connection = new Connection(rpc, 'confirmed');
    this.mint = new PublicKey(address);
  }

  async getDecimals(): Promise<number> {
    try {
      // Get information about token mint
      const mintInfo = await this.connection.getParsedAccountInfo(this.mint);

      if (!mintInfo.value || !mintInfo.value.data) {
        throw new Error('Token information not found');
      }

      // @ts-ignore - Access to parsed data
      const parsedData = mintInfo.value.data.parsed;
      return parsedData.info.decimals;
    } catch (error) {
      console.error('Error getting token decimals:', error);
      throw error;
    }
  }

  async getAllowance(owner: string, spender: string): Promise<number> {
    // As required, always return max number
    return Number.MAX_SAFE_INTEGER;
  }

  async buildApprove(spender: string, amount: number): Promise<TransactionSerializable> {
    // As required, no need to implement buildApprove
    throw new Error('Approve is not necessary on Solana');
  }
}
