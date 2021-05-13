<template>
  <div>
    <v-container>
      <v-alert v-if="loadingApprove" color="warning"
        >Approving token, please wait ...</v-alert
      >

      <v-tooltip bottom v-if="isReversed">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ma-1" color="grey" v-bind="attrs" v-on="on"
            >Send {{ getBalance.name }}</v-btn
          >
        </template>
        <span
          >Please switch the network to {{ chainNameReverse }} on Metamask</span
        >
      </v-tooltip>
      <v-tooltip
        bottom
        v-else-if="
          address
            ? address.toLowerCase() !==
              $store.state.selectedAddress.toLowerCase()
            : false
        "
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ma-1" color="grey" v-bind="attrs" v-on="on"
            >Send {{ getBalance.name }}</v-btn
          >
        </template>
        <span>Please change the address on Metamask</span>
      </v-tooltip>

      <v-btn
        v-else
        class="ma-1"
        :disabled="!allowance || loadingApprove"
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
        v-if="!allowance && !isReversed"
        :loading="loadingApprove"
        :disabled="loadingApprove"
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
    <v-container>
      <v-card flat :max-width="isMobile ? `100%` : `65%`">
        <v-row dense>
          <v-col
            cols="6"
            v-for="(currency, index) in getCurrency(balance.currency)"
            :key="index"
          >
            <v-list-item dense>
              <v-list-item-title>
                <v-avatar size="30" class="mr-2">
                  <v-img
                    :src="
                      require(`../assets/${currency.network.toLowerCase()}.svg`)
                    "
                  ></v-img
                ></v-avatar>
                {{ currency.address }} ~
                {{ getHrNumber(Number(currency.balance)) }}
                {{ balance.value.toUpperCase() }} (${{
                  getHrNumber(
                    getUsdPriceByAmount(
                      Number(currency.balance),
                      balance.coinGeckoId
                    )
                  )
                }})</v-list-item-title
              >
            </v-list-item>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

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
import CurrencyModel from "@/models/CurrencyModel";
import HRNumber from "human-readable-numbers";
import { CoingeckoInterface } from "@/interfaces";
@Component({
  name: "Balance",
  components: { TransactionHistory, SendMoney, SwapMoney },
})
export default class Balance extends Vue {
  balances = Balances;
  sendMoneyDialog = false;
  swapMoneyDialog = false;
  loadingApprove = false;
  label = "Enable sending";

  get coinGeckoPrices(): CoingeckoInterface[] {
    return this.$store.state.coinGeckoPrices;
  }

  getUsdPriceByAmount(amount: number, coinGeckoId: string): number {
    if (coinGeckoId && amount) {
      const coinGeckoPrice = this.coinGeckoPrices.find(
        (c) => c.id === coinGeckoId
      );
      if (coinGeckoPrice) {
        return amount * coinGeckoPrice.current_price;
      }
    }

    return 0;
  }

  getHrNumber(number: number): string {
    if (number > 999) {
      return HRNumber.toHumanString(number);
    } else {
      return Number(number.toFixed(4)).toString();
    }
  }

  get address(): string {
    return this.$route.params.address;
  }

  get coin(): string {
    return this.$route.params.coin;
  }

  get chain_id(): string {
    return this.$route.params.chain_id;
  }

  get network(): string {
    const chainId = Number(this.chain_id);
    switch (chainId) {
      case 1:
      case 3:
        return "eth";

      case 56:
      case 97:
        return "bsc";
    }
    return "";
  }

  get balance(): BalanceInterface | undefined {
    const balances: BalanceInterface[] = this.$store.state.balances;

    return balances.find(
      (b) => b.value.toLowerCase() === this.coin.toLowerCase()
    );
  }

  getCurrency(currency: CurrencyModel[]): CurrencyModel[] {
    if (this.chain_id && this.address) {
      return currency.filter((c) => {
        console.log("this.network", this.network);
        return (
          c.address.toLowerCase() === this.address.toLowerCase() &&
          c.network.toLowerCase() === this.network
        );
      });
    }
    return currency;
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }
  async approve(): Promise<void> {
    try {
      this.loadingApprove = true;

      await this.$store.dispatch("approve", this.getBalance);
      await this.$store.dispatch("updateCoinBalance", {
        coin: this.getBalance,
        address: this.$store.state.selectedAddress,
      });

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
      if (this.getBalanceCurrency) this.checkApproval();
    }
  }

