<template>
  <div>
  
  <v-card flat v-if="!pageLoading">
    <v-app-bar app color="white" flat class="alert-toolbar">
      <v-app-bar flat dence class="blue-grey lighten-5" height="30" top="100">
        <v-spacer></v-spacer>
        <v-subheader class="text-center"
          >Alpha version! use at your own risk</v-subheader
        >
        <v-spacer></v-spacer>
      </v-app-bar>
    </v-app-bar>
    <v-stepper v-model="e1" class="elevation-0">
      <!-- <v-toolbar dark color="white"> -->
      <v-stepper-header class="stepper-header">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-img
          v-if="!isMobile"
          class="ma-5 hover-pointer"
          max-height="60"
          max-width="130"
          src="../assets/logo2.svg"
          @click="goToHome()"
        ></v-img>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-stepper-step
          @click="isReview ? (e1 = 1) : ''"
          :complete="e1 > 1"
          step="1"
        >
          <a :class="isReview ? `text-decoration-underline` : ``"> Wallet</a>
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          @click="isReview ? (e1 = 2) : ''"
          :complete="e1 > 2"
          step="2"
        >
          <a :class="isReview ? `text-decoration-underline` : ``"> Recipient</a>
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          @click="isReview ? (e1 = 3) : ''"
          :complete="e1 > 3"
          step="3"
        >
          <a :class="isReview ? `text-decoration-underline` : ``"> Amount</a>
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          @click="isReview ? (e1 = 4) : ''"
          step="4"
          :complete="e1 > 4"
        >
          <a :class="isReview ? `text-decoration-underline` : ``"> Review</a>
        </v-stepper-step>
        <v-spacer></v-spacer>

        <ProfileMenu
          :classTop="'aa'"
          :showBell="false"
          v-if="!isMobile"
        ></ProfileMenu>
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
            <v-card flat :loading="approveLoadingStatus">
              <p class="text-center primary--text text-h5 mt-2">
                Where do you want to send from ?
              </p>
              <p
                class="text-center primary--text mt-2"
                v-if="approveLoadingStatus"
              >
                Approving, please wait ...
              </p>

              <v-card flat>
                <v-card-text>Select balance</v-card-text>
              </v-card>

              <v-card
                v-for="coin in balances"
                :key="coin.value"
                elevation="2"
                class="mx-auto mt-2"
                height="100"
                width="700"
                @click="nextSendFrom(coin)"
              >
                <v-card-text>
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-img
                        v-if="!coin.logo"
                        :src="require(`../assets/${coin.value}.svg`)"
                      ></v-img>
                      <v-img v-else :src="coin.logo"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        class="primary--text text-subtitle-1"
                        >{{ getCoinCurrency(coin).balance }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="">{{
                        coin.name
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-spacer v-if="!isMobile"></v-spacer>
                    <v-list-item-content>
                      <!--                      {{ getCoinCurrency(coin).allowance }}-->
                      <v-icon v-if="getCoinCurrency(coin).allowance"
                        >mdi-chevron-right</v-icon
                      >
                      <v-btn
                      v-else
                      :disabled="approveLoadingStatus"
                      color="primary"
                      small
                      @click="approve(coin)"
                      >{{ isMobile ? "Approve" : "ENABLE SENDING" }}</v-btn
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
              <p class="text-center primary--text text-h5 mt-2">
                Who are you sending money to?
              </p>
               <div class="text-center ma-2">
                <v-snackbar
                  color="primary"
                  v-model="snackbar"
                >
                  {{ text }}

                  <template v-slot:action="{ attrs }">
                    <v-btn
                      color="white"
                      text
                      v-bind="attrs"
                      @click="snackbar = false"
                    >
                      Close
                    </v-btn>
                  </template>
                </v-snackbar>
              </div>
              <v-card flat>
                <v-card-text>Select Recipient</v-card-text>
              </v-card>
              <v-card flat class="mx-auto" width="700">
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
                              <v-list-item-avatar>
                                <v-img
                                  :src="
                                    getAddressBookIconById(
                                      addressBook.token_list_id
                                    )
                                  "
                                ></v-img>
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

                              <v-avatar class="mr-2" size="30">
                                <v-img :src="getChainIdIcon(addressBook)"></v-img>
                              </v-avatar>

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
                          </v-card>
                        </v-container>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

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
                            <v-radio-group v-model="newRecipientType" row>
                              <v-radio
                                label="Wallet Address"
                                value="address"
                              ></v-radio>
                              <v-radio
                                label="E-Mail Address"
                                value="email"
                              ></v-radio>
                            </v-radio-group>
                            <v-text-field
                              v-if="newRecipientType === 'email'"
                              v-model="addARecipientEmail"
                              label="Account Holder email address"
                            ></v-text-field>
                            <v-text-field
                              v-if="newRecipientType === 'address'"
                              v-model="addARecipientWalletAddress"
                              label="Wallet Address"
                            ></v-text-field>
                          </v-container>

                          <v-card-actions>
                            <v-spacer></v-spacer>

                            <!--                            <v-btn-->
                            <!--                              color="secondary"-->
                            <!--                              outlined-->
                            <!--                              @click="addARecipient = false"-->
                            <!--                            >-->
                            <!--                              Cancel-->
                            <!--                            </v-btn>-->

                            <v-btn
                              color="secondary"
                              @click="createRecipient();"
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
                              <v-avatar color="">
                                <v-img
                                  :src="
                                    getAddressBookIconById(
                                      newSubmittedAddressBook.token_list_id
                                    )
                                  "
                                ></v-img>
                              </v-avatar>
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
            <v-card flat>
              <v-card v-if="selectedCurrency" flat width="600">
                <v-card flat>
                  <v-card v-if="selectedCurrency" flat width="600">
                    <v-text-field
                      :key="componentKey"
                      height=""
                      class="text-h5 rounded-0"
                      color="primary"
                      outlined
                      :max="getCoinCurrency(selectedCurrency).balance"
                      v-model="swapAmount"
                      :hint="hint"
                      persistent-hint
                      type="number"
                      :step="0.01"
                    >
                      <template v-slot:append>
                        <v-list-item class="mt-n4">
                          <v-list-item-avatar tile>
                            <v-img
                              :src="getAddressBookIconById(selectedCurrency.id)"
                            ></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              class="primary--text text-subtitle-1"
                              >{{
                                selectedCurrency.value === "eth"
                                  ? "Ethereum"
                                  : selectedCurrency.value.toUpperCase()
                              }}</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </template>

                      <template v-slot:label>
                        {{ label }} ${{ amountSendUsd }}
                      </template>

                      <template v-slot:message="{ message }">
                        <p v-if="getCoinCurrency(selectedCurrency)">
                          You have
                          <a
                            class="primary--text font-weight-bold"
                            @click="
                              swapAmount = getCoinCurrency(selectedCurrency)
                                .balance
                            "
                            >{{ getCoinCurrency(selectedCurrency).balance }}</a
                          >
                        </p>
                        <p v-else>{{ message }}</p>
                      </template>
                    </v-text-field>

                    <v-list-item class="mt-n5">
                      <v-divider
                        class="mr-2 mb-4 bala"
                        elevation="10"
                        vertical
                        inset
                      ></v-divider>

                      <v-list-item-content>
                        <v-row no-gutters dense>
                          <v-col cols="12">
                            <v-list-item-subtitle
                              class="secondary--text text-subtitle-2 text-left mb-1"
                              ><a
                                v-if="!loadingFee"
                                class="primary--text text-subtitle-2"
                                >-{{ gasFee }} {{ mainCurrency }} ({{
                                  convertToUsd(gasFee)
                                }}
                                USD)</a
                              >
                              <v-progress-circular
                                v-else
                                indeterminate
                                color="primary"
                                size="15"
                              >
                              </v-progress-circular>
                              Gas fee (estimated)</v-list-item-subtitle
                            >
                            <v-list-item-subtitle
                              class="secondary--text text-subtitle-2 text-left mb-1"
                              ><a
                                v-if="!loadingFee"
                                class="primary--text text-subtitle-2"
                                >-{{ transferFee }}
                                {{ selectedCurrency.value.toUpperCase() }} ({{
                                  transferFeeOnUsd
                                }}
                                USD)</a
                              >
                              <v-progress-circular
                                v-else
                                indeterminate
                                color="primary"
                                size="15"
                              >
                              </v-progress-circular>
                              Platform fee (Tier
                              {{ tier }})</v-list-item-subtitle
                            >
                            <v-divider class="mb-1"></v-divider>
                            <v-list-item-subtitle
                              class="secondary--text text-subtitle-2 text-left mb-1"
                              ><a
                                v-if="!loadingFee"
                                class="primary--text text-subtitle-2"
                                >{{
                                  (
                                    Number(convertToUsd(gasFee)) +
                                    Number(transferFeeOnUsd)
                                  ).toFixed(5)
                                }}
                                USD</a
                              >
                              <v-progress-circular
                                v-else
                                indeterminate
                                color="primary"
                                size="15"
                              >
                              </v-progress-circular>
                              Total Fee</v-list-item-subtitle
                            >
                          </v-col>
                        </v-row>
                        <v-divider class="mb-3 bala"></v-divider>
                        <v-row>
                          <v-col sm class="" cols="12">
                            <v-list-item-subtitle
                              class="secondary--text text-subtitle-2 text-left mb-1"
                              ><a
                                v-if="!loadingFee"
                                class="primary--text text-subtitle-2"
                                >+{{ transactionReward }} Ninja Token (
                                {{ transactionRewardInUsd }} USD)</a
                              >
                              <v-progress-circular
                                v-else
                                indeterminate
                                color="primary"
                                size="15"
                              >
                              </v-progress-circular>
                              Platform Reward (estimated)</v-list-item-subtitle
                            >

                            <!--                        <v-spacer></v-spacer>-->
                            <v-divider></v-divider>
                            <v-list-item-subtitle
                              class="secondary--text text-subtitle-2 text-left mb-1"
                              ><a
                                v-if="!loadingFee"
                                class="primary--text text-subtitle-2"
                              >
                                {{ transactionRewardInUsd }} USD</a
                              >
                              <v-progress-circular
                                v-else
                                indeterminate
                                color="primary"
                                size="15"
                              >
                              </v-progress-circular>
                              Total Mining Rewards</v-list-item-subtitle
                            >
                          </v-col>
                        </v-row>
                        <!--                        <v-divider class="mb-3 bala"></v-divider>-->
                      </v-list-item-content>
                    </v-list-item>
                    <v-row no-gutters>
                      <v-col :cols="isMobile ? 6 : 8">
                        <v-text-field
                          :key="componentKey"
                          class="text-h5 rounded-0 recipient-gets-input"
                          color="primary"
                          label="Recipient gets"
                          outlined
                          v-model="recipientGets"
                          type="number"
                          :step="0.01"
                          flat
                          height="50"
                        >
                          <!-- <template v-slot:append-outer>

                    </template> -->

                          <template v-slot:label>
                            <p class="mb-5">
                              Recipient gets ${{ amountReceiptUsd }}
                            </p>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col :cols="isMobile ? 6 : 4">
                        <v-select
                          color="primary"
                          :items="coins"
                          item-text="name"
                          item-value="value"
                          outlined
                          v-model="selectedRecipientTokenModel"
                          class="rounded-0 coin-list"
                          height="50"
                        >
                          <template v-slot:item="{ item, on, attrs }">
                            <v-list-item
                              :disabled="selectedCurrency.value !== item.value"
                              :to="
                                selectedCurrency.value !== item.value
                                  ? 'https://google.com'
                                  : undefined
                              "
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-list-item-avatar tile>
                                <v-img
                                  :src="getAddressBookIconById(item.id)"
                                ></v-img>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="primary--text text-subtitle-1"
                                  >{{ item.name
                                  }}{{
                                    selectedCurrency.value !== item.value
                                      ? `(Swap Coming Soon)`
                                      : ``
                                  }}</v-list-item-title
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </template>

                          <template v-slot:selection="{ item }">
                            <v-list-item style="padding: 0 0px !important">
                              <v-list-item-avatar tile class="">
                                <v-img
                                  :src="getAddressBookIconById(item.id)"
                                ></v-img>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="primary--text text-subtitle-1"
                                  >{{
                                    item.value.toUpperCase()
                                  }}</v-list-item-title
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>

                    <!--  -->
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" outlined @click="e1 = 2">
                        Back
                      </v-btn>
                      <v-btn
                        color="primary"
                        :disabled="loadingFee"
                        @click="e1 = 4"
                      >
                        {{ continueLabel }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card>
              </v-card>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <p class="text-center primary--text text-h5">Review</p>

          <v-card flat class="d-flex justify-center">
            <v-card flat width="600">
              <v-card flat>
                <v-card v-if="selectedCurrency" flat width="600">
                  <v-text-field
                    :key="componentKey"
                    height=""
                    class="text-h5 rounded-0"
                    color="primary"
                    outlined
                    :max="getCoinCurrency(selectedCurrency).balance"
                    v-model="swapAmount"
                    :hint="hint"
                    persistent-hint
                    type="number"
                    :step="0.01"
                  >
                    <template v-slot:append>
                      <v-list-item class="mt-n4">
                        <v-list-item-avatar tile>
                          <v-img
                            :src="getAddressBookIconById(selectedCurrency.id)"
                          ></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="primary--text text-subtitle-1"
                            >{{
                              selectedCurrency.value === "eth"
                                ? "Ethereum"
                                : selectedCurrency.value.toUpperCase()
                            }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </template>

                    <template v-slot:label>
                      {{ label }} ${{ amountSendUsd }}
                    </template>

                    <template v-slot:message="{ message }">
                      <p v-if="selectedCurrency.currency">
                        You have
                        <a
                          class="primary--text font-weight-bold"
                          @click="
                            swapAmount = getCoinCurrency(selectedCurrency)
                              .balance
                          "
                          >{{ getCoinCurrency(selectedCurrency).balance }}</a
                        >
                      </p>
                      <p v-else>{{ message }}</p>
                    </template>
                  </v-text-field>

                  <v-list-item class="mt-n5">
                    <v-divider
                      class="mr-2 mb-4 bala"
                      elevation="10"
                      vertical
                      inset
                    ></v-divider>

                    <v-list-item-content>
                      <v-row no-gutters dense>
                        <v-col cols="12">
                          <v-list-item-subtitle
                            class="secondary--text text-subtitle-2 text-left mb-1"
                            ><a
                              v-if="!loadingFee"
                              class="primary--text text-subtitle-2"
                              >-{{ gasFee }} {{ mainCurrency }} ({{
                                convertToUsd(gasFee)
                              }}
                              USD)</a
                            >
                            <v-progress-circular
                              v-else
                              indeterminate
                              color="primary"
                              size="15"
                            >
                            </v-progress-circular>
                            Gas fee (estimated)</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            class="secondary--text text-subtitle-2 text-left mb-1"
                            ><a
                              v-if="!loadingFee"
                              class="primary--text text-subtitle-2"
                              >-{{ transferFee }}
                              {{ selectedCurrency.value.toUpperCase() }} ({{
                                transferFeeOnUsd
                              }}
                              USD)</a
                            >
                            <v-progress-circular
                              v-else
                              indeterminate
                              color="primary"
                              size="15"
                            >
                            </v-progress-circular>
                            Platform fee (Tier {{ tier }})</v-list-item-subtitle
                          >
                          <v-divider class="mb-1"></v-divider>
                          <v-list-item-subtitle
                            class="secondary--text text-subtitle-2 text-left mb-1"
                            ><a
                              v-if="!loadingFee"
                              class="primary--text text-subtitle-2"
                              >{{
                                Number(convertToUsd(gasFee)) +
                                Number(transferFeeOnUsd)
                              }}
                              USD</a
                            >
                            <v-progress-circular
                              v-else
                              indeterminate
                              color="primary"
                              size="15"
                            >
                            </v-progress-circular>
                            Total Fee</v-list-item-subtitle
                          >
                        </v-col>
                      </v-row>
                      <v-divider class="mb-3 bala"></v-divider>
                      <v-row>
                        <v-col sm class="" cols="12">
                          <v-list-item-subtitle
                            class="secondary--text text-subtitle-2 text-left mb-1"
                            ><a
                              v-if="!loadingFee"
                              class="primary--text text-subtitle-2"
                              >+{{ transactionReward }} Ninja Token (
                              {{ transactionRewardInUsd }} USD)</a
                            >
                            <v-progress-circular
                              v-else
                              indeterminate
                              color="primary"
                              size="15"
                            >
                            </v-progress-circular>
                            Platform Reward (estimated)</v-list-item-subtitle
                          >

                          <!--                        <v-spacer></v-spacer>-->
                          <v-divider></v-divider>
                          <v-list-item-subtitle
                            class="secondary--text text-subtitle-2 text-left mb-1"
                            ><a
                              v-if="!loadingFee"
                              class="primary--text text-subtitle-2"
                            >
                              {{ transactionRewardInUsd }} USD</a
                            >
                            <v-progress-circular
                              v-else
                              indeterminate
                              color="primary"
                              size="15"
                            >
                            </v-progress-circular>
                            Total Mining Rewards</v-list-item-subtitle
                          >
                        </v-col>
                      </v-row>
                      <!--                      <v-divider class="mb-3 bala"></v-divider>-->
                    </v-list-item-content>
                  </v-list-item>
                  <v-row no-gutters>
                    <v-col :cols="isMobile ? 6 : 8">
                      <v-text-field
                        :key="componentKey"
                        class="text-h5 rounded-0 recipient-gets-input"
                        color="primary"
                        label="Recipient gets"
                        outlined
                        v-model="recipientGets"
                        type="number"
                        :step="0.01"
                        flat
                        height="50"
                      >
                        <!-- <template v-slot:append-outer>

                  </template> -->

                        <template v-slot:label>
                          <p class="mb-5">
                            Recipient gets ${{ amountReceiptUsd }}
                          </p>
                        </template>
                      </v-text-field>
                    </v-col>

                    <v-col :cols="isMobile ? 6 : 4">
                      <v-select
                        color="primary"
                        :items="coins"
                        item-text="name"
                        item-value="value"
                        outlined
                        v-model="selectedRecipientTokenModel"
                        class="rounded-0"
                        height="50"
                      >
                        <template v-slot:item="{ item, on, attrs }">
                          <v-list-item
                            :disabled="selectedCurrency.value !== item.value"
                            v-bind="attrs"
                            v-on="on"
                            style="padding: 0 0px !important"
                          >
                            <v-list-item-avatar tile>
                              <v-img
                                :src="getAddressBookIconById(item.id)"
                              ></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                class="primary--text text-subtitle-1"
                                >{{ item.name
                                }}{{
                                  selectedCurrency.value !== item.value
                                    ? `(Swap Coming Soon)`
                                    : ``
                                }}</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                        </template>

                        <template v-slot:selection="{ item }">
                          <v-list-item style="padding: 0 0px !important">
                            <v-list-item-avatar tile>
                              <v-img
                                :src="getAddressBookIconById(item.id)"
                              ></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                class="primary--text text-subtitle-1"
                                >{{
                                  item.value.toUpperCase()
                                }}</v-list-item-title
                              >
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>

                  <!--  -->
                  <!--                  <v-card-actions>-->
                  <!--                    <v-spacer></v-spacer>-->
                  <!--                    <v-btn color="primary" outlined @click="e1 = 2"> Back </v-btn>-->
                  <!--                    <v-btn color="primary" :disabled="loadingFee" @click="e1 = 4">-->
                  <!--                      {{ continueLabel }}-->
                  <!--                    </v-btn>-->
                  <!--                  </v-card-actions>-->
                </v-card>
              </v-card>
              <p>To</p>
              <v-card class="mb-2" v-if="selectedAddress">
                <v-list-item class="">
                  <v-list-item-avatar>
                    <v-img
                      :src="getAddressBookIconById(selectedCurrency.id)"
                    ></v-img>
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

              <v-card class="mb-2" v-if="addressByEmail">
                <v-list-item class="">
                  <v-list-item-avatar size="60">
                    <v-avatar color="main"></v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="primary--text ma-2"
                      >Email : {{ addARecipientEmail }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-card>

              <v-card flat class="mt-8">
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
          <p v-if="transaction" class="text-center primary--text text-h5">
            {{
              transaction.isOnHold
                ? "Awaiting Recipient Wallet Address"
                : "Pending"
            }}
          </p>
          <p class="text-center primary--text">
            We will notify you once the transaction is confirmed
          </p>

          <v-card v-if="transaction" flat class="d-flex justify-center">
            <v-card class="mb-2" :max-width="isMobile ? '100%' : 1100">
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
                        {{ transaction.from }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ getStatus(transaction) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>

                <v-col
                  v-if="!transaction.isOnHold"
                  cols="12"
                  md="6"
                  sm="6"
                  lg="6"
                  xl="6"
                >
                  <p
                    v-if="!transaction.isOnHold"
                    class="primary--text text-right mt-6 mr-2"
                  >
                    Amount Sent :
                    {{ getAmount(transaction).toUpperCase() }}
                  </p>
                  <p class="primary--text text-right mt-6 mr-2">
                    Amount Receipt :
                    {{ getAmountReceipt(transaction).toUpperCase() }}
                  </p>
                </v-col>

                <v-col v-else cols="12" md="6" sm="6" lg="6" xl="6">
                  <p class="primary--text text-right mt-6 mr-2">
                    Amount :
                    {{ getAmount(transaction).toUpperCase() }}
                  </p>
                </v-col>
              </v-row>

              <v-divider></v-divider>
              <v-container>
                <v-row class="mt-n1">
                  <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                    <v-card flat tile>
                      <v-card-subtitle> Set Up By </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{ getWalletName(transaction.from) }}
                      </v-card-title>
                    </v-card>
                  </v-col>
                  <v-col
                    v-if="!transaction.isOnHold"
                    cols="12"
                    md="6"
                    sm="6"
                    lg="6"
                    xl="6"
                  >
                    <v-card flat tile>
                      <v-card-subtitle> Rewards </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{ transactionReward }} Ninja Token ({{
                          transactionRewardInUsd
                        }}
                        USD) (estimated)
                      </v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col
                    v-if="!transaction.isOnHold"
                    cols="12"
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                  >
                    <v-card flat tile>
                      <v-card-subtitle> To </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{ getWalletName(transaction.to) }}
                      </v-card-title>
                      <v-card-subtitle> {{ transaction.to }} </v-card-subtitle>
                    </v-card>
                  </v-col>
                  <v-col v-else cols="12">
                    <v-card flat tile>
                      <v-card-subtitle> To </v-card-subtitle>
                      <v-card-title class="primary--text mt-n8">
                        {{
                          addARecipientName
                            ? addARecipientName
                            : addARecipientEmail
                        }}
                      </v-card-title>
                      <v-card-subtitle>
                        {{ addARecipientEmail }}
                      </v-card-subtitle>
                    </v-card>
                  </v-col>

                  <v-col
                    v-if="!transaction.isOnHold"
                    cols="12"
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                  >
                    <v-card flat tile>
                      <v-card-subtitle> TX Hash </v-card-subtitle>
                      <v-card-subtitle class="primary--text mt-n8">
                        {{ transaction.hash }}
                      </v-card-subtitle>
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

                  <v-col
                    v-if="!transaction.isOnHold"
                    cols="12"
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                  >
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
                        {{ transaction.isOnHold ? "On Hold" : "Pending" }}
                      </v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
                <v-card-actions v-if="!transaction.isOnHold">
                  <v-spacer></v-spacer>

                  <v-btn
                    :href="`${getTxDetailUrl(transaction.hash)}`"
                    target="_blank"
                    color="secondary"
                    outlined
                    class="mt-7"
                    >Tracking URL</v-btn
                  >
                </v-card-actions>
              </v-container>
            </v-card>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
  <v-card v-else :loading="true">
    <v-card-text>Please connect with Metamask</v-card-text>
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
            label="Nickname"
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ProfileMenu from "./shared/ProfileMenu.vue";
import SelectAmount from "./shared/SelectAmount.vue";
import balances, {
  BalanceInterface,
  CRYPTOZEN_CONTRACTS,
  NETWORKS_LIST,
} from "../static/balance";
import {
  AddressBookInterface,
  Fetcher,
  TransactionInterface,
} from "@/store/fetcher";
import Web3 from "web3";
import { AbstractProvider, TransactionConfig } from "web3-core";
import CryptoJS from "crypto-js";
// import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import Bignumber from "bignumber.js";
import BigNumber from "bignumber.js";
import { shleemy } from "shleemy";
// import cryptozen_contract from "../static/cryptozen_contract";
// import erc20abi from "../../static/erc20abi";
import fromExponential from "from-exponential";
import cryptozenabi from "../static/cryptozenabi";
// import {
//   Fetcher as UniswapFetcher,
//   Percent,
//   Route,
//   Token,
//   TokenAmount,
//   Trade,
//   TradeType,
//   WETH,
// } from "@uniswap/sdk";
// import CryptozenSdk from "../library/cryptozen-sdk";
import { providers } from "ethers";
import axios from "axios";
import CurrencyModel from "@/models/CurrencyModel";
import { CoingeckoInterface } from "@/interfaces";
import CryptozenSdk from "@/library/cryptozen-sdk";
import { storeInterface } from "@/store";
import { Contract } from "web3-eth-contract";
import uniswap_v2_abi from "@/static/uniswap-v2-abi";
// const EventSource = NativeEventSource || EventSourcePolyfill;
// // OR: may also need to set as global property
// global.EventSource = NativeEventSource || EventSourcePolyfill;
@Component({ name: "SendMoney", components: { ProfileMenu, SelectAmount } })
export default class SendMoney extends Vue {
  @Prop({ type: Number }) readonly step!: number;
  @Prop({ type: Object }) readonly currentSelected!: BalanceInterface;
  @Prop({ type: Object }) readonly setAddressSelected!: AddressBookInterface;
  @Prop({ type: Number }) readonly setAmount!: number;
  @Prop({ type: Object }) readonly setTransaction!: TransactionInterface;
  componentKey = 0;
  newRecipientType = "address";
  e1 = 1;
  coinSelected = "";
  currentlyApproved: BalanceInterface | "" = "";
  approveLoadingStatus = false;
  isReview = false;
  addARecipientEmail = "";
  addARecipientWalletAddress = "";
  addARecipientName = "";
  createWalletLoading = false;
  addWalletId = -1;
  selectedAddress: AddressBookInterface | "" = "";
  newSubmittedAddressBook: AddressBookInterface | "" = "";
  newAddressBookSubmitted = false;
  selectedCurrency: BalanceInterface | "" = "";
  selectedRecipientToken = this.selectedCurrency
    ? this.selectedCurrency.value
    : "usdt";
  reference = "";
  params: TransactionConfig | "" = "";
  gasFee = "0";
  loadingSendMoney = false;
  allowance = false;
  transferFee = "";
  loadingAddressBooks = false;
  detailUrl = process.env.VUE_APP_DETAIL_URL;
  // coins = Balances;
  swapAmount = 0;
  amountSendUsd = "0";
  amountReceiptUsd = "0";
  transferFeeOnUsd = "0";
  // gasFee = "0";
  platformFee = "0";
  platformFeeOnUsd = "";
  loadingFee = false;
  recipientGets = 0;
  // params: TransactionConfig | "" = "";

  selectedRecipientTokenModel = this.selectedRecipientToken;
  updatingAmount = false;
  transaction: TransactionInterface | "" = "";
  gas = 0;
  gasPrice = "0";
  // @Watch("transferFee")
  // async watchPlatformFee(value : string) : void{
  //   if(value !== "0"){

  //   }
  // }

  continueLabel = "Continue";

  // coins = balances;
  // swapAmount = 0;
  label = "You send";
  hint = `you have ${
    this.getBalanceCurrency ? this.getBalanceCurrency.balance : "0"
  }`;

  ethereumPrice: CoingeckoInterface | "" = "";
  transactionRewardInUsd = "0";
  transactionReward = "0";
  transactionRewardInEth = "0";
  pageLoading = true;
  addressByEmail = false;
  WETH = "";
  uniswapRouterAddress = "";
  
  snackbar = false;
  text = ``;
  editWallet = false;
  editWalletLoading = false;
  editAWalletCurrency = "";
  editAWalletAddress = "";
  editAWalletName = "";
  editWalletId = "";

  deleteWalletId = "";

  get currency(): BalanceInterface[] {
    return this.$store.state.balances;
  }
  
  get coins(): BalanceInterface[] {
    return this.balances;
  }

  get getBalanceCurrency(): CurrencyModel | undefined {
    if (this.selectedCurrency && this.selectedCurrency.currency) {
      console.log(
        "this.$store.state.networkName",
        this.$store.state.networkName
      );
      return this.selectedCurrency.currency.find(
        (c) =>
          c.network.toLowerCase() ===
            this.$store.state.networkName.toLowerCase() &&
          c.address.toLowerCase() ===
            this.$store.state.selectedAddress.toLowerCase()
      );
    }
    return undefined;
  }

  get balances(): BalanceInterface[] {
    let balances = this.$store.state.balances as BalanceInterface[];
    balances = balances.map((item)=>{
      if(item.name == "Binance"){
        item.name = "BNB";
        return item;
      }
      return item;
    })
    return balances.filter((b) =>
      b.network.find(
        (n) => n.toLowerCase() === this.$store.state.networkName.toLowerCase()
      )
    );
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }

  @Watch("transactionRewardInEth")
  async watchTransactionRewardInEth(value: string): Promise<void> {
    if (value !== "0") {
      this.transactionRewardInUsd = this.convertToUsd(value);
    }
  }

  // @Watch("setSwapAmount")
  // watchSetSwapAmount(value: number): void {
  //   this.swapAmount = value;
  // }
  //
  // @Watch("swapAmount")
  // watchSwapAmount(value: number): void {
  //   this.$emit("swap-amount", value);
  // }

  @Watch("e1")
  watchE1(value: number): void {
    if (value === 4) {
      this.componentKey += 1;
      this.isReview = true;
    }
  }

  @Watch("selectedCurrency")
  watchSelectedCurrency(value: BalanceInterface): void {
    if (value) {
      this.selectedRecipientToken = value.value;
    }
  }

  @Watch("selectedCurrencySync")
  watchSelectedCurrencySync(value: BalanceInterface): void {
    this.selectedCurrency = value;
  }

  @Watch("step")
  watchStep(value: number): void {
    this.e1 = value;
  }

  processWatchSwapAmount = false;

  @Watch("swapAmount")
  async watchSwapAmount(value: number): Promise<void> {
    if (!this.processWatchSwapAmount) {
      this.processWatchSwapAmount = true;
      if (!this.updatingAmount && this.selectedCurrency) {
        console.log("value", value);
        this.updatingAmount = true;
        console.log("this.getBalanceCurrency", this.getBalanceCurrency);
        if (value <= Number(this.getBalanceCurrency?.balance)) {
          await this.UpdateRecipientGetsAmount(value);
        } else {
          alert(`Value input is higher than your balance`);
          this.swapAmount = Number(this.getBalanceCurrency?.balance);
        }

        this.updatingAmount = false;
      }
      this.processWatchSwapAmount = false;
    } else {
      await sleep(500);
      await this.watchSwapAmount(value);
    }
  }

  processWatchRecipietGets = false;
  @Watch("recipientGets")
  async watchRecipientGets(value: number): Promise<void> {
    if (!this.processWatchRecipietGets) {
      if (!this.updatingAmount && this.selectedCurrency) {
        this.updatingAmount = true;
        if (value <= Number(this.getBalanceCurrency?.balance)) {
          await this.UpdateSwapAmount(value);
          if (this.swapAmount >= Number(this.getBalanceCurrency?.balance)) {
            alert(`Value input is higher than your balance`);
            this.swapAmount = Number(this.getBalanceCurrency?.balance);
          }
        } else {
          alert(`Value input is higher than your balance`);
          this.recipientGets = Number(0);
        }
        this.updatingAmount = false;
      }
      this.processWatchRecipietGets = false;
    } else {
      await sleep(500);
      await this.watchRecipientGets(value);
    }
  }

  @Watch("transferFee")
  watchtransferFee(value: string): void {
    if (value) {
      this.$emit("transfer-fee", value);
    }
  }

  @Watch("gasFee")
  watchGasFee(value: string): void {
    if (value) {
      this.$emit("gas-fee", value);
    }
  }

  @Watch("selectedAddress")
  watchSelectedAddress(value: string): void {
    if (value) {
      if (this.swapAmount) {
        this.UpdateRecipientGetsAmount(this.swapAmount);
      }
    }
  }

  @Watch("params", { deep: true })
  watchParams(value: TransactionConfig | ""): void {
    if (value) {
      this.$emit("params", value);
    }
  }

  @Watch("selectedRecipientToken")
  watchselectedRecipientToken(value: string): void {
    this.selectedRecipientTokenModel = value;
  }

  @Watch("selectedRecipientTokenModel")
  watchSelectedRecipientToken(value: string, prev: string): void {
    if (
      this.selectedCurrency &&
      value.toLowerCase() === this.selectedCurrency.value.toLowerCase()
    ) {
      this.$emit("selected-recipient-token", value);
      this.checkFee(this.swapAmount);
    } else {
      console.log("prev", prev);

      alert(`Swap currently are not available `);
      this.selectedRecipientTokenModel = prev;
    }
  }

  get addressBooksWallet(): AddressBookInterface[] {
    return this.$store.getters["getAddressBooks"].filter(
      (a: AddressBookInterface) =>
        a.type === "wallet" && a.chainId === this.chainId
    );
  }

  get addressBooks(): AddressBookInterface[] {
    const addressBooks = this.$store.getters["getAddressBooks"];
    return addressBooks.filter((a: AddressBookInterface) => {
      if (this.selectedCurrency && this.selectedCurrency?.value) {
        return (
          a.currency.toLowerCase() ===
            this.selectedCurrency.value.toLowerCase() &&
          a.address &&
          a.chainId === this.chainId
        );
      } else {
        return false;
      }
    });
  }

  isReversed(balance: BalanceInterface): boolean {
    return !balance.chainIds.find((c) => c === this.chainId);
  }

  get selectedEthereumAddress(): string {
    return window.ethereum.selectedAddress;
  }

  get mainCurrency(): string {
    let main;
    const chainId = this.$store.state.chainId;
    if (chainId === 1 || chainId === 3) {
      main = "ETH";
    } else {
      main = "BNB";
    }
    return main;
  }

  getCoinCurrency(coin: BalanceInterface): CurrencyModel | undefined {
    return coin.currency?.find(
      (c) =>
        c.network.toUpperCase() ===
          this.$store.state.networkName.toUpperCase() &&
        c.address.toLowerCase() ===
          this.$store.state.selectedAddress.toLowerCase()
    );
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      if (this.currentSelected) this.selectedCurrency = this.currentSelected;
      if (this.setAddressSelected)
        this.selectedAddress = this.setAddressSelected;
      if (this.setAmount) this.swapAmount = this.setAmount;
      if (this.step) this.e1 = this.step;
      // this.label = this.setLabel;
      // if (this.setSwapAmount) this.swapAmount = this.setSwapAmount;
      // if (this.setContinueLabel) this.continueLabel = this.setContinueLabel;
      // this.$nextTick(() => {});
      const chainId = this.$store.state.chainId;
      let axiosGet;
      if (chainId === 1 || chainId === 3) {
        axiosGet = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin,aave-dai,ethereum`
        );
        const data = axiosGet.data as CoingeckoInterface[];

        this.ethereumPrice = data.find(
          (d) => d.id === "ethereum"
        ) as CoingeckoInterface;
      } else {
        axiosGet = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin,usd-coin,aave-dai,ethereum`
        );
        const data = axiosGet.data as CoingeckoInterface[];
        this.ethereumPrice = data.find(
          (d) => d.id === "binancecoin"
        ) as CoingeckoInterface;
      }
      await this.checkApproval();
      this.gasPrice = await this.web3().eth.getGasPrice();
      console.log("this.swapAmount", this.swapAmount);
      // if (this.swapAmount) {
      //   await this.UpdateRecipientGetsAmount(this.swapAmount);
      //   await this.updateUsdAmount();
      // }
      console.log("this.selectedAddress", this.selectedAddress);

      this.WETH = await this.cryptozenContract().methods.WETH().call();
      this.uniswapRouterAddress = await this.cryptozenContract()
        .methods.uniswapRouterAddress()
        .call();
      this.pageLoading = false;
    });
  }

  cryptozenContract(): Contract {
    const web3 = this.$store.state.web3 as Web3;
    const networkName = `${this.$store.state.networkName.toUpperCase()}_${this.$store.state.networkType.toUpperCase()}` as NETWORKS_LIST;
    const CRYPTOZEN_CONTRACT = CRYPTOZEN_CONTRACTS[networkName];
    return new web3.eth.Contract(cryptozenabi, CRYPTOZEN_CONTRACT);
  }

  uniswapContract(): Contract {
    const web3 = this.$store.state.web3 as Web3;
    return new web3.eth.Contract(uniswap_v2_abi, this.uniswapRouterAddress);
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
        this.approveLoadingStatus = false;
        alert("Approval success, site will be reloaded");
        location.reload();
      } else {
        const tx2 = await web3.eth.getTransaction(hash);
        console.log("tx2tx2tx2", tx2);
        if (!tx2) {
          this.approveLoadingStatus = false;
          localStorage.removeItem(
            `approval:${this.$store.state.selectedAddress}`
          );
          alert(
            "You have replaced, cancel, or speed up the tx directly on Metamask. We cannot detect that transaction due the limitation of Metamask. Please make sure that the approval is confirmed manually"
          );
          location.reload();
        } else {
          this.approveLoadingStatus = true;
          this.checkApproval(true).then();
        }
      }
    } else {
      this.approveLoadingStatus = false;
    }
  }

  goToHome(): void {
    this.$router.push(`/`);
    location.reload();
  }

  async nextSendFrom(coin: BalanceInterface): Promise<void> {
    if (this.getCoinCurrency(coin)?.allowance) {
      this.selectedCurrency = coin;
      this.e1 = 2;
    } else {
      // await this.$store.dispatch("approve", coin);
    }
  }

  approveLoading(coin: BalanceInterface): boolean {
    return !!(
      this.currentlyApproved && coin.value === this.currentlyApproved.value
    );
  }

  async approve(coin: BalanceInterface): Promise<void> {
    try {
      const mainCurrencyBalance = balances.find(
        (b) => b.value === this.mainCurrency.toLowerCase()
      );
      const mainCurrency = mainCurrencyBalance?.currency?.find(
        (c) =>
          c.coin.toLowerCase() ===
            this.$store.state.networkName.toLowerCase() &&
          c.address === this.$store.state.selectedAddress
      );
      // if (!mainCurrency?.balance) {
      //   throw new Error(
      //     `Your ${this.mainCurrency} balance is 0, you need some amount to approve the token`
      //   );
      // }

      this.approveLoadingStatus = true;
      this.currentlyApproved = coin;
      console.log("this.currentlyApproved", this.currentlyApproved);
      await this.$store.dispatch("approve", coin);
      await this.$store.dispatch("updateCoinBalance", {
        coin,
        address: this.$store.state.selectedAddress,
      });
      this.approveLoadingStatus = false;
    } catch (e) {
      console.error("e", e);
      alert(e.message);
      this.approveLoadingStatus = false;
    }
  }

  setGasFee(value: string): void {
    if (value) {
      this.gasFee = value;
    }
  }

  setAllowance(value: boolean): void {
    this.allowance = value;
  }

  setParams(value: TransactionConfig): void {
    if (value) {
      this.params = value;
    }
  }

  setTransferFee(value: string): void {
    if (value) {
      this.transferFee = value;
    }
  }

  async sendMoney(): Promise<void> {
    try {
      this.loadingSendMoney = true;
      await this.checkFee(this.swapAmount);
      if (this.addressByEmail) {
        await this.sendRecipientEmail();
      } else {
        if (this.params) {
          const web3 = this.$store.getters["getWeb3"] as Web3;
          const ethBalanceInWei = await web3.eth.getBalance(
            window.ethereum.selectedAddress
          );
          const ethBalanceInEther = web3.utils.fromWei(
            ethBalanceInWei,
            "ether"
          );
          if (new Bignumber(ethBalanceInEther).isLessThan(this.gasFee)) {
            alert(
              `You do not have enough ${this.mainCurrency} for gas fee. Your current ${this.mainCurrency} balance is ${ethBalanceInEther}`
            );
          } else {
            await new Promise((resolve, reject) => {
              if (this.params) {
                this.params.gas = this.gas;
                console.log("this.params", this.params);
                web3.eth
                  .sendTransaction(this.params)
                  .on("transactionHash", async (hash) => {
                    console.log("hash", hash);
                    if (this.params) {
                      console.log("this.params.value", this.params.value);
                      if (!this.setTransaction) {
                        this.transaction = await this.$store.dispatch(
                          "newTrx",
                          {
                            hash,
                            isToken: this.params.value === "0x0",
                            fee: this.transferFee,
                            reference: this.reference,
                            reward: this.transactionReward,
                          }
                        );
                      } else {
                        this.transaction = await this.$store.dispatch(
                          "updateTrx",
                          {
                            id: this.setTransaction.id,
                            hash,
                            isToken: this.params.value === "0x0",
                            fee: this.transferFee,
                            reference: this.reference,
                            reward: {
                              transactionRewardInUsd: this
                                .transactionRewardInUsd,
                              transactionReward: this.transactionReward,
                            },
                          }
                        );
                      }

                      this.isReview = false;
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
      if (this.addARecipientWalletAddress) {
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
            const balance = this.getBalanceById(this.selectedCurrency.id);
            if (!balance) {
              throw new Error("coin not found");
            }
            const addressBookData = await this.$store.dispatch("createWallet", {
              name: this.addARecipientName,
              tokenListId: balance.id,
              address: this.addARecipientWalletAddress
                ? this.addARecipientWalletAddress
                : null,
              currency: balance.value.toLowerCase(),
              email,
              plainEmail: this.addARecipientEmail
                ? this.addARecipientEmail
                : null,
              sendEmail: !this.addARecipientWalletAddress,
              type: "recipient",
            });
            this.createWalletLoading = false;
            this.newAddressBookSubmitted = true;
            this.newSubmittedAddressBook = addressBookData;
            this.text = "Recipient has been successfully added";
            this.snackbar = true;
            // alert("Recipient has been successfully added");
            this.addARecipientName = "";
            this.addARecipientWalletAddress = "";
            // this.selectedCurrency = "";
            this.addARecipientEmail = "";
          }
        } else {
          alert(`no selected Currency`);
        }
      } else {
        if (this.addARecipientEmail) {
          this.addressByEmail = true;
          this.selectedAddress = "";
          this.e1 = this.e1 + 1;
        }
      }
    } catch (e) {
      // console.log("e", e);
      // alert(e.message);
      this.createWalletLoading = false;
    }
  }

  async sendRecipientEmail(): Promise<void> {
    try {
      let allowSubmit = true;
      let signature = null;
      if (this.selectedCurrency) {
        const web3 = this.$store.getters["getWeb3"] as Web3;
        if (this.addARecipientEmail) {
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
          let amount = web3.utils.toWei(this.swapAmount.toString(), "ether");
          if (
            this.selectedCurrency.mainCurrency &&
            this.selectedCurrency.decimal
          ) {
            amount = fromExponential(
              Number(
                this.swapAmount * 10 ** this.chainId === 3 || this.chainId === 1
                  ? this.selectedCurrency.decimal
                  : 18
              ).toString()
            );
          }
          this.transaction = await this.$store.dispatch("newTrxWithEmail", {
            name: this.addARecipientName,
            currency: this.selectedCurrency.value.toLowerCase(),
            reference: this.reference,
            plainEmail: this.addARecipientEmail,
            amount,
            email,
          });
          this.createWalletLoading = false;

          this.e1 = this.e1 + 1;
          this.isReview = false;
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

  async checkSubmittedAddressBook(id: string): Promise<void> {
    const token = Vue.$cookies.get("cryptozen_token");
    const addressBookData = await Fetcher.getSubmittedAddressBook(token, id);
    console.log("addressBookData", addressBookData);
    if (addressBookData) {
      this.newSubmittedAddressBook = addressBookData;
    } else {
      await sleep(30000);
      await this.checkSubmittedAddressBook(id);
    }
  }

  async getAddressBooks(): Promise<void> {
    this.loadingAddressBooks = true;
    await this.$store.dispatch("getAddressBookList");
    this.loadingAddressBooks = false;
  }

  getBalanceById(id: number): BalanceInterface | undefined {
    const balances = this.$store.state.balances as BalanceInterface[];

    return balances.find((b) => Number(b.id) === Number(id));
  }

  getAddressBookIconById(id: number): string {
    const balance = this.getBalanceById(id);
    console.log("getAddressBookIconByIdBalance", balance);
    if (balance) {
      if (balance.logo) {
        return balance.logo;
      } else {
        return require(`../assets/${balance.value.toLowerCase()}.svg`);
      }
    }
    return "";
  }
  getChainIdIcon(addressBook: AddressBookInterface): string {
    let icon = "eth";
    if (addressBook.chainId === 97 || addressBook.chainId === 56) {
      icon = "bnb";
    }
    return require(`../assets/${icon}.svg`);
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
      const balance = this.getBalanceById(this.addWalletId);
      if (balance) {
        await this.$store.dispatch("updateWallet", {
          id: this.editWalletId,
          name: this.editAWalletName,
          address: this.editAWalletAddress,
          currency: balance.value.toLowerCase(),
          tokenListId: this.addWalletId,
        });
      } else {
        throw new Error("Coin not found !");
      }

      this.editWalletLoading = false;
      this.editWallet = false;
      this.editAWalletCurrency = "";
      this.editAWalletAddress = "";
      this.editAWalletName = "";
      this.editWalletId = "";
      alert("Wallet has been successfully updated");
    } catch (e) {
      // console.log("e", e);
      alert(e.message);

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

  closeDialog(): void {
    // this.$emit("update-dialog", false);
    // this.e1 = 1;
    location.reload();
  }

  setSwapAmount(value: number): void {
    this.swapAmount = Number(value);
  }

  toHumanDate(date: string): string {
    const interval = shleemy(date);
    return interval.forHumans;
  }

  getAmount(transaction: TransactionInterface): string {
    return `${this.swapAmount} ${transaction.tokenName}`;
  }

  getAmountReceipt(transaction: TransactionInterface): string {
    return `${Number(this.swapAmount) - Number(this.transferFee)} ${
      transaction.tokenName
    }`;
  }

  getStatus(transaction: TransactionInterface): string {
    if (transaction.isOnHold) {
      return "On Hold";
    }
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

  get tier(): number {
    const tier = this.$store.state.tier;
    if (tier.length) {
      return tier[2];
    }
    return 0;
  }

  get chainId(): number {
    return this.$store.state.chainId;
  }

  async UpdateRecipientGetsAmount(value: number): Promise<void> {
    this.recipientGets = 0;
    if (this.swapAmount > 0) {
      await this.checkFee(value);

      this.recipientGets = Number(this.swapAmount) - Number(this.transferFee);
      await this.updateUsdAmount();
    }
  }

  async UpdateSwapAmount(value: number): Promise<void> {
    this.swapAmount = 0;
    if (this.recipientGets > 0) {
      await this.checkFee(value);

      this.swapAmount = Number(this.recipientGets) + Number(this.transferFee);
      await this.updateUsdAmount();
    }
  }

  async updateUsdAmount(): Promise<void> {
    if (
      this.transferFee !== "0" &&
      this.recipientGets !== 0 &&
      this.swapAmount !== 0 &&
      this.selectedCurrency
    ) {
      if (
        this.selectedCurrency.value === "ninja" &&
        this.selectedRecipientTokenModel === "ninja"
      ) {
        this.amountReceiptUsd = this.convertToUsd(
          await this.ninjaToWeth(
            (Number(this.recipientGets) - Number(this.transferFee)).toString()
          )
        );
        this.amountSendUsd = this.convertToUsd(
          await this.ninjaToWeth(
            (Number(this.swapAmount) + Number(this.transferFee)).toString()
          )
        );
      } else {
        console.log("this.selectedCurrency.value", this.selectedCurrency.value);
        if (this.selectedCurrency.mainCurrency) {
          this.amountReceiptUsd = this.convertToUsd(
            this.recipientGets.toString()
          );
          this.amountSendUsd = this.convertToUsd(this.swapAmount.toString());
        } else {
          this.amountReceiptUsd = this.recipientGets.toString();
          this.amountSendUsd = this.swapAmount.toString();
        }
      }

      this.componentKey += 1;
    } else {
      await sleep(1000);
      await this.updateUsdAmount();
    }
  }

  getTxDetailUrl(hash: string): string {
    const chainId = this.$store.state.chainId;
    switch (chainId) {
      case 1:
        return `https://etherscan.io/tx/${hash}`;
      case 3:
        return `https://ropsten.etherscan.io/tx/${hash}`;
      case 64:
        return `https://bscscan.com/tx/${hash}`;
      case 97:
        return `https://testnet.bscscan.com/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  }

  convertToUsd(eth: string): string {
    if (this.ethereumPrice && eth !== "NaN") {
      console.log("eth", eth);
      const currentPrice = this.ethereumPrice.current_price;
      console.log("currentPrice", currentPrice);
      const price = fromExponential(
        new BigNumber(eth).times(currentPrice).toFixed(5)
      );
      console.log("priceInUsd", price);
      return price;
    }
    return "0";
  }

  async checkFee(inputAmount: number): Promise<void> {
    if (!this.loadingFee) {
      try {
        if (
          this.selectedCurrency &&
          (this.selectedAddress || this.addressByEmail)
        ) {
          this.loadingFee = true;
          this.transferFee = "0";
          this.gasFee = "0";
          this.platformFee = "0";
          this.transactionReward = "0";
          const web3 = this.$store.getters["getWeb3"] as Web3;
          //addressByEmail
          let recipientAddress = this.selectedAddress
            ? this.selectedAddress.address
            : "";
          if (this.addressByEmail) {
            recipientAddress = window.ethereum.selectedAddress;
          }
          const state = this.$store.state;
          const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;

          const CRYPTOZEN_CONTRACT = CRYPTOZEN_CONTRACTS[networkName];
          console.log("CRYPTOZEN_CONTRACT", CRYPTOZEN_CONTRACT);
          const contract = new web3.eth.Contract(
            cryptozenabi,
            CRYPTOZEN_CONTRACT
          );
          let contractData = "";
          let amount = "";
          let value = "0";
          if (!this.selectedCurrency.mainCurrency) {
            if (
              this.selectedCurrency.decimal &&
              this.selectedCurrency.contractAddress
            ) {
              let contractAddress = this.selectedCurrency.contractAddress[
                networkName
              ];
              let decimal = this.selectedCurrency.decimal[networkName];

              amount = fromExponential(
                Number(inputAmount * 10 ** decimal).toString()
              );
              contractData = contract.methods
                .transferSameToken(contractAddress, recipientAddress, amount)
                .encodeABI();
            }
          } else {
            console.log("inputAmount.toString()", inputAmount.toString());
            amount = web3.utils.toWei(inputAmount.toString(), "ether");
            contractData = contract.methods
              .transferSameEther(recipientAddress)
              .encodeABI();
            value = amount;
          }

          if (!contractData) {
            throw new Error("Contract data not found !");
          }

          const params = {
            from: window.ethereum.selectedAddress,
            to: CRYPTOZEN_CONTRACT,
            value,
            data: contractData,
            gasPrice: this.gasPrice,
          };
          console.log("this.gasPrice", this.gasPrice);
          console.log(
            "window.ethereum.selectedAddress",
            window.ethereum.selectedAddress
          );
          await this.$store.dispatch("getTier");
          const tier = this.$store.state.tier;
          const transferFee: number = await contract.methods
            .calculateTransferFee(amount, tier[1])
            .call({
              from: window.ethereum.selectedAddress,
              // gasPrice: this.gasPrice,
            });
          // const transferFee = (Number(amount) * Number(tier[1])) / 10000;
          console.log("amountamountamount", amount);
          console.log("transferFee", transferFee);
          console.log("tier[1]", tier[1]);
          if (transferFee) {
            if (this.selectedCurrency?.decimal) {
              const decimal = this.selectedCurrency.decimal[networkName];

              this.transferFee = Number(transferFee / 10 ** decimal).toFixed(5);
              this.transferFeeOnUsd = await this.checkTransferFeeOnUsd(
                this.transferFee
              );
            } else {
              this.transferFee = web3.utils.fromWei(
                transferFee.toString(),
                "ether"
              );
              this.transferFeeOnUsd = this.convertToUsd(this.transferFee);
            }
          }
          console.log("this.transferFee", this.transferFee);
          this.gas = await web3.eth.estimateGas(params);

          console.log("gasPrice", this.gasPrice);
          console.log("gas", this.gas);
          // await this.checkRewardFee(
          //   this.transferFee.toString(),
          //   !this.selectedCurrency.mainCurrency,
          //   this.selectedCurrency
          // );
          await this.checkRewardFeeNew(
            new Bignumber(this.gas).times(this.gasPrice).toString(),
            this.transferFee,
            !this.selectedCurrency.mainCurrency,
            this.selectedCurrency
          );

          this.params = params;
          const txFee = new BigNumber(this.gas).times(
            web3.utils.fromWei(this.gasPrice, "ether")
          );

          this.gasFee = txFee.toFixed(5);

          this.loadingFee = false;
        }
      } catch (e) {
        console.log("eaea", e);
        // this.transactionReward = "0";
        // this.transferFee = "0";
        // this.gasFee = "0";
        // this.platformFee = "0";
        this.loadingFee = false;
        await sleep(100);
        // await this.checkFee(inputAmount);
      }
    } else {
      await sleep(100);
      console.log("checkFee");
      await this.checkFee(inputAmount);
    }
  }

  // nextStep(): void {
  //   this.$emit("next-step", this.currentStep + 1);
  // }

  // prevStep(): void {
  //   this.$emit("prev-step", this.currentStep - 1);
  // }

  async checkTransferFeeOnUsd(amount: string): Promise<string> {
    if (this.selectedCurrency && this.selectedCurrency.value === "ninja") {
      return this.convertToUsd(await this.ninjaToWeth(amount));
    } else {
      return amount;
    }
  }

  networkName(): NETWORKS_LIST {
    const state = this.$store.state as storeInterface;
    return `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
  }

  web3(): Web3 {
    const state = this.$store.state as storeInterface;
    return state.web3 as Web3;
  }

  async ninjaToWeth(amount: string): Promise<string> {
    const state = this.$store.state as storeInterface;
    const {
      ChainId,
      Token,
      Fetcher,
      WETH,
      Route,
      Trade,
      TokenAmount,
      Percent,
      TradeType,
    } = CryptozenSdk(
      state.networkName.toLowerCase(),
      state.networkType === "TESTNET"
    );

    const networkName = this.networkName();
    const ethProvider = new providers.Web3Provider(window.ethereum);
    const ninjaBalance = balances.find((b) => b.value === "ninja");
    if (ninjaBalance && ninjaBalance.contractAddress) {
      const chainId = state.chainId;
      const NinjaContract = ninjaBalance.contractAddress[networkName];
      const Ninja = new Token(chainId, NinjaContract as string, 18);

      const NinjaWETHPair = await Fetcher.fetchPairData(
        WETH[Ninja.chainId],
        Ninja,
        ethProvider
      );

      const route = new Route(
        [NinjaWETHPair],
        Ninja,
        WETH[NinjaWETHPair.chainId]
      );
      console.log("amountamountamount", amount);
      const realAmount = new BigNumber(amount).times(10 ** 18).toFixed();
      const trade = new Trade(
        route,
        new TokenAmount(Ninja, realAmount),
        TradeType.EXACT_INPUT
      );
      const slippageTolerance = new Percent("50", "10000");
      const amountOutMin = trade.minimumAmountOut(slippageTolerance);
      console.log("amountOutMinninjaToWeth", amountOutMin.toSignificant(6));
      return amountOutMin.toSignificant(6);
    }
    return "0";
  }

  async checkRewardFeeNew(
    gasFee: string,
    transferFee: string,
    isToken: boolean,
    TRADETOKENContract?: BalanceInterface
  ): Promise<void> {
    try {
      const contract = this.cryptozenContract();
      const web3 = this.web3();
      console.log("checkRewardFeeNew TRADETOKENContract", TRADETOKENContract);
      console.log("checkRewardFeeNew gasFee", gasFee);
      console.log("checkRewardFeeNew this.WETH", this.WETH);
      const fee1 = await contract.methods
        .calculateNinjaReward(fromExponential(gasFee), this.WETH)
        .call();
      let fee2 = "0";
      console.log("checkRewardFeeNew fee1", fee1);

      if (
        isToken &&
        TRADETOKENContract &&
        TRADETOKENContract.contractAddress &&
        TRADETOKENContract.decimal &&
        web3
      ) {
        if (TRADETOKENContract.id !== 9999) {
          const feeTf = new Bignumber(transferFee)
            .times(10 ** TRADETOKENContract.decimal[this.networkName()])
            .toString();
          console.log("checkRewardFeeNew feeTf", feeTf);
          fee2 = await contract.methods
            .calculateNinjaReward(
              fromExponential(feeTf),
              TRADETOKENContract.contractAddress[this.networkName()]
            )
            .call();
        }
      } else {
        const feeTf = web3.utils.toWei(transferFee, "ether");
        console.log("checkRewardFeeNew feeTf", feeTf);
        fee2 = await contract.methods
          .calculateNinjaReward(fromExponential(feeTf), this.WETH)
          .call();
      }

      console.log("checkRewardFeeNew fee2", fee2);
      this.transactionReward = Number(
        new Bignumber(fee1)
          .plus(fee2)
          .div(10 ** 18)
          .toFixed(5)
      ).toString();
      console.log("checkRewardFeeNew [this.WETH, this.ninjaContractAddress]", [
        this.WETH,
        this.ninjaContractAddress(),
      ]);
      console.log(
        "checkRewardFeeNew this.transactionReward",
        this.transactionReward
      );
      const amountOut = await this.uniswapContract()
        .methods.getAmountsOut(
          fromExponential(new Bignumber(fee1).plus(fee2).toString()),
          [this.ninjaContractAddress(), this.WETH]
        )
        .call();
      console.log("checkRewardFeeNew amountOut", amountOut);
      this.transactionRewardInEth = web3.utils.fromWei(amountOut[1], "ether");
      console.log(
        "checkRewardFeeNew this.transactionRewardInEth",
        this.transactionRewardInEth
      );
    } catch (e) {
      throw new Error(`error checkRewardFeeNew ${e.message}`);
    }
  }

  ninjaContractAddress(): string {
    const ninjaBalance = balances.find((b) => b.value === "ninja");
    if (ninjaBalance && ninjaBalance.contractAddress) {
      return ninjaBalance.contractAddress[this.networkName()];
    }
    return "";
  }

  async checkRewardFee(
    amountFee: string,
    isToken: boolean,
    TRADETOKENContract?: BalanceInterface
  ): Promise<void> {
    const state = this.$store.state as storeInterface;
    const {
      ChainId,
      Token,
      Fetcher,
      WETH,
      Route,
      Trade,
      TokenAmount,
      Percent,
      TradeType,
    } = CryptozenSdk(
      state.networkName.toLowerCase(),
      state.networkType === "TESTNET"
    );
    const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;
    const chainId = state.chainId as number;
    const ninjaBalance = balances.find((b) => b.value === "ninja");
    if (ninjaBalance && ninjaBalance.contractAddress) {
      const ethProvider = new providers.Web3Provider(window.ethereum);
      const NinjaContract = ninjaBalance.contractAddress[networkName];
      const Ninja = new Token(chainId, NinjaContract as string, 18);
      console.log("NinjaContract", NinjaContract);
      if (Ninja) {
        console.log("Ninja", Ninja);

        const NinjaWETHPair = await Fetcher.fetchPairData(
          WETH[Ninja.chainId],
          Ninja,
          ethProvider
        );

        if (isToken) {
          if (
            TRADETOKENContract &&
            TRADETOKENContract.contractAddress &&
            TRADETOKENContract.decimal
          ) {
            const contractAddress =
              TRADETOKENContract.contractAddress[networkName];
            const decimal = TRADETOKENContract.decimal[networkName];

            const TRADETOKEN = new Token(
              Ninja.chainId,
              contractAddress,
              decimal
            );
            const TRADETOKENWETHPAIR = await Fetcher.fetchPairData(
              WETH[Ninja.chainId],
              TRADETOKEN,
              ethProvider
            );
            const pairs = [TRADETOKENWETHPAIR, NinjaWETHPair];
            const route = new Route(pairs, TRADETOKEN, Ninja);
            const routeEth = new Route(
              [NinjaWETHPair],
              Ninja,
              WETH[Ninja.chainId]
            );
            console.log("checkRewardFeeamountFee", amountFee);
            const amount = new BigNumber(amountFee)
              .times(10 ** decimal)
              .toFixed();
            const realAmount = fromExponential(amount);
            console.log("checkRewardFeerealAmount22", realAmount);
            const trade = new Trade(
              route,
              new TokenAmount(TRADETOKEN, realAmount),
              TradeType.EXACT_INPUT
            );
            console.log("checkRewardFeetrade", trade);
            const slippageTolerance = new Percent("50", "10000");
            const amountOutMin = trade.minimumAmountOut(slippageTolerance);

            const txFee = Number(this.gasPrice) * Number(this.gas);
            const route3 = new Route(
              [NinjaWETHPair],
              WETH[NinjaWETHPair.chainId],
              Ninja
            );
            console.log("txFee", txFee);
            const trade3 = new Trade(
              route3,
              new TokenAmount(WETH[NinjaWETHPair.chainId], txFee.toFixed()),
              TradeType.EXACT_INPUT
            );
            const slippageTolerance3 = new Percent("50", "10000");
            const amountOutMin3 = trade3.minimumAmountOut(slippageTolerance3);

            this.transactionReward = (
              Number(amountOutMin.toSignificant(6)) +
              Number(amountOutMin3.toSignificant(6))
            ).toFixed(5);
            console.log("this.transactionReward", this.transactionReward);
            const tradeEth = new Trade(
              routeEth,
              new TokenAmount(
                Ninja,
                fromExponential(
                  Number(Number(this.transactionReward) * 10 ** 18).toString()
                )
              ),
              TradeType.EXACT_INPUT
            );
            const amountOutMinEth = tradeEth.minimumAmountOut(
              slippageTolerance
            );
            this.transactionRewardInEth = amountOutMinEth.toSignificant(6);
          }
        } else {
          // const route = new Route(
          //   [NinjaWETHPair],
          //   WETH[NinjaWETHPair.chainId],
          //   Ninja
          // );
          const web3 = this.$store.getters["getWeb3"] as Web3;
          // console.log("amountFee", amountFee);
          // const realAmount = web3.utils.toWei(amountFee, "ether");
          // console.log("realAmount", realAmount);
          // const trade = new Trade(
          //   route,
          //   new TokenAmount(WETH[NinjaWETHPair.chainId], realAmount),
          //   TradeType.EXACT_INPUT
          // );
          // const slippageTolerance = new Percent("50", "10000");
          // const amountOutMin = trade.minimumAmountOut(slippageTolerance);
          // console.log("amountOutMin", amountOutMin.toSignificant(6));
          //
          const txFee = Number(this.gasPrice) * Number(this.gas);
          // const route3 = new Route(
          //   [NinjaWETHPair],
          //   WETH[NinjaWETHPair.chainId],
          //   Ninja
          // );
          // console.log("txFee.toFixed()", txFee.toFixed());
          // const trade3 = new Trade(
          //   route3,
          //   new TokenAmount(WETH[NinjaWETHPair.chainId], txFee.toFixed()),
          //   TradeType.EXACT_INPUT
          // );
          // const slippageTolerance3 = new Percent("50", "10000");
          // const amountOutMin3 = trade3.minimumAmountOut(slippageTolerance3);
          // console.log("amountOutMin3", amountOutMin3.toSignificant(6));
          // console.log("amountOutMin3", amountOutMin3.toSignificant(6));
          // this.transactionReward = (
          //   Number(amountOutMin.toSignificant(6)) +
          //   Number(amountOutMin3.toSignificant(6))
          // ).toString();
          let BNBToken;
          if (chainId === 97) {
            BNBToken = new Token(
              Ninja.chainId,
              "0x824f499d27e5e281a390a0caa225c4f723bb8ae4",
              18
            );
          }
          if (chainId === 56) {
            BNBToken = new Token(
              Ninja.chainId,
              "0xf66493f8a7c25b272c6d56ae8f55f0b7668b10a7",
              18
            );
          }
          let BNBWETHPAIRS;
          if (BNBToken) {
            console.log("BNBToken", BNBToken);
            BNBWETHPAIRS = await Fetcher.fetchPairData(
              WETH[Ninja.chainId],
              BNBToken,
              ethProvider
            );
          }
          console.log("BNBToken", BNBToken);
          this.transactionRewardInEth = (
            Number(amountFee) +
            Number(web3.utils.fromWei(txFee.toFixed(), "ether"))
          ).toString();
          let pairs = [NinjaWETHPair];
          if (BNBWETHPAIRS) {
            pairs = [BNBWETHPAIRS, NinjaWETHPair];
          }
          const route3 = new Route(
            pairs,
            BNBToken ? BNBToken : WETH[Ninja.chainId],
            Ninja
          );

          const trade3 = new Trade(
            route3,
            new TokenAmount(
              BNBToken ? BNBToken : WETH[Ninja.chainId],
              web3.utils.toWei(
                Number(this.transactionRewardInEth).toFixed(5),
                "ether"
              )
            ),
            TradeType.EXACT_INPUT
          );
          const slippageTolerance3 = new Percent("50", "10000");
          const amountOutMin3 = trade3.minimumAmountOut(slippageTolerance3);

          this.transactionReward = amountOutMin3.toSignificant(6);

          console.log(
            "usdusdtransactionRewardInEth",
            this.transactionRewardInEth
          );
        }
      }
    }
  }
}

export interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style scoped>
.bala {
  border: 0.5px solid #005672;
}
::v-deep .coin-list .v-input__slot {
  min-height: 57px !important;
}
::v-deep .recipient-gets-input .v-input__slot fieldset {
  height: 62px !important;
}
::v-deep .recipient-gets-input .v-input__slot {
  top: 0px;
  min-height: initial;
}
::v-deep .v-text-field--outlined.v-input--is-focused fieldset,
.v-text-field--outlined.v-input--has-state fieldset {
  border-width: 1px !important;
}

.hover-pointer:hover{
  cursor: pointer;
}
::v-deep .alert-toolbar{
  left: 0px !important;
  height: 30px !important;
}
::v-deep .v-stepper{
  position: relative;
  top: 30px;
}
</style>
