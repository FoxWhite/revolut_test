import {
  ACCOUNTS_ADD,
  ACCOUNTS_WITHDRAW,
} from 'redux/actions/accounts';

export const initialAccountsState = {
    'GBP': 1000,
    'USD': 1000,
    'EUR': 1000,
};
export const accountsReducer = (state = initialAccountsState, action) => {
  switch (action.type) {
    case ACCOUNTS_ADD: {
      const { account } = action;
      const newAmount = state[account] + action.amount;
      return {...state, [account]: newAmount}
    }
    case ACCOUNTS_WITHDRAW: {
      const { account } = action;
      // all the checks should have been performed in business logic by now
      const newAmount = state[account] - action.amount;
      return {...state, [account]: newAmount}

    }
    default:
      return state;
  }
}

export default accountsReducer;