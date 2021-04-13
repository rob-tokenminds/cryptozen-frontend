export default class CurrencyModel {
  address!: string;
  balance!: string;
  coin!: string;
  allowance!: boolean;
  allowancePending!: boolean;
  hash!: string;
  balanceReverse!: string;
  constructor(
    address: string,
    balance: string,
    coin: string,
    allowance: boolean,
    allowancePending: boolean,
    hash: string,
    balanceReverse?: string
  ) {
    this.address = address;
    this.balance = balance;
    this.coin = coin;
    this.allowance = allowance;
    this.allowancePending = allowancePending;
    this.hash = hash;
    if (balanceReverse) this.balanceReverse = balanceReverse;
  }
}
