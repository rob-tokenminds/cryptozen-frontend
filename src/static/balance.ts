import CurrencyModel from "..//models/CurrencyModel";

export interface BalanceInterface {
  value: CoinList;
  name: string;
  contractAddress?: {
    ROPSTEN: string;
    MAINNET: string;
  };
  decimal?: number;
  currency?: CurrencyModel;
}

export enum CoinList {
  usdc = "usdc",
  usdt = "usdt",
  eth = "eth",
  dai = "dai",
  bf = "bf",
}

const balances: BalanceInterface[] = [
  {
    value: CoinList.usdc,
    name: "USDC",
    contractAddress: {
      ROPSTEN: "0x0801ad1506287ccdf6fa7016ec390ab0ceb0cb96",
      MAINNET: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    decimal: 6,
  },
  {
    value: CoinList.usdt,
    name: "USDT",
    contractAddress: {
      ROPSTEN: "0x4717501931a1d39706fc655b5fcccfda2eb7f759",
      MAINNET: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    decimal: 6,
  },
  {
    value: CoinList.eth,
    name: "Ethereum",
  },
  {
    value: CoinList.dai,
    name: "DAI",
    contractAddress: {
      ROPSTEN: "0x2a318987215800e39feea5abc7eed38891485dc4",
      MAINNET: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    decimal: 18,
  },
  {
    value: CoinList.bf,
    name: "Ninja Token",
    contractAddress: {
      ROPSTEN: "0xacef59a53941ebff53cea6c9296c6a3af96a1a41",
      MAINNET: "0xacef59a53941ebff53cea6c9296c6a3af96a1a41",
    },
    decimal: 18,
  },
];

export default balances;
