import React from 'react';
import './CurrentRatesDisplay.sass';
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
  <div className="CurrentRatesDisplay">
    {
      ratesLoaded
        ? `${fromCurr}1 = ${toCurr}${rate}`
        : 'loading rates...'
    }
  </div>

export default CurrentRatesDisplay;