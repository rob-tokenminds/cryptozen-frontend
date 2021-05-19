import { TransactionInterface } from "@/store/fetcher";
import axios from "axios";
import { storeInterface } from "@/store";
import AbiDecoder from "abi-decoder";
import erc20abi from "@/static/erc20abi";
import cryptozenabi from "@/static/cryptozenabi";
import { CRYPTOZEN_CONTRACTS } from "@/static/balance";
import { fromUnixTime } from "date-fns";
AbiDecoder.addABI(erc20abi);
AbiDecoder.addABI(cryptozenabi);
export class ExternalTransaction {
  chainId!: number;
  address!: string;
  blockNumber!: number;
  state!: storeInterface;
  constructor(
    chainId: number,
    address: string,
    blockNumber: number,
    state: storeInterface
  ) {
    this.chainId = chainId;
    this.address = address;
    this.blockNumber = blockNumber;
    this.state = state;
  }

  async fetch(): Promise<TransactionInterface[]> {
    switch (Number(this.chainId)) {
      case 56:
      case 97:
        return await new BscExternalTransaction(
          Number(this.chainId),
          this.address,
          this.blockNumber,
          this.state
        ).fetch();
      default:
        return [];
    }
  }
}

export class BscExternalTransaction {
  chainId!: number;
  address!: string;
  blockNumber!: number;
  state!: storeInterface;
  constructor(
    chainId: number,
    address: string,
    blockNumber: number,
    state: storeInterface
  ) {
    this.chainId = chainId;
    this.address = address;
    this.blockNumber = blockNumber;
    this.state = state;
  }

