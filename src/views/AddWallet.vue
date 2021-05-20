<template>
  <v-card class="mb-2" flat>
    <v-card-title>Select New Wallet</v-card-title>
    <v-row dense>
      <v-col cols="12" md="6" sm="6" lg="6" xl="6">
        <v-btn
          @click="showMetamaskDialog = true"
          outlined
          block
          color="primary"
        >
          <v-avatar size="35">
            <v-img
              class="mr-1"
              :src="require('../assets/metamask.png')"
            ></v-img>
          </v-avatar>
          Metamask</v-btn
        >
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="6" xl="6">
        <v-btn @click="showAddAddress = true" outlined block color="primary">
          <v-avatar size="35">
            <v-img class="mr-1" :src="require('../assets/eth.svg')"></v-img>
          </v-avatar>

          ETH/BSC Address
          <v-avatar size="25">
            <v-img class="ml-1" :src="require('../assets/bsc.svg')"></v-img>
          </v-avatar>
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-5">
      <v-divider></v-divider>

      <v-card-title>Wallet List</v-card-title>

      <v-list dense>
        <v-list-item v-for="(item, i) in walletList" :key="i">
          <v-list-item-content>
            <v-list-item-title
              >{{ item }}
              <v-btn @click="removeAddress(i)" icon>
                <v-icon
                  v-if="
                    item.toLowerCase() !==
                    $store.state.selectedAddress.toLowerCase()
                  "
                  color="red"
                  >mdi-close</v-icon
                ></v-btn
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="showMetamaskDialog" width="600">
      <v-card>
        <v-card-title
          >To add new wallet, please change the selected address on Metamask and
          then click connect if the address hasn't been connected to this
          dapp</v-card-title
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddAddress" width="600">
      <v-card>
        <v-container>
          <v-card-title>Add ETH / BSC Address</v-card-title>
          <v-container>
            <v-text-field
              label="ETH / BSC Address"
              v-model="address"
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-btn color="secondary" @click="addAddress()">Add</v-btn>
            <v-btn color="secondary" outlined @click="showAddAddress = false"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Web3 from "web3";

@Component({ name: "AddWallet", components: {} })
export default class AddWallet extends Vue {
  showMetamaskDialog = false;
  newAddress = false;
  showAddAddress = false;
  address = "";

  get walletList(): string[] {
    return this.$store.state.userAddresses;
  }

  removeAddress(index: number): void {
    if (confirm(`Delete this wallet address ? ${this.walletList[index]}`)) {
      for (const network of ["MAINNET", "TESTNET"]) {
        localStorage.removeItem(
          `lastBlockNumber:bsc:${network}:${this.walletList[
            index
          ].toLowerCase()}`
        );
        localStorage.removeItem(
          `result:bsc:${network}:${this.walletList[index].toLowerCase()}`
        );
      }

      this.walletList.splice(index, 1);
      localStorage.setItem("watchAddresses", JSON.stringify(this.walletList));
    }
  }

  async addAddress(): Promise<void> {
    const web3 = this.$store.getters["getWeb3"] as Web3;
    if (this.address && web3.utils.isAddress(this.address)) {
      const addressesLocal = localStorage.getItem("watchAddresses");
      let addressesData: string[] = [];
      if (addressesLocal) {
        addressesData = JSON.parse(addressesLocal);
      } else {
        addressesData = [this.address];
        localStorage.setItem("watchAddresses", JSON.stringify(addressesData));
      }

      if (
        !addressesData.find(
          (a) => a.toLowerCase() === this.address.toLowerCase()
        )
      ) {
        addressesData.push(this.address);
      }

      localStorage.setItem("watchAddresses", JSON.stringify(addressesData));
      location.reload();
    } else {
      alert("Invalid ETH/BSC Address");
    }
  }

  mounted(): void {
    // window.ethereum.on("accountsChanged", () => {
    //   if (this.newAddress) {
    //     Vue.$cookies.remove("cryptozen_token");
    //     this.$router.push("/");
    //     location.reload();
    //   }
    // });
  }
}
</script>
