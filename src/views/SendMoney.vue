<template>
  <v-card>
    <v-stepper v-model="e1">
      <!-- <v-toolbar dark color="white"> -->

      <v-stepper-header>
        <v-img
          class="ma-5"
          max-height="60"
          max-width="130"
          src="../assets/logo2.svg"
        ></v-img>
        <v-stepper-step :complete="e1 > 1" step=""> Wallet </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step=""> Amount </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 3" step=""> Recipient </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step> Review </v-stepper-step>
        <v-spacer></v-spacer>
        <div class="mt-2">
          <ProfileMenu></ProfileMenu>
        </div>
      </v-stepper-header>

      <!-- </v-toolbar> -->

      <v-card-actions>
        <v-btn class="secondary" @click="closeDialog">Back</v-btn>
      </v-card-actions>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import ProfileMenu from "./shared/ProfileMenu.vue";
@Component({ name: "SendMoney", components: { ProfileMenu } })
export default class SendMoney extends Vue {
  e1 = 1;
  closeDialog(): void {
    console.log("closeDialog", "closeDialog");
    this.$emit("update-dialog", false);
  }
}
</script>
