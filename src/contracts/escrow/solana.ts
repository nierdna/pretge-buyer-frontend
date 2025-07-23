import { Connection, PublicKey } from '@solana/web3.js';
import { EscrowMarketClient } from 'escrow-market-sdk';
import { SolanaContract } from 'lynx-reown-dapp-kit/solana';
import { TransactionSerializable } from 'lynx-reown-dapp-kit/types';
import { TokenSolana } from '../tokens/solana';
import { IEscrow } from './types';

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
      // Convert token address to PublicKey
      const mint = new PublicKey(token);
      const mintProgram = new TokenSolana(token, this.connection.rpcEndpoint);
      const decimals = await mintProgram.getDecimals();
      // Create deposit transaction
      // According to escrow-market-sdk API, deposit needs feePayer (usually the sender)
      const tx = await this.client.deposit(
        this.userPublicKey, // feePayer/depositor
        mint, // Mint address of token
        BigInt(Number(amount) * 10 ** decimals) // Token amount, need to convert to BigInt
      );

      console.log('tx', tx);

      // Convert transaction to TransactionSerializable format
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
      // Get config to obtain operator
      const config = await this.client.getConfig();

      // Operator must sign the settle transaction according to escrow-market-sdk API
      const operatorPubkey = config.operator;

      // Required parameters
      const buyer = new PublicKey(buyerAddress);
      const seller = this.userPublicKey;
      const tokenTransferPubkey = new PublicKey(tokenTransfer);
      const tokenWithdrawPubkey = new PublicKey(tokenWithdraw);

      const tokenTransferProgram = new TokenSolana(tokenTransfer, this.connection.rpcEndpoint);
      const tokenWithdrawProgram = new TokenSolana(tokenWithdraw, this.connection.rpcEndpoint);
      const transferAmountDecimals = await tokenTransferProgram.getDecimals();
      const withdrawAmountDecimals = await tokenWithdrawProgram.getDecimals();

      // Call settle API
      const tx = await this.client.settle(
        operatorPubkey, // Operator public key
        id, // Deal ID
        buyer, // Buyer
        seller, // Seller
        tokenTransferPubkey, // Token to transfer
        tokenWithdrawPubkey, // Token to withdraw
        BigInt(Number(transferAmount) * 10 ** transferAmountDecimals), // Amount of tokens to transfer
        BigInt(Number(withdrawAmount) * 10 ** withdrawAmountDecimals) // Amount of tokens to withdraw
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
      // Get config to obtain operator
      const config = await this.client.getConfig();
      const operatorPubkey = config.operator;

      // In escrow-market-sdk, operatorCancel needs buyer address and token
      // Get deal information to get buyer
      const deal = await this.client.getDeal(id);
      const buyer = deal ? deal.buyer : this.userPublicKey; // Fallback
      const tokenPubkey = new PublicKey(token);
      const tokenProgram = new TokenSolana(token, this.connection.rpcEndpoint);
      const decimals = await tokenProgram.getDecimals();

      // Call operatorCancel API
      const tx = await this.client.operatorCancel(
        operatorPubkey, // Operator public key
        id, // Deal ID
        buyer, // Buyer address
        tokenPubkey, // Token address
        BigInt(Number(amount) * 10 ** decimals) // Token amount, using BigInt
      );

      return this.build(tx);
    } catch (error) {
      console.error('Error building cancel transaction:', error);
      throw error;
    }
  }

  // Transaction parsing method
  async parseTransaction(signature: string): Promise<any> {
    try {
      const events = await this.client.parseEventsFromTransaction(signature);

      if (!events || events.length === 0) {
        return { found: false };
      }

      // Process each type of event
      for (const event of events) {
        if (event.name === 'DepositEvent') {
          const tokenProgram = new TokenSolana(
            event.data.token.toString(),
            this.connection.rpcEndpoint
          );
          const decimals = await tokenProgram.getDecimals();
          // For Deposit event

          return {
            found: true,
            eventType: 'Deposit',
            userAddress: event.data.user.toString(),
            tokenAddress: event.data.token.toString(),
            rawAmount: event.data.amount.toNumber(),
            formattedAmount: (Number(event.data.amount) / 10 ** decimals).toString(),
            // Don't format amount here, let the client handle it
          };
        } else if (event.name === 'SettleEvent') {
          // For Settle event
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
