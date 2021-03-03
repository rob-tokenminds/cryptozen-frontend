<template>
  <v-card flat height="10000">
    <v-stepper v-model="e1">
      <!-- <v-toolbar dark color="white"> -->

      <v-stepper-header>
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

        <ProfileMenu class="mr-10" :showBell="false"></ProfileMenu>
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

              <v-card elevation="2" class="mx-auto" height="100" width="800">
                <v-card-text @click="e1 = 2">
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-img :src="require(`../assets/usdc.svg`)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text text-subtitle-1"
                        >100</v-list-item-title
                      >
                      <v-list-item-subtitle class="">USDC</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-list-item-content>
                      <v-btn icon><v-icon>mdi-chevron-right</v-icon></v-btn>
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

          <v-card flat class="d-flex justify-center mt-5">
            <v-card flat width="800">
              <v-text-field
                label="You send"
                outlined
                value="0"
                hint="you have 100"
                persistent-hint
              >
                <template v-slot:append>
                  <v-list-item class="mt-n4">
                    <v-list-item-avatar tile>
                      <v-img :src="require(`../assets/usdc.svg`)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text text-subtitle-1"
                        >USDC</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-text-field>
              <div class="line-lurus"></div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="e1 = 1"> Back </v-btn>
                <v-btn color="primary" @click="e1 = 3"> Continue </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-btn color="primary" @click="e1 = 1"> Continue </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>

        <v-btn outlined color="secondary" @click="closeDialog" class="ma-5">
          Cancel
        </v-btn>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ProfileMenu from "./shared/ProfileMenu.vue";
@Component({ name: "SendMoney", components: { ProfileMenu } })
export default class SendMoney extends Vue {
  e1 = 1;
  closeDialog(): void {
    this.$emit("update-dialog", false);
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
