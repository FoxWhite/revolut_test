import React, { Component }  from 'react';
import { connect }           from 'react-redux';

import {
  ratesAreLoaded,
  roundToDecimals,
}                            from 'helpers';
import { validate }          from 'helpers/validation';
import CurrentRatesDisplay   from 'components/CurrentRatesDisplay';
import MoneySelector         from 'components/MoneySelector';
import { transfer }          from 'redux/actions/accounts';

import { supportedCurrencies } from 'config';
import fx from 'money';

/**
 * @flow
 */

type Props = {
  ratesData:    RatesStore,
  accountsData: AccountsStore,
  dispatch:     Function,
};


@connect(state => ({
  ratesData:    state.rates,
  accountsData: state.accounts,
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
    validator:    ValidatorResult;
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
      validator: {
        canTransfer: false,
        fromAmountIsValid: true,
      }
    }
  }

  componentWillMount() {
    const { ratesData } = this.props;
    if (ratesAreLoaded(ratesData)) {
      this.setNewRates(ratesData);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { ratesData, accountsData } = nextProps;
    if (ratesAreLoaded(ratesData)) {
      this.setNewRates(ratesData);
    }
    if(this.props.accountsData !== nextProps.accountsData) {
      const validatorConfig = {
        ...this.state,
        accounts: accountsData
      };
      this.setState({
        validator: validate(validatorConfig)
      });
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
    const { accountsData } = this.props;

    this.setState((currentState) => {
      const toAmountConverted = this.money.convert(
        currentState.fromAmount, {
          from: val,
          to: currentState.toCurrency
        });
      const validatorConfig = {
        ...currentState,
        toAmount:     toAmountConverted,
        fromCurrency: val,
        accounts:     accountsData,
      };
      return {
        fromCurrency: val,
        // we must also recalculate the digits.
        fromAmount: currentState.fromAmount,
        toAmount: toAmountConverted,
        validator: validate(validatorConfig)
      }
    });
  }

  onChangeToCurrency = (val: string) => {
    const { accountsData } = this.props;

    this.setState((currentState) => {
      const fromAmountConverted = this.money.convert(
        currentState.toAmount, {
          from: val,
          to: currentState.fromCurrency
        });
      const validatorConfig = {
        ...currentState,
        fromAmount: fromAmountConverted,
        accounts: accountsData,
      };
      return {
        toCurrency: val,
        // we must also recalculate the digits
        toAmount: currentState.toAmount,
        fromAmount: fromAmountConverted,
        validator: validate(validatorConfig)
      }
    });
  }

  onChangeFromAmount = (val: string) => {
    const { accountsData } = this.props;

    this.setState((currentState) => {
      const toAmountConverted = this.money.convert(val, {
        from: currentState.fromCurrency,
        to: currentState.toCurrency
      });
      const validatorConfig = {
        ...currentState,
        fromAmount: val,
        toAmount: toAmountConverted,
        accounts: accountsData,
      };
      return {
        fromAmount: val,
        toAmount: toAmountConverted,
        validator: validate(validatorConfig)
      }
    });
  }

  onChangeToAmount = (val: string) => {
    const { accountsData } = this.props;

    this.setState((currentState) => {
      const fromAmountConverted = this.money.convert(val, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      });
      const validatorConfig = {
        ...currentState,
        fromAmount: fromAmountConverted,
        accounts: accountsData,
      };
      return {
        toAmount: val,
        fromAmount: fromAmountConverted,
        validator: validate(validatorConfig)
      }
    });
  }

  onSwapClick = () => {
    const { accountsData } = this.props;

    this.setState((currentState) => {
      const toAmountConverted = this.money.convert(currentState.fromAmount, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      });
      const validatorConfig = {
        ...currentState,
        toAmount: toAmountConverted,
        fromCurrency: currentState.toCurrency,
        accounts: accountsData,
      };
      return {
        // swap currencies, recalc 'to' amount.
        toCurrency:   currentState.fromCurrency,
        fromCurrency: currentState.toCurrency,
        toAmount: toAmountConverted,
        validator: validate(validatorConfig)
      }
    });
  }

  onTransferClick = () => {
    if (!this.state.validator.canTransfer) return;
    const { dispatch } = this.props;
    const {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount } = this.state;
    // convert to Number just in case.
    dispatch(transfer(fromCurrency, toCurrency, Number(fromAmount), Number(toAmount)));
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
      validator
    } = this.state;
    const {
      canTransfer,
      fromAmountIsValid} = validator;
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
            valid={fromAmountIsValid}
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
