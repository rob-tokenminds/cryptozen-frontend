import CurrencyModel from "..//models/CurrencyModel";

export const DefaultTokens: string[] = [
  "uni",
  "link",
  "wbtc",
  "cro",
  "busd",
  "ceth",
  "aave",
  "okb",
  "ftt",
  "cusdc",
  "ht",
  "cdai",
  "hot",
];

export enum NETWORKS_LIST {
  ETH_TESTNET = "ETH_TESTNET",
  ETH_MAINNET = "ETH_MAINNET",
  BSC_TESTNET = "BSC_TESTNET",
  BSC_MAINNET = "BSC_MAINNET",
}

export interface BalanceInterface {
  id: number;
  value: string;
  name: string;
  network: string[];
  mainCurrency?: boolean;
  contractAddress?: { [key in NETWORKS_LIST]: string };
  decimal?: { [key in NETWORKS_LIST]: number };
  currency?: CurrencyModel[];
  chainIds: number[];
  logo?: string;
  mainAsset: boolean;
  balanceTotal?(
    chainId: string | undefined,
    address: string | undefined,
    hr: boolean
  ): string;
  realBalanceTotal?(): number;
  coinGeckoId?: string;
}

export const CRYPTOZEN_CONTRACTS: { [key in NETWORKS_LIST]: string } = {
  // ETH_TESTNET: "0x53BB043B01a8F1f23B5D7B1bc50cDa0eedd13a19",
  ETH_TESTNET: "0x5552eca80462F6BB50d87004bF71D5a8cbb613D7",
  ETH_MAINNET: "0xBD202EB895E2717B0382887370E03544149D5C71",
  BSC_TESTNET: "0xD134e47d7768bB1A7FfCC42A2FAdf5cba3B8113A",
  BSC_MAINNET: "0x250198fb1617b779391fbf920e5947fd25d44344",
};

export enum CoinList {
  usdc = "usdc",
  usdt = "usdt",
  eth = "eth",
  bnb = "bnb",
  dai = "dai",
  ninja = "ninja",
}

export enum NETWORKS {
  ETH = "ETH",
  BSC = "BSC",
}

export enum CHAIN_IDS {
  ETH_MAINNET = 1,
  ETH_TESTNET = 3,
  BSC_TESTNET = 97,
  BSC_MAINNET = 56,
}

export const NODE_URLS: { [key in NETWORKS_LIST]: string } = {
  ETH_TESTNET: "https://ropsten.infura.io/v3/cae0f55058ee4cda955c385804d33352",
  ETH_MAINNET: "https://mainnet.infura.io/v3/cae0f55058ee4cda955c385804d33352",
  BSC_TESTNET: "https://data-seed-prebsc-1-s1.binance.org:8545",
  BSC_MAINNET: "https://bsc-dataseed.binance.org",
};

const balances: BalanceInterface[] = [
  {
    id: 9999,
    value: CoinList.ninja,
    name: "Ninja Token",
    contractAddress: {
      ETH_TESTNET: "0x47d88fff2978a25787d618d22dc090a65651cdf9",
      ETH_MAINNET: "0x2d77695ef1E6DAC3AFf3E2B61484bDE2F88f0298",
      BSC_TESTNET: "0x5c648210abb0e77160dae48f5c3a20bc195295cc",
      // BSC_TESTNET: "0x289856272f27185433b9f9403516a254d2e2959e",
      BSC_MAINNET: "0x39921b176F69A9F01b094dE4b6e1c46d62D2A0cA",
    },
    decimal: {
      ETH_TESTNET: 18,
      ETH_MAINNET: 18,
      BSC_TESTNET: 18,
      BSC_MAINNET: 18,
    },
    chainIds: [1, 3, 56, 97],
    network: ["eth", "bsc"],
    mainAsset: true,
  },
  {
    id: 9998,
    value: CoinList.usdc,
    name: "USDC",
    network: ["eth", "bsc"],
    contractAddress: {
      ETH_TESTNET: "0x0801ad1506287ccdf6fa7016ec390ab0ceb0cb96",
      ETH_MAINNET: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      BSC_TESTNET: "0x8aa2f83e334e53926156fedceccf8ad63361eb46",
      BSC_MAINNET: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    },
    decimal: {
      ETH_TESTNET: 6,
      ETH_MAINNET: 6,
      BSC_TESTNET: 18,
      BSC_MAINNET: 18,
    },
    chainIds: [1, 3, 56, 97],
    mainAsset: true,
  },
  {
    id: 9997,
    value: CoinList.usdt,
    name: "USDT",
    network: ["eth", "bsc"],
    contractAddress: {
      ETH_TESTNET: "0x30BbA86AaaAaBeD1dcE5553b366D77B17437F60F",
      ETH_MAINNET: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      BSC_TESTNET: "0xb179d44de670f457cefd86cf8482b4cb71fed13b",
      BSC_MAINNET: "0x55d398326f99059ff775485246999027b3197955",
    },
    decimal: {
      ETH_TESTNET: 6,
      ETH_MAINNET: 6,
      BSC_TESTNET: 18,
      BSC_MAINNET: 18,
    },
    chainIds: [1, 3, 56, 97],
    mainAsset: true,
  },
  {
    id: 9996,
    value: CoinList.eth,
    name: "Ethereum",
    mainCurrency: true,
    chainIds: [1, 3],
    network: ["eth"],
    mainAsset: true,
  },
  {
    id: 9995,
    value: CoinList.bnb,
    name: "Binance",
    mainCurrency: true,
    chainIds: [56, 97],
    network: ["bsc"],
    mainAsset: true,
  },
  {
    id: 9995,
    value: CoinList.dai,
    name: "DAI",
    network: ["eth", "bsc"],
    contractAddress: {
      ETH_TESTNET: "0x2a318987215800e39feea5abc7eed38891485dc4",
      ETH_MAINNET: "0x6b175474e89094c44da98b954eedeac495271d0f",
      BSC_TESTNET: "0xea4e4402bf9e5dd6d45f79b017686ef9558686b5",
      BSC_MAINNET: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    },
    decimal: {
      ETH_TESTNET: 18,
      ETH_MAINNET: 18,
      BSC_TESTNET: 18,
      BSC_MAINNET: 18,
    },
    chainIds: [1, 3, 56, 97],
    mainAsset: true,
  },
];

export default balances;
