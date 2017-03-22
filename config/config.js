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
};
