const ROPSTEN = "0xc13588ff090dec50260eb2c9f3e405ce407a9e8b";
const MAINNET = "";
const BSC_TESTNET = "0x3ddb757a8b21e196336931289c019ac3c18f3905";
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
