<template>
  <v-card :loading="loading" :disabled="loading" width="100%">
    <v-container>
      <v-data-iterator
        :items="tokenList"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
      >
        <template v-slot:header>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="search"
                clearable
                flat
                prepend-inner-icon="mdi-magnify"
                label="Search"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="network"
                :items="networks"
                item-text="name"
                item-value="value"
                clearable
                flat
                label="Network"
              ></v-select>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="{ items }">
          <v-row>
            <v-col
              v-for="item of items"
              :key="item.value"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-list>
                <v-list-item-avatar>
                  <v-img :src="item.logo"></v-img>
                </v-list-item-avatar>
                <v-list-item-title>
                  {{ item.value.toUpperCase() }}
                  <v-avatar
                    v-if="!item.network || item.network === `eth`"
                    size="40"
                    ><v-img :src="require('../assets/eth.svg')"></v-img
                  ></v-avatar>
                  <v-avatar
                    v-if="!item.network || item.network === `bsc`"
                    size="30"
                    ><v-img :src="require('../assets/bsc.svg')"></v-img
                  ></v-avatar>
                </v-list-item-title>
                <v-list-item-subtitle> {{ item.name }}</v-list-item-subtitle>
              </v-list>
              <v-btn @click="addAsset(item)" outlined color="primary"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { BalanceInterface } from "@/static/balance";

@Component({ name: "NewAsset", components: {} })
export default class NewAsset extends Vue {
  loading = false;
  itemsPerPage = 15;
  page = 1;
  search = "";
  sortBy = "value";
  sortDesc = false;
  networks = [
    { name: "All", value: "" },
    { name: "Binance Smart Chain", value: "bsc" },
    { name: "Ethereum", value: "eth" },
  ];
  network = "";

  get balances(): BalanceInterface[] {
    return this.$store.state.balances as BalanceInterface[];
  }

  get fullTokenList(): BalanceInterface[] {
    let tokenList = this.$store.state.tokenList as BalanceInterface[];
    if (this.network) {
      tokenList = tokenList.filter((t) =>
        t.network.find((n) => n.toLowerCase() === this.network.toLowerCase())
      );
    }
    return tokenList;
  }

  get tokenList(): BalanceInterface[] {
    return this.fullTokenList.filter(
      (t) => !this.balances.find((b) => t.value === b.value)
    );
  }

  async addAsset(balance: BalanceInterface): Promise<void> {
    try {
      this.loading = true;
      const confirms = confirm(
        `Add ${balance.value.toUpperCase()} to your list of assets ?`
      );
      if (confirms) {
        await this.$store.dispatch("addAsset", balance.value.toLowerCase());
        await this.$store.dispatch("getTokenList");
        alert("New Asset Has Been Successfully Added");
      }

      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  async mounted(): Promise<void> {
    try {
      this.loading = true;

      await this.$store.dispatch("getTokenList");

      this.loading = false;
    } catch (e) {
      alert(e.message);
      this.loading = false;
    }
  }
}
</script>

<style scoped></style>
