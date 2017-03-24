/**
  * @flow
  */
import config from 'config';


/*
 * action types
 */
const prefix = 'ACCOUNTS/';

// we don't really need to HOLD the money in this app,
// but in real life we'd want to do that
// between adding and withdrawing transactions
// const ACCOUNTS_HOLD        = `${prefix}HOLD`;
const ACCOUNTS_ADD         = `${prefix}ADD`;
const ACCOUNTS_WITHDRAW    = `${prefix}WITHDRAW`;


/*
 * action creators
 */
const accountAdd = (account, amount) =>
  ({
    type: ACCOUNTS_ADD,
    account,
    amount,
  })

const accountWithdraw = (account, amount) =>
  ({
    type: ACCOUNTS_WITHDRAW,
    account,
    amount,
  })


const transfer = (
  accountFrom: string, accountTo: string, amountFrom: number, amountTo: number) =>
  (dispatch: Function) => {
    dispatch(accountWithdraw(accountFrom, amountFrom));
    dispatch(accountAdd(accountTo, amountTo));
  }


export {
  transfer,

  ACCOUNTS_ADD,
  ACCOUNTS_WITHDRAW,
}