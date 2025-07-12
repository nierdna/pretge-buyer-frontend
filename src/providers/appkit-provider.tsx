'use client';

import { projectId } from '@/configs/env';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  solana,
  solanaDevnet,
} from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { LynxReownProvider } from 'lynx-reown-dapp-kit';
import { chainConfigs } from '@/configs/chains';

// 2. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new SolanaAdapter(), new EthersAdapter()],
  metadata,
  networks: [mainnet, base, baseSepolia, solana, solanaDevnet, arbitrum, arbitrumSepolia],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: [],
  },
  allWallets: 'SHOW',
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  // Lấy chain đầu tiên là defaultChain (có thể tuỳ chỉnh)
  return (
    <LynxReownProvider
      chains={chainConfigs.map((item) => ({
        chainId: item.chainId,
        chainName: item.name,
        chainType: item.chainType as any,
        rpc: item.privateRpcUrl,
        explorerUrl: item.explorerUrl,
      }))}
    >
      {children}
    </LynxReownProvider>
  );
}
