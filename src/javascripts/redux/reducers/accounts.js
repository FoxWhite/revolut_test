// import {
//   RATES_FETCH_BEGIN,
//   RATES_FETCH_SUCCESS,
//   RATES_FETCH_ERROR,
// } from 'redux/actions/exchangeRates';

export const initialAccountsState = {
    'GBP': 0,
    'USD': 0,
    'EUR': 0,
};
export const accountsReducer = (state = initialAccountsState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export default accountsReducer;