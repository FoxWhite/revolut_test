import React, { Component }  from 'react';
import { connect }           from 'react-redux';

import {
  ratesAreLoaded,
  roundToDecimals,
}                            from 'helpers';
import {
  validate,
  validMoneyInput,
}                            from 'helpers/validation';
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
  validate: Function;

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
    this.validate = validate.bind(null, props.accountsData);
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
    if(this.props.accountsData !== nextProps.accountsData) {
      this.validate = validate.bind(null, nextProps.accountsData);
      this.setState((state) => ({
        validator: this.validate(state)
      }));
    }
  }

  setNewRates(ratesData: RatesStore) {
    const { data } = ratesData;
    this.money.rates = data.rates;
    this.money.base = data.base;
    this.setState({ratesLoaded: true});
  }

  convert = (val: any, currencies: {from: string, to: string}) =>{
    const { from, to } = currencies;
    const converted = this.money.convert(val, {from, to});
    return isNaN(converted) ? 0 : roundToDecimals(converted, 4);
  }
  /*
   *   Event handlers
   */

  onChangeFromCurrency = (val: string) => {
    this.setState((currentState) => {

      const toAmountConverted = this.convert(
        currentState.fromAmount, {
          from: val,
          to: currentState.toCurrency
        });
      const validatorConfig = {
        ...currentState,
        toAmount:     toAmountConverted,
        fromCurrency: val,
      };
      return {
        fromCurrency: val,
        // we must also recalculate the digits.
        fromAmount: currentState.fromAmount,
        toAmount: toAmountConverted,
        validator: this.validate(validatorConfig)
      }
    });
  }

  onChangeToCurrency = (val: string) => {
    this.setState((currentState) => {
      const fromAmountConverted = this.convert(
        currentState.toAmount, {
          from: val,
          to: currentState.fromCurrency
        });
      const validatorConfig = {
        ...currentState,
        fromAmount: fromAmountConverted,
      };
      return {
        toCurrency: val,
        // we must also recalculate the digits
        toAmount: currentState.toAmount,
        fromAmount: fromAmountConverted,
        validator: this.validate(validatorConfig)
      }
    });
  }


  onChangeFromAmount = (val: string) => {
    val = val.replace(',', '.');
    if (!validMoneyInput(val)) {
      return;
    }

    this.setState((currentState) => {
      const toAmountConverted = this.convert(val, {
        from: currentState.fromCurrency,
        to: currentState.toCurrency
      });
      const validatorConfig = {
        ...currentState,
        fromAmount: val,
        toAmount: toAmountConverted,
      };
      return {
        fromAmount: val,
        toAmount: toAmountConverted,
        validator: this.validate(validatorConfig)
      }
    });
  }

  onChangeToAmount = (val: string) => {
    val = val.replace(',', '.');
    if (!validMoneyInput(val)) {
      return;
    }

    this.setState((currentState) => {
      const fromAmountConverted = this.convert(val, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      });
      const validatorConfig = {
        ...currentState,
        fromAmount: fromAmountConverted,
      };
      return {
        toAmount: val,
        fromAmount: fromAmountConverted,
        validator: this.validate(validatorConfig)
      }
    });
  }

  onSwapClick = () => {
    this.setState((currentState) => {
      const toAmountConverted = this.convert(currentState.fromAmount, {
        from: currentState.toCurrency,
        to: currentState.fromCurrency
      });
      const validatorConfig = {
        ...currentState,
        toAmount: toAmountConverted,
        fromCurrency: currentState.toCurrency,
      };
      return {
        // swap currencies, recalc 'to' amount.
        toCurrency:   currentState.fromCurrency,
        fromCurrency: currentState.toCurrency,
        toAmount: toAmountConverted,
        validator: this.validate(validatorConfig)
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
            inputValue={fromAmount}
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
            inputValue={toAmount}
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
