import React from 'react';
/**
 * @flow
 */

type Props = {
  ratesLoaded: boolean,
  fromCurr: string,
  toCurr:  string,
  rate: ?number,
};

const CurrentRatesDisplay = ({ratesLoaded, fromCurr, toCurr, rate}: Props) =>
  <div className="current-rates">
    {
      ratesLoaded
        ? `${fromCurr}1 = ${toCurr}${rate}`
        : 'loading rates...'
    }
  </div>

export default CurrentRatesDisplay;