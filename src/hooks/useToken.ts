import { useLynxReown } from 'lynx-reown-dapp-kit';
import { useMemo } from 'react';
import { TokenFactory } from '../contracts/factory/token-factory';
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
    if (!token || !chain) return undefined;

    return TokenFactory.create(chain.chainType as any, token, {
      rpc: chain.rpc,
    });
  }, [chain, token]);

  return {
    tokenContract,
  };
};
