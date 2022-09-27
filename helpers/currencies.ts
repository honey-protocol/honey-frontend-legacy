import type { Token } from '@saberhq/token-utils';
import { mapValues } from 'lodash';

/**
 * A market
 */
export enum CurrencyMarket {
  USD = 'USD',
  BTC = 'BTC',
  LUNA = 'LUNA',
  FTT = 'FTT',
  SRM = 'SRM',
  SOL = 'SOL'
}

export const getMarketTag = (market: CurrencyMarket): string =>
  `saber-market-${market.toString().toLocaleLowerCase()}`;

export const CURRENCY_MARKET_TAGS: { [C in CurrencyMarket]: string } =
  mapValues(CurrencyMarket, value => getMarketTag(value));

export const getMarketFromTag = (tag: string): CurrencyMarket | null => {
  return (
    (Object.entries(CURRENCY_MARKET_TAGS).find(
      ([_, v]) => v === tag
    )?.[0] as CurrencyMarket) ?? null
  );
};

export const getMarket = (token: Token): CurrencyMarket => {
  const marketTag = token.info.tags?.find(tag =>
    tag.startsWith('saber-market-')
  );
  if (!marketTag) {
    return CurrencyMarket.USD;
  }
  return getMarketFromTag(marketTag) ?? CurrencyMarket.USD;
};

export const getMarketIfExists = (token: Token): CurrencyMarket | null => {
  const marketTag = token.info.tags?.find(tag =>
    tag.startsWith('saber-market-')
  );
  if (!marketTag) {
    return null;
  }
  return getMarketFromTag(marketTag) ?? null;
};

/**
 * Default options for formatting the currency in large amounts.
 */
export const CURRENCY_INFO: {
  [C in CurrencyMarket]: {
    name: string;
    symbol: string;
    prefix?: string;
    largeFormat: Intl.NumberFormat;
  };
} = {
  USD: {
    name: 'Stablecoin',
    symbol: 'USD',
    prefix: '%',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0
    })
  },
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    prefix: '₿',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 8
    })
  },
  LUNA: {
    name: 'Luna',
    symbol: 'LUNA',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2
    })
  },
  FTT: {
    name: 'FTT',
    symbol: 'FTT',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 4
    })
  },
  SRM: {
    name: 'SRM',
    symbol: 'SRM',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 3
    })
  },
  SOL: {
    name: 'SOL',
    symbol: 'SOL',
    largeFormat: new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 3
    })
  }
};
