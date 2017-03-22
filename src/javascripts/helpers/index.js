/*
  checks if
*/

export const ratesAreLoaded = (ratesData: RatesStore): boolean => {
  const { data } = ratesData;
  return (
    Object.keys(data.rates).length > 0 &&
    data.base.length > 0 &&
    !ratesData.error &&
    !ratesData.isLoading
  );
}

