import * as Uniswap from "@uniswap/sdk";

import * as PancakeSwap from "./pancakeswap-sdk";
import * as PancakeSwapTestnet from "./pancakeswap-testnet-sdk";

const CryptozenSdk = (type: string, isTestnet: boolean): typeof Uniswap => {
  if (type === "eth") {
    return Uniswap;
  } else {
    if (isTestnet) {
      return (PancakeSwapTestnet as unknown) as typeof Uniswap;
    }
    return (PancakeSwap as unknown) as typeof Uniswap;
  }
};

export default CryptozenSdk;
