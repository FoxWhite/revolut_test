declare type GetRatesResult = {
  rates?: Rates,
  base?:  string,
  error?: string,
};

declare type ApiResponse = {
  status: number,
  statusText: string
}
