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
          @click="goToHome()"
        ></v-img>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-stepper-step :complete="e1 > 1" :step="e1 === 1 ? `O` : ``">
          <v-chip
            @click="isReview ? (e1 = 1) : ''"
            :color="e1 === 1 ? `primary` : ``"
          >
            Wallet</v-chip
          >
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" :step="e1 === 2 ? `O` : ``">
          <v-chip
            @click="isReview ? (e1 = 2) : ''"
            :color="e1 === 2 ? `primary` : ``"
          >
            Recipient</v-chip
          >
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 3" :step="e1 === 3 ? `O` : ``">
          <v-chip
            @click="isReview ? (e1 = 3) : ''"
            :color="e1 === 3 ? `primary` : ``"
          >
            Amount</v-chip
          >
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :step="e1 === 4 ? `O` : ``">
          <v-chip
            @click="isReview ? (e1 = 4) : ''"
            :color="e1 === 4 ? `primary` : ``"
          >
            Review</v-chip
          >
        </v-stepper-step>
        <v-spacer></v-spacer>

        <ProfileMenu class="mb-3" :showBell="false"></ProfileMenu>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-btn color="primary" icon large class="mt-3" @click="closeDialog">
          <v-icon class="">mdi-close</v-icon></v-btn
        >

        <v-spacer></v-spacer>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card
            :disabled="approveLoadingStatus"
            flat
            class="d-flex justify-center"
          >
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
                @click="nextSendFrom(coin)"
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
                      <v-icon v-if="coin.currency.allowance"
                        >mdi-chevron-right</v-icon
                      >
                      <v-btn
                        :disabled="approveLoadingStatus"
                        v-else
                        color="primary"
                        small
                        @click="approve(coin)"
                        >{{
                          coin.currency.allowancePending
                            ? "Pending"
                            : "Approve Contract"
                        }}</v-btn
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>

              <v-card-actions> </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
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
                              e1 = 3;
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

                <!-- <v-expansion-panels class="mb-2">
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
                </v-expansion-panels> -->

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
                        <v-container v-if="!newAddressBookSubmitted">
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

                        <v-container v-else-if="!newSubmittedAddressBook">
                          <v-card-text
                            >New address has been submitted, please wait until
                            recipient submit the address</v-card-text
                          >
                        </v-container>

                        <v-card
                          class="mb-2"
                          v-if="newSubmittedAddressBook"
                          @click="
                            selectedAddress = newSubmittedAddressBook;
                            e1 = 3;
                          "
                        >
                          <v-list-item class="">
                            <v-list-item-avatar size="60">
                              <v-avatar color="main"></v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title class="primary--text ma-2"
                                >{{
                                  newSubmittedAddressBook.currency.toUpperCase()
                                }}
                                |
                                {{
                                  newSubmittedAddressBook.name
                                }}</v-list-item-title
                              >
                              <v-list-item-subtitle class="ma-2"
                                >{{ newSubmittedAddressBook.address }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="e1 = 1"> Back </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <p class="text-center primary--text text-h5">
            You are sending on behalf of {{ selectedEthereumAddress }}
          </p>

          <v-card flat class="d-flex justify-center">
            <SelectAmount
              v-if="selectedCurrency"
              :setSwapAmount="swapAmount"
              :currentStep="3"
              :selectedCurrency="selectedCurrency"
              :selectedAddress="selectedAddress"
              :selectedRecipientToken="selectedRecipientToken"
              :shouldSend="false"
              :readOnly="false"
              @swap-amount="setSwapAmount"
              @next-step="e1 = 4"
              @prev-step="e1 = 2"
              @selected-recipient-token="setSelectedRecipientToken"
              @transfer-fee="setTransferFee"
              @set-allowance="setAllowance"
            ></SelectAmount>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <p class="text-center primary--text text-h5">Review</p>

          <v-card flat class="d-flex justify-center">
            <v-card flat width="800">
              <SelectAmount
                v-if="selectedCurrency"
                :key="componentKey"
                :currentStep="4"
                :selectedCurrency="selectedCurrency"
                :setSwapAmount="swapAmount"
                :disableActionButton="true"
                :selectedAddress="selectedAddress"
                :selectedRecipientToken="selectedRecipientToken"
                :shouldSend="true"
                :readOnly="true"
                @swap-amount="setSwapAmount"
                @next-step="e1 = 3"
                @prev-step="finish()"
                @selected-recipient-token="setSelectedRecipientToken"
                @params="setParams"
                @gas-fee="setGasFee"
                @transfer-fee="setTransferFee"
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

              <v-card flat>
                <v-text-field
                  outlined
                  label="Personal Reference"
                  v-model="reference"
                ></v-text-field>
              </v-card>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="e1 = 3"> Back </v-btn>
                <v-btn
                  color="primary"
                  :loading="loadingSendMoney"
                  @click="sendMoney"
                >
                  Send
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="5">
          <p class="text-center primary--text text-h5">Pending</p>
          <p class="text-center primary--text">
            We will notify you once the transaction is confirmed
          </p>

          <v-card v-if="transaction" flat class="d-flex justify-center">
            <v-card class="mb-2" max-width="1100">
              <v-card-subtitle>Pending</v-card-subtitle>
              <v-divider></v-divider>

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
                        {{ ransaction.from }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ getStatus(transaction) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>

                <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                  <p class="primary--text text-right mt-6 mr-2">
                    Amount sent/receipt :
                    {{ getAmount(transaction).toUpperCase() }} /
                    {{ getAmountReceipt(transaction).toUpperCase() }}
                    <br />
                  </p>
                </v-col>
              </v-row>

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
                      <v-card-subtitle> {{ transaction.to }} </v-card-subtitle>
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
                      <v-card-subtitle> Reference </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{ transaction.reference }}
                      </v-card-title>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                    <v-card flat tile>
                      <v-card-subtitle> Transfer Fee </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{ transaction.fee }}
                        {{ transaction.tokenSymbol.toUpperCase() }}
                      </v-card-title>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                    <v-card flat tile>
                      <v-card-subtitle> Block Number </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        Pending
                      </v-card-title>
                    </v-card>
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                    class="text-right"
                  >
                    <v-btn
                      :href="`${detailUrl}${transaction.hash}`"
                      target="_blank"
                      color="secondary"
                      outlined
                      class="mt-7"
                      >Tracking URL</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
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
import {
  AddressBookInterface,
  Fetcher,
  TransactionInterface,
} from "@/store/fetcher";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";
import CryptoJS from "crypto-js";
import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";
import { TransactionConfig } from "web3-core";
import Bignumber from "bignumber.js";
import { shleemy } from "shleemy";

