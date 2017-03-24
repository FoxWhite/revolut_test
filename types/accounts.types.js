import { supportedCurrencies } from './config';

declare type AccountsStore = {
  "EUR":  number,
  "GBP":  number,
  "USD":  number,
};

declare type CurrencyString = $Keys<typeof supportedCurrencies>;
