import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  mainnet,
  solana,
  solanaDevnet,
} from '@reown/appkit/networks';

export const CONTRACTS = {
  [baseSepolia.id.toString()]: {
    ESCROW: '0xe9edd28b3e8cfd142b1e5b84fa282a18c1b783c2',
  },
  [arbitrumSepolia.id.toString()]: {
    ESCROW: '0x06535764889886540055C4bFE44578DF75008658',
  },
  [base.id.toString()]: {
    ESCROW: '0xe419f17D931fD5De4Cde4874B1326Fe76B7EeE17',
  },
  [arbitrum.id.toString()]: {
    ESCROW: '0xe419f17D931fD5De4Cde4874B1326Fe76B7EeE17',
  },
  [bsc.id.toString()]: {
    ESCROW: '0xe419f17D931fD5De4Cde4874B1326Fe76B7EeE17',
  },
  [mainnet.id.toString()]: {
    ESCROW: '0xe419f17D931fD5De4Cde4874B1326Fe76B7EeE17',
  },
  [solanaDevnet.id.toString()]: {
    ESCROW: '6p58bca3jvFHGX4x179gL3ykXVreW4Hp2JLWv9Jnacmx',
  },
  [solana.id.toString()]: {
    ESCROW: '6p58bca3jvFHGX4x179gL3ykXVreW4Hp2JLWv9Jnacmx',
  },
};
