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
const integerRegex = /^\d*$/;

const transformToNumber = (value: string): string => {
  const transformComma = value.replace(/,/g, '.');
  const escapeRegExp = transformComma.replace(specialSymbolsRegex, '\\$&');
  if (transformComma === '' || currencyRegex.test(escapeRegExp)) {
    return transformComma;
  }
  return '';
};

export const transformToIntegerNumber = (value: string): string => {
  // Remove any non-digit characters except for empty string
  if (value === '' || integerRegex.test(value)) {
    return value;
  }
  return '';
};

/**
 * Extract token symbol from search input
 * If input contains "WLFI - World Liberty Financial", return "WLFI"
 * If input is just "WLFI", return "WLFI"
 */
export function extractTokenSymbol(searchInput: string): string {
  if (!searchInput || !searchInput.trim()) {
    return '';
  }

  const trimmed = searchInput.trim();
  const dashIndex = trimmed.indexOf(' - ');

  if (dashIndex > 0) {
    return trimmed.substring(0, dashIndex).trim();
  }

  return trimmed;
}

export { normalizeNetworkName, transformToNumber, truncateAddress };
