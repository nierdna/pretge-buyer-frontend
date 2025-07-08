import { ChainType } from '@/server/enums/chain';
import { IChainConfig } from '@/types/chain';

export const chainConfigs: IChainConfig[] = [
  {
    id: '1',
    name: 'Ethereum',
    publicRpcUrl: 'https://eth.llamarpc.com',
    privateRpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    chainId: '1',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },
  //add base
  {
    id: '8453',
    name: 'Base',
    publicRpcUrl: 'https://base.llamarpc.com',
    privateRpcUrl: 'https://base.llamarpc.com',
    explorerUrl: 'https://basescan.org',
    chainId: '8453',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },

  //add base sepolia
  {
    id: '84532',
    name: 'Base Sepolia',
    publicRpcUrl: 'https://sepolia.base.org',
    privateRpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://basescan.org',
    chainId: '84532',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
    contractAddress: '0x9D90aeb5c841925fc8D7c5481c02523bDAc95585',
    escrowVaultAddress: '0x6B4792a57caBEbE6363ce3C0354D1494e63d0320',
  },

  //add solana devnet
  {
    id: '999999',
    name: 'Solana Devnet',
    publicRpcUrl: 'https://api.devnet.solana.com',
    privateRpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    chainId: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
  //add solana mainnet
  {
    id: '666666',
    name: 'Solana',
    publicRpcUrl: 'https://api.mainnet.solana.com',
    privateRpcUrl: 'https://api.mainnet.solana.com',
    explorerUrl: 'https://solscan.io',
    chainId: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
];
