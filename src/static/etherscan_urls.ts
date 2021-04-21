import { NETWORKS_LIST } from "@/static/balance";

const urls: { [key in NETWORKS_LIST]: string } = {
  ETH_TESTNET: "https://api-ropsten.etherscan.io",
  ETH_MAINNET: "https://api.etherscan.io",
  BSC_TESTNET: "https://api-testnet.bcscan.com",
  BSC_MAINNET: "https://api.bcscan.com",
};

export default urls;