const EventSource = NativeEventSource || EventSourcePolyfill;
// OR: may also need to set as global property
global.EventSource = NativeEventSource || EventSourcePolyfill;
@Component({ name: "SendMoney", components: { ProfileMenu, SelectAmount } })
export default class SendMoney extends Vue {
  @Prop({ type: Number }) readonly step!: number;
  @Prop({ type: Object }) readonly currentSelected!: BalanceInterface;
  componentKey = 0;
  get selectedEthereumAddress(): string {
    return window.ethereum.selectedAddress;
  }

  goToHome(): void {
    this.$router.push(`/`);
    location.reload();
  }
  @Watch("e1")
  watche1(value: number): void {
    console.log("valuee1", value);
    if (value === 4) {
      this.componentKey += 1;
      this.isReview = true;
    }
  }
  async nextSendFrom(coin: BalanceInterface): Promise<void> {
    if (coin.currency?.allowance) {
      this.selectedCurrency = coin;
      this.e1 = 2;
    } else {
      // await this.$store.dispatch("approve", coin);
    }
  }

  approveLoading(coin: BalanceInterface): boolean {
    if (this.currentlyApproved && coin.value === this.currentlyApproved.value) {
      return true;
    }
    return false;
  }

  currentlyApproved: BalanceInterface | "" = "";

  approveLoadingStatus = false;
  async approve(coin: BalanceInterface): Promise<void> {
    try {
      if (!coin.currency?.allowancePending) {
        this.approveLoadingStatus = true;
        this.currentlyApproved = coin;
        await this.$store.dispatch("approve", coin);
        await this.$store.dispatch("updateCoinBalance", coin);
        this.approveLoadingStatus = false;
      }
    } catch (e) {
      this.approveLoadingStatus = false;
    }
  }
  isReview = false;
  addARecipientEmail = "";
  addARecipientWalletAddress = "";
  addARecipientName = "";
  createWalletLoading = false;
  selectedAddress: AddressBookInterface | "" = "";
  newSubmittedAddressBook: AddressBookInterface | "" = "";
  newAddressBookSubmitted = false;
  selectedCurrency: BalanceInterface | "" = "";
  selectedRecipientToken = this.selectedCurrency
    ? this.selectedCurrency.value
    : "usdt";

  reference = "";

