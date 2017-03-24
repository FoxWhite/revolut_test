/**
 * @flow
 */

type ValidatorResult = {
  canTransfer: boolean,
  fromAmountIsValid: boolean,
};

type ValidatorConfig = {
  accounts:     AccountsStore,
  ratesLoaded:  boolean,
  fromAmount:   number,
  fromCurrency: CurrencyString,
  toAmount:     number
};

const validate = ( config: ValidatorConfig): ValidatorResult => {
  const {
    accounts,
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


export {
  validate,

  transactionIsValid,
  hasEnoughMoney,
}