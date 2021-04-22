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
  ETH_TESTNET: "0xc13588ff090dec50260eb2c9f3e405ce407a9e8b",
  ETH_MAINNET: "",
  BSC_TESTNET: "0x3ddb757a8b21e196336931289c019ac3c18f3905",
  BSC_MAINNET: "",
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
  ETH_TESTNET: process.env.VUE_APP_ROPSTEN_NODE_URL as string,
  ETH_MAINNET: process.env.VUE_APP_MAINNET_NODE_URL as string,
  BSC_TESTNET: process.env.VUE_APP_BNB_TESTNET_NODE_URL as string,
  BSC_MAINNET: process.env.VUE_APP_BNB_MAINNET_NODE_URL as string,
};

const balances: BalanceInterface[] = [
  {
    id: 9999,
    value: CoinList.ninja,
    name: "Ninja Token",
    contractAddress: {
      ETH_TESTNET: "0x47d88fff2978a25787d618d22dc090a65651cdf9",
      ETH_MAINNET: "",
      BSC_TESTNET: "",
      // BSC_TESTNET: "0x289856272f27185433b9f9403516a254d2e2959e",
      BSC_MAINNET: "",
    },
    decimal: {
      ETH_TESTNET: 18,
      ETH_MAINNET: 18,
      BSC_TESTNET: 18,
      BSC_MAINNET: 18,
    },
    chainIds: [1, 3],
    network: ["eth"],
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
      ETH_TESTNET: "0x4717501931a1d39706fc655b5fcccfda2eb7f759",
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
