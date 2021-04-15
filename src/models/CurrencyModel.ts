import { NETWORKS, CHAIN_IDS } from "../static/balance";

export default class CurrencyModel {
  address!: string;
  balance!: string;
  coin!: string;
  allowance!: boolean;
  allowancePending!: boolean;
  hash!: string;
  balanceReverse!: string;
  network!: NETWORKS;
  chainId!: CHAIN_IDS;
  constructor(
    address: string,
    balance: string,
    coin: string,
    allowance: boolean,
    allowancePending: boolean,
    hash: string,
    network: NETWORKS,
    chainId: CHAIN_IDS
  ) {
    this.address = address;
    this.balance = balance;
    this.coin = coin;
    this.allowance = allowance;
    this.allowancePending = allowancePending;
    this.hash = hash;
    this.network = network;
    this.chainId = chainId;
  }
}
