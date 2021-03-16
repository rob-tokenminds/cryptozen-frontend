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
} from "./fetcher";
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
    async updateCoinBalance(
      { commit, state },
      { web3, coin }: updateCoinBalanceParams
    ) {
      if (coin.value === "eth") {
        await web3.eth
          .getBalance(state.selectedAddress)
          .then((balanceInWei) => {
            const ethBalance = new CurrencyModel(
              state.selectedAddress,
              web3.utils.fromWei(balanceInWei, "ether"),
              coin.value
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
            .then((unscaledBalance: number) => {
              if (coin.decimal && unscaledBalance > 0) {
                const BN = web3.utils
                  .toBN(unscaledBalance)
                  .div(web3.utils.toBN(10 ** coin.decimal));
                const ethBalance = new CurrencyModel(
                  state.selectedAddress,
                  BN.toString(),
                  coin.value
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
          const checkTrx = state.transactions.find(
            (t) => t.id === transaction.id
          );
          if (!checkTrx) {
            state.transactions.push(transaction);
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
          const checkTrx = state.transactions.find(
            (t) => t.id === transaction.id
          );
          if (!checkTrx) {
            state.transactions.push(transaction);
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
  },
  // plugins: [vuexLocal.plugin],
};

export default new Vuex.Store(store);
