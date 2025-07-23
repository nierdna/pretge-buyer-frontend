import { ChainType } from '@/server/enums/chain';
import { CONTRACTS } from '../contracts';
import { EscrowEvm } from '../escrow/evm';
import { EscrowSolana } from '../escrow/solana';
import { IEscrow } from '../escrow/types';

export class EscrowFactory {
  static create(
    type: ChainType,
    chainId: string,
    options: {
      rpc?: string;
      programId?: string;
      userAddress?: string;
    }
  ): IEscrow | undefined {
    const contractAddress = CONTRACTS[chainId]?.ESCROW;
    const { programId, rpc, userAddress } = options;
    switch (type) {
      case ChainType.EVM:
        if (!contractAddress || !options.rpc) return undefined;
        return new EscrowEvm(contractAddress, options.rpc);

      case ChainType.SOLANA:
        // Check required parameters
        if (!programId || !rpc || !userAddress) return undefined;
        return new EscrowSolana(programId, rpc, userAddress);

      default:
        return undefined;
    }
  }
}
