import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { ratesReducer,    initialRatesState    } from 'redux/reducers/rates'
import { accountsReducer, initialAccountsState } from 'redux/reducers/accounts'

const initialState = {
  rates:    initialRatesState,
  accounts: initialAccountsState,
}

const reducer = combineReducers({
  rates:    ratesReducer,
  accounts: accountsReducer,
});

const store = createStore(reducer, initialState, composeWithDevTools(
  applyMiddleware(thunk)
));

export default store;