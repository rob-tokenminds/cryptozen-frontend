import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import CurrencyModel from "../models/CurrencyModel";
import Web3 from "web3";
import Balances, { BalanceInterface } from "../static/balance";
import ERC20Abi from "../static/erc20abi";
import {
  Fetcher,
  ProfileInterface,
  AddressBookInterface,
  TransactionInterface,
  RewardInterface,
} from "./fetcher";
import cryptozenabi from "@/static/cryptozenabi";
// import bignumber from "bignumber.js";
import fromExponential from "from-exponential";
import cryptozen_contract from "@/static/cryptozen_contract";
// import VuexPersistence from "vuex-persist";
const StaticBalances = Balances;
export interface updateCoinBalanceParams {
  web3: Web3;
  coin: BalanceInterface;
}
export interface storeInterface {
  currencyBalances: CurrencyModel[];
  selectedAddress: string;
  chainId: number;
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
}

export interface updateWalletInterface {
  name: string;
  address: string;
  currency: string;
  id: string;
}

const store: StoreOptions<storeInterface> = {
  state: {
    currencyBalances: [],
    selectedAddress: "",
    chainId: 0,
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
    // SOCKET_ONMESSAGE(state, message) {
    //   state.socket.message = message;
    // },
    // SOCKET_ONOPEN(state, event) {
    //   Vue.prototype.$socket = event.currentTarget;
    //   state.socket.isConnected = true;
    // },
    // SOCKET_ONCLOSE(state, event) {
    //   state.socket.isConnected = false;
    // },
    // SOCKET_ONERROR(state, event) {
    //   console.error(state, event);
    // },
  },
  actions: {
    async updateCoinBalance({ commit, state }, coin: BalanceInterface) {
      if (state.chainId) {
        let web3 = state.web3;
        let reverseNodeUrl = process.env.VUE_APP_MAINNET_NODE_URL as string;
        let reverseDecimal = coin.decimal;
        switch (state.chainId) {
          case 1:
            reverseNodeUrl = process.env.VUE_APP_BNB_MAINNET_NODE_URL as string;
            reverseDecimal = 18;
            break;
          case 3:
            reverseNodeUrl = process.env.VUE_APP_BNB_TESTNET_NODE_URL as string;
            reverseDecimal = 18;
            break;
          case 56:
            reverseNodeUrl = process.env.VUE_APP_MAINNET_NODE_URL as string;
            break;
          case 97:
            reverseNodeUrl = process.env.VUE_APP_ROPSTEN_NODE_URL as string;
            break;
        }
        console.log("coin", coin);
        console.log("coinnodeUrl", reverseNodeUrl);
        const reverseWeb3 = new Web3(reverseNodeUrl);
        if (!coin.chainIds.find((c) => c === state.chainId)) {
          web3 = reverseWeb3;
        }
        if (web3) {
          if (coin.mainCurrency) {
            await web3.eth
              .getBalance(state.selectedAddress)
              .then(async (balanceInWei) => {
                if (web3) {
                  const ethBalance = new CurrencyModel(
                    state.selectedAddress,
                    web3.utils.fromWei(balanceInWei, "ether"),
                    coin.value,
                    true,
                    false,
                    ""
                  );
                  commit("pushCurrencyBalances", ethBalance);
                  commit(
                    "pushBalance",
                    Object.assign(coin, { currency: ethBalance })
                  );
                }
              });
          } else {
            if (coin.decimal && coin.contractAddress && reverseDecimal) {
              let decimal = coin.decimal;

              let contractAddress = coin.contractAddress?.MAINNET;
              let reverseContractAddress = coin.contractAddress?.BSC_MAINNET;
              if (state.chainId === 3) {
                contractAddress = coin.contractAddress?.ROPSTEN;
                reverseContractAddress = coin.contractAddress?.BSC_TESTNET;
              }
              if (state.chainId === 97) {
                contractAddress = coin.contractAddress?.BSC_TESTNET;
                if (coin.value === "ninja") {
                  contractAddress = coin.contractAddress?.ROPSTEN;
                }

                reverseContractAddress = coin.contractAddress?.ROPSTEN;
                decimal = 18;
              }
              if (state.chainId === 56) {
                contractAddress = coin.contractAddress?.BSC_MAINNET;
                if (coin.value === "ninja") {
                  contractAddress = coin.contractAddress?.MAINNET;
                }
                reverseContractAddress = coin.contractAddress?.MAINNET;
                decimal = 18;
              }
              const skip = false;
              if (!skip) {
                const contract = new web3.eth.Contract(
                  ERC20Abi,
                  contractAddress
                );
                await contract.methods
                  .balanceOf(state.selectedAddress)
                  .call({ from: state.selectedAddress })
                  .then(async (unscaledBalance: number) => {
                    if (decimal && web3) {
                      const contract = new web3.eth.Contract(
                        ERC20Abi,
                        contractAddress
                      );
                      const CRYPTOZEN_CONTRACT = cryptozen_contract(
                        state.chainId
                      );
                      console.log("CRYPTOZEN_CONTRACT", CRYPTOZEN_CONTRACT);
                      console.log("contractAddress", contractAddress);
                      const allowance = await contract.methods
                        .allowance(
                          window.ethereum.selectedAddress,
                          CRYPTOZEN_CONTRACT
                        )
                        .call();
                      let isApproved = false;
                      let hash = "";
                      console.log("allowance", allowance);
                      if (unscaledBalance > 0) {
                        if (allowance === 0 || allowance === "0") {
                          const token = Vue.$cookies.get("cryptozen_token");
                          hash = await Fetcher.getApproval(
                            token,
                            window.ethereum.selectedAddress,
                            contractAddress,
                            state.chainId
                          );
                          console.log("hash", hash);
                          if (hash) {
                            const tx = await web3.eth.getTransactionReceipt(
                              hash
                            );
                            if (tx && tx.status) {
                              isApproved = true;
                            }
                          } else {
                            isApproved = true;
                          }
                        } else {
                          isApproved = true;
                        }
                      } else {
                        isApproved = true;
                      }

                      console.log("isApproved", isApproved);
                      const BN = web3.utils
                        .toBN(unscaledBalance)
                        .div(web3.utils.toBN(10 ** decimal));
                      let reverseBalance;
                      if (
                        reverseContractAddress &&
                        reverseDecimal &&
                        coin.value !== "ninja"
                      ) {
                        const reverseContract = new reverseWeb3.eth.Contract(
                          ERC20Abi,
                          reverseContractAddress
                        );
                        reverseBalance = await reverseContract.methods
                          .balanceOf(state.selectedAddress)
                          .call({ from: state.selectedAddress });
                        reverseBalance = reverseBalance / 10 ** reverseDecimal;
                      }

                      const ethBalance = new CurrencyModel(
                        state.selectedAddress,
                        BN.toString(),
                        coin.value,
                        Number(allowance) > 0,
                        !isApproved,
                        hash,
                        reverseBalance?.toString()
                      );
                      commit("pushCurrencyBalances", ethBalance);
                      commit(
                        "pushBalance",
                        Object.assign(coin, { currency: ethBalance })
                      );
                    }
                  });
              }
            }
          }
        }
      }
    },
    async updateReverseBalance({ state }) {
      const balances = StaticBalances;
      console.log("balances", balances);
      const chainId = state.chainId;
      let nodeUrl = process.env.VUE_APP_MAINNET_NODE_URL;
      switch (chainId) {
        case 1:
          nodeUrl = process.env.VUE_APP_BNB_MAINNET_NODE_URL;
          break;
        case 3:
          nodeUrl = process.env.VUE_APP_BNB_TESTNET_NODE_URL;
          break;
        case 97:
          nodeUrl = process.env.VUE_APP_ROPSTEN_NODE_URL;
          break;
        case 56:
          nodeUrl = process.env.VUE_APP_MAINNET_NODE_URL;
          break;
      }

      for (const balance of balances) {
        let shouldPush = false;
        if (balance.value === "eth" || balance.value === "ninja") {
          shouldPush = !(chainId === 1 || chainId === 3);
        } else {
          if (balance.value === "bnb") {
            shouldPush = !(chainId === 97 || chainId === 56);
          } else {
            shouldPush = true;
          }
        }

        if (shouldPush) {
          // state.reverseBalances.push({
          //   name: balance.name,
          //   value: balance.value,
          //   contractAddress: balance.contractAddress,
          //   decimal: balance.decimal,
          //   mainCurrency: balance.mainCurrency,
          // });
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve) => {
            const web3 = new Web3(nodeUrl as string);

            let currency;
            if (balance.mainCurrency) {
              console.log("state.selectedAddress", state.selectedAddress);
              const balanceAmount = web3.utils.fromWei(
                await web3.eth.getBalance(state.selectedAddress),
                "ether"
              );
              currency = new CurrencyModel(
                state.selectedAddress,
                balanceAmount,
                balance.value,
                true,
                false,
                ""
              );
            } else {
              // const balanceData = balances.find((b) => b.name === balance.name);
              // let contractAddress = balanceData?.contractAddress?.MAINNET;
              // let decimal = 18;
              // switch (chainId) {
              //   case 1:
              //     contractAddress = balanceData?.contractAddress?.BSC_MAINNET;
              //     break;
              //   case 3:
              //     contractAddress = balanceData?.contractAddress?.BSC_TESTNET;
              //
              //     break;
              //   case 97:
              //     contractAddress = balanceData?.contractAddress?.ROPSTEN;
              //     decimal = balance.decimal as number;
              //     break;
              //   case 56:
              //     contractAddress = balanceData?.contractAddress?.MAINNET;
              //     decimal = balance.decimal as number;
              //     break;
              // }
              // const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
              // const balanceAmount = await contract.methods
              //   .balanceOf(state.selectedAddress)
              //   .call({ from: state.selectedAddress });
              // currency = new CurrencyModel(
              //   state.selectedAddress,
              //   (Number(balanceAmount) / 10 ** decimal).toString(),
              //   balance.value,
              //   true,
              //   false,
              //   ""
              // );
            }
            // if (currency) {
            //   const index = state.reverseBalances.findIndex(
            //     (r) => r.name === balance.name
            //   );
            //   if (index >= 0) {
            //     state.reverseBalances.splice(index, 1, {
            //       name: balance.name,
            //       value: balance.value,
            //       contractAddress: balance.contractAddress,
            //       decimal: balance.decimal,
            //       mainCurrency: balance.mainCurrency,
            //       currency,
            //     });
            //   }
            // }
            resolve("true");
          });
        }
      }
    },
    async approve({ state }, coin: BalanceInterface) {
      const web3 = state.web3;
      if (web3) {
        try {
          let contractAddress = coin.contractAddress?.MAINNET;
          if (state.chainId === 3) {
            contractAddress = coin.contractAddress?.ROPSTEN;
          }
          if (state.chainId === 97) {
            contractAddress = coin.contractAddress?.BSC_TESTNET;
          }
          if (state.chainId === 56) {
            contractAddress = coin.contractAddress?.BSC_MAINNET;
          }
          if (coin.decimal && contractAddress) {
            const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
            const CRYPTOZEN_CONTRACT = cryptozen_contract(state.chainId);
            const approveData = await contract.methods
              .approve(
                CRYPTOZEN_CONTRACT,
                fromExponential(Number(90000000000 * 10 ** 18).toString())
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
                  await Fetcher.postApproval(
                    token,
                    hash,
                    window.ethereum.selectedAddress,
                    contractAddress as string,
                    state.chainId
                  );
                  alert(
                    "Processing approval function, please wait until it confirmed on the blockchain. You can see the progress directly on metamask "
                  );
                })
                .on("receipt", (receipt) => {
                  console.log("receipt", receipt);
                  resolve(true);
                })
                .on("error", (error) => {
                  reject(error);
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
      return await Fetcher.getApproval(
        token,
        address,
        contractAddress,
        state.chainId
      );
    },
    updateSelectedAddress({ state }, address: string) {
      state.selectedAddress = address;
    },
    async updateChainId({ state, dispatch }, web3: Web3) {
      state.chainId = await web3.eth.getChainId();
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
    async login({ state }, { address, signature }) {
      const accessToken = await Fetcher.login(address, signature);
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
        state.chainId
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
        params.currency
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
    async getTransactions({ state }, { address, currency }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const transactions = await Fetcher.getTransactions(
        token,
        address,

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
      }: {
        hash: string;
        isToken: boolean;
        fee: string;
        reference: string;
        reward: any;
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
      if (state.chainId === 1 || state.chainId === 3) {
        const web3 = state.web3;
        if (web3) {
          const CRYPTOZEN_CONTRACT = cryptozen_contract(state.chainId);
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
      } else {
        state.tier = [0, 6, 0] as any;
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
      let web3 = state.web3 as Web3;
      console.log("state.chainId", state.chainId);
      let cryptozenContract = cryptozen_contract(state.chainId);
      if (state.chainId !== 1 && state.chainId !== 3) {
        if (state.chainId === 56) {
          web3 = new Web3(process.env.VUE_APP_MAINNET_NODE_URL as string);
          cryptozenContract = cryptozen_contract(1);
        } else {
          web3 = new Web3(process.env.VUE_APP_ROPSTEN_NODE_URL as string);
          cryptozenContract = cryptozen_contract(3);
        }
      }
      console.log("cryptozenContract", cryptozenContract);
      const contract = new web3.eth.Contract(cryptozenabi, cryptozenContract);
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

export default new Vuex.Store(store);
