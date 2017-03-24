import thunk     from 'redux-thunk';
import _throttle from 'lodash.throttle'
import {
  createStore,
  applyMiddleware,
  combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { ratesReducer,    initialRatesState    } from 'redux/reducers/rates'
import { accountsReducer, initialAccountsState } from 'redux/reducers/accounts'

import { LS_ACCOUNTS } from 'config';
import {
  loadLS,
  saveLS,
 } from 'helpers/localStorage';

const initialState = {
  rates:    initialRatesState,
  // first we want to check if there's anything for us in localStorage
  accounts: loadLS(LS_ACCOUNTS) || initialAccountsState,
}

const reducer = combineReducers({
  rates:    ratesReducer,
  accounts: accountsReducer,
});

const store = createStore(reducer, initialState, composeWithDevTools(
  applyMiddleware(thunk)
));

// subscribe localStorage to store state updates
store.subscribe(_throttle(() => {
  saveLS(LS_ACCOUNTS, store.getState().accounts)
}, 1000));

export default store;