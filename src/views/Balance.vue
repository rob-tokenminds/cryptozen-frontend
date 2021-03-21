<template>
  <div>
    <v-container>
      <v-btn
        :disabled="!allowance"
        color="secondary"
        @click="sendMoneyDialog = true"
        >Send {{ getBalance.name }}</v-btn
      >
      <v-btn
        :disabled="!allowance"
        color="secondary"
        @click="swapMoneyDialog = true"
        class="ml-1"
        >Swap {{ getBalance.name }}</v-btn
      >
      <v-btn :disabled="!allowance" color="secondary" class="ml-1"
        >Lock Compound</v-btn
      >
      <v-btn
        class="ml-1"
        v-if="!allowance"
        :loading="loadingApprove"
        @click="approve"
        color="secondary"
        >Approve contract address</v-btn
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
import { Vue, Component } from "vue-property-decorator";
import TransactionHistory from "./shared/TransactionHistory.vue";
import Balances, { BalanceInterface } from "../static/balance";
import SendMoney from "./SendMoney.vue";
import SwapMoney from "./SwapMoney.vue";
@Component({
  name: "Balance",
  components: { TransactionHistory, SendMoney, SwapMoney },
})
export default class Balance extends Vue {
  balances = Balances;
  sendMoneyDialog = false;
  swapMoneyDialog = false;
  loadingApprove = false;
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
}
</script>
