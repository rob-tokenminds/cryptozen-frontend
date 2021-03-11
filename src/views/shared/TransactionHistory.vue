<template>
  <v-container>
    <v-card flat max-width="1100">
      <v-card-subtitle class="primary--text">All Activity</v-card-subtitle>
    </v-card>
    <v-card class="mt-2" flat max-width="1100">
      <v-card-subtitle>Yesterday</v-card-subtitle>
      <v-divider></v-divider>
      <v-expansion-panels multiple flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="main " size="60"></v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >From : Fullname</v-list-item-title
                >
                <v-list-item-subtitle> Received </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-container>
              <v-row class="mt-n1">
                <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                  <v-card flat tile>
                    <v-card-subtitle> Set Up By </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      Fullname
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> To </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      Fullname
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Reference </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      Number
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-n5">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Fee </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      Fullname
                    </v-card-title>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Transfer Number </v-card-subtitle>
                    <v-card-title class="primary--text mt-n8">
                      Number
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
import { TransactionInterface } from "@/store/fetcher";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TransactionHistory", components: {} })
export default class TransactionHistory extends Vue {
  @Prop(String) label!: string;

  get transactions(): TransactionInterface[] {
    return this.$store.getters["getTransactions"];
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      await this.getTransactions();
    });
  }

  async getTransactions(): Promise<void> {
    if (window.ethereum.selectedAddress) {
      await this.$store.dispatch(
        "getTransactions",
        window.ethereum.selectedAddress
      );
    } else {
      await sleep(5000);
      await this.getTransactions();
    }
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
