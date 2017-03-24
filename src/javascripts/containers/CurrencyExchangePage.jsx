import React, { Component }  from 'react';
import { connect }           from 'react-redux';

import {
  ratesAreLoaded,
  roundToDecimals,
}                            from 'helpers';
import CurrentRatesDisplay   from 'components/CurrentRatesDisplay';
import MoneySelector         from 'components/MoneySelector';
import { transfer }          from 'redux/actions/accounts';

import { supportedCurrencies } from 'config';
import fx from 'money';

/**
 * @flow
 */

type Props = {
  ratesData:  RatesStore,
  dispatch:   Function,
};

@connect(state => ({
  ratesData:    state.rates,
}))
export default class CurrencyExchangePage extends Component {
  props: Props;
  money: Function;
  state: {
    ratesLoaded:  boolean,
    fromCurrency: CurrencyString,
    toCurrency:   CurrencyString,
    fromAmount:   number,
    toAmount:     number,
    canTransfer:  boolean,
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
      canTransfer: true, //todo False
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

  /*
   *   Event handlers
   */

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

  onSwapClick = () => {
    this.setState((currentState) => ({
      // swap currencies, recalc 'to' amount.
      toCurrency:   currentState.fromCurrency,
      fromCurrency: currentState.toCurrency,
      toAmount:  this.money.convert(currentState.fromAmount, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      }),
    }));
  }

  onTransferClick = () => {
    if (!this.state.canTransfer) return;
    const { dispatch } = this.props;
    const {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount } = this.state;

    dispatch(transfer(fromCurrency, toCurrency, fromAmount, toAmount));
  }

  render() {
    const selectOpts = Object.keys(supportedCurrencies).map(
      cur => ({value: cur, label: cur})
    );
    const {
      fromCurrency,
      toCurrency,
      ratesLoaded,
      fromAmount,
      toAmount,
      canTransfer,
    } = this.state;
    const {error} =  this.props.ratesData;

    const rate = ratesLoaded
      ? this.money.convert(1, {from: fromCurrency, to: toCurrency})
      : null;

    return (
      <div className='exchanger-wrapper'>
        {
          error &&
          <div className="error-message">
            {`${error} :(`}
          </div>
        }
        {
          fromCurrency !== toCurrency &&
          <CurrentRatesDisplay
            ratesLoaded={ratesLoaded}
            fromCurr={supportedCurrencies[fromCurrency]}
            toCurr={supportedCurrencies[toCurrency]}
            rate={rate}
          />
        }
        <div className="money-selector-wrapper">
          <MoneySelector
            namePostfix="from"
            inputValue={roundToDecimals(fromAmount, 4)}
            onInputChange={(e) => this.onChangeFromAmount(e.target.value)}
            selectValue={fromCurrency}
            selectOpts={selectOpts}
            onSelectChange={(e) => this.onChangeFromCurrency(e.value)}
          />
          <button
            className={`transfer-button ${canTransfer ? '' : 'disabled'}`}
            onClick={this.onTransferClick}
          >transfer!
          </button>
        </div>
        <button className="swap-button"
          onClick={this.onSwapClick}
        >⇆</button>
        <div className="money-selector-wrapper">
          <MoneySelector
            namePostfix="from"
            inputValue={roundToDecimals(toAmount, 4)}
            onInputChange={(e) => this.onChangeToAmount(e.target.value)}
            selectValue={toCurrency}
            selectOpts={selectOpts}
            onSelectChange={(e) => this.onChangeToCurrency(e.value)}
          />
        </div>
      </div>
    );
  }
}
