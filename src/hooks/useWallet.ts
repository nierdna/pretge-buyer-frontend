import { useMemo } from 'react';
import { useLynxReown } from 'lynx-reown-dapp-kit';
import { EvmWallet } from 'lynx-reown-dapp-kit/dist/evm/evmWallet';
import { SolanaWallet } from 'lynx-reown-dapp-kit/dist/solana/solanaWallet';
import { Wallet } from 'lynx-reown-dapp-kit/dist/core/wallet';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit/react';
import type { Provider as SolanaProvider } from '@reown/appkit-adapter-solana/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaTransactionSerializable } from 'lynx-reown-dapp-kit/dist/types/transaction';

/**
 * Custom hook trả về instance wallet phù hợp với chainId
 * @param chainId - id của chain muốn lấy wallet
 * @returns Wallet instance hoặc undefined nếu không tìm thấy chain
 */
export function useWallet(chainId: string): Wallet | undefined {
  const { walletProvider: solanaProvider } = useAppKitProvider<SolanaProvider>('solana');
  const { walletProvider: wagmiProvider } = useAppKitProvider<Provider>('eip155');
  const { address: wagmiAddress } = useAppKitAccount({ namespace: 'eip155' });
  const { address: solanaAddress } = useAppKitAccount({ namespace: 'solana' });

  const { chains } = useLynxReown();
  const chain = useMemo(() => chains.find((c) => c.chainId === chainId), [chains, chainId]);

  const wallet = useMemo(() => {
    if (!chain) return undefined;
    if (chain.chainType === 'evm' && wagmiAddress) {
      const wallet = new EvmWallet(wagmiAddress as string);
      wallet.registerSendTransaction(async (tx) => {
        return (await wagmiProvider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: wagmiAddress as string,
              ...tx,
            },
          ] as any,
        })) as any;
      });
      return wallet;
    }
    if (chain.chainType === 'sol' && solanaAddress) {
      const rpc = chain.rpc;
      const connection = new Connection(rpc);
      const wallet = new SolanaWallet(solanaAddress as string);
      wallet.registerSendTransaction(async (tx) => {
        if (!(tx as SolanaTransactionSerializable).recentBlockhash) {
          const latestBlockhash = await connection.getLatestBlockhash();
          (tx as SolanaTransactionSerializable).recentBlockhash = latestBlockhash.blockhash;
        }
        if (!(tx as SolanaTransactionSerializable).feePayer) {
          (tx as SolanaTransactionSerializable).feePayer = new PublicKey(solanaAddress as string);
        }
        return await solanaProvider.sendTransaction(
          tx as SolanaTransactionSerializable,
          connection
        );
      });
      return wallet;
    }
    return undefined;
  }, [chain, wagmiProvider, solanaProvider, wagmiAddress, solanaAddress]);

  return wallet;
}
