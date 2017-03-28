import React from 'react';
import './AccountsDisplay.sass';
import { roundToDecimals } from 'helpers';
import { supportedCurrencies } from 'config';

/**
 * @flow
 */


type Props = {
  accounts: AccountsStore
};

const AccountsDisplay = ({accounts}: Props) =>
  <div className="AccountsDisplay">
    <h3>Your wallets:</h3>
    <ul>
    {
      Object.keys(accounts).map((acc, i) => {
        const symbol = supportedCurrencies[acc];
        return <li key={i}>{`${acc}: ${symbol}${roundToDecimals(accounts[acc], 2)}`}</li>
      })
    }
    </ul>
  </div>

export default AccountsDisplay;