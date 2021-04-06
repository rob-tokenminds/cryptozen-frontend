import CurrencyModel from "..//models/CurrencyModel";

export interface BalanceInterface {
  value: CoinList;
  name: string;
  mainCurrency?: boolean;
  contractAddress?: {
    ROPSTEN: string;
    MAINNET: string;
    BSC_TESTNET: string;
    BSC_MAINNET: string;
  };
  decimal?: number;
  currency?: CurrencyModel;
}

export enum CoinList {
  usdc = "usdc",
  usdt = "usdt",
  eth = "eth",
  bnb = "bnb",
  dai = "dai",
  ninja = "ninja",
}

const balances: BalanceInterface[] = [
  {
    value: CoinList.usdc,
    name: "USDC",
    contractAddress: {
      ROPSTEN: "0x0801ad1506287ccdf6fa7016ec390ab0ceb0cb96",
      MAINNET: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      BSC_TESTNET: "0x8aa2f83e334e53926156fedceccf8ad63361eb46",
      BSC_MAINNET: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    },
    decimal: 6,
  },
  {
    value: CoinList.usdt,
    name: "USDT",
    contractAddress: {
      ROPSTEN: "0x4717501931a1d39706fc655b5fcccfda2eb7f759",
      MAINNET: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      BSC_TESTNET: "0xb179d44de670f457cefd86cf8482b4cb71fed13b",
      BSC_MAINNET: "0x55d398326f99059ff775485246999027b3197955",
    },
    decimal: 6,
  },
  {
    value: CoinList.eth,
    name: "Ethereum",
    mainCurrency: true,
  },
  {
    value: CoinList.bnb,
    name: "Binance",
    mainCurrency: true,
  },
  {
    value: CoinList.dai,
    name: "DAI",
    contractAddress: {
      ROPSTEN: "0x2a318987215800e39feea5abc7eed38891485dc4",
      MAINNET: "0x6b175474e89094c44da98b954eedeac495271d0f",
      BSC_TESTNET: "0xea4e4402bf9e5dd6d45f79b017686ef9558686b5",
      BSC_MAINNET: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    },
    decimal: 18,
  },
  {
    value: CoinList.ninja,
    name: "Ninja Token",
    contractAddress: {
      ROPSTEN: "0x47d88fff2978a25787d618d22dc090a65651cdf9",
      MAINNET: "",
      BSC_TESTNET: "0x289856272f27185433b9f9403516a254d2e2959e",
      BSC_MAINNET: "",
    },
    decimal: 18,
  },
];

export default balances;
