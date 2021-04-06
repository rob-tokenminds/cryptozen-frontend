const ROPSTEN = "0x11cbd1eb707fd652c6a98395960d422d9da5d430";
const MAINNET = "";
const BSC_TESTNET = "0xa09bbf8e372b9ee7519de2812cb1eeba8feedb32";
const BSC_MAINNET = "";

const contract = (id: number) => {
  switch (id) {
    case 1:
      return MAINNET;
    case 3:
      return ROPSTEN;

    case 97:
      return BSC_TESTNET;

    case 56:
      return BSC_MAINNET;
  }
};

export default contract;
