import Decimal from 'decimal.js';
import formatNumber, { FormatOptions } from './numberish/formatNumber';

export function pad(d: number): string {
  return d < 10 ? '0' + d.toString() : d.toString();
}

const safeDecimalConversion = (value: number | string): number | string => {
  if (typeof value === 'string' && (value.includes('e') || value.includes('E'))) {
    try {
      return Number(value);
    } catch (error) {
      console.error('Error converting scientific notation:', error);
      return '0';
    }
  }
  return value;
};

export const add = (a: number | string, b: number | string) => {
  return new Decimal(safeDecimalConversion(a)).plus(safeDecimalConversion(b)).toNumber();
};

export const mul = (a: number | string, b: number | string) => {
  return new Decimal(safeDecimalConversion(a)).mul(safeDecimalConversion(b)).toNumber();
};

export const minus = (a: number | string, b: number | string) => {
  return new Decimal(safeDecimalConversion(a)).minus(safeDecimalConversion(b)).toNumber();
};

export const div = (a: number | string, b: number | string) => {
  return new Decimal(safeDecimalConversion(a)).div(safeDecimalConversion(b)).toNumber();
};

export const ceil = (a: number | string) => {
  return new Decimal(safeDecimalConversion(a)).ceil().toNumber();
};

export const floor = (a: number | string) => {
  return new Decimal(safeDecimalConversion(a)).floor().toNumber();
};

// export const parseValueToBigInt = (value: number | string, decimals: number) => {
//   return ethers.parseUnits(value.toString(), decimals);
// };

// export const formatUnitsValue = (value: string, decimals: number) => {
//   return ethers.formatUnits(value, decimals);
// };

export function formatNumberV2(
  value: number | string,
  options: Intl.NumberFormatOptions = {},
  fractionDigits: number = 2
): string {
  if (typeof value === 'string') value = Number(value);
  if (typeof value !== 'number' || isNaN(value)) return '';
  return new Intl.NumberFormat('en', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    compactDisplay: 'short',
    ...options,
  }).format(value);
}

export function smNumber(value: number, threshold = 5, minimumSignificantDigits = 2): string {
  if (value === 0) return '0';
  if (!value) return '-';
  const subs = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  const [left, right] = value.toFixed(String(value).length).split('.');
  const result = right.match(`^([0]{${threshold},})`);
  if (result) {
    const length = result[0].length;
    const subStr = length.toString().replace(/\d/g, (digit) => subs[+digit]);
    const end = right.slice(length);
    return (left + '.0' + subStr + end)
      .replace(/0+$/, '')
      .substring(0, 4 + minimumSignificantDigits);
  }
  return formatNumberV2(value, {
    minimumSignificantDigits,
    maximumSignificantDigits: 3,
  });
}

export const formatSmartNumber = (num: number | string, toFixed: number = 2): string => {
  if (!num) return '0';
  if (typeof num === 'string') {
    num = Number(num);
  }

  if (num >= 10) {
    return parseFloat(num.toFixed(1)).toString();
  } else if (num >= 1) {
    return parseFloat(num.toFixed(toFixed)).toString();
  } else {
    let numberDecimalAfterZero = 3;

    if (Number(num) >= 0.1) {
      numberDecimalAfterZero = 4;
    }

    const strNumber = num.toFixed(13).toString();
    const arr = strNumber.split('.');
    if (arr.length === 1) {
      return num.toString();
    }
    const decimal = arr[1];
    //find first non-zero number
    let index = 0;
    while (index < decimal.length && decimal[index] === '0') {
      index++;
    }
    if (index === decimal.length) {
      return parseFloat(num.toString()).toString();
    }

    let threeDecimal = decimal.slice(index, index + numberDecimalAfterZero);

    threeDecimal = Number(threeDecimal.split('').reverse().join(''))
      .toString()
      .split('')
      .reverse()
      .join('');

    return `${arr[0]}.${decimal.slice(0, index)}${threeDecimal}`;
  }
};

export const formatNumberShort = (
  number: number | string | Decimal | null | undefined,
  {
    groupSeparator = ',',
    maxDecimalCount = 2,
    groupSize = 3,
    decimalMode = 'trim',
    needSeperate = true,
    useShorterExpression,
  }: FormatOptions = {},
  {
    isShowSmNumber = false,
  }: {
    isShowSmNumber?: boolean;
  } = {}
) => {
  if (!number) return '0';

  // Handle scientific notation strings
  if (typeof number === 'string' && (number.includes('e') || number.includes('E'))) {
    try {
      // Convert to regular decimal notation
      const numValue = Number(number);
      if (isNaN(numValue)) {
        return '0';
      }

      // Handle as a regular number
      number = numValue;
    } catch (error) {
      console.error('Error converting scientific notation:', error);
      return '0';
    }
  }

  if (isShowSmNumber && Number(number) < 0.001) return smNumber(Number(number), 3);

  if (Number(number) < 0.1) return formatSmartNumber(number.toString());

  if (number === 0) return '0';

  return formatNumber(number, {
    groupSeparator,
    maxDecimalCount,
    groupSize,
    decimalMode,
    needSeperate,
    useShorterExpression,
  });
};
