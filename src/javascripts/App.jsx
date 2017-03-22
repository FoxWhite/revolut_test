/**
 * @flow
 */

import React, { Component } from 'react';
import { connect }          from 'react-redux';
import {ratesPollInterval}    from 'config';
import {getRates} from 'redux/actions/exchangeRates';

// test
type Props = {
  ratesData:  RatesStore,
  dispatch:   Function,
};

@connect(state => ({
  ratesData:    state,
}))
export default class App extends Component {
  // Some flow typing instead of propTypes here.
  // Not really necessary in this project though,
  // so basically I did this the way I'd usually do
  // in larger projects, for demo purposes
  props: Props;

  ratesPoll: number;

  componentWillReceiveProps(nextProps: Props) {
    const currRates = this.props.ratesData.data.rates;
    const nextRates = nextProps.ratesData.data.rates;
    if (currRates !== nextRates) {
      clearTimeout(this.ratesPoll);
    }
    if (!nextProps.ratesData.isFetching) {
      this.startPoll();
    }
  }

  componentWillMount() {
    // we could also mapDispatchToProps.
    const { dispatch } = this.props;
    dispatch(getRates());
  }

  componentWillUnmount() {
    clearTimeout(this.ratesPoll);
  }

  startPoll() {
    const { dispatch } = this.props;
    this.ratesPoll = setTimeout(
      () => dispatch(getRates()),
      ratesPollInterval
    );
  }

  render(){
    return (
      <div>Here be revolut app</div>
    );
  }
}

