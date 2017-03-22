/* eslint-env node, jest */

import { ratesAreLoaded } from 'helpers';


describe('ratesAreLoaded', () => {
  let mockRatesStore = {
    data: {
      rates: {},
      base:  '',
    },
    isFetching: false,
    error: null,
  }
  it('should check if rates store contains any values', () => {
    expect(ratesAreLoaded(mockRatesStore)).toBe(false);
    mockRatesStore.data.rates['USD'] = 111;
    expect(ratesAreLoaded(mockRatesStore)).toBe(false);
    mockRatesStore.data.base = 'EUR';
    expect(ratesAreLoaded(mockRatesStore)).toBe(true);
  });
  it('should check if rates are not being fetched', () => {
    expect(ratesAreLoaded(mockRatesStore)).toBe(true);
    mockRatesStore.isFetching = true;
    expect(ratesAreLoaded(mockRatesStore)).toBe(false);
  });
  it('should check if there is no error', () => {
    mockRatesStore.isFetching = false;
    mockRatesStore.error = 'some error';
    expect(ratesAreLoaded(mockRatesStore)).toBe(false);
    mockRatesStore.error = null;
    expect(ratesAreLoaded(mockRatesStore)).toBe(true);
  });
});
