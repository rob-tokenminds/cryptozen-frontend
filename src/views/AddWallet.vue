<template>
  <v-card class="mb-2" flat>
    <v-card-title>Select Wallet</v-card-title>
    <v-row dense>
      <v-col cols="6">
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
      <v-col cols="6">
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
