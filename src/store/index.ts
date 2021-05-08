import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import CurrencyModel from "../models/CurrencyModel";
import Web3 from "web3";
import Balances, {
  BalanceInterface,
  CHAIN_IDS,
  CRYPTOZEN_CONTRACTS,
  DefaultTokens,
  NETWORKS,
  NETWORKS_LIST,
  NODE_URLS,
} from "../static/balance";
import ERC20Abi from "../static/erc20abi";
import {
  AddressBookInterface,
  Fetcher,
  ProfileInterface,
  RewardInterface,
  TransactionInterface,
} from "./fetcher";
import cryptozenabi from "@/static/cryptozenabi";
import fromExponential from "from-exponential";
import HRNumber from "human-readable-numbers";
import { CoingeckoInterface } from "../interfaces";
import BigNumber from "bignumber.js";
import axios from "axios";
import { addHours } from "date-fns";
export interface updateCoinBalanceParams {
  web3: Web3;
  coin: BalanceInterface;
}
export interface storeInterface {
  currencyBalances: CurrencyModel[];
  selectedAddress: string;
  chainId: number;
  networkName: string;
  networkType: "MAINNET" | "TESTNET";
  balances: BalanceInterface[];
  reverseBalances: BalanceInterface[];
  words: string;
  profile: ProfileInterface | null;
  addressBooks: AddressBookInterface[];
  web3: Web3 | null;
  socket: {
    isConnected: boolean;
    message: string;
    reconnectError: boolean;
  };
  notifications: UserNotification[];
  transactions: TransactionInterface[];
  isLogin: boolean;
  tier: [];
  rewards: RewardInterface[];
  claimableReward: number;
  tokenList: BalanceInterface[];
  userAddresses: string[];
  coinGeckoPrices: CoingeckoInterface[];
}
// const vuexLocal = new VuexPersistence<storeInterface>({
//   storage: window.localStorage,
//   // reducer: (state) => ({ transactions: state.transactions }),
// });
Vue.use(Vuex);

export interface UserNotification {
  id: string;
  user_id: string;
  message: string;
  url: string;
  is_read: boolean;
  created_at: string;
}

export interface createWalletInterface {
  name: string;
  address: string;
  currency: string;
  email: string;
  plainEmail: string;
  sendEmail: boolean;
  type: string;
  tokenListId: number;
}

export interface updateWalletInterface {
  name: string;
  address: string;
  currency: string;
  id: string;
  tokenListId: number;
}

