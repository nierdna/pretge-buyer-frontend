import { ChainType } from '@/server/enums/chain';
import { IChainConfig } from '@/types/chain';
import { arbitrum, arbitrumSepolia, solana, solanaDevnet } from '@reown/appkit/networks';

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

  //
  {
    id: arbitrum.id.toString(),
    name: 'Arbitrum',
    publicRpcUrl: arbitrum.rpcUrls.default.http[0],
    privateRpcUrl: arbitrum.rpcUrls.default.http[0],
    explorerUrl: arbitrum.blockExplorers.default.url,
    chainId: arbitrum.id.toString(),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },

  // arbitrum sepolia
  {
    id: arbitrumSepolia.id.toString(),
    name: 'Arbitrum Sepolia',
    publicRpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
    privateRpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
    explorerUrl: 'https://sepolia.arbiscan.io',
    chainId: arbitrumSepolia.id.toString(),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },

  //add solana devnet
  {
    id: solanaDevnet.id.toString(),
    name: 'Solana Devnet',
    publicRpcUrl: 'https://api.devnet.solana.com',
    privateRpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    chainId: solanaDevnet.id.toString(),
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
  //add solana mainnet
  {
    id: solana.id.toString(),
    name: 'Solana',
    publicRpcUrl: 'https://api.mainnet.solana.com',
    privateRpcUrl:
      'https://powerful-prettiest-aura.solana-mainnet.quiknode.pro/c2cb8c625bd63a33189e46ae79aec60b64e845ee',
    explorerUrl: 'https://solscan.io',
    chainId: solana.id.toString(),
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
];
