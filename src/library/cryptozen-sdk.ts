import * as Uniswap from "@uniswap/sdk";

import * as PancakeSwap from "./pancakeswap-sdk";

const CryptozenSdk = (type: string): any => {
  if (type === "eth") {
    return Uniswap;
  } else {
    return PancakeSwap;
  }
};

export default CryptozenSdk;
