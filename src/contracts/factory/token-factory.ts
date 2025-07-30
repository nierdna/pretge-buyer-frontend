import { ChainType } from '@/server/enums/chain';
import { TokenEvm } from '../tokens/evm';
import { TokenSolana } from '../tokens/solana';
import { IToken } from '../tokens/types';

export class TokenFactory {
  static create(
    type: ChainType,
    tokenAddress: string,
    options: {
      rpc?: string;
    }
  ): IToken | undefined {
    switch (type) {
      case ChainType.EVM:
        if (!options.rpc) return undefined;
        return new TokenEvm(tokenAddress, options.rpc);

      case ChainType.SOLANA:
        if (!options.rpc) return undefined;
        return new TokenSolana(tokenAddress, options.rpc);

      default:
        return undefined;
    }
  }
}
