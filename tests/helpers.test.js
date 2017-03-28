/* eslint-env node, jest */

import {
  ratesAreLoaded,
  roundToDecimals,
} from 'helpers';

import {
  transactionIsValid,
  hasEnoughMoney,
  validMoneyInput,
} from 'helpers/validation';

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

describe('roundToDecimals', () => {
  it('should round given number at most to given decimal places', () => {
    expect(roundToDecimals(10, 1)).toBe(10);
    expect(roundToDecimals(10.2, 1)).toBe(10.2);
    expect(roundToDecimals(234.2199, 2)).toBe(234.22);
    expect(roundToDecimals(-234.2199, 2)).toBe(-234.22);
    expect(roundToDecimals(0.908095, 5)).toBe(0.9081);
  });
});

describe('transactionIsValid', () => {
  const accounts = {'EUR': 100};
  it('should check that account of given currency has enough money to give the needed sum', () => {
    expect(transactionIsValid(accounts, 'EUR', 1000 )).toBe(false);
    expect(transactionIsValid(accounts, 'EUR', 100 )).toBe(true);
    expect(transactionIsValid(accounts, 'EUR', 10 )).toBe(true);
  });
});

describe('hasEnoughMoney', () => {
  const accounts = {'EUR': 100};
  it('should check if needed sum does not exceed account value', () => {
    expect(hasEnoughMoney(accounts['EUR'], 100)).toBe(true);
    expect(hasEnoughMoney(accounts['EUR'], 42)).toBe(true);
    expect(hasEnoughMoney(accounts['EUR'], 1000)).toBe(false);
  });
});

describe('validMoneyInput', () => {
  it('should check money input is positive floating point number', () => {
    expect(validMoneyInput(1)).toBe(true);
    expect(validMoneyInput(1.23)).toBe(true);
    expect(validMoneyInput(-1.23)).toBe(false);
    expect(validMoneyInput('23')).toBe(true);
  });
  it('should parse strings', () => {
    expect(validMoneyInput('23')).toBe(true);
    expect(validMoneyInput('-23')).toBe(false);
  });
  it('should parse point', () => {
    expect(validMoneyInput('12.3')).toBe(true);
    expect(validMoneyInput('12.')).toBe(true);
    expect(validMoneyInput('.')).toBe(true);
  });
  it('should check point is single', () => {
    expect(validMoneyInput('12.3.42')).toBe(false);
  });
});
