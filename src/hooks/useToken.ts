import { useLynxReown } from 'lynx-reown-dapp-kit';
import { useMemo } from 'react';
import { TokenEvm } from '../contracts/tokens/evm';
import { IToken } from '../contracts/tokens/types';

export const useToken = (
  token: string,
  chainId: string
): {
  tokenContract: IToken | undefined;
} => {
  const { chains } = useLynxReown();

  const chain = useMemo(() => {
    return chains.find((chain) => chain.chainId === chainId);
  }, [chains, chainId]);

  const tokenContract = useMemo(() => {
    if (!chain) return undefined;

    if (chain.chainType === 'evm') {
      return new TokenEvm(token, chain.rpc);
    }

    return undefined;
  }, [chain, token]);

  return {
    tokenContract,
  };
};
