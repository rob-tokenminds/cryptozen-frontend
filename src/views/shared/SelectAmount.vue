<template>
  <v-card v-if="selectedCurrency" flat width="600">
    <v-text-field
      height=""
      class="text-h5 rounded-0"
      color="primary"
      full-width
      label="You send"
      outlined
      :max="selectedCurrency.currency.balance"
      v-model="swapAmount"
      :hint="`you have ${selectedCurrency.currency.balance}`"
      persistent-hint
      type="number"
      :step="0.000001"
    >
      <template v-slot:append>
        <v-list-item class="mt-n4">
          <v-list-item-avatar tile>
            <v-img
              :src="require(`../../assets/${selectedCurrency.value}.svg`)"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="primary--text text-subtitle-1">{{
              selectedCurrency.value === "eth"
                ? "Ethereum"
                : selectedCurrency.value.toUpperCase()
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-text-field>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle class="secondary--text text-subtitle-2 text-left"
          ><a class="primary--text text-subtitle-2">-23</a> Gas
          fee</v-list-item-subtitle
        >
        <v-list-item-subtitle class="secondary--text text-subtitle-2 text-left"
          ><a class="primary--text text-subtitle-2">-23</a> Transfer
          fee</v-list-item-subtitle
        >
        <v-divider></v-divider>
        <v-list-item-subtitle class="secondary--text text-subtitle-2 text-left"
          ><a class="primary--text text-subtitle-2">0</a> Platform fee
          (discounted)</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-row no-gutters>
      <v-col cols="8">
        <v-text-field
          class="text-h5 rounded-0"
          color="primary"
          label="Recipient gets"
          outlined
          value="0"
          persistent-hint
          type="number"
          step="0.000001"
          flat
        >
          <!-- <template v-slot:append-outer>
               
                </template> -->
        </v-text-field>
      </v-col>

      <v-col cols="4">
        <v-select
          color="primary"
          :items="coins"
          item-text="name"
          item-value="value"
          outlined
          v-model="selectedRecipientToken"
          class="rounded-0"
          height="50"
        >
          <template v-slot:item="{ item, on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-avatar tile>
                <v-img :src="require(`../../assets/${item.value}.svg`)"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="primary--text text-subtitle-1">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-slot:selection="{ item }">
            <v-list-item>
              <v-list-item-avatar tile>
                <v-img :src="require(`../../assets/${item.value}.svg`)"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="primary--text text-subtitle-1">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <!--  -->
    <v-card-actions v-if="!disableActionButton">
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="prevStep()"> Back </v-btn>
      <v-btn color="primary" @click="nextStep()"> Continue </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { BalanceInterface } from "../../static/balance";
import balances from "../../static/balance";

@Component({ name: "SelectAmount" })
export default class SelectAmount extends Vue {
  @Prop(Number) readonly currentStep!: number;
  @Prop(Object) readonly selectedCurrency!: BalanceInterface;
  @Prop(Number) readonly setSwapAmount!: number;
  @Prop(Boolean) readonly disableActionButton!: boolean;

  selectedRecipientToken = "usdt";
  coins = balances;
  swapAmount = 0;

  mounted(): void {
    this.swapAmount = this.setSwapAmount;
  }

  @Watch("setSwapAmount")
  watchSetSwapAmount(value: number) {
    this.swapAmount = value;
  }

  @Watch("swapAmount")
  watchSwapAmount(value: number): void {
    this.$emit("swap-amount", value);
  }

  nextStep(): void {
    this.$emit("next-step", this.currentStep + 1);
  }

  prevStep(): void {
    this.$emit("prev-step", this.currentStep - 1);
  }
}
</script>
