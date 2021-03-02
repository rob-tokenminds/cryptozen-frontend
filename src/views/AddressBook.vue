<template>
  <v-container>
    <div>
      <v-row class="ml-1">
        <v-btn color="secondary" @click="addAWallet = true">Add a Wallet</v-btn>
        <v-btn color="secondary" @click="addARecipient = true" class="ml-1"
          >Add a Recipient</v-btn
        >
      </v-row>

      <v-dialog v-model="addAWallet" max-width="800">
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
                v-model="addAWalletAddress"
                label="Wallet Address"
              ></v-text-field>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="secondary" outlined @click="addAWallet = false">
                Cancel
              </v-btn>

              <v-btn color="secondary" outlined @click="addAWallet = false">
                Add a Wallet
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addARecipient" max-width="800">
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

              <v-btn color="secondary" outlined @click="addARecipient = false">
                Add a Recipient
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
    </div>

    <v-card class="mt-10" flat max-width="1100">
      <v-list-item class="">
        <v-list-item-avatar size="60">
          <v-avatar color="main"></v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="primary--text ma-2"
            >Wallet Name</v-list-item-title
          >
          <v-list-item-subtitle class="ma-2">address </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import Balance from "../static/balance";
@Component({ name: "AddressBook", components: {} })
export default class AddressBook extends Vue {
  addARecipient = false;
  addARecipientCurrency = "";
  addARecipientEmail = "";
  addARecipientWalletAddress = "";

  addAWallet = false;
  addAWalletCurrency = "";
  addAWalletAddress = "";

  currency = Balance;
}
</script>