const store: StoreOptions<storeInterface> = {
  state: {
    currencyBalances: [],
    selectedAddress: "",
    chainId: 0,
    networkName: "",
    networkType: "MAINNET",
    balances: Balances,
    reverseBalances: [],
    words: "",
    profile: null,
    addressBooks: [],
    web3: null,
    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
    },
    notifications: [],
    transactions: [],
    isLogin: false,
    tier: [],
    rewards: [],
    claimableReward: 0,
    tokenList: [],
    userAddresses: [],
    coinGeckoPrices: [],
  },
  mutations: {
    pushCurrencyBalances(state, ethereumBalanceModel: CurrencyModel) {
      state.currencyBalances.push(ethereumBalanceModel);
    },
    pushBalance(state, balance: BalanceInterface) {
      const findIndex = state.balances.findIndex(
        (b) => b.value.toLowerCase() === balance.value.toLowerCase()
      );
      state.balances.splice(findIndex, 1, balance);
    },
  },
  actions: {
    async updateCoinBalance(
      { commit, state },
      { coin, address }: { coin: BalanceInterface; address: string }
    ) {
      if (state.chainId) {
        for (const NETWORK of Object.keys(NETWORKS)) {
          try {
            let web3 = state.web3;
            const networkName = `${NETWORK}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;

            console.log("NETWORK12", state.networkName.toUpperCase());
            if (NETWORK !== state.networkName.toUpperCase()) {
              const nodeUrl = NODE_URLS[networkName];
              web3 = new Web3(nodeUrl);
            }
            if (web3) {
              let newBalance;
              if (coin.mainCurrency) {
                await web3.eth
                  .getBalance(address)
                  .then(async (balanceInWei) => {
                    if (web3) {
                      newBalance = new CurrencyModel(
                        address,
                        web3.utils.fromWei(balanceInWei, "ether"),
                        coin.value,
                        true,
                        false,
                        "",
                        NETWORK as NETWORKS,
                        CHAIN_IDS[
                          `${NETWORK}_${state.networkType.toUpperCase()}` as "ETH_TESTNET"
                        ]
                      );
                    }
                  });
              } else {
                if (coin.decimal && coin.contractAddress) {
                  console.log("networkName", networkName);
                  const contractAddress = coin.contractAddress[networkName];
                  console.log("networkNamecontractAddress", contractAddress);
                  if (contractAddress) {
                    const decimal = coin.decimal[networkName];
                    const contract = new web3.eth.Contract(
                      ERC20Abi,
                      contractAddress
                    );
                    await contract.methods
                      .balanceOf(address)
                      .call({ from: state.selectedAddress })
                      .then(async (unscaledBalance: number) => {
                        if (decimal && web3) {
                          const contract = new web3.eth.Contract(
                            ERC20Abi,
                            contractAddress
                          );
                          const CRYPTOZEN_CONTRACT =
                            CRYPTOZEN_CONTRACTS[networkName];

                          const allowance = await contract.methods
                            .allowance(address, CRYPTOZEN_CONTRACT)
                            .call({ from: state.selectedAddress });
                          console.log("allowance", allowance);
                          let isApproved = false;
                          // let hash = "";
                          let tx;
                          if (Number(unscaledBalance) > 0) {
                            if (Number(allowance) === 0) {
                              const token = Vue.$cookies.get("cryptozen_token");
                              // hash = await Fetcher.getApproval(
                              //   token,
                              //   address,
                              //   contractAddress,
                              //   state.chainId
                              // );

                              // if (hash) {
                              //   tx = await web3.eth.getTransactionReceipt(hash);
                              //   if (tx && tx.status) {
                              //     isApproved = true;
                              //   }
                              // } else {
                              //   isApproved = true;
                              // }
                            } else {
                              isApproved = true;
                            }
                          }
                          const balance = new BigNumber(unscaledBalance).div(
                            10 ** decimal
                          );

                          // if (coin.value === "uni") {
                          //   console.log("uniuniunscaledBalance", unscaledBalance);
                          //   console.log("uniunidecimal", decimal);
                          //   console.log("uniuni", balance.toString());
                          // }

                          newBalance = new CurrencyModel(
                            address,
                            balance.toString(),
                            coin.value,
                            Number(allowance) > 0,
                            !isApproved,
                            "",
                            NETWORK as NETWORKS,
                            CHAIN_IDS[
                              `${NETWORK}_${state.networkType.toUpperCase()}` as "ETH_TESTNET"
                            ]
                          );
                        }
                      });
                  }
                }
              }

              if (newBalance) {
                const index = state.balances.findIndex(
                  (b) => b.value === coin.value
                );
                if (index >= 0) {
                  const currencies = state.balances[index].currency;
                  if (currencies) {
                    const currencyIndex = currencies.findIndex(
                      (c) =>
                        c.coin === coin.value &&
                        c.address.toLowerCase() === address.toLowerCase() &&
                        c.network === NETWORK
                    );
                    if (currencyIndex >= 0) {
                      currencies.splice(currencyIndex, 1, newBalance);
                      const result = Object.assign(state.balances[index], {
                        currency: currencies,
                      });
                      state.balances.splice(index, 1, result);
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error(`errUpdateCoinBalance`, e);
          }
        }
      }
    },
    async updateAddresses({ state, dispatch }, addresses: string[]) {
      const balances = [];

      const addressesLocal = localStorage.getItem("watchAddresses");
      let addressesData: string[] = [];
      if (addressesLocal) {
        addressesData = JSON.parse(addressesLocal);
      } else {
        addressesData = addresses;
        localStorage.setItem("watchAddresses", JSON.stringify(addressesData));
      }

      for (const address of addresses) {
        if (
          !addressesData.find((a) => a.toLowerCase() === address.toLowerCase())
        )
          addressesData.push(address);
      }
      state.userAddresses = addressesData;
      localStorage.setItem(
        "watchAddresses",
        JSON.stringify(state.userAddresses)
      );
      for (const balance of state.balances) {
        const currencies = [];

        for (const network of Object.keys(NETWORKS)) {
          for (const address of state.userAddresses) {
            let skip = false;
            if (
              balance.network &&
              !balance.network.find(
                (n) => n.toLowerCase() === network.toLowerCase()
              )
            ) {
              skip = true;
            }
            if (!skip)
              currencies.push(
                new CurrencyModel(
                  address,
                  "0",
                  balance.value,
                  false,
                  false,
                  "",
                  network as NETWORKS,
                  CHAIN_IDS[
                    `${network}_${state.networkType.toUpperCase()}` as "ETH_TESTNET"
                  ]
                )
              );
          }
        }
        balances.push(Object.assign(balance, { currency: currencies }));
      }
      state.balances = balances;
      dispatch("updateBalanceFunctions");
    },
    async approve({ state }, coin: BalanceInterface) {
      const web3 = state.web3;
      if (web3 && coin.contractAddress) {
        try {
          const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
          const contractAddress = coin.contractAddress[networkName];

          if (coin.decimal && contractAddress) {
            const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
            const CRYPTOZEN_CONTRACT = CRYPTOZEN_CONTRACTS[networkName];
            const approveData = await contract.methods
              .approve(
                CRYPTOZEN_CONTRACT,
                fromExponential(
                  Number(999999999 * 10 ** coin.decimal[networkName]).toString()
                )
              )
              .encodeABI();
            const params = {
              from: window.ethereum.selectedAddress,
              to: contractAddress,
              value: 0,
              data: approveData,
            };
            await new Promise((resolve, reject) => {
              web3.eth
                .sendTransaction(params)
                .on("transactionHash", async (hash) => {
                  console.log("hash", hash);
                  const token = Vue.$cookies.get("cryptozen_token");
                  localStorage.setItem(
                    `approval:${state.selectedAddress}`,
                    hash
                  );
                  // await Fetcher.postApproval(
                  //   token,
                  //   hash,
                  //   window.ethereum.selectedAddress,
                  //   contractAddress as string,
                  //   state.chainId
                  // );
                  alert(
                    "Processing approval function, please wait until it confirmed on the blockchain. You can see the progress directly on metamask "
                  );
                })
                .on("receipt", (receipt) => {
                  console.log("receipt", receipt);
                  localStorage.removeItem(`approval:${state.selectedAddress}`);
                  resolve(true);
                })
                .on("error", (error) => {
                  reject(error);
                  localStorage.removeItem(`approval:${state.selectedAddress}`);
                });
            });
          }
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    async getHashApproval({ state }, { address, contractAddress }) {
      const token = Vue.$cookies.get("cryptozen_token");
      // return await Fetcher.getApproval(
      //   token,
      //   address,
      //   contractAddress,
      //   state.chainId
      // );
    },
    updateSelectedAddress({ state }, address: string) {
      state.selectedAddress = address;
    },
    async updateChainId({ state, dispatch }, web3: Web3) {
      state.chainId = await web3.eth.getChainId();
      if (state.chainId === 3 || state.chainId === 1) {
        state.networkName = "ETH";
      }
      if (state.chainId === 56 || state.chainId === 97) {
        state.networkName = "BSC";
      }
      if (state.chainId === 3 || state.chainId === 97) {
        state.networkType = "TESTNET";
      }
      // await dispatch("updateReverseBalance");
      // if (state.chainId !== 1 && state.chainId !== 3) {
      //   const index = state.balances.findIndex((b) => b.name === "Ethereum");
      //
      //   if (index >= 0) {
      //     state.balances.splice(index, 1);
      //   }
      //   const index2 = state.balances.findIndex((b) => b.value === "ninja");
      //   if (index2 >= 0) {
      //     state.balances.splice(index2, 1);
      //   }
      //   console.log("index2state.balances", state.balances);
      // } else {
      //   const index = state.balances.findIndex((b) => b.name === "Binance");
      //   if (index >= 0) {
      //     state.balances.splice(index, 1);
      //   }
      // }
    },
    async getLoginWord() {
      return await Fetcher.getLoginWords();
    },
    async login({ state }, { address, signature, chainId }) {
      const accessToken = await Fetcher.login(address, signature, chainId);
      Vue.$cookies.set("cryptozen_token", accessToken);
      return accessToken;
    },
    async getProfile({ state }) {
      Vue.$cookies.get("cryptozen_token");
      const profile = await Fetcher.getProfile(
        Vue.$cookies.get("cryptozen_token")
      );
      state.isLogin = true;
      state.profile = profile;

      return profile;
    },
    async setEmail({ state }, email) {
      const token = Vue.$cookies.get("cryptozen_token");
      const emailData = await Fetcher.updateEmail(token, email);
      if (emailData) {
        alert(
          `we've sent an verification link to your email, please verify your email to keep use our platform`
        );
        if (state.profile) {
          Vue.set(state.profile, "email", emailData);
        }
      }
    },
    async createWallet({ state }, params: createWalletInterface) {
      const token = Vue.$cookies.get("cryptozen_token");
      const addressBookData = await Fetcher.createWallet(
        token,
        params.name,
        params.address,
        params.currency,
        params.email,
        params.sendEmail,
        params.plainEmail,
        params.type,
        state.chainId,
        params.tokenListId
      );
      state.addressBooks.push(addressBookData);
      return addressBookData;
    },
    async updateWallet({ state }, params: updateWalletInterface) {
      const token = Vue.$cookies.get("cryptozen_token");
      const addressBook = await Fetcher.updateWallet(
        token,
        params.id,
        params.name,
        params.address,
        params.currency,
        params.tokenListId
      );
      const addressBookDataIndex = state.addressBooks.findIndex(
        (a) => a.id === params.id
      );
      state.addressBooks.splice(addressBookDataIndex, 1, addressBook);
    },
    async deleteWallet({ state }, id: string) {
      const token = Vue.$cookies.get("cryptozen_token");
      await Fetcher.deleteWallet(token, id);
      const addressBookDataIndex = state.addressBooks.findIndex(
        (a) => a.id === id
      );
      state.addressBooks.splice(addressBookDataIndex, 1);
    },
    async getAddressBookList({ state }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const addressBooks = await Fetcher.getAddressBookList(token);
      for (const addressBook of addressBooks) {
        if (!state.addressBooks.find((a) => addressBook.id === a.id))
          state.addressBooks.push(addressBook);
      }
    },
    setWeb3({ state }, web3: Web3) {
      state.web3 = web3;
    },
    async getNotifications({ state }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const notifications = await Fetcher.getNotifications(token);
      for (const notification of notifications) {
        if (!state.notifications.find((a) => notification.id === a.id))
          state.notifications.push(notification);
      }
      if (!state.profile?.email && state.profile) {
        if (!state.notifications.find((n) => n.id === "string"))
          state.notifications.unshift({
            id: "string",
            user_id: state.profile.id,
            message: `Please add your email to save wallet addresses`,
            url: "",
            is_read: false,
            created_at: new Date().toDateString(),
          });
      }
    },
    async setNotificationIsRead({ state }, notification: UserNotification) {
      await Fetcher.markAsRead(notification.id);
      const index = state.notifications.findIndex(
        (n) => n.id === notification.id
      );
      state.notifications.splice(
        index,
        1,
        Object.assign(notification, { is_read: true })
      );
    },
    async clearNotifications({ state }, user_id) {
      await Fetcher.clearNotifications(user_id);
    },
    async getTransactions({ state }, { addresses, currency }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const transactions = await Fetcher.getTransactions(
        token,
        addresses,

        currency
      );
      if (transactions.length) {
        for (const transaction of transactions) {
          const checkTrx = state.transactions.findIndex(
            (t) => t.id === transaction.id
          );
          if (checkTrx < 0) {
            state.transactions.push(transaction);
          } else {
            state.transactions.splice(checkTrx, 1, transaction);
          }
        }
      }
    },
    async getSyncTransactions({ state, dispatch }, { address, currency }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const transactions = await Fetcher.getSyncTransactions(
        token,
        address,
        state.chainId,
        currency
      );
      if (transactions.length) {
        for (const transaction of transactions) {
          const checkTrx = state.transactions.findIndex(
            (t) => t.id === transaction.id
          );
          if (checkTrx < 0) {
            state.transactions.push(transaction);
          } else {
            state.transactions.splice(checkTrx, 1, transaction);
          }
        }
        for (const balance of state.balances) {
          await dispatch("updateCoinBalance", balance);
        }
      }
    },
    async newTrx(
      { state },
      {
        hash,
        isToken,
        fee,
        reference,
        reward,
      }: //
      {
        hash: string;
        isToken: boolean;
        fee: string;
        reference: string;
        reward: string;
      }
    ) {
      const token = Vue.$cookies.get("cryptozen_token");
      const trx = await Fetcher.postNewTrx(
        token,
        hash,
        isToken,
        fee,
        reference,
        reward,
        state.chainId
      );
      const checkTrx = state.transactions.find((t) => t.id === trx.id);
      if (!checkTrx) {
        state.transactions.push(trx);
      }
      return trx;
    },
    async updateTrx(
      { state },
      {
        id,
        hash,
        isToken,
        fee,
        reference,
        reward,
      }: {
        id: string;
        hash: string;
        isToken: boolean;
        fee: string;
        reference: string;
        reward: any;
      }
    ) {
      const token = Vue.$cookies.get("cryptozen_token");
      const trx = await Fetcher.updateNewTrx(
        token,
        id,
        hash,
        isToken,
        fee,
        reference,
        reward,
        state.chainId
      );
      const checkTrx = state.transactions.findIndex((t) => t.id === trx.id);
      if (checkTrx) {
        state.transactions.splice(checkTrx, 1, trx);
      }
      return trx;
    },
    async newTrxWithEmail(
      { state },
      { currency, name, plainEmail, email, reference, amount }
    ) {
      const token = Vue.$cookies.get("cryptozen_token");
      const trx = await Fetcher.postNewTrxWithEmail(
        token,
        amount,
        currency,
        name,
        plainEmail,
        email,
        reference,
        state.chainId
      );
      const checkTrx = state.transactions.find((t) => t.id === trx.id);
      if (!checkTrx) {
        state.transactions.push(trx);
      }
      return trx;
    },
    async getTier({ state }) {
      const web3 = state.web3;
      if (web3) {
        const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
        const CRYPTOZEN_CONTRACT = CRYPTOZEN_CONTRACTS[networkName];
        const contract = new web3.eth.Contract(
          cryptozenabi,
          CRYPTOZEN_CONTRACT
        );
        const tier = await contract.methods
          .getTier()
          .call({ from: state.selectedAddress });
        console.log("tier", tier);
        state.tier = tier;
      }
    },
    async getRewards({ state }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const rewards = await Fetcher.getRewards(token);
      for (const reward of rewards) {
        const findReward = state.rewards.find((r) => r.id === reward.id);
        if (!findReward) {
          state.rewards.push(reward);
        }
      }
      const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
      const web3 = state.web3 as Web3;
      // if ("ETH" !== state.networkName.toUpperCase()) {
      //   const nodeUrl = NODE_URLS[networkName];
      //   web3 = new Web3(nodeUrl);
      // }
      console.log("state.chainId", state.chainId);
      const CRYPTOZEN_CONTRACT = CRYPTOZEN_CONTRACTS[networkName];
      console.log("cryptozenContract", CRYPTOZEN_CONTRACT);
      const contract = new web3.eth.Contract(cryptozenabi, CRYPTOZEN_CONTRACT);
      const claimableReward = await contract.methods
        .getReward()
        .call({ from: state.selectedAddress });
      console.log("claimableReward", claimableReward);
      state.claimableReward = claimableReward / 10 ** 18;
    },
    async newClaimReward({ state }, { hash, amount }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const tx = await Fetcher.newClaimReward(
        token,
        hash,
        state.chainId,
        amount
      );
      if (tx) {
        const checkTrx = state.transactions.findIndex((t) => t.id === tx.id);
        if (checkTrx < 0) {
          state.transactions.push(tx);
        }
      }
    },
    async getTokenList({ state }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const tokenList = await Fetcher.getCachedTokenList(token);
      console.log("tokenList", tokenList);
      state.tokenList = tokenList;
    },
    async getDefaultTokenList({ state, dispatch }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const tokenList = await Fetcher.getDefaultTokenList(token);

      console.log("getDefaultTokenList", tokenList);
      state.balances = tokenList;
      dispatch("updateBalanceFunctions");
    },
    async addAsset({ state, dispatch }, symbol: string) {
      const token = Vue.$cookies.get("cryptozen_token");
      const assets = await Fetcher.addAsset(token, symbol);

      let asset = assets[0];
      const currencies: CurrencyModel[] = [];
      for (const network of Object.keys(NETWORKS)) {
        for (const address of state.userAddresses) {
          let skip = false;
          if (
            asset.network &&
            !asset.network.find(
              (n) => n.toLowerCase() === network.toLowerCase()
            )
          ) {
            skip = true;
          }
          if (!skip)
            currencies.push(
              new CurrencyModel(
                address,
                "0",
                asset.value,
                false,
                false,
                "",
                network as NETWORKS,
                CHAIN_IDS[
                  `${network}_${state.networkType.toUpperCase()}` as "ETH_TESTNET"
                ]
              )
            );
        }
      }
      console.log("assetassetasset", asset);
      asset = Object.assign(asset, {
        currency: currencies,
      });
      state.balances.push(asset);
      dispatch("updateBalanceFunctions");
      localStorage.removeItem("coin_gecko_price");
      await dispatch("updateCoinGeckoPrice");
      for (const address of state.userAddresses) {
        await dispatch("updateCoinBalance", { coin: asset, address });
      }
    },

    async assetList({ state, dispatch }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const assets = await Fetcher.userAssetList(token);
      console.log("assets", assets);
      for (const asset of assets) {
        state.balances.push(asset);
      }
      dispatch("updateBalanceFunctions");
    },
    updateCoinGeckoPrices({ state }, price: CoingeckoInterface[]) {
      state.coinGeckoPrices = price;
    },
    async syncAddressDefaultAssets({ state, dispatch }) {
      await dispatch("getTokenList");
      const tokens = DefaultTokens;
      const web3 = state.web3;
      if (web3) {
        for (const token of tokens.filter(
          (t) =>
            !state.balances.find(
              (b) => t.toLowerCase() === b.value.toLowerCase()
            )
        )) {
          const coin = state.tokenList.find(
            (t) => t.value.toLowerCase() === token.toLowerCase()
          );
          if (coin) {
            const networkName = `${
              state.networkName
            }_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
            if (coin.contractAddress && coin.contractAddress[networkName]) {
              const coinContract = new web3.eth.Contract(
                ERC20Abi,
                coin.contractAddress[networkName]
              );
              const balance = await coinContract.methods
                .balanceOf(state.selectedAddress)
                .call({ from: state.selectedAddress });
              // console.log("balanceeeeeeee", balance);
              if (balance > 0) {
                await dispatch("addAsset", coin.value);
              }
            }
          }
        }
      }
    },
    async updateCoinGeckoPrice({ state, dispatch }) {
      let coinGeckoPricesData = localStorage.getItem("coin_gecko_price");
      const priceDateString = localStorage.getItem("coin_gecko_price_date");
      let shouldUpdatePrice = false;
      if (priceDateString) {
        const priceDate = new Date(priceDateString);
        const currentDate = new Date();
        if (priceDate >= currentDate) {
          shouldUpdatePrice = true;
        }
      }

      if (!coinGeckoPricesData || shouldUpdatePrice) {
        const assets = [];

        for (const coin of state.balances) {
          assets.push(coin.coinGeckoId);
        }
        const axiosGet = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${assets.join(
            ","
          )}`
        );
        const data = axiosGet.data as CoingeckoInterface[];

        localStorage.setItem("coin_gecko_price", JSON.stringify(data));
        localStorage.setItem(
          "coin_gecko_price_date",
          addHours(new Date(), 1).toISOString()
        );
        coinGeckoPricesData = localStorage.getItem(
          "coin_gecko_price"
        ) as string;
      }
      const coinGeckoPrices = JSON.parse(
        coinGeckoPricesData
      ) as CoingeckoInterface[];
      await dispatch("updateCoinGeckoPrices", coinGeckoPrices);
      console.log("coinGeckoPrices", coinGeckoPrices);
    },
    updateBalanceFunctions({ state }) {
      for (const token of state.balances) {
        if (typeof token.realBalanceTotal !== "function") {
          token.realBalanceTotal = function () {
            let total = 0;
            for (const currency of this.currency ? this.currency : []) {
              total += Number(currency.balance);
            }
            return total;
          };
        }
        if (typeof token.balanceTotal !== "function") {
          token.balanceTotal = function (
            chainIda: string | undefined,
            address: string | undefined,
            hr = true
          ) {
            function getHrNumber(number: number): string {
              if (number > 99999) {
                return HRNumber.toHumanString(number);
              } else {
                return Number(number.toFixed(4)).toString();
              }
            }

            const chainId = Number(chainIda);
            if (chainId && address && this.currency) {
              const currency = this.currency.find(
                (c) =>
                  c.chainId === chainId &&
                  c.address.toLowerCase() === address.toLowerCase()
              );
              if (currency) {
                if (hr) return getHrNumber(Number(currency.balance));
                else return currency.balance;
              }
              return "0";
            }
            let total = 0;
            for (const currency of this.currency ? this.currency : []) {
              total += Number(currency.balance);
            }
            if (hr) return getHrNumber(total);
            else return total.toString();
          };
        }
      }
    },
    async getUserAssetList({ state }) {
      if (state.profile?.email && state.profile?.email_verified) {
        const token = Vue.$cookies.get("cryptozen_token");
        const addresses = await Fetcher.userAddressList(token);
        if (addresses.length) {
          for (const address of addresses) {
            state.userAddresses.push(address);
          }
        }
      }
    },
  },
  getters: {
    getSelectedAddress(state) {
      return state.selectedAddress;
    },
    getCurrentSelectedBalances(state) {
      return state.currencyBalances.filter(
        (c) => c.address.toLowerCase() === state.selectedAddress.toLowerCase()
      );
    },
    coinsWithCurrencyBalance(state) {
      const currentSelectedBalances: CurrencyModel[] = state.currencyBalances.filter(
        (c) => c.address.toLowerCase() === state.selectedAddress.toLowerCase()
      );
      const coins: BalanceInterface[] = [];

      for (const coin of Balances) {
        const currency = currentSelectedBalances.find(
          (c) => c.coin.toLowerCase() === coin.value.toLowerCase()
        );
        coins.push(Object.assign(coin, { currency }));
      }
      return coins;
    },
    getProfile(state) {
      return state.profile;
    },
    getAddressBooks(state) {
      return state.addressBooks;
    },
    getWeb3(state) {
      return state.web3;
    },
    getNotifications(state) {
      return state.notifications;
    },
    getTransactions(state) {
      return state.transactions;
    },
    getRewards(state) {
      return state.rewards;
    },
  },
  // plugins: [vuexLocal.plugin],
};

// declare module "vue/types/vue" {
//   interface Vue {
//     $vStore: Store<{ state: storeInterface }>;
//   }
// }
//
// const typedStorePlugin: PluginObject<void> = {
//   install(VueInstance: typeof Vue) {
//     Object.defineProperty(VueInstance.prototype, "$vStore", {
//       get() {
//         return this.$store;
//       },
//     });
//   },
// };

export default new Vuex.Store(store);
