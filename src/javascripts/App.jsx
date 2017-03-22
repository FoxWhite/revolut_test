/**
 * @flow
 */

import React, { Component } from 'react';
import { connect }          from 'react-redux';

// test
import {getRates} from 'redux/actions/exchangeRates';
  //

// test
type Props = {
  rates:      RatesStore,
};

@connect(state => ({
  rates:    state.data,
}))
export default class App extends Component {
  // Some flow typing instead of propTypes here.
  // Not really necessary in this project though,
  // so basically I did this the way I'd usually do
  // in larger projects, for demo purposes
  props: Props;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getRates());
  }

  render(){
    return (
      <div>Here be revolut app</div>
    );
  }
}