  async fetch(): Promise<TransactionInterface[]> {
    let baseUrl = "https://api.bscscan.com";
    if (this.chainId === 97) {
      baseUrl = "https://api-testnet.bscscan.com";
    }
    const url = `${baseUrl}/api?module=account&action=txlist&address=${
      this.address
    }&startblock=${this.startBlockNumber()}&endblock=${
      this.blockNumber
    }&sort=desc&apikey=HMYMAYZUKUBSD7CU3KMMKS9KFZADAHRUW7`;
    // console.log("url", url);
    const trxData: EtherscanNormalTransaction[] = (await axios.get(url)).data
      .result;
    // console.log("trxData", trxData);
    const result: TransactionInterface[] = [];
    if (trxData.length > 0) {
      for (const trx of trxData) {
        if (!this.state.transactions.find((tx) => tx.hash === trx.hash)) {
          const network = `${this.state.networkName.toUpperCase()}_${this.state.networkType.toUpperCase()}` as "ETH_MAINNET";

          if (
            trx.to &&
            trx.contractAddress.toLowerCase() !==
              CRYPTOZEN_CONTRACTS[network].toLowerCase()
          ) {
            const value = trx.value;
            let isApprove = false;
            if (trx.input !== "0x") {
              const decodedData = AbiDecoder.decodeMethod(trx.input);
              if (decodedData && decodedData.name.toLowerCase() === "approve") {
                isApprove = true;
              }
            }

            let token;
            if (isApprove) {
              token = this.state.tokenList.find((t) =>
                t.contractAddress
                  ? t.contractAddress[network].toLowerCase() ===
                    trx.to.toLowerCase()
                  : false
              );
            }

            if (token || Number(value)) {
              const data: TransactionInterface = {
                chainId: this.chainId,
                created_at: fromUnixTime(Number(trx.timeStamp)).toISOString(),
                fee: "0",
                from: trx.from,
                gas: Number(trx.gas),
                gasPrice: Number(trx.gasPrice),
                hash: trx.hash,
                isClaimReward: false,
                isError: trx.isError === "1",
                isInternal: false,
                isOnHold: false,
                isToken: false,
                nonce: Number(trx.nonce),
                reward: "0",
                timestamp: Number(trx.timeStamp),
                to: trx.to,
                tokenName: token ? token.name : "BSC",
                tokenSymbol: token ? token.value : "BSC",
                updated_at: fromUnixTime(Number(trx.timeStamp)).toISOString(),
                value: value,
                id: trx.hash,
                user_id: this.state.profile?.id as string,
                blockNumber: Number(trx.blockNumber),
                isApprove: isApprove,
                isExternal: true,
              };
              result.push(data);
            }
          }
        }
      }
    }

    const urlToken = `${baseUrl}/api?module=account&action=tokentx&address=${
      this.address
    }&startblock=${this.startBlockNumber()}&endblock=${
      this.blockNumber
    }&sort=desc&apikey=HMYMAYZUKUBSD7CU3KMMKS9KFZADAHRUW7`;
    const trxDataToken: BEP20EventTransaction[] = (await axios.get(urlToken))
      .data.result;
    if (trxDataToken.length > 0) {
      for (const trx of trxDataToken) {
        if (!this.state.transactions.find((tx) => tx.hash === trx.hash)) {
          const network = `${this.state.networkName.toUpperCase()}_${this.state.networkType.toUpperCase()}` as "ETH_MAINNET";
          const token = this.state.tokenList.find((token) =>
            token.contractAddress
              ? token.contractAddress[network].toLowerCase() ===
                trx.contractAddress.toLowerCase()
              : false
          );

          const data: TransactionInterface = {
            chainId: this.chainId,
            created_at: fromUnixTime(Number(trx.timeStamp)).toISOString(),
            fee: "0",
            from: trx.from,
            gas: Number(trx.gas),
            gasPrice: Number(trx.gasPrice),
            hash: trx.hash,
            isClaimReward: false,
            isError: false,
            isInternal: false,
            isOnHold: false,
            isToken: true,
            nonce: Number(trx.nonce),
            reward: "0",
            timestamp: Number(trx.timeStamp),
            to: trx.to,
            tokenName: token ? token.name : trx.tokenName,
            tokenSymbol: token ? token.value : trx.tokenSymbol,
            updated_at: fromUnixTime(Number(trx.timeStamp)).toISOString(),
            value: trx.value,
            tokenDecimal: Number(trx.tokenDecimal),
            id: trx.hash,
            user_id: this.state.profile?.id as string,
            blockNumber: Number(trx.blockNumber),
            isApprove: false,
            isExternal: true,
          };
          // console.log("datadatadata", data);
          result.push(data);
        }
      }
    }

    this.setBlockNumber();
    this.setResult(result);
    return result;
  }

  startBlockNumber(): number {
    const last = localStorage.getItem(
      `lastBlockNumber:bsc:${
        this.state.networkType
      }:${this.address.toLowerCase()}`
    );
    if (last) {
      return Number(last) + 1;
    }
    return 1;
  }

  getResult(): TransactionInterface[] {
    const result = localStorage.getItem(
      `result:bsc:${this.state.networkType}:${this.address.toLowerCase()}`
    );
    if (result) {
      return JSON.parse(result);
    }
    return [];
  }

  setResult(result: TransactionInterface[]): void {
    const previousResult = this.getResult();
    if (previousResult.length) {
      const finalResult = previousResult;
      for (const res of result) {
        if (!previousResult.find((p) => p.hash === res.hash)) {
          finalResult.push(res);
        }
      }
      localStorage.setItem(
        `result:bsc:${this.state.networkType}:${this.address.toLowerCase()}`,
        JSON.stringify(finalResult)
      );
    } else {
      localStorage.setItem(
        `result:bsc:${this.state.networkType}:${this.address.toLowerCase()}`,
        JSON.stringify(result)
      );
    }
  }

  setBlockNumber(): void {
    localStorage.setItem(
      `lastBlockNumber:bsc:${
        this.state.networkType
      }:${this.address.toLowerCase()}`,
      this.blockNumber.toString()
    );
  }
}

export interface EtherscanNormalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface BEP20EventTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
