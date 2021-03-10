export default class CurrencyModel {
  address!: string;
  balance!: string;
  coin!: string;

  constructor(address: string, balance: string, coin: string) {
    this.address = address;
    this.balance = balance;
    this.coin = coin;
  }
}
