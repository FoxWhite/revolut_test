import React, { Component } from 'react';
import { connect }          from 'react-redux';
import {ratesPollInterval}    from 'config';
import {getRates} from 'redux/actions/exchangeRates';

import CurrencyExchangePage from 'containers/CurrencyExchangePage';
import AccountsDisplay      from 'components/AccountsDisplay';

import 'stylesheets/index';

/**
 * @flow
 */

type Props = {
  ratesData:     RatesStore,
  accountsData:  AccountsStore,
  dispatch:      Function,
};

@connect(state => ({
  ratesData:    state.rates,
  accountsData: state.accounts,
}))
export default class App extends Component {
  // Some flow typing instead of propTypes here.
  // Not really necessary in this project though,
  // so basically I did this the way I'd usually do
  // in larger projects, for demo purposes
  props:     Props;
  ratesPoll: number;

  componentWillMount() {
    // we could also mapDispatchToProps.
    const { dispatch } = this.props;
    dispatch(getRates());
    this.startPoll();
  }

  componentWillUnmount() {
    clearTimeout(this.ratesPoll);
  }

  startPoll = () => {
    const { dispatch } = this.props;
    function poll() {
      dispatch(getRates());
      this.ratesPoll = setTimeout(poll.bind(this), ratesPollInterval);
    }
    this.ratesPoll = setTimeout(poll.bind(this), ratesPollInterval);
  }

  render() {
    const { accountsData } = this.props;
    return (
      <span>
        <aside>
          <AccountsDisplay accounts={accountsData} />
        </aside>
        <main>
          <CurrencyExchangePage />
        </main>
      </span>
    );
  }
}

