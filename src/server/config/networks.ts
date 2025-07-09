export interface NetworkConfig {
  id: string;
  name: string;
  chainType: 'evm' | 'sol' | 'sui';
  rpcUrl: string;
  explorerUrl: string;
  chainId?: number;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const NETWORKS: NetworkConfig[] = [
  {
    id: 'base',
    name: 'Base',
    chainType: 'evm',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    chainId: 8453,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'base-sepolia',
    name: 'Base Sepolia',
    chainType: 'evm',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    chainId: 84532,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainType: 'evm',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://etherscan.io',
    chainId: 1,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'solana',
    name: 'Solana',
    chainType: 'sol',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
  },
  {
    id: 'solana-devnet',
    name: 'Solana Devnet',
    chainType: 'sol',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
  },
];

export const getNetworkById = (id: string): NetworkConfig | undefined => {
  return NETWORKS.find((network) => network.id === id);
};

export const getNetworksByChainType = (chainType: 'evm' | 'sol' | 'sui'): NetworkConfig[] => {
  return NETWORKS.filter((network) => network.chainType === chainType);
};

export const getDefaultNetwork = (chainType: 'evm' | 'sol' | 'sui'): NetworkConfig | undefined => {
  const networks = getNetworksByChainType(chainType);
  return networks[0];
};

// Environment-specific configurations
export const getNetworkConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return {
      defaultEvmNetwork: 'base-sepolia',
      defaultSolNetwork: 'solana-devnet',
    };
  }

  return {
    defaultEvmNetwork: 'base',
    defaultSolNetwork: 'solana',
  };
};
