import { ERC20_ABI } from '../../configs/contracts';
import { IToken } from './types';
import { ethers, parseUnits } from 'ethers';
import { EvmContract } from 'lynx-reown-dapp-kit/evm';
import { TransactionSerializable } from 'lynx-reown-dapp-kit/types';

export class TokenEvm extends EvmContract implements IToken {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(
    address: string,
    private readonly rpc: string
  ) {
    super({
      address,
      abi: ERC20_ABI,
    });
    this.provider = new ethers.JsonRpcProvider(rpc);
    this.contract = new ethers.Contract(address, ERC20_ABI, this.provider);
  }

  async getDecimals(): Promise<number> {
    const decimals = await this.contract.decimals();
    return Number(decimals);
  }

  async getAllowance(owner: string, spender: string): Promise<number> {
    const allowance = await this.contract.allowance(owner, spender);
    const decimals = await this.getDecimals();
    return Number(ethers.formatUnits(allowance, decimals));
  }

  async buildApprove(spender: string, amount: number): Promise<TransactionSerializable> {
    const decimals = await this.getDecimals();
    const amountBN = parseUnits(amount.toString(), decimals);
    return this.build({
      method: 'approve',
      params: [spender, amountBN.toString()],
    });
  }
}
