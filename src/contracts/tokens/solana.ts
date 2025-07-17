import { Connection, PublicKey } from '@solana/web3.js';
import { IToken } from './types';
import { TransactionSerializable } from 'lynx-reown-dapp-kit/types';

export class TokenSolana implements IToken {
  private connection: Connection;
  private mint: PublicKey;

  constructor(address: string, rpc: string) {
    this.connection = new Connection(rpc, 'confirmed');
    this.mint = new PublicKey(address);
  }

  async getDecimals(): Promise<number> {
    try {
      // Lấy thông tin về token mint
      const mintInfo = await this.connection.getParsedAccountInfo(this.mint);

      if (!mintInfo.value || !mintInfo.value.data) {
        throw new Error('Không tìm thấy thông tin token');
      }

      // @ts-ignore - Truy cập vào dữ liệu đã phân tích
      const parsedData = mintInfo.value.data.parsed;
      return parsedData.info.decimals;
    } catch (error) {
      console.error('Error getting token decimals:', error);
      throw error;
    }
  }

  async getAllowance(owner: string, spender: string): Promise<number> {
    // Theo yêu cầu, luôn trả về max number
    return Number.MAX_SAFE_INTEGER;
  }

  async buildApprove(spender: string, amount: number): Promise<TransactionSerializable> {
    // Theo yêu cầu, không cần triển khai buildApprove
    throw new Error('Approve không cần thiết trên Solana');
  }
}
