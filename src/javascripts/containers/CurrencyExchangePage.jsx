/**
 * @flow
 */

import React, { Component }  from 'react';
import { ratesAreLoaded }    from 'helpers';

import fx from 'money';

type Props = {
  ratesData:  RatesStore,
};

export default class CurrencyExchangePage extends Component {
  constructor(props: Props) {
    super(props);
    this.money = fx; // lib object containing current exchange data and methods.
    this.state = {
      ratesLoaded: false,
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

  setNewRates(ratesData) {
    const { data } = ratesData;
    this.money.rates = data.rates;
    this.money.base = data.base;
    this.setState({ratesLoaded: true});
  }

  render() {
    if (this.state.ratesLoaded)
      console.log(this.money.convert(100, {from: 'USD', to: 'GBP'}));
    return <div>kek</div>
  }
}