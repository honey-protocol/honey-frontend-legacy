import { Fraction, Percent, ZERO } from "@saberhq/token-utils";
import formatDuration from "date-fns/formatDuration";
import intervalToDuration from "date-fns/intervalToDuration";
import JSBI from "jsbi";

import { CURRENCY_INFO, CurrencyMarket } from "./currencies";

export const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
});

export const FORMAT_PERCENT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
  style: "percent",
};

export const FORMAT_VOTE_PERCENT = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  style: "percent",
});

export const fractionToFloat = (frac: Fraction): number => {
  if (JSBI.equal(frac.denominator, ZERO)) {
    return JSBI.greaterThan(frac.numerator, ZERO)
      ? Number.POSITIVE_INFINITY
      : JSBI.lessThan(frac.numerator, ZERO)
      ? Number.NEGATIVE_INFINITY
      : Number.NaN;
  }
  return parseFloat(frac.toFixed(10));
};

const ONE_BP = new Percent(1, 10_000);

export const formatPercent = (percent: Percent): string => {
  return percent.lessThan(ONE_BP)
    ? `${percent.toSignificant()}%`
    : fractionToFloat(percent.asFraction).toLocaleString(
        undefined,
        FORMAT_PERCENT
      );
};

export const formatPrecise = (percent: Percent): string => {
  return (fractionToFloat(percent.asFraction) * 100).toLocaleString(undefined, {
    maximumFractionDigits: 10,
  });
};

export const FORMAT_DOLLARS: Intl.NumberFormatOptions = {
  currency: "USD",
  style: "currency",
};

export const FORMAT_DOLLARS_WHOLE: Intl.NumberFormatOptions = {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export const formatCurrency = (
  amount: number,
  currency: CurrencyMarket,
  numberFormatOptions: Intl.NumberFormatOptions = {}
): string => {
  if (currency === CurrencyMarket.USD) {
    return amount.toLocaleString(undefined, {
      ...FORMAT_DOLLARS,
      ...numberFormatOptions,
    });
  }
  const fmt = amount.toLocaleString(undefined, {
    minimumSignificantDigits: 4,
    ...numberFormatOptions,
  });
  const info = CURRENCY_INFO[currency];
  const prefix = info.prefix;
  if (prefix) {
    return `${prefix}${fmt}`;
  }
  return `${fmt} ${info.symbol}`;
};

export const formatCurrencyWhole = (
  amount: number,
  currency: CurrencyMarket,
  numberFormatOptions: Intl.NumberFormatOptions = {}
): string => {
  if (currency === CurrencyMarket.USD) {
    return amount.toLocaleString(undefined, {
      ...FORMAT_DOLLARS_WHOLE,
      ...numberFormatOptions,
    });
  }
  const fmt = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...numberFormatOptions,
  });
  const info = CURRENCY_INFO[currency];
  const prefix = info.prefix;
  if (prefix) {
    return `${prefix}${fmt}`;
  }
  return `${fmt} ${info.symbol}`;
};

export const formatCurrencySmart = (
  amount: number | Fraction,
  currency: CurrencyMarket,
  numberFormatOptions?: Intl.NumberFormatOptions
): string => {
  const amtFloat =
    amount instanceof Fraction ||
    (typeof amount === "object" && (amount as Record<string, unknown>)?.toFixed)
      ? fractionToFloat(amount)
      : amount;
  const threshold =
    currency === CurrencyMarket.USD
      ? 100
      : currency === CurrencyMarket.BTC
      ? 100
      : 1;
  return amtFloat > threshold
    ? formatCurrencyWhole(amtFloat, currency, numberFormatOptions)
    : formatCurrency(amtFloat, currency, numberFormatOptions);
};

/**
 * @warning For end-user display purposes only. It loses precision and does rounding
 *
 * There is padding
 *
 * If (Whole number digits > softMaximumSignificantDigits)
 *   Rounds to whole number towards 0
 * Otherwise
 *   Defaults to token.decimals, but respects numberFormatOptions as an override
 *
 * Example for softMaximumSignificantDigits = 7 and token with 6 maxDigits
 *
 * 1234.87654321 => 1234.876 (7 significant figures)
 * 1234567.87654321 => 1234567 (rounded down)
 * 123456789.321 => 123456789
 * 1.87654321 => 1.876543
 */
export const formatDisplayWithSoftLimit = (
  float: number,
  maxDecimals: number,
  softMaximumSignificantDigits = 7,
  numberFormatOptions?: Intl.NumberFormatOptions,
  locale?: string
): string => {
  if (
    Number.isNaN(softMaximumSignificantDigits) ||
    softMaximumSignificantDigits <= 0
  ) {
    throw new Error("softMaximumSignificantDigits must be greater than 0");
  }

  // Round to integer if there are enough whole digits
  const dropDecimalsAfter = Math.pow(10, softMaximumSignificantDigits - 1);

  if (float >= dropDecimalsAfter) {
    // Round down to display integer amount
    const wholeNumberFormatOptions: Intl.NumberFormatOptions = Object.assign(
      {},
      numberFormatOptions,
      {
        maximumFractionDigits: 0,
      }
    );
    return Math.floor(float).toLocaleString(locale, wholeNumberFormatOptions);
  }

  // Round to maxDecimals if too small
  const sigDerivedDigitsOnRight =
    softMaximumSignificantDigits - Math.floor(Math.log10(float)) - 1;

  const digitsOnRight = Math.max(
    0,
    Math.min(maxDecimals, sigDerivedDigitsOnRight)
  );
  const flooredToPrecision =
    Math.floor(float * 10 ** digitsOnRight) / 10 ** digitsOnRight;

  const maxFormatOptions: Intl.NumberFormatOptions = Object.assign(
    {
      minimumFractionDigits: digitsOnRight,
      maximumFractionDigits: digitsOnRight,
    },
    numberFormatOptions
  );
  return flooredToPrecision.toLocaleString(locale, maxFormatOptions);
};

const SI_SUFFIXES = {
  t: 12,
  b: 9,
  m: 6,
  k: 3,
};

export const formatNumberSI = (value: number): string => {
  const result = Object.entries(SI_SUFFIXES).find(([_, power]) => {
    return value >= 10 ** power;
  });
  if (!result) {
    return value.toLocaleString();
  }
  const [suffix, power] = result;
  const adjusted = value / 10 ** power;
  return `${adjusted.toLocaleString(undefined, {
    maximumSignificantDigits: 3,
  })}${suffix}`;
};

export const formatDurationSeconds = (seconds: number) =>
  formatDuration(
    intervalToDuration({
      start: new Date(0),
      end: new Date(seconds * 1_000),
    }),
    { delimiter: ", " }
  );

export const formatSignificantDistance = (end: Date, start: Date) =>
  formatDuration(
    intervalToDuration({
      start,
      end,
    }),
    { delimiter: ", " }
  )
    .split(", ")
    .slice(0, 3)
    .join(", ");

export const formatSignificantDistanceWithSuffix = (end: Date, start: Date) => {
  const fmt = formatSignificantDistance(end, start);
  return `${fmt} ${end < start ? "after" : "before"}`;
};
