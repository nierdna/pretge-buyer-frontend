import { ethers, parseUnits } from 'ethers';
import { EvmContract } from 'lynx-reown-dapp-kit/evm';
import { ERC20_ABI, ESCROW_ABI } from '../../configs/contracts';
import { TokenEvm } from '../tokens/evm';
import { IEscrow } from './types';

export class EscrowEvm extends EvmContract implements IEscrow {
  private rpc: string;
  private provider: ethers.JsonRpcProvider;
  private _abi: any;
  private _address: string;

  constructor(address: string, rpc: string) {
    super({
      address,
      abi: ESCROW_ABI,
    });
    this.rpc = rpc;
    this.provider = new ethers.JsonRpcProvider(rpc);
    this._abi = ESCROW_ABI;
    this._address = address;
  }

  async buildWithdraw(
    userAddress: string,
    tokenAddress: string,
    amount: number,
    nonce: number
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async buildDeposit(token: string, amount: number) {
    const tokenContract = new TokenEvm(token, this.rpc);
    const decimals = await tokenContract.getDecimals();
    const amountBN = parseUnits(amount.toString(), decimals);
    return this.build({
      method: 'deposit',
      params: [token, amountBN.toString()],
    });
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
  }) {
    const tokenTransferContract = new TokenEvm(tokenTransfer, this.rpc);
    const decimalsTransfer = await tokenTransferContract.getDecimals();
    const tokenWithdrawContract = new TokenEvm(tokenWithdraw, this.rpc);
    const decimalsWithdraw = await tokenWithdrawContract.getDecimals();
    const transferAmountBN = parseUnits(transferAmount.toString(), decimalsTransfer);
    const withdrawAmountBN = parseUnits(withdrawAmount.toString(), decimalsWithdraw);

    return this.build({
      method: 'settle',
      params: [
        id,
        tokenTransfer,
        tokenWithdraw,
        buyerAddress,
        transferAmountBN.toString(),
        withdrawAmountBN.toString(),
        nonce,
        deadline,
        signature,
      ],
    });
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
  }) {
    const tokenContract = new TokenEvm(token, this.rpc);
    const decimals = await tokenContract.getDecimals();
    const amountBN = parseUnits(amount.toString(), decimals);
    return this.build({
      method: 'cancel',
      params: [id, token, amountBN.toString(), nonce, deadline, signature],
    });
  }

  async parseTransaction(txHash: string): Promise<any> {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return null;
    }
    const iface = new ethers.Interface(this._abi);

    let found = false;
    let userAddress = '';
    let tokenAddress = '';
    let rawAmount = '';
    let formattedAmount = '';
    let decimals = 18;
    let logIndex = -1;
    let eventType = '';
    let settleEventData = null;

    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      if (log.address.toLowerCase() === this._address.toLowerCase()) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed) {
            if (parsed.name === 'Deposit') {
              const { user, token, amount } = parsed.args;
              userAddress = user;
              tokenAddress = token;
              rawAmount = amount.toString();
              // Get token decimals
              const tokenContract = new ethers.Contract(token, ERC20_ABI, this.provider);
              decimals = await tokenContract.decimals();
              // Format amount
              formattedAmount = ethers.formatUnits(amount, decimals);
              found = true;
              logIndex = i;
              eventType = 'Deposit';
              break;
            } else if (parsed.name === 'Settle') {
              // Placeholder cho event Settle
              settleEventData = parsed.args;
              found = true;
              logIndex = i;
              eventType = 'Settle';
              break;
            }
          }
        } catch (e) {
          // Not a log of Deposit or Settle event, skip
        }
      }
    }

    return {
      found,
      userAddress,
      tokenAddress,
      rawAmount,
      formattedAmount,
      eventType,
      logIndex,
      decimals,
      ...settleEventData,
    };
  }
}
