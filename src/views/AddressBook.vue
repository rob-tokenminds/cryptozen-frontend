<template>
  <v-container>
    <div class="mb-10">
      <v-row class="ml-1">
        <!-- <v-btn color="secondary" @click="addAWallet = true">Add a Wallet</v-btn> -->
        <v-btn color="secondary" @click="addARecipient = true" class="ml-1"
          >Add a Recipient</v-btn
        >
      </v-row>

      <v-dialog v-model="addAWallet" :max-width="isMobile ? `100%` : `65%`">
        <v-card>
          <v-container>
            <v-card-title class="headline"> Add A Wallet </v-card-title>

            <v-divider></v-divider>

            <v-container>
              <v-select
                :items="currency"
                item-text="name"
                item-value="value"
                label="Select Currency (*)"
                v-model="addAWalletCurrency"
              ></v-select>
              <v-text-field
                v-model="addAWalletName"
                label="Wallet Name"
              ></v-text-field>

              <v-text-field
                v-model="addAWalletAddress"
                label="Wallet Address"
              ></v-text-field>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="secondary" outlined @click="addAWallet = false">
                Cancel
              </v-btn>

              <v-btn
                color="secondary"
                :loading="createWalletLoading"
                @click="createWallet()"
              >
                Add a Wallet
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addARecipient" :max-width="isMobile ? `100%` : `65%`">
        <v-card>
          <v-container>
            <v-card-title class="headline"> Add A Recipient </v-card-title>

            <v-divider></v-divider>

            <v-container>
              <v-select
                :items="currency"
                item-text="name"
                item-value="value"
                label="Select Currency (*)"
                v-model="addARecipientCurrency"
              ></v-select>
              <v-text-field
                v-model="addARecipientName"
                label="Wallet Name"
              ></v-text-field>

              <v-text-field
                v-model="addARecipientEmail"
                label="Account Holder email address"
              ></v-text-field>
              <v-text-field
                v-model="addARecipientWalletAddress"
                label="Wallet Address"
              ></v-text-field>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="secondary" outlined @click="addARecipient = false">
                Cancel
              </v-btn>

              <v-btn
                color="secondary"
                @click="createRecipient()"
                :loading="createWalletLoading"
              >
                Add a Recipient
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
    </div>

    <v-card
      class="mt-2"
      flat
      :max-width="isMobile ? `100%` : `65%`"
      v-for="addressBook in addressBookList"
      :key="addressBook.id"
    >
      <v-list-item class="">
        <v-list-item-avatar size="60">
          <v-avatar color="">
            <v-img
              :src="require(`../assets/${addressBook.currency}.svg`)"
            ></v-img>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="primary--text ma-2"
            >{{ addressBook.currency.toUpperCase() }} |
            {{ addressBook.name }}</v-list-item-title
          >
          <v-list-item-subtitle class="ma-2"
            >{{ addressBook.address }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="editWalletData(addressBook)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              @click="
                deleteWalletId = addressBook.id;
                deleteWallet = true;
              "
            >
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
      <v-spacer></v-spacer>
    </v-card>

    <v-dialog v-model="editWallet" max-width="800">
      <v-card>
        <v-container>
          <v-card-title class="headline"> Edit Wallet </v-card-title>

          <v-divider></v-divider>

          <v-container>
            <v-select
              :items="currency"
              item-text="name"
              item-value="value"
              label="Select Currency (*)"
              v-model="editAWalletCurrency"
            ></v-select>
            <v-text-field
              v-model="editAWalletName"
              label="Wallet Name"
            ></v-text-field>

            <v-text-field
              v-model="editAWalletAddress"
              label="Wallet Address"
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="secondary" outlined @click="editWallet = false">
              Cancel
            </v-btn>

            <v-btn
              color="secondary"
              @click="updateWallet()"
              :loading="editWalletLoading"
            >
              Update Wallet
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteWallet" max-width="500">
      <v-card>
        <v-container>
          <v-card-title class="headline"> Delete Wallet </v-card-title>

          <v-card-text>Are you sure to delete this wallet ?</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="secondary"
              outlined
              @click="
                deleteWalletId = '';
                deleteWallet = false;
              "
            >
              Cancel
            </v-btn>

            <v-btn
              color="secondary"
              @click="walletDelete()"
              :loading="editWalletLoading"
            >
              Delete Wallet
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { AddressBookInterface } from "../store/fetcher";
import { Vue, Component } from "vue-property-decorator";
import Balance from "../static/balance";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";
import CryptoJS from "crypto-js";
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
}
declare const window: Window;
@Component({ name: "AddressBook", components: {} })
export default class AddressBook extends Vue {
  addARecipient = false;
  addARecipientCurrency = "";
  addARecipientEmail = "";
  addARecipientWalletAddress = "";
  addARecipientName = "";

