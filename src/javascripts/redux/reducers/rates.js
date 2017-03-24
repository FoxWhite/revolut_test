import {
  RATES_FETCH_BEGIN,
  RATES_FETCH_SUCCESS,
  RATES_FETCH_ERROR,
} from 'redux/actions/exchangeRates';

export const initialRatesState = {
    data: {
      rates: {},
      base: '',
    },
    isFetching: false,
    error: null,
};

export const ratesReducer = (state = initialRatesState, action) => {
  switch (action.type) {
    case RATES_FETCH_BEGIN: {
      return { ...state, isFetching: true, error: null };
    }
    case RATES_FETCH_SUCCESS: {
      return {
        isFetching: false,
        data: {
          ...state.data,
          rates: action.data.rates,
          base: action.data.base,
        }
      };
    }
    case RATES_FETCH_ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      };
    }
    default:
      return state;
  }
}

export default ratesReducer;