  @Watch("selectedCurrency")
  watchselectedCurrency(value: BalanceInterface): void {
    if (value) {
      this.selectedRecipientToken = value.value;
    }
  }

  params: TransactionConfig | "" = "";
  gasFee = "0";
  setGasFee(value: string): void {
    if (value) {
      this.gasFee = value;
    }
  }

  allowance = false;
  setAllowance(value: boolean): void {
    this.allowance = value;
  }

  setParams(value: TransactionConfig): void {
    if (value) {
      this.params = value;
    }
  }

  transferFee = "";
  setTransferFee(value: string): void {
    if (value) {
      this.transferFee = value;
    }
  }
  loadingSendMoney = false;
  async sendMoney(): Promise<void> {
    try {
      this.loadingSendMoney = true;
      if (this.params) {
        const web3 = this.$store.getters["getWeb3"] as Web3;
        const ethBalanceInWei = await web3.eth.getBalance(
          window.ethereum.selectedAddress
        );
        const ethBalanceInEther = web3.utils.fromWei(ethBalanceInWei, "ether");
        if (new Bignumber(ethBalanceInEther).isLessThan(this.gasFee)) {
          alert(
            `You do not have enough ETH for gas fee. Your current ETH balance is ${ethBalanceInEther}`
          );
        } else {
          await new Promise((resolve, reject) => {
            if (this.params) {
              web3.eth
                .sendTransaction(this.params)
                .on("transactionHash", async (hash) => {
                  console.log("hash", hash);
                  if (this.params) {
                    console.log("this.params.value", this.params.value);
                    this.transaction = await this.$store.dispatch("newTrx", {
                      hash,
                      isToken: this.params.value === "0x0",
                      fee: this.transferFee,
                      reference: this.reference,
                    });
                    console.log("this.transaction", this.transaction);
                  }
                  resolve(true);
                })
                .on("error", (e) => {
                  reject(false);
                });
            } else {
              resolve(true);
            }
          });
          this.e1 = 5;
          this.loadingSendMoney = false;
        }
      }
      this.loadingSendMoney = false;
    } catch (e) {
      this.loadingSendMoney = false;
    }
  }

  setSelectedRecipientToken(value: string): void {
    this.selectedRecipientToken = value;
  }

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
            signature = await new Promise((resolve) => {
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
          const addressBookData = await this.$store.dispatch("createWallet", {
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
          this.newAddressBookSubmitted = true;
          if (!this.addARecipientWalletAddress) {
            this.checkSubmittedAddresBook(addressBookData.id);
            alert(
              "Recipient has been successfully added. The account holder will be notified by email to add the address"
            );
          } else {
            this.newSubmittedAddressBook = addressBookData;
            alert("Recipient has been successfully added");
          }
          this.addARecipientName = "";
          this.addARecipientWalletAddress = "";
          // this.selectedCurrency = "";
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

  async checkSubmittedAddresBook(id: string): Promise<void> {
    const token = Vue.$cookies.get("cryptozen_token");
    const addressBookData = await Fetcher.getSubmittedAddressBook(token, id);
    console.log("addressBookData", addressBookData);
    if (addressBookData) {
      this.newSubmittedAddressBook = addressBookData;
    } else {
      await sleep(30000);
      await this.checkSubmittedAddresBook(id);
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
    console.log("this.currentSelected", this.currentSelected);
    if (this.step) this.e1 = this.step;
    if (this.currentSelected) this.selectedCurrency = this.currentSelected;
  }

  e1 = 1;
  coinSelected = "";
  closeDialog(): void {
    // this.$emit("update-dialog", false);
    // this.e1 = 1;
    location.reload();
  }
  detailUrl = process.env.VUE_APP_DETAIL_URL;
  coins = Balances;

  swapAmount = 0;
  setSwapAmount(value: number): void {
    this.swapAmount = Number(value);
  }
  transaction: TransactionInterface | "" = "";
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

  getAmountReceipt(transaction: TransactionInterface): string {
    if (transaction.isToken) {
      return `${(
        (Number(transaction.value) - Number(transaction.fee)) /
        10 ** Number(transaction.tokenDecimal)
      ).toString()} ${transaction.tokenName}`;
    } else {
      const web3 = this.$store.getters["getWeb3"] as Web3;
      return `${
        Number(web3.utils.fromWei(transaction.value, "ether")) -
        Number(transaction.fee)
      } ETH`;
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

  getFee(transaction: TransactionInterface): string {
    return "";
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
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
