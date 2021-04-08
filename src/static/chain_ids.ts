const chainIds = [
  {
    name: "Binance Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s3.binance.org:8545/",
    chainId: 97,
    currencySymbol: "BNB",
    blockExplorer: "https://testnet.bscscan.com",
  },
  {
    name: "Binance Mainnet",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    chainId: 56,
    currencySymbol: "BNB",
    blockExplorer: "https://bscscan.com",
  },
  {
    name: "Ropsten",
    rpcUrl: "https://ropsten.infura.io/v3/00000000000",
    chainId: 3,
    currencySymbol: "ETH",
    blockExplorer: "https://ropsten.etherscan.io",
  },
];
export default chainIds;
