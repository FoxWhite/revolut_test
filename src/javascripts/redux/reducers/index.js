import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { initialState, ratesReducer } from 'redux/reducers/rates'

// usually you'd expect a more complex structure with combineReducers(),
// but we only need one here.

const store = createStore(ratesReducer, initialState, composeWithDevTools(
  applyMiddleware(thunk)
));

export default store;