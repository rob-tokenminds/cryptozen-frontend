<template>
  <v-stepper v-model="e1">
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
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <ProfileMenu :showBell="false"></ProfileMenu>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-stepper-header>
    <v-stepper-items flat>
      <v-stepper-content flat step="1">
        <v-card flat>
          <p class="text-center primary--text text-h5">
            You are swapping {{ selectedCurrency.name }}
          </p>
          <v-card flat class="d-flex justify-center">
            <SelectAmount
              v-if="selectedCurrency"
              :currentStep="2"
              :selectedCurrency="selectedCurrency"
              :setLabel="`You swap`"
              :disableBack="true"
              :setContinueLabel="`Swap`"
              @swap-amount="setSwapAmount"
              @next-step="swap"
            ></SelectAmount>
          </v-card>
        </v-card>
      </v-stepper-content>
      <v-btn outlined color="secondary" @click="closeDialog" class="ma-5">
        Cancel
      </v-btn>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ProfileMenu from "./shared/ProfileMenu.vue";
import SelectAmount from "./shared/SelectAmount.vue";
import { BalanceInterface } from "../static/balance";
@Component({ name: "SwapMoney", components: { ProfileMenu, SelectAmount } })
export default class SwapMoney extends Vue {
  @Prop({ type: Object }) readonly selectedCurrency!: BalanceInterface;

  swapAmount = 0;
  setSwapAmount(value: number): void {
    this.swapAmount = Number(value);
  }

  swap(): void {
    console.log("swap");
  }

  closeDialog(): void {
    this.$emit("update-dialog", false);
  }
}
</script>