  addAWallet = false;
  addAWalletCurrency = "";
  addAWalletAddress = "";
  addAWalletName = "";

  currency = Balance;

  editWallet = false;
  editWalletLoading = false;
  editAWalletCurrency = "";
  editAWalletAddress = "";
  editAWalletName = "";
  editWalletId = "";

  deleteWalletId = "";

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }

  editWalletData(wallet: AddressBookInterface): void {
    console.log("wallet", wallet);
    if (wallet) {
      this.editAWalletCurrency = wallet.currency;
      this.editAWalletAddress = wallet.address;
      this.editAWalletName = wallet.name;
      this.editWalletId = wallet.id;
      this.editWallet = true;
    }
  }

  async updateWallet(): Promise<void> {
    this.editWalletLoading = true;
    try {
      await this.$store.dispatch("updateWallet", {
        id: this.editWalletId,
        name: this.editAWalletName,
        address: this.editAWalletAddress,
        currency: this.editAWalletCurrency,
      });
      this.editWalletLoading = false;
      this.editWallet = false;
      this.editAWalletCurrency = "";
      this.editAWalletAddress = "";
      this.editAWalletName = "";
      this.editWalletId = "";
      alert("Wallet has been successfully updated");
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);

      this.editWalletLoading = false;
    }
  }
  deleteWalletLoading = false;
  deleteWallet = false;
  async walletDelete(): Promise<void> {
    this.deleteWalletLoading = true;
    try {
      await this.$store.dispatch("deleteWallet", this.deleteWalletId);
      this.deleteWalletLoading = false;
      this.deleteWallet = false;
      this.deleteWalletId = "";
      alert("Wallet has been successfully deleted");
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);
      this.deleteWalletLoading = false;
    }
  }

  get addressBookList(): AddressBookInterface[] {
    return this.$store.getters["getAddressBooks"];
  }

  async mounted(): Promise<void> {
    await this.$store.dispatch("getAddressBookList");
  }

  createWalletLoading = false;
  async createWallet(): Promise<void> {
    try {
      this.createWalletLoading = true;
      await this.$store.dispatch("createWallet", {
        name: this.addAWalletName,
        address: this.addAWalletAddress,
        currency: this.addAWalletCurrency.toLowerCase(),
        email: null,
        sendEmail: false,
        type: "wallet",
      });
      this.createWalletLoading = false;
      this.addAWallet = false;
      this.addAWalletName = "";
      this.addAWalletAddress = "";
      this.addAWalletCurrency = "";
      alert("Wallet has been successfully added");
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);
      this.createWalletLoading = false;
    }
  }

  async createRecipient(): Promise<void> {
    try {
      this.createWalletLoading = true;
      let allowSubmit = true;
      let signature = null;
      if (this.addARecipientEmail) {
        const web3 = this.$store.getters["getWeb3"] as Web3;
        if (web3) {
          const message = `We are requesting your signature again to encrypt the email address. Your signature won't be saved on the server`;
          const params = [message, window.ethereum.selectedAddress];
          const currentProvider = web3.currentProvider;
          signature = await new Promise((resolve, reject) => {
            (currentProvider as AbstractProvider).sendAsync(
              {
                jsonrpc: "1",
                method: "personal_sign",
                params,
              },
              (error, result) => {
                if (error) {
                  resolve(false);
                } else {
                  resolve(result?.result);
                }
              }
            );
          });

          if (!signature) {
            alert(`Please sign the signature request`);
            allowSubmit = false;
            this.createWalletLoading = false;
          }
        } else {
          allowSubmit = false;
          alert(`Cannot initialize Web3.js`);
        }
      }
      if (allowSubmit) {
        let email = null;
        if (signature) {
          email = CryptoJS.AES.encrypt(
            this.addARecipientEmail,
            signature as string
          ).toString();
        }
        await this.$store.dispatch("createWallet", {
          name: this.addARecipientName,
          address: this.addARecipientWalletAddress
            ? this.addARecipientWalletAddress
            : null,
          currency: this.addARecipientCurrency.toLowerCase(),
          email,
          plainEmail: this.addARecipientEmail ? this.addARecipientEmail : null,
          sendEmail: !this.addARecipientWalletAddress,
          type: "recipient",
        });

        if (!this.addARecipientWalletAddress) {
          alert(
            "Recipient has been successfully added. The account holder will be notified by email to add the address"
          );
        } else {
          alert("Recipient has been successfully added");
        }
        this.createWalletLoading = false;
        this.addARecipient = false;
        this.addARecipientName = "";
        this.addARecipientWalletAddress = "";
        this.addARecipientCurrency = "";
        this.addARecipientEmail = "";
      }
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);
      this.createWalletLoading = false;
    }
  }
}
</script>
