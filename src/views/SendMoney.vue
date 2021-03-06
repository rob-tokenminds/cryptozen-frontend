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

              <v-card elevation="2" class="mx-auto" height="100" width="800">
                <v-card-text @click="e1 = 4">
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-icon large color="primary">mdi-home-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text text-h6"
                        >Address Book</v-list-item-title
                      >
                    </v-list-item-content>

                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-list-item-content>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>

              <v-card
                elevation="2"
                class="mx-auto mt-2"
                height="100"
                width="800"
              >
                <v-card-text @click="e1 = 4">
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-icon large color="primary">mdi-wallet-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text text-h6"
                        >Your Wallet</v-list-item-title
                      >
                    </v-list-item-content>

                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-list-item-content>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>

              <v-card
                elevation="2"
                class="mx-auto mt-2"
                height="100"
                width="800"
              >
                <v-card-text @click="e1 = 4">
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-icon large color="primary">mdi-plus</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text text-h6"
                        >New Recipient</v-list-item-title
                      >
                    </v-list-item-content>

                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-list-item-content>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
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
              <v-card class="mb-2">
                <v-list-item class="">
                  <v-list-item-avatar size="60">
                    <v-avatar color="main"></v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text ma-2"
                      >Username</v-list-item-title
                    >
                    <v-list-item-subtitle class="ma-2"
                      >0xabcdefgeahskehelhske
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
@Component({ name: "SendMoney", components: { ProfileMenu, SelectAmount } })
export default class SendMoney extends Vue {
  @Prop({ type: Number }) readonly step!: number;
  @Prop({ type: Object }) readonly currentSelected!: BalanceInterface;

  @Watch("selectedCurrencySync")
  watchSelectedCurrencySync(value: BalanceInterface): void {
    this.selectedCurrency = value;
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
