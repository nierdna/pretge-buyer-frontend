const truncateAddress = (address?: string, length: number = 4) => {
  if (!address) return '';
  return address.length > length * 2
    ? `${address.slice(0, length)}...${address.slice(-length)}`
    : address;
};
const normalizeNetworkName = (networkName?: string) => {
  return networkName?.replaceAll(/( Mainnet| Testnet| Devnet)/g, '');
};

export { normalizeNetworkName, truncateAddress };
