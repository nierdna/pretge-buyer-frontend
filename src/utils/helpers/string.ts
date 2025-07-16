const truncateAddress = (address?: string, length: number = 4) => {
  if (!address) return '';
  return address.length > length * 2
    ? `${address.slice(0, length)}...${address.slice(-length)}`
    : address;
};
const normalizeNetworkName = (networkName?: string) => {
  return networkName?.replaceAll(/( Mainnet| Testnet| Devnet)/g, '');
};
const specialSymbolsRegex = /[.*+?^${}()|[\]\\]/g;
const currencyRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

const transformToNumber = (value: string): string => {
  const transformComma = value.replace(/,/g, '.');
  const escapeRegExp = transformComma.replace(specialSymbolsRegex, '\\$&');
  if (transformComma === '' || currencyRegex.test(escapeRegExp)) {
    return transformComma;
  }
  return '';
};

export { normalizeNetworkName, transformToNumber, truncateAddress };
