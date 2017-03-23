/**
  * @flow
  */
import config from 'config';
import fx from 'money';

import {
  checkStatus,
  parseJson,
  } from 'redux/helpers/api_helpers';

/*
 * action types
 */
const prefix = 'RATES/';
const RATES_FETCH_BEGIN    = `${prefix}FETCH_BEGIN`;
const RATES_FETCH_ERROR    = `${prefix}FETCH_ERROR`;
const RATES_FETCH_SUCCESS  = `${prefix}FETCH_SUCCESS`;

/*
 * action creators
 */

const ratesFetchBegin = () =>
  ({
    type: RATES_FETCH_BEGIN,
  })

const ratesFetchError = (error) =>
  ({
    type: RATES_FETCH_ERROR,
    error: error,
  })

const ratesFetchSuccess = (rates) =>
  ({
    type: RATES_FETCH_SUCCESS,
    data: rates,
  })


const getRates = () => {
  return function (dispatch: any) {
    return new Promise((resolve) => {
      resolve(dispatch(ratesFetchBegin()))
    })
      .then(() => {
        fetchLatestRates()
          .then(
            // Fetch ok
            data => {
              dispatch(ratesFetchSuccess({
                rates: data.rates,
                base: data.base
              }));
            },
            // Fetch fail
            reason => dispatch(ratesFetchError(reason))
          )
      });
  }
}



function fetchLatestRates(): Promise<GetRatesResult> {
  const { api, appId } = config.openExchangeRate;
  const url = api.getLatest.replace('[id]', appId);
  return fetch(url, {
    method:     'GET',
  })
  .then(checkStatus)
  .then(parseJson)
}


export {
  getRates,
  RATES_FETCH_BEGIN,
  RATES_FETCH_SUCCESS,
  RATES_FETCH_ERROR,
}