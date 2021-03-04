import Vue from "vue";
import Vuex from "vuex";
import CurrencyModel from "../models/CurrencyModel";
import Web3 from "web3";
import Balances, { BalanceInterface } from "../static/balance";
import ERC20Abi from "../static/erc20abi";

export interface updateCoinBalanceParams {
  web3: Web3;
  coin: BalanceInterface;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currencyBalances: Array<CurrencyModel>(),
    selectedAddress: "",
    chainId: 1,
    balances: Balances,
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
  },
});
