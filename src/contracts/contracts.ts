import { arbitrumSepolia, baseSepolia, mainnet, base, arbitrum, bsc } from '@reown/appkit/networks';

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
    ESCROW: '0xe7F76c6D23b889a9cac5c2Bebf54988DD9EE3093',
  },
};
