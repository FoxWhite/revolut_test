declare type Rates = {
  "EUR":  ?number,
  "GBP":  ?number,
  "USD":  ?number,
};

// usually this kind of typing works really well with Immutable.js
// here we store things as plain objects.
declare type RatesStore = {
  data: {
    rates: Rates,
    base:  string,
  },
  isFetching: boolean,
  error: ?string,
}