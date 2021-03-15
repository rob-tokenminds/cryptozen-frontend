<template>
  <v-container>
    <v-card flat max-width="1100" class="mb-2">
      <v-card-subtitle class="primary--text">All Activity</v-card-subtitle>
    </v-card>

    <v-skeleton-loader
      max-width="1100"
      class="mb-2"
      v-if="loadingSyncTransactions"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-skeleton-loader
      max-width="1100"
      class="mb-2"
      v-if="loadingTransactions"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-card
      v-else
      v-for="transaction in transactions"
      :key="transaction.id"
      class="mb-2"
      flat
      max-width="1100"
    >
      <v-card-subtitle>{{
        toHumanDate(transaction.created_at)
      }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-expansion-panels multiple flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row>
              <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar color="main " size="60"></v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text"
                      >From :
                      {{ getWalletName(transaction.from) }}</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      {{ getStatus(transaction) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                <p class="primary--text text-right mt-6">
                  {{ getAmount(transaction) }}
                </p>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-container>
              <v-row class="mt-n1">
                <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                  <v-card flat tile>
                    <v-card-subtitle> Set Up By </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      {{ getWalletName(transaction.from) }}
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> To </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      {{ getWalletName(transaction.to) }}
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> TX Hash </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      {{ transaction.hash }}
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-n5">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Fee </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      {{ transaction.fee }}
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Block Number </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      {{ transaction.blockNumber }}
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4" class="text-right">
                  <v-btn color="secondary" outlined class="mt-7"
                    >Track URL</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { AddressBookInterface, TransactionInterface } from "@/store/fetcher";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { shleemy } from "shleemy";
import Web3 from "web3";

@Component({ name: "TransactionHistory", components: {} })
export default class TransactionHistory extends Vue {
  @Prop(String) readonly label!: string;
  @Prop(String) readonly currency!: string;
  loadingTransactions = false;
  toHumanDate(date: string): string {
    const interval = shleemy(date);
    return interval.forHumans;
  }

  getAmount(transaction: TransactionInterface): string {
    if (transaction.isToken) {
      return `${(
        Number(transaction.value) /
        10 ** Number(transaction.tokenDecimal)
      ).toString()} ${transaction.tokenName}`;
    } else {
      const web3 = this.$store.getters["getWeb3"] as Web3;
      return `${web3.utils.fromWei(transaction.value, "ether")} ETH`;
    }
  }

  getStatus(transaction: TransactionInterface): string {
    if (
      transaction.to?.toLowerCase() ===
      window.ethereum.selectedAddress?.toLowerCase()
    ) {
      return "Received";
    } else {
      return "Send";
    }
  }

  getWalletName(address: string): string {
    const addressBooks: AddressBookInterface[] = this.$store.getters[
      "getAddressBooks"
    ];

    const addressBook = addressBooks.find(
      (a) => a.address?.toLowerCase() === address?.toLowerCase()
    );
    if (addressBook) {
      return addressBook.name;
    } else {
      if (
        address?.toLowerCase() ===
        window.ethereum.selectedAddress?.toLowerCase()
      )
        return "Current address";
      else return address;
    }
  }

  get transactions(): TransactionInterface[] {
    const transactions: TransactionInterface[] = this.$store.getters[
      "getTransactions"
    ];
    if (this.$route.params.coin) {
      return transactions.filter(
        (t) => t.tokenSymbol === this.$route.params.coin
      );
    }
    return transactions;
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      await this.getTransactions();
      this.getSyncTransactions();
    });
  }
  loadingSyncTransactions = false;
  async getSyncTransactions(): Promise<void> {
    try {
      this.loadingSyncTransactions = true;
      if (window.ethereum.selectedAddress && this.$store.state.isLogin) {
        await this.$store.dispatch("getSyncTransactions", {
          address: window.ethereum.selectedAddress,
          // currency: this.$route.params.coin ? this.$route.params.coin : "",
          currency: "",
        });
      } else {
        await sleep(5000);
        await this.getTransactions();
      }
      this.loadingSyncTransactions = false;
    } catch (e) {
      this.loadingSyncTransactions = false;
    }
  }

  async getTransactions(): Promise<void> {
    try {
      this.loadingTransactions = true;
      if (window.ethereum.selectedAddress && this.$store.state.isLogin) {
        await this.$store.dispatch("getAddressBookList");
        await this.$store.dispatch("getTransactions", {
          address: window.ethereum.selectedAddress,
          // currency: this.$route.params.coin ? this.$route.params.coin : "",
          currency: "",
        });
      } else {
        await sleep(5000);
        await this.getTransactions();
      }
      this.loadingTransactions = false;
    } catch (e) {
      this.loadingTransactions = false;
    }
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
