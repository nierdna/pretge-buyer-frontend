import { ChainType } from '@/server/enums/chain';
import { useLynxReown } from 'lynx-reown-dapp-kit';
import { useMemo } from 'react';
import { CONTRACTS } from '../contracts/contracts';
import { EscrowEvm } from '../contracts/escrow/evm';
import { EscrowSolana } from '../contracts/escrow/solana';
import { IEscrow } from '../contracts/escrow/types';
import { useWallet } from './useWallet';

export const useEscrow = (
  chainId: string
): {
  escrowContract: IEscrow | undefined;
} => {
  const { chains } = useLynxReown();
  const wallet = useWallet(chainId);
  const userAddress = wallet?.address || '';

  const chain = useMemo(() => {
    return chains.find((chain) => chain.chainId === chainId);
  }, [chains, chainId]);

  const escrowContract = useMemo(() => {
    if (!chainId || !chain) return undefined;

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.ESCROW;

    // Solana case
    if (chain.chainType === ChainType.SOLANA) {
      if (!userAddress) return undefined;
      return new EscrowSolana(contractAddress, chain.rpc, userAddress);
    }

    // EVM case
    if (chain.chainType === ChainType.EVM) {
      const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.ESCROW;
      if (!contractAddress) return undefined;
      return new EscrowEvm(contractAddress, chain.rpc);
    }

    return undefined;
  }, [chain, chainId, userAddress]);

  return {
    escrowContract,
  };
};
