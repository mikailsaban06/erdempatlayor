import { Currency } from '../types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, countryCode: 'US', name: 'United States' },
  { code: 'EUR', symbol: '€', rate: 0.92, countryCode: 'DE', name: 'Europe (DE)' },
  { code: 'GBP', symbol: '£', rate: 0.79, countryCode: 'GB', name: 'United Kingdom' },
  { code: 'CAD', symbol: '$', rate: 1.35, countryCode: 'CA', name: 'Canada' },
  { code: 'PLN', symbol: 'zł', rate: 3.96, countryCode: 'PL', name: 'Poland' },
  { code: 'AUD', symbol: '$', rate: 1.52, countryCode: 'AU', name: 'Australia' },
  { code: 'SGD', symbol: '$', rate: 1.34, countryCode: 'SG', name: 'Singapore' },
  { code: 'TRY', symbol: '₺', rate: 32.50, countryCode: 'TR', name: 'Turkey' },
];

export const formatPrice = (priceUSD: number, currency: Currency): string => {
  const converted = priceUSD * currency.rate;
  
  // Custom formatting for some currencies if needed, otherwise generic Intl
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(converted);
};

export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};