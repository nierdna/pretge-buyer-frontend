import { EvmContract } from 'lynx-reown-dapp-kit';
import { ESCROW_ABI } from '../../configs/contracts';
import { IEscrow } from './types';
import { parseUnits } from 'ethers';
import { TokenEvm } from '../tokens/evm';

export class EscrowEvm extends EvmContract implements IEscrow {
  private rpc: string;
  constructor(address: string, rpc: string) {
    super({
      address,
      abi: ESCROW_ABI,
    });
    this.rpc = rpc;
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
    transferAmount: number;
    withdrawAmount: number;
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
}
