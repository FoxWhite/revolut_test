/**
 * @flow
 */

type ValidatorResult = {
  canTransfer: boolean,
  fromAmountIsValid: boolean,
};

type ValidatorConfig = {
  ratesLoaded:  boolean,
  fromAmount:   number,
  fromCurrency: CurrencyString,
  toAmount:     number
};

const validate = (accounts: AccountsStore, config: ValidatorConfig): ValidatorResult => {
  const {
    ratesLoaded,
    fromAmount,
    fromCurrency,
    // toAmount,
  } = config;
  const inputReceived = (fromAmount > 0);
  const accountFrom = accounts[fromCurrency];
  return {
    canTransfer: (
      inputReceived &&
      ratesLoaded &&
      transactionIsValid(accounts, fromCurrency, fromAmount)),
    fromAmountIsValid: hasEnoughMoney(accountFrom, fromAmount),
  }
};


const transactionIsValid = (
  accounts:     AccountsStore,
  fromCurrency: CurrencyString,
  fromAmount:   number) => {
  return hasEnoughMoney(accounts[fromCurrency], fromAmount)
}

const hasEnoughMoney = (sumOnAccount: number, sumNeeded: number) =>
  sumOnAccount >= sumNeeded


// should be a floating point number (optional decimal part) or a '.'
const validMoneyInput = (input: string) => {
  const moneyRegex = /^(([0-9]+)?(\.([0-9][0-9]?)?)?)$/;
  return moneyRegex.test(input)
}

export {
  validate,

  transactionIsValid,
  hasEnoughMoney,
  validMoneyInput,
}