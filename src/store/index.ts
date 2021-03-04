import Vue from "vue";
import Vuex from "vuex";
import CurrencyModel from "../models/CurrencyModel";
import Web3 from "web3";
import { BalanceInterface } from "../static/balance";
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
  },
  mutations: {
    pushBalance(state, ethereumBalanceModel: CurrencyModel) {
      state.currencyBalances.push(ethereumBalanceModel);
    },
  },
  actions: {
    updateCoinBalance(
      { commit, state },
      { web3, coin }: updateCoinBalanceParams
    ) {
      if (coin.value === "eth") {
        web3.eth.getBalance(state.selectedAddress).then((balanceInWei) => {
          const ethBalance = new CurrencyModel(
            state.selectedAddress,
            web3.utils.fromWei(balanceInWei, "ether"),
            coin.value
          );
          commit("pushBalance", ethBalance);
        });
      } else {
        if (coin.decimal && coin.contractAddress) {
          let contractAddress = coin.contractAddress?.MAINNET;
          if (state.chainId === 3) {
            contractAddress = coin.contractAddress?.ROPSTEN;
          }
          const contract = new web3.eth.Contract(ERC20Abi, contractAddress);
          contract.methods
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
                commit("pushBalance", ethBalance);
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
  },
});
