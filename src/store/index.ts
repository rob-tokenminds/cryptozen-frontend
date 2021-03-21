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
import bignumber from "bignumber.js";
import fromExponential from "from-exponential";
// import VuexPersistence from "vuex-persist";

export interface updateCoinBalanceParams {
  web3: Web3;
  coin: BalanceInterface;
}
export interface storeInterface {
  currencyBalances: CurrencyModel[];
  selectedAddress: string;
  chainId: number;
  balances: BalanceInterface[];
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
    chainId: 1,
    balances: Balances,
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
      const web3 = state.web3;
      if (web3) {
        if (coin.value === "eth") {
          await web3.eth
            .getBalance(state.selectedAddress)
            .then(async (balanceInWei) => {
              const ethBalance = new CurrencyModel(
                state.selectedAddress,
                web3.utils.fromWei(balanceInWei, "ether"),
                coin.value,
                true
              );
              commit("pushCurrencyBalances", ethBalance);
              commit(
                "pushBalance",
                Object.assign(coin, { currency: ethBalance })
              );
            });
        } else {
          if (coin.decimal && coin.contractAddress) {
            let contractAddress = coin.contractAddress?.MAINNET;
            if (state.chainId === 3) {
              contractAddress = coin.contractAddress?.ROPSTEN;
            }
            const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
            await contract.methods
              .balanceOf(state.selectedAddress)
              .call({ from: state.selectedAddress })
              .then(async (unscaledBalance: number) => {
                if (
                  coin.decimal &&
                  unscaledBalance > 0 &&
                  coin.contractAddress
                ) {
                  let contractAddress = coin.contractAddress.MAINNET;
                  if (state.chainId === 3) {
                    contractAddress = coin.contractAddress?.ROPSTEN;
                  }
                  const contract = new web3.eth.Contract(
                    ERC20Abi,
                    contractAddress
                  );
                  const allowance = await contract.methods
                    .allowance(
                      window.ethereum.selectedAddress,
                      process.env.VUE_APP_CRYPTOZEN_CONTRACT
                    )
                    .call();

                  const BN = web3.utils
                    .toBN(unscaledBalance)
                    .div(web3.utils.toBN(10 ** coin.decimal));
                  const ethBalance = new CurrencyModel(
                    state.selectedAddress,
                    BN.toString(),
                    coin.value,
                    allowance > 0
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
    },
    async approve({ state }, coin: BalanceInterface) {
      const web3 = state.web3;
      if (web3) {
        try {
          let contractAddress = coin.contractAddress?.MAINNET;
          if (state.chainId === 3) {
            contractAddress = coin.contractAddress?.ROPSTEN;
          }
          if (coin.decimal) {
            const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
            const approveData = await contract.methods
              .approve(
                process.env.VUE_APP_CRYPTOZEN_CONTRACT,
                fromExponential(
                  Number(90000000000 * 10 ** coin.decimal).toString()
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
                .on("transactionHash", (hash) => {
                  console.log("hash", hash);
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
    updateSelectedAddress({ state }, address: string) {
      state.selectedAddress = address;
    },
    async updateChainId({ state }, web3: Web3) {
      state.chainId = await web3.eth.getChainId();
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
        params.type
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
    async getSyncTransactions({ state }, { address, currency }) {
      const token = Vue.$cookies.get("cryptozen_token");
      const transactions = await Fetcher.getSyncTransactions(
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
    async newTrx(
      { state },
      { hash, isToken, fee }: { hash: string; isToken: boolean; fee: string }
    ) {
      const token = Vue.$cookies.get("cryptozen_token");
      const trx = await Fetcher.postNewTrx(token, hash, isToken, fee);
      const checkTrx = state.transactions.find((t) => t.id === trx.id);
      if (!checkTrx) {
        state.transactions.push(trx);
      }
      return trx;
    },
    async getTier({ state }) {
      const tokenBalance = state.balances;
      const balance = tokenBalance.find((t) => t.value === "bf");
      const web3 = state.web3;
      if (web3 && balance && balance.currency) {
        const contract = new web3.eth.Contract(
          cryptozenabi,
          process.env.VUE_APP_CRYPTOZEN_CONTRACT
        );
        console.log("alance.currency.balance", balance.currency.balance);
        const balanceAmount = new bignumber(balance.currency.balance).toFixed();
        console.log("balanceAmount", balanceAmount);
        const tier = await contract.methods
          .getTierByAmount(balanceAmount)
          .call();
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
