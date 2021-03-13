<template>
  <v-card flat>
    <v-stepper v-model="e1" class="elevation-0">
      <!-- <v-toolbar dark color="white"> -->

      <v-stepper-header>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-img
          class="ma-5"
          max-height="60"
          max-width="130"
          src="../assets/logo2.svg"
        ></v-img>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-stepper-step :complete="e1 > 1" step=""> Wallet </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step=""> Amount </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 3" step=""> Recipient </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step=""> Review </v-stepper-step>
        <v-spacer></v-spacer>

        <ProfileMenu class="mt-1" :showBell="false"></ProfileMenu>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>

        <v-icon color="primary" large class="mb-3" @click="closeDialog"
          >mdi-close</v-icon
        >
        <v-spacer></v-spacer>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card flat class="d-flex justify-center">
            <v-card flat>
              <p class="text-center primary--text text-h5">
                Where do you want to send from ?
              </p>

              <v-card flat>
                <v-card-text>Select balance</v-card-text>
              </v-card>

              <v-card
                v-for="coin in $store.state.balances"
                :key="coin.value"
                elevation="2"
                class="mx-auto mt-2"
                height="100"
                width="600"
                @click="
                  selectedCurrency = coin;
                  e1 = 2;
                "
              >
                <v-card-text>
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-img
                        :src="require(`../assets/${coin.value}.svg`)"
                      ></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        class="primary--text text-subtitle-1"
                        >{{
                          coin.currency ? coin.currency.balance : 0
                        }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="">{{
                        coin.name
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-spacer></v-spacer>
                    <v-list-item-content>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>

              <v-card-actions> </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <p class="text-center primary--text text-h5">
            You are sending on behalf of Bruce Wayne
          </p>
          <v-card flat class="d-flex justify-center">
            <SelectAmount
              v-if="selectedCurrency"
              :currentStep="2"
              :selectedCurrency="selectedCurrency"
              @swap-amount="setSwapAmount"
              @next-step="e1 = 3"
              @prev-step="e1 = 1"
            ></SelectAmount>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card flat class="d-flex justify-center">
            <v-card flat>
              <p class="text-center primary--text text-h5">
                Who are you sending money to?
              </p>

              <v-card flat>
                <v-card-text>Select Recipient</v-card-text>
              </v-card>
              <v-card flat class="mx-auto" width="800">
                <v-expansion-panels class="mb-2">
                  <v-expansion-panel @click="getAddressBooks()">
                    <v-expansion-panel-header>
                      <v-list-item>
                        <v-list-item-avatar tile>
                          <v-icon large color="primary"
                            >mdi-home-outline</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="primary--text text-h6"
                            >Address Book</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item></v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <v-card flat :loading="loadingAddressBooks">
                        <v-container>
                          <!-- <v-skeleton-loader
                            v-if="loadingAddressBooks"
                            type="card"
                          ></v-skeleton-loader> -->

                          <v-card
                            v-for="addressBook of addressBooks"
                            :key="addressBook.id"
                            class="mb-2"
                            @click="
                              selectedAddress = addressBook;
                              e1 = 4;
                            "
                          >
                            <v-list-item class="">
                              <v-list-item-avatar size="60">
                                <v-avatar color="main"></v-avatar>
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
                            </v-list-item>
                          </v-card>
                        </v-container>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="mb-2">
                  <v-expansion-panel @click="getAddressBooks()">
                    <v-expansion-panel-header>
                      <v-list-item>
                        <v-list-item-avatar tile>
                          <v-icon large color="primary"
                            >mdi-wallet-outline</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="primary--text text-h6"
                            >Your Wallet</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item></v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <v-card
                        v-for="addressBook of addressBooksWallet"
                        :key="addressBook.id"
                        class="mb-2"
                      >
                        <v-list-item class="">
                          <v-list-item-avatar size="60">
                            <v-avatar color="main"></v-avatar>
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
                        </v-list-item>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- <v-card elevation="2" class="mx-auto" height="100" width="800">
                <v-card-text @click="e1 = 4">
                
                </v-card-text>
              </v-card> -->

                <v-expansion-panels class="mb-2">
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <v-list-item>
                        <v-list-item-avatar tile>
                          <v-icon large color="primary">mdi-plus</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="primary--text text-h6"
                            >New Recipient</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item></v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <v-card>
                        <v-container>
                          <v-container>
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

                            <v-btn
                              color="secondary"
                              outlined
                              @click="addARecipient = false"
                            >
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
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="e1 = 2"> Back </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <p class="text-center primary--text text-h5">Review</p>

          <v-card flat class="d-flex justify-center">
            <v-card flat width="600">
              <SelectAmount
                v-if="selectedCurrency"
                :currentStep="4"
                :selectedCurrency="selectedCurrency"
                :setSwapAmount="swapAmount"
                :disableActionButton="true"
                @swap-amount="setSwapAmount"
                @next-step="finish()"
                @prev-step="e1 = 3"
              ></SelectAmount>
              <p>To</p>
              <v-card class="mb-2" v-if="selectedAddress">
                <v-list-item class="">
                  <v-list-item-avatar size="60">
                    <v-avatar color="main"></v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text ma-2"
                      >{{ selectedAddress.currency.toUpperCase() }} |
                      {{ selectedAddress.name }}</v-list-item-title
                    >
                    <v-list-item-subtitle class="ma-2"
                      >{{ selectedAddress.address }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="e1 = 3"> Back </v-btn>
                <v-btn color="primary"> Send </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ProfileMenu from "./shared/ProfileMenu.vue";
import SelectAmount from "./shared/SelectAmount.vue";
import Balances, { BalanceInterface } from "../static/balance";
import { AddressBookInterface } from "@/store/fetcher";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";
import CryptoJS from "crypto-js";
@Component({ name: "SendMoney", components: { ProfileMenu, SelectAmount } })
export default class SendMoney extends Vue {
  @Prop({ type: Number }) readonly step!: number;
  @Prop({ type: Object }) readonly currentSelected!: BalanceInterface;

  addARecipientEmail = "";
  addARecipientWalletAddress = "";
  addARecipientName = "";
  createWalletLoading = false;
  selectedAddress: AddressBookInterface | "" = "";

  async createRecipient(): Promise<void> {
    try {
      this.createWalletLoading = true;
      let allowSubmit = true;
      let signature = null;
      if (this.selectedCurrency) {
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
            currency: this.selectedCurrency.value.toLowerCase(),
            email,
            plainEmail: this.addARecipientEmail
              ? this.addARecipientEmail
              : null,
            sendEmail: !this.addARecipientWalletAddress,
            type: "recipient",
          });
          this.createWalletLoading = false;

          if (!this.addARecipientWalletAddress) {
            alert(
              "Recipient has been successfully added. The account holder will be notified by email to add the address"
            );
          } else {
            alert("Recipient has been successfully added");
          }
          this.addARecipientName = "";
          this.addARecipientWalletAddress = "";
          this.selectedCurrency = "";
          this.addARecipientEmail = "";
        }
      } else {
        alert(`no selected Currency`);
      }
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);
      this.createWalletLoading = false;
    }
  }

  @Watch("selectedCurrencySync")
  watchSelectedCurrencySync(value: BalanceInterface): void {
    this.selectedCurrency = value;
  }

  get addressBooksWallet(): AddressBookInterface[] {
    return this.$store.getters["getAddressBooks"].filter(
      (a: AddressBookInterface) => a.type === "wallet"
    );
  }

  get addressBooks(): AddressBookInterface[] {
    return this.$store.getters["getAddressBooks"];
  }
  loadingAddressBooks = false;
  // @Watch("e1")
  // async watchE1(value: number): Promise<void> {
  //   if (value === 3) {

  //   }
  // }

  async getAddressBooks(): Promise<void> {
    this.loadingAddressBooks = true;
    await this.$store.dispatch("getAddressBookList");
    this.loadingAddressBooks = false;
  }

  @Watch("step")
  watchStep(value: number): void {
    this.e1 = value;
  }

  mounted(): void {
    if (this.step) this.e1 = this.step;
    if (this.currentSelected) this.selectedCurrency = this.currentSelected;
  }

  e1 = 1;
  coinSelected = "";
  closeDialog(): void {
    this.$emit("update-dialog", false);
  }
  selectedRecipientToken = "usdt";
  coins = Balances;
  selectedCurrency: BalanceInterface | "" = "";
  swapAmount = 0;
  setSwapAmount(value: number): void {
    this.swapAmount = Number(value);
  }
}
</script>

<style>
.line-lurus {
  /* Line 2 */

  position: absolute;
  left: 6.17%;
  right: 75.31%;
  top: 98%;
  bottom: 2%;

  /* Main color */

  border: 2px solid #005672;
  transform: rotate(90deg);
}
</style>
