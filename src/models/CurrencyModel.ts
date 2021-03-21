export default class CurrencyModel {
  address!: string;
  balance!: string;
  coin!: string;
  allowance!: boolean;
  constructor(
    address: string,
    balance: string,
    coin: string,
    allowance: boolean
  ) {
    this.address = address;
    this.balance = balance;
    this.coin = coin;
    this.allowance = allowance;
  }
}
