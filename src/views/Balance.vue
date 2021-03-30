<template>
  <div>
    <v-container>
      <v-btn
        class="ma-1"
        :disabled="!allowance"
        color="secondary"
        @click="sendMoneyDialog = true"
        >Send {{ getBalance.name }}</v-btn
      >
      <v-btn
        disabled
        color="secondary"
        @click="swapMoneyDialog = true"
        class="ma-1"
        >Swap {{ getBalance.name }} Coming soon</v-btn
      >
      <v-btn disabled color="secondary" class="ml-1"
        >Lock Compound Coming soon</v-btn
      >
      <v-btn
        class="ma-1"
        v-if="!allowance"
        :disabled="allowancePending"
        @click="approve"
        color="secondary"
        >{{ label }}</v-btn
      >
    </v-container>

    <v-dialog
      v-model="sendMoneyDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <SendMoney
        :currentSelected="getBalance"
        :step="2"
        @update-dialog="updateSendMoneyDialog"
      ></SendMoney>
    </v-dialog>

    <v-dialog
      v-model="swapMoneyDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <SwapMoney
          @update-dialog="swapMoneyDialog = false"
          :selectedCurrency="getBalance"
        ></SwapMoney>
      </v-card>
    </v-dialog>

    <TransactionHistory
      :label="`Activity on ${balanceTitle}`"
    ></TransactionHistory>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import TransactionHistory from "./shared/TransactionHistory.vue";
import Balances, { BalanceInterface } from "../static/balance";
import SendMoney from "./SendMoney.vue";
import SwapMoney from "./SwapMoney.vue";
import Web3 from "web3";
@Component({
  name: "Balance",
  components: { TransactionHistory, SendMoney, SwapMoney },
})
export default class Balance extends Vue {
  balances = Balances;
  sendMoneyDialog = false;
  swapMoneyDialog = false;
  loadingApprove = false;
  label = "Approve contract address";

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }
  async approve(): Promise<void> {
    try {
      this.loadingApprove = true;

      await this.$store.dispatch("approve", this.getBalance);
      await this.$store.dispatch("updateCoinBalance", this.getBalance);

      this.loadingApprove = false;
    } catch (e) {
      this.loadingApprove = false;
    }
  }

  updateSendMoneyDialog(value: boolean): void {
    this.sendMoneyDialog = value;
  }

  @Watch("loadingApprove")
  watchLoading(value: boolean): void {
    if (value === true) {
      this.label = "Approval Pending...";
      this.checkApproval(this.getBalance.currency?.hash as string);
    }
  }

  @Watch("getBalance", { deep: true })
  watchgetBalance(value: BalanceInterface): void {
    if (value) {
      this.loadingApprove = this.allowancePending;
      console.log("this.loadingApprove", this.loadingApprove);
    }
  }

  async checkApproval(hash: string): Promise<void> {
    const web3 = this.$store.getters["getWeb3"] as Web3;
    if (web3) {
      const tx = await web3.eth.getTransactionReceipt(hash);
      if (tx && tx.status) {
        const balanceIndex = this.$store.state.balances.findIndex(
          (b: BalanceInterface) => b.value === this.$route.params.coin
        );
        const balance = this.$store.state.balances[
          balanceIndex
        ] as BalanceInterface;
        (this.$store.state.balances as BalanceInterface[]).splice(
          balanceIndex,
          1,
          Object.assign(balance, {
            currency: Object.assign(balance.currency, {
              allowancePending: false,
              hash: "",
            }),
          })
        );
      } else {
        await sleep(10000);
        await this.checkApproval(hash);
      }
    }
  }

  get getBalance(): BalanceInterface {
    const balance = this.$store.state.balances.find(
      (b: BalanceInterface) => b.value === this.$route.params.coin
    );
    return balance;
  }

  get allowance(): boolean {
    const balance = this.getBalance;
    if (balance.currency) {
      return balance.currency.allowance;
    }
    return true;
  }

  get balanceTitle(): string {
    const balance = this.getBalance;
    if (balance) return `${balance.name} Balance`;
    else return "";
  }

  get allowancePending(): boolean {
    const balance = this.getBalance;
    if (balance.currency) {
      return balance.currency.allowancePending;
    }
    return false;
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
