/**
 * @flow
 */

import React, { Component }  from 'react';
import {
  ratesAreLoaded,
  roundToDecimals,
}                            from 'helpers';
import CurrentRatesDisplay   from 'components/CurrentRatesDisplay';
import Select                from 'react-select';
import 'react-select/dist/react-select.css';

import { supportedCurrencies } from 'config';
import fx from 'money';

type Props = {
  ratesData:  RatesStore,
};

type CurrencySelectorValue = $Keys<typeof supportedCurrencies>;

export default class CurrencyExchangePage extends Component {
  props: Props;
  money: Function;
  state: {
    ratesLoaded:  boolean,
    fromCurrency: CurrencySelectorValue,
    toCurrency:   CurrencySelectorValue,
    fromAmount:   number,
    toAmount:     number,
  };

  constructor(props: Props) {
    super(props);
    this.money = fx; // lib object containing current exchange data and methods.
    this.state = {
      ratesLoaded: false,
      fromCurrency: 'USD',
      toCurrency: 'GBP',
      fromAmount: 0,
      toAmount: 0,
    }
  }

  componentWillMount() {
    const { ratesData } = this.props;
    if (ratesAreLoaded(ratesData)) {
      this.setNewRates(ratesData);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { ratesData } = nextProps;
    if (ratesAreLoaded(ratesData)) {
      this.setNewRates(ratesData);
    }
  }

  setNewRates(ratesData: RatesStore) {
    const { data } = ratesData;
    this.money.rates = data.rates;
    this.money.base = data.base;
    this.setState({ratesLoaded: true});
  }

  onChangeFromCurrency = (val: string) => {
    this.setState((currentState) => ({
      fromCurrency: val,
      // we must also recalculate the digits.
      fromAmount: currentState.fromAmount,
      toAmount: this.money.convert(
        currentState.fromAmount, {
          from: val,
          to: currentState.toCurrency
      }),
    }));
  }

  onChangeToCurrency = (val: string) => {
    this.setState((currentState) => ({
      toCurrency: val,
      // we must also recalculate the digits
      toAmount: currentState.toAmount,
      fromAmount: this.money.convert(
        currentState.toAmount, {
        from: val,
        to: currentState.fromCurrency
      }),
    }));
  }

  onChangeFromAmount = (val: string) => {
    this.setState((currentState) => ({
      fromAmount: val,
      toAmount: this.money.convert(val, {
        from: currentState.fromCurrency,
        to: currentState.toCurrency
      }),
    }));
  }

  onChangeToAmount = (val: string) => {
    this.setState((currentState) => ({
      toAmount: val,
      fromAmount: this.money.convert(val, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      }),
    }));
  }

  render() {
    const selectOpts = Object.keys(supportedCurrencies).map(cur => ({value: cur, label: cur}));
    const {
      fromCurrency,
      toCurrency,
      ratesLoaded,
      fromAmount,
      toAmount,
    } = this.state;
    const rate = ratesLoaded
      ? this.money.convert(1, {from: fromCurrency, to: toCurrency})
      : null;

    return (
      <div className='exchanger-wrapper'>
        {
          fromCurrency !== toCurrency &&
          <CurrentRatesDisplay
            ratesLoaded={ratesLoaded}
            fromCurr={supportedCurrencies[fromCurrency]}
            toCurr={supportedCurrencies[toCurrency]}
            rate={rate}
          />
        }
        <div className="from-selector">
          <input
            name="amount-from"
            type="number"
            value={roundToDecimals(fromAmount, 4)}
            onChange={(e) => this.onChangeFromAmount(e.target.value)}
          />
          <br/><br/>
          <Select
            name="currency-from"
            value={fromCurrency}
            options={selectOpts}
            onChange={(e) => this.onChangeFromCurrency(e.value)}
            searchable={false}
            clearable={false}
          />
        </div>
        <div className="to-selector">
          <input
            name="amount-from"
            type="number"
            value={roundToDecimals(toAmount, 4)}
            onChange={(e) => this.onChangeToAmount(e.target.value)}
          />
          <br/><br/>
          <Select
            name="currency-to"
            value={toCurrency}
            options={selectOpts}
            onChange={(e) => this.onChangeToCurrency(e.value)}
            searchable={false}
            clearable={false}
          />
        </div>
      </div>
    );
  }
}
