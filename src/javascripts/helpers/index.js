/*
  checks for redux Rates store, if the rates finished loading and have no errors.
*/
export const ratesAreLoaded = (ratesData: RatesStore): boolean => {
  const { data } = ratesData;
  return (
    Object.keys(data.rates).length > 0 &&
    data.base.length > 0 &&
    !ratesData.error &&
    !ratesData.isFetching
  );
}

export const roundToDecimals = (val: number, decimalPlaces: number): number =>
  Math.round(val * (10 ** decimalPlaces)) / (10 ** decimalPlaces)