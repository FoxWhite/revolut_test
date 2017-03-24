/**
  * Exports App config that is later embedded into bundle.
  * Usage: `import config from 'config';`
  */

module.exports = {
  openExchangeRate: {
    appId: process.env.OER_ID,
    api: {
      getLatest: process.env.OER_API_LATEST,
    }
  },
  ratesPollInterval: 30000, // ms
  supportedCurrencies: {
    "GBP": "\u00a3",
    "EUR": "\u20ac",
    "USD": "\u0024",
  },
  // accounts storage name in localStorage
  LS_ACCOUNTS: 'revolutAccounts',
};
