<template>
  <div>
    <v-container>
      <v-btn color="secondary">Send {{ getBalance().name }}</v-btn>
      <v-btn color="secondary" class="ml-1">Swap {{ getBalance().name }}</v-btn>
      <v-btn color="secondary" class="ml-1">Lock Compound</v-btn>
    </v-container>

    <TransactionHistory
      :label="`Activity on ${balanceTitle()}`"
    ></TransactionHistory>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import TransactionHistory from "./shared/TransactionHistory.vue";
import Balances from "../static/balance";
@Component({ name: "Balance", components: { TransactionHistory } })
export default class Balance extends Vue {
  balances = Balances;

  getBalance(): any {
    const balance = this.balances.find(
      (b) => b.value === this.$route.params.coin
    );
    return balance;
  }

  balanceTitle(): string {
    const balance = this.getBalance();
    if (balance) return `${balance.name} Balance`;
    else return "";
  }
}
</script>
