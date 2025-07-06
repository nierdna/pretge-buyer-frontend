/**
 * Supported blockchain networks configuration
 */

export interface Chain {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: string;
    public: string;
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet: boolean;
}

/**
 * Ethereum Mainnet
 */
export const ethereum: Chain = {
  id: 1,
  name: 'Ethereum',
  network: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://eth.llamarpc.com',
    public: 'https://eth.llamarpc.com',
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  testnet: false,
};

/**
 * Polygon Mainnet
 */
export const polygon: Chain = {
  id: 137,
  name: 'Polygon',
  network: 'matic',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://polygon-rpc.com',
    public: 'https://polygon-rpc.com',
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://polygonscan.com',
    },
  },
  testnet: false,
};

/**
 * Binance Smart Chain Mainnet
 */
export const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org',
    public: 'https://bsc-dataseed.binance.org',
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  },
  testnet: false,
};

/**
 * All supported chains
 */
export const chains: Chain[] = [ethereum, polygon, bsc];

/**
 * Default chain
 */
export const defaultChain = ethereum;