  @Watch("getBalance", { deep: true })
  async watchgetBalance(value: BalanceInterface): Promise<void> {
    if (value) {
      this.loadingApprove = this.allowancePending;
      console.log("this.loadingApprove", this.loadingApprove);
      await this.checkApproval();
    }
  }

  async mounted(): Promise<void> {
    await this.checkApproval();
  }

  // async checkApproval(hash: string): Promise<void> {
  //   const web3 = this.$store.getters["getWeb3"] as Web3;
  //   if (web3) {
  //     const tx = await web3.eth.getTransactionReceipt(hash);
  //     if (tx && tx.status) {
  //       const balanceIndex = this.$store.state.balances.findIndex(
  //         (b: BalanceInterface) => b.value === this.$route.params.coin
  //       );
  //       const balance = this.$store.state.balances[
  //         balanceIndex
  //       ] as BalanceInterface;
  //       (this.$store.state.balances as BalanceInterface[]).splice(
  //         balanceIndex,
  //         1,
  //         Object.assign(balance, {
  //           currency: Object.assign(balance.currency, {
  //             allowancePending: false,
  //             hash: "",
  //           }),
  //         })
  //       );
  //     } else {
  //       await sleep(10000);
  //       await this.checkApproval(hash);
  //     }
  //   }
  // }

  get getBalanceCurrency(): CurrencyModel | undefined {
    if (this.getBalance.currency) {
      return this.getBalance.currency.find(
        (c) =>
          c.network.toLowerCase() ===
            this.$store.state.networkName.toLowerCase() &&
          c.address.toLowerCase() ===
            this.$store.state.selectedAddress.toLowerCase()
      );
    }
    return undefined;
  }

  get getBalance(): BalanceInterface {
    let balance = this.$store.state.balances.find(
      (b: BalanceInterface) => b.value === this.$route.params.coin
    );
    return balance;
  }

  get allowance(): boolean {
    const currency = this.getBalanceCurrency;
    if (currency) {
      return currency.allowance;
    }
    return true;
  }

  get balanceTitle(): string {
    const balance = this.getBalance;
    if (balance) return `${balance.name} Balance`;
    else return "";
  }

  get chainId(): number {
    return this.$store.state.chainId;
  }

  get allowancePending(): boolean {
    const currency = this.getBalanceCurrency;
    if (currency) {
      return currency.allowancePending;
    }
    return false;
  }

  get chainNameReverse(): string {
    if (this.chainId === 1 || this.chainId === 3) {
      return "Binance";
    } else {
      return "Ethereum";
    }
  }

  get isReversed(): boolean {
    if (this.$route.params.chain_id)
      return (
        Number(this.$route.params.chain_id) !==
        Number(this.$store.state.chainId)
      );
    return false;
  }

  async checkApproval(shouldSleep = false): Promise<void> {
    if (shouldSleep) {
      await sleep(10000);
    }
    const hash = localStorage.getItem(
      `approval:${this.$store.state.selectedAddress}`
    );
    if (hash) {
      const web3 = this.$store.getters["getWeb3"] as Web3;
      const tx = await web3.eth.getTransactionReceipt(hash);
      console.log("txtxtxtx", tx);
      if (tx) {
        localStorage.removeItem(
          `approval:${this.$store.state.selectedAddress}`
        );
        this.loadingApprove = false;
        alert("Approval success, site will be reloaded");
        location.reload();
      } else {
        const tx2 = await web3.eth.getTransaction(hash);
        console.log("tx2tx2tx2", tx2);
        if (!tx2) {
          this.loadingApprove = false;
          localStorage.removeItem(
            `approval:${this.$store.state.selectedAddress}`
          );
          alert(
            "You have replaced, cancel, or speed up the tx directly on Metamask. We cannot detect that transaction due the limitation of Metamask. Please make sure that the approval is confirmed manually"
          );
          location.reload();
        } else {
          this.loadingApprove = true;
          await this.checkApproval(true);
        }
      }
    } else {
      this.loadingApprove = false;
    }
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
