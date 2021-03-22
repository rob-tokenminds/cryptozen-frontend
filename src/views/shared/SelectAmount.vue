<template>
  <v-card flat>
    <v-card v-if="selectedCurrency" flat width="600">
      <v-text-field
        height=""
        class="text-h5 rounded-0"
        color="primary"
        :label="label"
        outlined
        :max="selectedCurrency.currency.balance"
        v-model="swapAmount"
        :hint="hint"
        persistent-hint
        type="number"
        :step="0.000001"
        :readonly="readOnly"
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
          <v-list-item-subtitle
            class="secondary--text text-subtitle-2 text-left"
            ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
              >-{{ gasFee }} ETH</a
            >
            <v-progress-circular v-else indeterminate color="primary" size="15">
            </v-progress-circular>
            Gas fee (estimated)</v-list-item-subtitle
          >
          <v-list-item-subtitle
            class="secondary--text text-subtitle-2 text-left"
            ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
              >-{{ transferFee }} {{ selectedCurrency.value.toUpperCase() }}</a
            >
            <v-progress-circular v-else indeterminate color="primary" size="15">
            </v-progress-circular>
            Platform fee</v-list-item-subtitle
          >
          <!-- <v-divider class=""></v-divider>
          <v-list-item-subtitle
            class="secondary--text text-subtitle-2 text-left"
            ><a v-if="!loadingFee" class="primary--text text-subtitle-2"
              >{{ platformFee }} ETH</a
            >
            <v-progress-circular v-else indeterminate color="primary" size="15">
            </v-progress-circular>
            Platform fee (discounted)</v-list-item-subtitle
          > -->
        </v-list-item-content>
      </v-list-item>
      <v-row no-gutters>
        <v-col cols="8">
          <v-text-field
            class="text-h5 rounded-0"
            color="primary"
            label="Recipient gets"
            outlined
            v-model="recipientGets"
            type="number"
            step="0.000001"
            flat
            height="50"
            readonly
          >
            <!-- <template v-slot:append-outer>
               
                </template> -->
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
              <v-list-item v-bind="attrs" v-on="on">
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
        <v-btn color="primary" @click="nextStep()"> {{ continueLabel }} </v-btn>
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
import Bignumber from "bignumber.js";
import { TransactionConfig } from "web3-core";
import cryptozenabi from "../../static/cryptozenabi";

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

  transferFee = "0";
  gasFee = "0";
  platformFee = "0";
  loadingFee = false;
  recipientGets = 0;
  params: TransactionConfig | "" = "";

  selectedRecipientTokenModel = this.selectedRecipientToken;

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
      this.checkFee();
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
  watchSelectedRecipientToken(value: string): void {
    this.$emit("selected-recipient-token", value);
    this.checkFee();
  }

  @Watch("swapAmount")
  watchswapAmount(value: number): void {
    this.checkFee();
  }

  async checkFee(): Promise<void> {
    try {
      if (this.selectedCurrency && this.selectedAddress) {
        this.loadingFee = true;
        this.transferFee = "0";
        this.gasFee = "0";
        this.platformFee = "0";
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
              contractAddress = this.selectedCurrency.contractAddress?.ROPSTEN;
            }
            amount = fromExponential(
              Number(
                this.swapAmount * 10 ** this.selectedCurrency.decimal
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
          amount = web3.utils.toWei(this.swapAmount.toString(), "ether");
          contractData = contract.methods
            .transferSameEther(this.selectedAddress.address, amount)
            .encodeABI();
          value = amount;
        }

        if (!contractData) {
          throw new Error("Contract data not found !");
        }
        this.params = {
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
          } else {
            this.transferFee = web3.utils.fromWei(
              transferFee.toString(),
              "ether"
            );
          }
        }

        if (
          this.selectedRecipientTokenModel.toLowerCase() ===
          this.selectedCurrency.value.toLowerCase()
        ) {
          this.recipientGets = this.swapAmount - Number(this.transferFee);
        }

        const gas = await web3.eth.estimateGas(this.params);
        const gasPrice = await web3.eth.getGasPrice();

        const txFee = new Bignumber(gas).times(
          web3.utils.fromWei(gasPrice, "ether")
        );

        this.gasFee = txFee.toString();

        this.loadingFee = false;
      }
    } catch (e) {
      console.log("e", e);
      this.loadingFee = false;
    }
  }

  continueLabel = "Continue";

  coins = balances;
  swapAmount = 0;
  label = "You send";
  hint = `you have ${this.selectedCurrency?.currency?.balance}`;
  // hint = `<span class=&quot;red--text&quot;>Red hint</span>`;
  mounted(): void {
    if (this.setLabel) this.label = this.setLabel;
    if (this.setSwapAmount) this.swapAmount = this.setSwapAmount;
    if (this.setContinueLabel) this.continueLabel = this.setContinueLabel;
    // this.$nextTick(() => {});
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
}
</script>

<style scoped>
.bala {
  border: 0.5px solid #005672;
}
</style>
