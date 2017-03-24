/**
 * @flow
 */

const transactionIsValid = (
  accounts: AccountsStore, fromCurrency: CurrencyString, fromAmount: number) => {

  return hasEnoughMoney(accounts[fromCurrency], fromAmount)
}

const hasEnoughMoney = (sumOnAccount, sumNeeded) =>
  sumOnAccount >= sumNeeded
