import { Connection, PublicKey } from '@solana/web3.js';
import { EscrowMarketClient } from 'escrow-market-sdk';
import { IEscrow } from './types';
import { TransactionSerializable } from 'lynx-reown-dapp-kit/types';
import { SolanaContract } from 'lynx-reown-dapp-kit/solana';
import { TokenSolana } from '../tokens/solana';

export class EscrowSolana extends SolanaContract implements IEscrow {
  private client: EscrowMarketClient;
  private connection: Connection;
  private userPublicKey: PublicKey;

  constructor(programId: string, endpoint: string, userPublicKey: string) {
    super();
    this.connection = new Connection(endpoint, 'confirmed');
    this.userPublicKey = new PublicKey(userPublicKey);
    this.client = new EscrowMarketClient(this.connection, programId);
  }
  async buildWithdraw(
    userAddress: string,
    tokenAddress: string,
    amount: number,
    nonce: number
  ): Promise<any> {
    try {
      const config = await this.client.getConfig();
      const operatorPubkey = config.operator;
      const tokenProgram = new TokenSolana(tokenAddress, this.connection.rpcEndpoint);
      const decimals = await tokenProgram.getDecimals();
      const tx = await this.client.withdraw(
        operatorPubkey,
        new PublicKey(userAddress),
        new PublicKey(tokenAddress),
        BigInt(Number(amount) * 10 ** decimals),
        nonce
      );
      return this.build(tx);
    } catch (error) {
      console.error('Error building withdraw transaction:', error);
      throw error;
    }
  }

  async buildDeposit(token: string, amount: number): Promise<TransactionSerializable> {
    try {
      // Chuyển đổi địa chỉ token thành PublicKey
      const mint = new PublicKey(token);
      console.log('this.connection.rpcEndpoint', this.connection.rpcEndpoint);
      const mintProgram = new TokenSolana(token, this.connection.rpcEndpoint);
      const decimals = await mintProgram.getDecimals();
      console.log('decimals', decimals);
      // Tạo transaction deposit
      // Theo API của escrow-market-sdk, deposit cần feePayer (thường là người gửi)
      const tx = await this.client.deposit(
        this.userPublicKey, // feePayer/depositor
        mint, // Mint address của token
        BigInt(Number(amount) * 10 ** decimals) // Số lượng token, cần convert sang BigInt
      );

      console.log('tx', tx);

      // Chuyển đổi transaction sang định dạng TransactionSerializable
      return this.build(tx);
    } catch (error) {
      console.error('Error building deposit transaction:', error);
      throw error;
    }
  }

  async buildSettle({
    id,
    tokenTransfer,
    tokenWithdraw,
    buyerAddress,
    transferAmount,
    withdrawAmount,
    nonce,
    deadline,
    signature,
  }: {
    id: string;
    tokenTransfer: string;
    tokenWithdraw: string;
    buyerAddress: string;
    transferAmount: string;
    withdrawAmount: string;
    nonce: number;
    deadline: number;
    signature: string;
  }): Promise<TransactionSerializable> {
    try {
      // Lấy config để có được operator
      const config = await this.client.getConfig();

      // Operator phải ký giao dịch settle theo API của escrow-market-sdk
      const operatorPubkey = config.operator;

      // Các tham số cần thiết
      const buyer = new PublicKey(buyerAddress);
      const seller = this.userPublicKey;
      const tokenTransferPubkey = new PublicKey(tokenTransfer);
      const tokenWithdrawPubkey = new PublicKey(tokenWithdraw);

      const tokenTransferProgram = new TokenSolana(tokenTransfer, this.connection.rpcEndpoint);
      const tokenWithdrawProgram = new TokenSolana(tokenWithdraw, this.connection.rpcEndpoint);
      const transferAmountDecimals = await tokenTransferProgram.getDecimals();
      const withdrawAmountDecimals = await tokenWithdrawProgram.getDecimals();

      // Gọi API settle
      const tx = await this.client.settle(
        operatorPubkey, // Operator public key
        id, // Deal ID
        buyer, // Người mua
        seller, // Người bán
        tokenTransferPubkey, // Token chuyển đi
        tokenWithdrawPubkey, // Token rút về
        BigInt(Number(transferAmount) * 10 ** transferAmountDecimals), // Số lượng token chuyển đi
        BigInt(Number(withdrawAmount) * 10 ** withdrawAmountDecimals) // Số lượng token rút về
      );

      return this.build(tx);
    } catch (error) {
      console.error('Error building settle transaction:', error);
      throw error;
    }
  }

  async buildCancel({
    id,
    token,
    amount,
    nonce,
    deadline,
    signature,
  }: {
    id: string;
    token: string;
    amount: number;
    nonce: number;
    deadline: number;
    signature: string;
  }): Promise<TransactionSerializable> {
    try {
      // Lấy config để có được operator
      const config = await this.client.getConfig();
      const operatorPubkey = config.operator;

      // Trong escrow-market-sdk, operatorCancel cần buyer address và token
      // Lấy thông tin deal để có buyer
      const deal = await this.client.getDeal(id);
      const buyer = deal ? deal.buyer : this.userPublicKey; // Fallback
      const tokenPubkey = new PublicKey(token);
      const tokenProgram = new TokenSolana(token, this.connection.rpcEndpoint);
      const decimals = await tokenProgram.getDecimals();

      // Gọi API operatorCancel
      const tx = await this.client.operatorCancel(
        operatorPubkey, // Operator public key
        id, // Deal ID
        buyer, // Buyer address
        tokenPubkey, // Token address
        BigInt(Number(amount) * 10 ** decimals) // Số lượng token, dùng BigInt
      );

      return this.build(tx);
    } catch (error) {
      console.error('Error building cancel transaction:', error);
      throw error;
    }
  }

  // Phương thức phân tích giao dịch
  async parseTransaction(signature: string): Promise<any> {
    try {
      const events = await this.client.parseEventsFromTransaction(signature);

      if (!events || events.length === 0) {
        return { found: false };
      }

      // Xử lý từng loại sự kiện
      for (const event of events) {
        if (event.name === 'DepositEvent') {
          const tokenProgram = new TokenSolana(
            event.data.token.toString(),
            this.connection.rpcEndpoint
          );
          const decimals = await tokenProgram.getDecimals();
          // Đối với sự kiện Deposit
          console.log('event', event);

          return {
            found: true,
            eventType: 'Deposit',
            userAddress: event.data.user.toString(),
            tokenAddress: event.data.token.toString(),
            rawAmount: event.data.amount.toNumber(),
            formattedAmount: (Number(event.data.amount) / 10 ** decimals).toString(),
            // Không format amount ở đây, để client xử lý
          };
        } else if (event.name === 'SettleEvent') {
          // Đối với sự kiện Settle
          return {
            found: true,
            eventType: 'Settle',
            id: event.data.dealId,
            buyer: event.data.buyer.toString(),
            seller: event.data.seller.toString(),
            tokenTransfer: event.data.tokenTransfer.toString(),
            tokenWithdraw: event.data.tokenWithdraw.toString(),
            transferAmount: event.data.transferAmount.toString(),
            withdrawAmount: event.data.withdrawAmount.toString(),
          };
        }
      }

      return { found: false };
    } catch (error: any) {
      console.error('Error parsing transaction:', error);
      return { found: false, error: error.message };
    }
  }
}
