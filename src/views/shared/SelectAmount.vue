<template>
  <v-card flat>
    <v-card v-if="selectedCurrency" flat width="800">
      <v-text-field
        :key="componentKey"
        height=""
        class="text-h5 rounded-0"
        color="primary"
        outlined
        :max="selectedCurrency.currency.balance"
        v-model.lazy="swapAmount"
        :hint="hint"
        persistent-hint
        type="number"
        :step="0.01"
        :readonly="readOnly"
        @change="UpdateRecipientGetsAmount"
      >
        <template v-slot:append>
          <v-list-item class="mt-n4">
            <v-list-item-avatar tile>
              <v-img
                :src="require(`../../assets/${selectedCurrency.value}.svg`)"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="primary--text text-subtitle-1">{{
                selectedCurrency.value === "eth"
                  ? "Ethereum"
                  : selectedCurrency.value.toUpperCase()
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-slot:label> {{ label }} ${{ amountSendUsd }} </template>

        <template v-slot:message="{ message }">
          <p v-if="selectedCurrency.currency">
            You have
            <a
              class="primary--text font-weight-bold"
              @click="swapAmount = selectedCurrency.currency.balance"
              >{{ selectedCurrency.currency.balance }}</a
            >
          </p>
          <p v-else>{{ message }}</p>
        </template>
      </v-text-field>

      <v-list-item class="mt-n5">
        <v-divider
          class="mr-2 mb-4 bala"
          elevation="10"
          vertical
          inset
        ></v-divider>

        <v-list-item-content>
          <v-row no-gutters dense>
            <v-col cols="6">
              <v-list-item-subtitle
                class="secondary--text text-subtitle-2 text-left"
                ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
                  >-{{ gasFee }} ETH ({{ convertToUsd(gasFee) }} USD)</a
                >
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="15"
                >
                </v-progress-circular>
                Gas fee (estimated)</v-list-item-subtitle
              >
              <v-list-item-subtitle
                class="secondary--text text-subtitle-2 text-left"
                ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
                  >-{{ transferFee }}
                  {{ selectedCurrency.value.toUpperCase() }} ({{
                    transferFeeOnUsd
                  }}
                  USD)</a
                >
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="15"
                >
                </v-progress-circular>
                Platform fee (Tier {{ tier }})</v-list-item-subtitle
              >
              <v-divider class=""></v-divider>
              <v-list-item-subtitle
                class="secondary--text text-subtitle-2 text-left"
                ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
                  >{{
                    Number(convertToUsd(gasFee)) + Number(transferFeeOnUsd)
                  }}
                  USD</a
                >
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="15"
                >
                </v-progress-circular>
                Total Fee</v-list-item-subtitle
              >
            </v-col>

            <v-col sm class="" cols="1">
              <v-divider class="" elevation="10" vertical></v-divider>
            </v-col>

            <v-col sm class="mr-10" cols="5">
              <v-list-item-subtitle
                class="secondary--text text-subtitle-2 text-left"
                ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
                  >+{{ transactionReward }} BF Token (
                  {{ transactionRewardInUsd }} USD)</a
                >
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="15"
                >
                </v-progress-circular>
                Platform Reward</v-list-item-subtitle
              >

              <v-spacer></v-spacer>
              <v-divider class="mt-5"></v-divider>
              <v-list-item-subtitle
                class="secondary--text text-subtitle-2 text-left"
                ><a v-if="!loadingFee" class="primary--text text-subtitle-2">
                  {{ transactionRewardInUsd }} USD</a
                >
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="15"
                >
                </v-progress-circular>
                Total Reward</v-list-item-subtitle
              >
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-row no-gutters>
        <v-col cols="8">
          <v-text-field
            :key="componentKey"
            class="text-h5 rounded-0"
            color="primary"
            label="Recipient gets"
            outlined
            v-model.lazy="recipientGets"
            type="number"
            :step="0.01"
            flat
            height="50"
            @change="UpdateSwapAmount"
            :readonly="readOnly"
          >
            <!-- <template v-slot:append-outer>
               
                </template> -->

            <template v-slot:label>
              <p class="mb-5">Recipient gets ${{ amountReceiptUsd }}</p>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="4">
          <v-select
            color="primary"
            :items="coins"
            item-text="name"
            item-value="value"
            outlined
            v-model="selectedRecipientTokenModel"
            class="rounded-0"
            height="50"
            :readonly="readOnly"
          >
            <template v-slot:item="{ item, on, attrs }">
              <v-list-item
                :disabled="selectedCurrency.value !== item.value"
                v-bind="attrs"
                v-on="on"
              >
                <v-list-item-avatar tile>
                  <v-img
                    :src="require(`../../assets/${item.value}.svg`)"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="primary--text text-subtitle-1"
                    >{{ item.name
                    }}{{
                      selectedCurrency.value !== item.value
                        ? `(Swap Coming Soon)`
                        : ``
                    }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <v-list-item>
                <v-list-item-avatar tile>
                  <v-img
                    :src="require(`../../assets/${item.value}.svg`)"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="primary--text text-subtitle-1">{{
                    item.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!--  -->
      <v-card-actions v-if="!disableActionButton">
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="!disableBack" outlined @click="prevStep()">
          Back
        </v-btn>
        <v-btn color="primary" :disabled="loadingFee" @click="nextStep()">
          {{ continueLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { BalanceInterface } from "../../static/balance";
import balances from "../../static/balance";
import Web3 from "web3";
// import erc20abi from "../../static/erc20abi";
import fromExponential from "from-exponential";
import { AddressBookInterface } from "../../store/fetcher";
import BigNumber from "bignumber.js";
import { TransactionConfig } from "web3-core";
import cryptozenabi from "../../static/cryptozenabi";
import {
  ChainId,
  Token,
  WETH,
  Fetcher as UniswapFetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import { providers } from "ethers";
import axios from "axios";

@Component({ name: "SelectAmount" })
export default class SelectAmount extends Vue {
  @Prop(Number) readonly currentStep!: number;
  @Prop(Object) readonly selectedCurrency!: BalanceInterface;
  @Prop(Number) readonly setSwapAmount!: number;
  @Prop(Boolean) readonly disableActionButton!: boolean;
  @Prop(String) readonly setLabel!: string;
  @Prop(Boolean) readonly disableBack!: boolean;
  @Prop(String) readonly setContinueLabel!: string;
  @Prop([Object, String]) readonly selectedAddress!: AddressBookInterface | "";
  @Prop(String) readonly selectedRecipientToken!: string;
  @Prop(Boolean) readonly shouldSend!: boolean;
  @Prop(Boolean) readonly readOnly!: boolean;
  @Prop(Boolean) readonly approved!: boolean;

  get tier(): number {
    const tier = this.$store.state.tier;
    if (tier.length) {
      return tier[2];
    }
    return 0;
  }

  amountSendUsd = "0";
  amountReceiptUsd = "0";
  transferFee = "0";
  transferFeeOnUsd = "0";
  gasFee = "0";
  platformFee = "0";
  platformFeeOnUsd = "";
  loadingFee = false;
  recipientGets = 0;
  params: TransactionConfig | "" = "";

  selectedRecipientTokenModel = this.selectedRecipientToken;
  updatingAmount = false;
  @Watch("swapAmount")
  async watchswapAmount(value: number): Promise<void> {
    if (!this.updatingAmount) {
      this.updatingAmount = true;
      if (value <= Number(this.selectedCurrency?.currency?.balance)) {
        await this.UpdateRecipientGetsAmount(value);
      } else {
        alert(`Value input is higher than your balance`);
        this.swapAmount = Number(this.selectedCurrency?.currency?.balance);
      }

      this.updatingAmount = false;
    }
  }

  @Watch("recipientGets")
  async watchrecipientGets(value: number): Promise<void> {
    if (!this.updatingAmount) {
      this.updatingAmount = true;
      if (value <= Number(this.selectedCurrency?.currency?.balance)) {
        await this.UpdateSwapAmount(value);
        if (
          this.swapAmount >= Number(this.selectedCurrency?.currency?.balance)
        ) {
          alert(`Value input is higher than your balance`);
          this.swapAmount = Number(this.selectedCurrency?.currency?.balance);
        }
      } else {
        alert(`Value input is higher than your balance`);
        this.recipientGets = Number(0);
      }
      this.updatingAmount = false;
    }
  }

  @Watch("transferFee")
  watchtransferFee(value: string): void {
    if (value) {
      this.$emit("transfer-fee", value);
    }
  }

  @Watch("gasFee")
  watchGasFee(value: string): void {
    if (value) {
      this.$emit("gas-fee", value);
    }
  }

  @Watch("selectedAddress")
  watchSelectedAddress(value: string): void {
    if (value) {
      if (this.swapAmount) {
        this.UpdateRecipientGetsAmount(this.swapAmount);
      }
    }
  }

  @Watch("params", { deep: true })
  watchParams(value: TransactionConfig | ""): void {
    if (value) {
      this.$emit("params", value);
    }
  }

  @Watch("selectedRecipientToken")
  watchselectedRecipientToken(value: string): void {
    this.selectedRecipientTokenModel = value;
  }

  @Watch("selectedRecipientTokenModel")
  watchSelectedRecipientToken(value: string, prev: string): void {
    if (value.toLowerCase() === this.selectedCurrency.value.toLowerCase()) {
      this.$emit("selected-recipient-token", value);
      this.checkFee(this.swapAmount);
    } else {
      console.log("prev", prev);

      alert(`Swap currently are not available `);
      this.selectedRecipientTokenModel = prev;
    }
  }
  componentKey = 1;
  async UpdateRecipientGetsAmount(value: number): Promise<void> {
    this.recipientGets = 0;
    if (this.swapAmount) {
      await this.checkFee(this.swapAmount);

      this.recipientGets = Number(this.swapAmount) - Number(this.transferFee);
      await this.updateUsdAmount();
    }
  }

  async UpdateSwapAmount(value: number): Promise<void> {
    this.swapAmount = 0;
    if (this.recipientGets) {
      await this.checkFee(this.recipientGets);

      this.swapAmount = Number(this.recipientGets) + Number(this.transferFee);
      await this.updateUsdAmount();
    }
  }

  async updateUsdAmount(): Promise<void> {
    if (
      this.transferFee !== "0" &&
      this.recipientGets !== 0 &&
      this.swapAmount !== 0
    ) {
      if (
        this.selectedCurrency.value === "bf" &&
        this.selectedRecipientTokenModel === "bf"
      ) {
        this.amountReceiptUsd = this.convertToUsd(
          await this.ninjaToWeth(
            (Number(this.recipientGets) - Number(this.transferFee)).toString()
          )
        );
        this.amountSendUsd = this.convertToUsd(
          await this.ninjaToWeth(
            (Number(this.swapAmount) + Number(this.transferFee)).toString()
          )
        );
      } else {
        this.amountReceiptUsd = this.recipientGets.toString();
        this.amountSendUsd = this.swapAmount.toString();
      }

      this.componentKey += 1;
    } else {
      await sleep(1000);
      await this.updateUsdAmount();
    }
  }

  // @Watch("swapAmount")
  // async watchswapAmount(value: number): Promise<void> {
  //   await this.checkFee(value);
  //   if (
  //     this.selectedRecipientTokenModel.toLowerCase() ===
  //     this.selectedCurrency.value.toLowerCase()
  //   ) {
  //     this.recipientGets = this.swapAmount - Number(this.transferFee);
  //   }
  // }

  // @Watch("recipientGets")
  // async watchrecipientGets(value: number): Promise<void> {
  //   await this.checkFee(value);

  //   if (
  //     this.selectedRecipientTokenModel.toLowerCase() ===
  //     this.selectedCurrency.value.toLowerCase()
  //   ) {
  //     this.swapAmount = this.recipientGets + Number(this.transferFee);
  //   }
  // }

  convertToUsd(eth: string): string {
    if (this.ethereumPrice && eth !== "NaN") {
      console.log("eth", eth);
      const currentPrice = this.ethereumPrice.current_price;
      return fromExponential(new BigNumber(eth).times(currentPrice).toFixed(2));
    }
    return "0";
  }

  async checkFee(inputAmount: number): Promise<void> {
    if (!this.loadingFee) {
      try {
        if (this.selectedCurrency && this.selectedAddress) {
          this.loadingFee = true;
          this.transferFee = "0";
          this.gasFee = "0";
          this.platformFee = "0";
          this.transactionReward = "0";
          const web3 = this.$store.getters["getWeb3"] as Web3;

          const contract = new web3.eth.Contract(
            cryptozenabi,
            process.env.VUE_APP_CRYPTOZEN_CONTRACT
          );
          let contractData = "";
          let amount = "";
          let value = "0";
          if (this.selectedCurrency.value !== "eth") {
            if (
              this.selectedCurrency.decimal &&
              this.selectedCurrency.contractAddress
            ) {
              let contractAddress = this.selectedCurrency.contractAddress
                ?.MAINNET;
              if (this.$store.state.chainId === 3) {
                contractAddress = this.selectedCurrency.contractAddress
                  ?.ROPSTEN;
              }
              amount = fromExponential(
                Number(
                  inputAmount * 10 ** this.selectedCurrency.decimal
                ).toString()
              );
              contractData = contract.methods
                .transferSameToken(
                  contractAddress,
                  this.selectedAddress.address,
                  amount
                )
                .encodeABI();
            }
          } else {
            console.log("inputAmount.toString()", inputAmount.toString());
            amount = web3.utils.toWei(inputAmount.toString(), "ether");
            contractData = contract.methods
              .transferSameEther(this.selectedAddress.address, amount)
              .encodeABI();
            value = amount;
          }

          if (!contractData) {
            throw new Error("Contract data not found !");
          }
          const params = {
            from: window.ethereum.selectedAddress,
            to: process.env.VUE_APP_CRYPTOZEN_CONTRACT,
            value,
            data: contractData,
          };
          await this.$store.dispatch("getTier");
          const tier = this.$store.state.tier;
          const transferFee: number = await contract.methods
            .calculateTransferFee(amount, tier[1])
            .call();

          console.log("transferFee", transferFee);
          console.log("tier[1]", tier[1]);
          if (transferFee) {
            if (this.selectedCurrency?.decimal) {
              this.transferFee = Number(
                transferFee / 10 ** this.selectedCurrency.decimal
              ).toString();
              this.transferFeeOnUsd = await this.checktransferFeeOnUsd(
                this.transferFee
              );
            } else {
              this.transferFee = web3.utils.fromWei(
                transferFee.toString(),
                "ether"
              );
              this.transferFeeOnUsd = this.convertToUsd(this.transferFee);
            }
          }

          this.gas = await web3.eth.estimateGas(params);
          this.gasPrice = await web3.eth.getGasPrice();
          await this.checkRewardFee(
            this.transferFee.toString(),
            this.selectedCurrency.value !== "eth",
            this.selectedCurrency
          );
          console.log("gasPrice", this.gasPrice);
          console.log("gas", this.gas);
          this.params = params;
          const txFee = new BigNumber(this.gas).times(
            web3.utils.fromWei(this.gasPrice, "ether")
          );

          this.gasFee = txFee.toString();

          this.loadingFee = false;
        }
      } catch (e) {
        console.log("e", e);
        // this.transactionReward = "0";
        // this.transferFee = "0";
        // this.gasFee = "0";
        // this.platformFee = "0";
        this.loadingFee = false;
      }
    } else {
      await sleep(100);
      this.checkFee(inputAmount);
    }
  }
  gas = 0;
  gasPrice = "0";
  // @Watch("transferFee")
  // async watchPlatformFee(value : string) : void{
  //   if(value !== "0"){

  //   }
  // }

  continueLabel = "Continue";

  coins = balances;
  swapAmount = 0;
  label = "You send";
  hint = `you have ${this.selectedCurrency?.currency?.balance}`;

  ethereumPrice: CoingeckoInterface | "" = "";
  async mounted(): Promise<void> {
    if (this.setLabel) this.label = this.setLabel;
    if (this.setSwapAmount) this.swapAmount = this.setSwapAmount;
    if (this.setContinueLabel) this.continueLabel = this.setContinueLabel;
    // this.$nextTick(() => {});
    console.log("this.swapAmountmounted", this.swapAmount);
    const axiosGet = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin,aave-dai,ethereum`
    );
    const data = axiosGet.data as CoingeckoInterface[];
    this.ethereumPrice = data.find(
      (d) => d.id === "ethereum"
    ) as CoingeckoInterface;
    if (this.swapAmount) {
      await this.UpdateRecipientGetsAmount(this.swapAmount);
      await this.updateUsdAmount();
    }
  }

  @Watch("setSwapAmount")
  watchSetSwapAmount(value: number): void {
    this.swapAmount = value;
  }

  @Watch("swapAmount")
  watchSwapAmount(value: number): void {
    this.$emit("swap-amount", value);
  }

  nextStep(): void {
    this.$emit("next-step", this.currentStep + 1);
  }

  prevStep(): void {
    this.$emit("prev-step", this.currentStep - 1);
  }

  async checktransferFeeOnUsd(amount: string): Promise<string> {
    if (this.selectedCurrency && this.selectedCurrency.value === "bf") {
      return this.convertToUsd(await this.ninjaToWeth(amount));
    } else {
      return amount;
    }
  }

  async ninjaToWeth(amount: string): Promise<string> {
    console.log("amountninjaToWeth", amount);
    const ethProvider = new providers.Web3Provider(window.ethereum);
    const Ninja = new Token(
      ChainId.ROPSTEN,
      process.env.VUE_APP_NINJA_TOKEN_CONTRACT as string,
      18
    );
    const NinjaWETHPair = await UniswapFetcher.fetchPairData(
      WETH[ChainId.ROPSTEN],
      Ninja,
      ethProvider
    );

    const route = new Route(
      [NinjaWETHPair],
      Ninja,
      WETH[NinjaWETHPair.chainId]
    );
    console.log("amountamountamount", amount);
    const realAmount = new BigNumber(amount).times(10 ** 18).toFixed();
    const trade = new Trade(
      route,
      new TokenAmount(Ninja, realAmount),
      TradeType.EXACT_INPUT
    );
    const slippageTolerance = new Percent("50", realAmount);
    const amountOutMin = trade.minimumAmountOut(slippageTolerance);
    console.log("amountOutMinninjaToWeth", amountOutMin.toSignificant(6));
    return amountOutMin.toSignificant(6);
  }

  transactionReward = "0";
  transactionRewardInEth = "0";
  async checkRewardFee(
    amountFee: string,
    isToken: boolean,
    TRADETOKENContract?: BalanceInterface
  ): Promise<void> {
    const ethProvider = new providers.Web3Provider(window.ethereum);
    const Ninja = new Token(
      ChainId.ROPSTEN,
      process.env.VUE_APP_NINJA_TOKEN_CONTRACT as string,
      18
    );
    const NinjaWETHPair = await UniswapFetcher.fetchPairData(
      WETH[ChainId.ROPSTEN],
      Ninja,
      ethProvider
    );
    if (isToken) {
      if (
        TRADETOKENContract &&
        TRADETOKENContract.contractAddress &&
        TRADETOKENContract.decimal
      ) {
        let contractAddress = TRADETOKENContract.contractAddress.MAINNET;
        if (this.$store.state.chainId === 3) {
          contractAddress = TRADETOKENContract.contractAddress.ROPSTEN;
        }
        const TRADETOKEN = new Token(
          ChainId.ROPSTEN,
          contractAddress,
          TRADETOKENContract.decimal
        );
        const TRADETOKENWETHPAIR = await UniswapFetcher.fetchPairData(
          WETH[ChainId.ROPSTEN],
          TRADETOKEN,
          ethProvider
        );

        const route = new Route(
          [TRADETOKENWETHPAIR, NinjaWETHPair],
          TRADETOKEN,
          Ninja
        );
        const routeEth = new Route(
          [NinjaWETHPair],
          Ninja,
          WETH[ChainId.ROPSTEN]
        );
        // console.log("amountFee", amountFee);
        const amount = new BigNumber(amountFee)
          .times(10 ** TRADETOKENContract.decimal)
          .toFixed();
        const realAmount = fromExponential(amount);
        const trade = new Trade(
          route,
          new TokenAmount(TRADETOKEN, realAmount),
          TradeType.EXACT_INPUT
        );

        const slippageTolerance = new Percent("50", realAmount);
        const amountOutMin = trade.minimumAmountOut(slippageTolerance);

        const txFee = Number(this.gasPrice) * Number(this.gas);
        const route3 = new Route(
          [NinjaWETHPair],
          WETH[NinjaWETHPair.chainId],
          Ninja
        );

        const trade3 = new Trade(
          route3,
          new TokenAmount(WETH[NinjaWETHPair.chainId], txFee.toFixed()),
          TradeType.EXACT_INPUT
        );
        const slippageTolerance3 = new Percent("50", txFee.toFixed());
        const amountOutMin3 = trade3.minimumAmountOut(slippageTolerance3);

        this.transactionReward = (
          Number(amountOutMin.toSignificant(6)) +
          Number(amountOutMin3.toSignificant(6))
        ).toFixed(6);
        const tradeEth = new Trade(
          routeEth,
          new TokenAmount(
            Ninja,
            fromExponential(
              Number(Number(this.transactionReward) * 10 ** 18).toString()
            )
          ),
          TradeType.EXACT_INPUT
        );
        const amountOutMinEth = tradeEth.minimumAmountOut(slippageTolerance);
        this.transactionRewardInEth = amountOutMinEth.toSignificant();
      }
    } else {
      const route = new Route(
        [NinjaWETHPair],
        WETH[NinjaWETHPair.chainId],
        Ninja
      );
      const web3 = this.$store.getters["getWeb3"] as Web3;
      const realAmount = web3.utils.toWei(amountFee, "ether");
      const trade = new Trade(
        route,
        new TokenAmount(WETH[NinjaWETHPair.chainId], realAmount),
        TradeType.EXACT_INPUT
      );
      const slippageTolerance = new Percent("50", realAmount);
      const amountOutMin = trade.minimumAmountOut(slippageTolerance);

      const txFee = Number(this.gasPrice) * Number(this.gas);
      const route3 = new Route(
        [NinjaWETHPair],
        WETH[NinjaWETHPair.chainId],
        Ninja
      );

      const trade3 = new Trade(
        route3,
        new TokenAmount(WETH[NinjaWETHPair.chainId], txFee.toFixed()),
        TradeType.EXACT_INPUT
      );
      const slippageTolerance3 = new Percent("50", txFee.toFixed());
      const amountOutMin3 = trade3.minimumAmountOut(slippageTolerance3);

      this.transactionReward = (
        Number(amountOutMin.toSignificant(6)) +
        Number(amountOutMin3.toSignificant(6))
      ).toString();
      this.transactionRewardInEth = this.transactionReward;
    }
  }

  transactionRewardInUsd = "0";
  @Watch("transactionRewardInEth")
  async watchtransactionRewardInEth(value: string): Promise<void> {
    if (value !== "0") {
      this.transactionRewardInUsd = this.convertToUsd(value);
    }
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface CoingeckoInterface {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: any;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: any;
  max_supply?: any;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  roi: Roi;
  last_updated: Date;
}
</script>

<style scoped>
.bala {
  border: 0.5px solid #005672;
}
</style>
